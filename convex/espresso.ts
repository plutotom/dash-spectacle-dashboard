/* eslint-disable no-console */
import { internalMutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// --- Constants ---
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SHOT_LIMIT = 8; // how many recent shots to keep
const SHOT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // drop shots older than a week
const API_BASE = "https://visualizer.coffee/api";
// Curve resolution to cache. The UI downsamples to 64-96 points for rendering,
// so storing the full (multi-hundred-point, many-channel) visualizer payload
// just burns DB write + read I/O and websocket egress. We keep a small superset.
const CURVE_POINTS = 128;
const PRESSURE_KEYS = ["espresso_pressure", "pressure", "p", "espresso_pressure_goal"];
const FLOW_KEYS = ["espresso_flow", "flow", "f", "espresso_flow_goal"];
const TEMP_KEYS = [
  "espresso_temperature_mix",
  "espresso_temperature_basket",
  "espresso_temperature_goal",
  "temperature_mix",
  "temperature",
];

// --- Types (kept loose: visualizer payloads vary) ---
type ShotSummary = {
  id: string;
  profile_title?: string;
  bean_brand?: string;
  bean_type?: string;
  drink_weight?: number | string; // grams out
  bean_weight?: number | string; // dose grams in (some payloads)
  espresso_enjoyment?: number; // 1..100 (visualizer scale)
  start_time?: string; // ISO
  /** Unix seconds — list endpoint often sends this instead of start_time */
  clock?: number;
  updated_at?: number;
  duration?: number | string; // seconds
  user_id?: string;
};

type ShotDetail = ShotSummary & {
  /** Sample times in seconds. Live payloads put this at the top level. */
  timeframe?: number[];
  /**
   * Curve channels. Live Visualizer payloads use a flat map here
   * (`data.espresso_pressure`); older payloads nest them under `data.data`.
   */
  data?: Record<string, unknown>;
};

const WEIGHT_KEYS = ["espresso_weight", "weight", "w", "espresso_flow_weight"];

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((v) => typeof v === "number");
}

/** Flatten either payload shape into a plain channel -> samples map. */
function resolveChannels(detail: ShotDetail): Record<string, number[]> {
  const root = detail.data;
  if (!root) return {};
  const nested = root.data;
  const source = nested && typeof nested === "object" ? (nested as Record<string, unknown>) : root;
  const out: Record<string, number[]> = {};
  for (const [key, value] of Object.entries(source)) {
    if (isNumberArray(value)) out[key] = value;
  }
  return out;
}

function resolveTimeframe(detail: ShotDetail): number[] {
  if (isNumberArray(detail.timeframe)) return detail.timeframe;
  const nestedTimeframe = detail.data?.timeframe;
  if (isNumberArray(nestedTimeframe)) return nestedTimeframe;
  const inner = detail.data?.data as Record<string, unknown> | undefined;
  if (inner && isNumberArray(inner.timeframe)) return inner.timeframe;
  return [];
}

/** Prefer start_time; fall back to Visualizer `clock` (unix seconds). */
function shotTimestampMs(s: ShotSummary): number {
  if (s.start_time) {
    const t = Date.parse(s.start_time);
    if (Number.isFinite(t)) return t;
  }
  if (typeof s.clock === "number" && Number.isFinite(s.clock) && s.clock > 0) {
    return s.clock * 1000;
  }
  return NaN;
}

/** Ensure list rows always expose start_time so the UI can format pull time. */
function withStartTime(s: ShotSummary): ShotSummary {
  if (s.start_time) return s;
  const ms = shotTimestampMs(s);
  if (!Number.isFinite(ms)) return s;
  return { ...s, start_time: new Date(ms).toISOString() };
}

/** List cache should stay slim — no curve arrays. */
function toListSummary(s: ShotSummary): ShotSummary {
  return {
    id: s.id,
    profile_title: s.profile_title,
    bean_brand: s.bean_brand,
    bean_type: s.bean_type,
    drink_weight: s.drink_weight,
    bean_weight: s.bean_weight,
    espresso_enjoyment: s.espresso_enjoyment,
    start_time: s.start_time,
    clock: s.clock,
    updated_at: s.updated_at,
    duration: s.duration,
    user_id: s.user_id,
  };
}

