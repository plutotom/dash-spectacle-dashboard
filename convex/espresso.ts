/* eslint-disable no-console */
import { internalMutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// --- Constants ---
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SHOT_LIMIT = 8; // how many recent shots to keep
const API_BASE = "https://visualizer.coffee/api";

// --- Types (kept loose: visualizer payloads vary) ---
type ShotSummary = {
  id: string;
  profile_title?: string;
  bean_brand?: string;
  bean_type?: string;
  drink_weight?: number; // grams out
  bean_weight?: number; // dose grams in (some payloads)
  espresso_enjoyment?: number; // 1..100 (visualizer scale)
  start_time?: string; // ISO
  duration?: number; // seconds
  user_id?: string;
};

type ShotDetail = ShotSummary & {
  data?: {
    timeframe?: number[];
    data?: Record<string, number[]>; // espresso_pressure, espresso_flow, etc
  };
};

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
    if (!auth) {
      console.error("Missing VISUALIZER_EMAIL or VISUALIZER_PASSWORD env vars");
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
        console.error(
          "visualizer /shots failed",
          listRes.status,
          await listRes.text(),
        );
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

      // Sort newest first just in case
      const sorted = [...shots].sort((a, b) => {
        const ta = a.start_time ? Date.parse(a.start_time) : 0;
        const tb = b.start_time ? Date.parse(b.start_time) : 0;
        return tb - ta;
      });

      const trimmed = sorted.slice(0, SHOT_LIMIT);

      await ctx.runMutation(internal.espresso.upsertCache, {
        kind: "list",
        data: trimmed,
      });

      // 3. Fetch full detail (with curves) for the latest shot.
      const latest = trimmed[0];
      if (latest?.id) {
        try {
          const detailRes = await fetch(
            `${API_BASE}/shots/${latest.id}/download`,
            { headers: authHeaders },
          );
          if (detailRes.ok) {
            const detail = (await detailRes.json()) as ShotDetail;
            // download/show is public for any shot id; confirm ownership.
            if (detail.user_id && detail.user_id !== me.id) {
              console.error(
                "visualizer detail user_id mismatch /me — not caching detail",
                { meId: me.id, shotUserId: detail.user_id },
              );
            } else {
              await ctx.runMutation(internal.espresso.upsertCache, {
                kind: "detail",
                data: { ...latest, ...detail },
              });
            }
          } else {
            console.error(
              "visualizer /shots/:id/download failed",
              detailRes.status,
            );
          }
        } catch (e) {
          console.error("detail fetch failed", e);
        }
      }

      return { count: trimmed.length };
    } catch (e) {
      console.error("fetchShots failed", e);
      return null;
    }
  },
});