/** Yield grams from drink_weight, or last espresso_weight sample. */
function resolveDrinkWeight(detail: ShotDetail): number | string | undefined {
  const fromField = detail.drink_weight;
  if (fromField != null && fromField !== "") {
    const n = typeof fromField === "number" ? fromField : Number(fromField);
    if (Number.isFinite(n) && n > 0) return fromField;
  }
  const series = resolveChannels(detail);
  for (const key of WEIGHT_KEYS) {
    const values = series[key];
    if (!values || values.length === 0) continue;
    const last = values[values.length - 1];
    if (typeof last === "number" && Number.isFinite(last) && last > 0) return last;
  }
  return undefined;
}

/** Confirmed by GET /api/me — Visualizer still returns 200 + public shots when Basic auth is wrong. */
type VisualizerMe = {
  id: string;
  name?: string;
  public?: boolean;
  avatar_url?: string | null;
};

// --- Auth header (HTTP Basic from env) ---
/** Base64 without Node `Buffer` (Convex actions run in an isolate). */
function base64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function buildAuthHeader(): string | null {
  const email = process.env.VISUALIZER_EMAIL;
  const password = process.env.VISUALIZER_PASSWORD;
  if (!email || !password) return null;
  return `Basic ${base64Utf8(`${email}:${password}`)}`;
}

// --- Payload trimming ---
function downsampleArray(values: unknown, maxPoints = CURVE_POINTS): number[] {
  if (!Array.isArray(values)) return [];
  if (values.length <= maxPoints) return values as number[];
  const step = values.length / maxPoints;
  const out: number[] = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push((values[Math.floor(i * step)] as number) ?? 0);
  }
  return out;
}

/**
 * Shrink a shot detail to only what the dashboard renders: the pressure/flow/
 * temperature/weight curves plus their goal traces, downsampled, alongside a
 * downsampled timeframe. Drops the channels no widget reads (water dispensed,
 * resistance, …). Weight is kept so yield can fall back when drink_weight is
 * missing. Output is normalized to the flat `data` + top-level `timeframe`
 * shape regardless of which shape came back from Visualizer.
 */
function trimDetail(detail: ShotDetail): ShotDetail {
  const series = resolveChannels(detail);
  if (Object.keys(series).length === 0) return detail;
  const kept: Record<string, number[]> = {};
  for (const key of [...PRESSURE_KEYS, ...FLOW_KEYS, ...TEMP_KEYS, ...WEIGHT_KEYS]) {
    if (series[key]) kept[key] = downsampleArray(series[key]);
  }
  return {
    ...detail,
    timeframe: downsampleArray(resolveTimeframe(detail)),
    data: kept,
  };
}

// --- Queries ---

export const getList = query({
  args: {},
  handler: async (ctx) => {
    const record = await ctx.db
      .query("espressoShots")
      .withIndex("by_kind", (q) => q.eq("kind", "list"))
      .first();
    if (!record) return null;
    const isStale = Date.now() - record.updatedAt > CACHE_TTL_MS;
    return {
      shots: (record.data ?? []) as ShotSummary[],
      updatedAt: record.updatedAt,
      isStale,
    };
  },
});

export const getLatestDetail = query({
  args: {},
  handler: async (ctx) => {
    const record = await ctx.db
      .query("espressoShots")
      .withIndex("by_kind", (q) => q.eq("kind", "detail"))
      .first();
    if (!record) return null;
    return {
      shot: record.data as ShotDetail,
      updatedAt: record.updatedAt,
    };
  },
});

// --- Mutations ---

export const upsertCache = internalMutation({
  args: { kind: v.string(), data: v.any() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("espressoShots")
      .withIndex("by_kind", (q) => q.eq("kind", args.kind))
      .first();
    if (existing) {
      // Skip no-op writes. The cache is refreshed every 5 min but shots rarely
      // change, and rewriting an identical document still bills full write I/O
      // and pushes a websocket update to every subscribed client.
      if (JSON.stringify(existing.data) === JSON.stringify(args.data)) {
        return;
      }
      await ctx.db.patch(existing._id, {
        data: args.data,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("espressoShots", {
        kind: args.kind,
        data: args.data,
        updatedAt: Date.now(),
      });
    }
  },
});

// --- Actions ---

export const fetchShots = action({
  args: {},
  handler: async (ctx) => {
    const auth = buildAuthHeader();
    // Optional integration — skip quietly when unset (crons still fire).
    if (!auth) {
      return null;
    }

    const authHeaders = { Authorization: auth, Accept: "application/json" };

    try {
      // 1. Prove credentials work. /shots is public-friendly: invalid Basic auth
      //    still returns 200 with Shot.visible (random community shots), not yours.
      const meRes = await fetch(`${API_BASE}/me`, { headers: authHeaders });
      if (!meRes.ok) {
        const body = await meRes.text();
        console.error(
          "visualizer /me failed — credentials invalid or missing; refusing to fetch public /shots feed",
          meRes.status,
          body,
        );
        return null;
      }
      const me = (await meRes.json()) as VisualizerMe;
      if (!me?.id) {
        console.error("visualizer /me returned unexpected payload", me);
        return null;
      }

      // 2. List recent shots for the authenticated user only.
      const listRes = await fetch(`${API_BASE}/shots?per_page=${SHOT_LIMIT}`, {
        headers: authHeaders,
      });

      if (!listRes.ok) {
        console.error("visualizer /shots failed", listRes.status, await listRes.text());
        return null;
      }

      const listJson = (await listRes.json()) as
        | ShotSummary[]
        | { data?: ShotSummary[]; shots?: ShotSummary[] };

      const shots: ShotSummary[] = Array.isArray(listJson)
        ? listJson
        : (listJson.data ?? listJson.shots ?? []);

      if (shots.length === 0) {
        await ctx.runMutation(internal.espresso.upsertCache, {
          kind: "list",
          data: [],
        });
        return { count: 0 };
      }

      // Sort newest first — list payloads often only have `clock`, not start_time.
      const sorted = [...shots]
        .map(withStartTime)
        .sort((a, b) => shotTimestampMs(b) - shotTimestampMs(a));

      // Prefer shots from the last week, but never wipe the ribbon if everything
      // is older — still keep the newest SHOT_LIMIT rows.
      const cutoff = Date.now() - SHOT_MAX_AGE_MS;
      const withinWeek = sorted.filter((s) => {
        const t = shotTimestampMs(s);
        return Number.isFinite(t) && t >= cutoff;
      });
      const trimmed = (withinWeek.length > 0 ? withinWeek : sorted)
        .filter((s) => Number.isFinite(shotTimestampMs(s)))
        .slice(0, SHOT_LIMIT);

      if (trimmed.length === 0) {
        await ctx.runMutation(internal.espresso.upsertCache, {
          kind: "list",
          data: [],
        });
        return { count: 0 };
      }

      // List endpoint is sparse (often just id/clock). Download each shot for
      // yield/duration/start_time, but only cache slim summaries in the list.
      const hydrated = await Promise.all(
        trimmed.map(async (summary) => {
          try {
            const detailRes = await fetch(`${API_BASE}/shots/${summary.id}/download`, {
              headers: authHeaders,
            });
            if (!detailRes.ok) {
              console.error("visualizer /shots/:id/download failed", summary.id, detailRes.status);
              return { summary: withStartTime(summary), detail: null as ShotDetail | null };
            }
            const detail = (await detailRes.json()) as ShotDetail;
            if (detail.user_id && detail.user_id !== me.id) {
              return { summary: withStartTime(summary), detail: null };
            }
            const merged = withStartTime({
              ...summary,
              ...detail,
              drink_weight: resolveDrinkWeight(detail) ?? detail.drink_weight,
            });
            return {
              summary: toListSummary(merged),
              detail: merged,
            };
          } catch (e) {
            console.error("visualizer /shots/:id/download failed", summary.id, e);
            return { summary: withStartTime(summary), detail: null as ShotDetail | null };
          }
        }),
      );

      const enriched = hydrated.map((h) => h.summary);

      await ctx.runMutation(internal.espresso.upsertCache, {
        kind: "list",
        data: enriched,
      });

      // Cache curves for the latest shot (already downloaded above).
      const latestDetail = hydrated[0]?.detail;
      if (latestDetail) {
        await ctx.runMutation(internal.espresso.upsertCache, {
          kind: "detail",
          data: trimDetail(latestDetail),
        });
      }

      return { count: enriched.length };
    } catch (e) {
      console.error("fetchShots failed", e);
      return null;
    }
  },
});
