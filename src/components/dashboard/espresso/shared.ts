// Shared types + helpers for espresso shot widgets.
// Visualizer.coffee payloads are intentionally loose — we coerce to a
// stable internal shape and provide safe fallbacks everywhere.

/** Home default when Visualizer omits bean_weight (typical 18g in → ~36g out). */
export const DEFAULT_DOSE_G = 18;

export type RawShot = {
  id: string;
  profile_title?: string;
  bean_brand?: string;
  bean_type?: string;
  /** Visualizer may send numbers or numeric strings */
  drink_weight?: number | string;
  bean_weight?: number | string;
  espresso_enjoyment?: number | string; // 1..100
  start_time?: string;
  /** Unix seconds — list endpoint often sends this instead of start_time */
  clock?: number | string;
  updated_at?: number | string;
  duration?: number | string;
  /** Sample times in seconds. Live payloads put this at the top level. */
  timeframe?: number[];
  /**
   * Curves. Live Visualizer payloads use a flat channel map here
   * (`data.espresso_pressure`); older/nested payloads use `data.data`.
   * Kept as `unknown` so both shapes can be resolved at runtime.
   */
  data?: Record<string, unknown>;
};

export type Shot = {
  id: string;
  profile: string;
  bean: string;
  roaster: string;
  date: Date | null;
  doseG: number | null;
  yieldG: number | null;
  durationS: number | null;
  enjoyment: number | null; // 0..1 normalized
  pressure: number[]; // normalized 0..1
  flow: number[]; // normalized 0..1
};

const PRESSURE_MAX = 12; // bar
const FLOW_MAX = 8; // ml/s

const PRESSURE_KEYS = ["espresso_pressure", "pressure", "p"];
const PRESSURE_GOAL_KEYS = ["espresso_pressure_goal", "pressure_goal"];
const FLOW_KEYS = ["espresso_flow", "flow", "f"];
const FLOW_GOAL_KEYS = ["espresso_flow_goal", "flow_goal"];
const WEIGHT_KEYS = ["espresso_weight", "weight", "w"];
const TEMP_KEYS = [
  "espresso_temperature_mix",
  "espresso_temperature_basket",
  "temperature_mix",
  "temperature",
];
const TEMP_GOAL_KEYS = ["espresso_temperature_goal", "temperature_goal"];

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((v) => typeof v === "number");
}

/**
 * Curves live either directly on `data` (current Visualizer shape) or nested
 * under `data.data` (older shape). Return whichever holds numeric channels.
 */
function resolveChannels(raw: RawShot): Record<string, number[]> {
  const root = raw.data;
  if (!root) return {};
  const nested = root.data;
  const source = nested && typeof nested === "object" ? (nested as Record<string, unknown>) : root;
  const out: Record<string, number[]> = {};
  for (const [key, value] of Object.entries(source)) {
    if (isNumberArray(value)) out[key] = value;
  }
  return out;
}

function resolveTimeframe(raw: RawShot): number[] {
  if (isNumberArray(raw.timeframe)) return raw.timeframe;
  const nestedTimeframe = raw.data?.timeframe;
  if (isNumberArray(nestedTimeframe)) return nestedTimeframe;
  const inner = raw.data?.data as Record<string, unknown> | undefined;
  if (inner && isNumberArray(inner.timeframe)) return inner.timeframe;
  return [];
}

function pickChannel(channels: Record<string, number[]>, keys: string[]): number[] {
  for (const key of keys) {
    const values = channels[key];
    if (values && values.length > 0) return values;
  }
  return [];
}

/** Coerce loose JSON numbers (API may send strings) to finite number or null */
export function toOptionalNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function shotDate(raw: RawShot): Date | null {
  if (raw.start_time) {
    const d = new Date(raw.start_time);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const clock = toOptionalNumber(raw.clock);
  if (clock !== null && clock > 0) {
    // Visualizer `clock` is unix seconds
    return new Date(clock * 1000);
  }
  return null;
}

/** Last scale reading when drink_weight is missing from the payload. */
function yieldFromWeightCurve(raw: RawShot): number | null {
  const values = pickChannel(resolveChannels(raw), WEIGHT_KEYS);
  if (values.length === 0) return null;
  const last = values[values.length - 1];
  return typeof last === "number" && Number.isFinite(last) && last > 0 ? last : null;
}

function normalize(values: number[] | undefined, max: number): number[] {
  if (!values || values.length === 0) return [];
  return values.map((v) => Math.max(0, Math.min(1, v / max)));
}

function downsample(values: number[], maxPoints = 64): number[] {
  if (values.length <= maxPoints) return values;
  const step = values.length / maxPoints;
  const out: number[] = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push(values[Math.floor(i * step)] ?? 0);
  }
  return out;
}

export function normalizeShot(raw: RawShot): Shot {
  const channels = resolveChannels(raw);

  const doseFromApi = toOptionalNumber(raw.bean_weight);
  const yieldG = toOptionalNumber(raw.drink_weight) ?? yieldFromWeightCurve(raw);

  // Duration: explicit field, else approximate from updated_at - clock (list payloads).
  let durationS = toOptionalNumber(raw.duration);
  if (durationS === null) {
    const clock = toOptionalNumber(raw.clock);
    const updated = toOptionalNumber(raw.updated_at);
    if (clock !== null && updated !== null && updated > clock) {
      durationS = updated - clock;
    }
  }

  return {
    id: raw.id,
    profile: raw.profile_title ?? "Untitled profile",
    bean: raw.bean_type ?? "Unknown bean",
    roaster: raw.bean_brand ?? "",
    date: shotDate(raw),
    doseG: doseFromApi ?? DEFAULT_DOSE_G,
    yieldG,
    durationS,
    enjoyment: (() => {
      const e = toOptionalNumber(raw.espresso_enjoyment);
      return e === null ? null : Math.max(0, Math.min(1, e / 100));
    })(),
    pressure: downsample(normalize(pickChannel(channels, PRESSURE_KEYS), PRESSURE_MAX)),
    flow: downsample(normalize(pickChannel(channels, FLOW_KEYS), FLOW_MAX)),
  };
}

/**
 * Raw-valued, index-aligned series for the shot graph card. Channels can differ
 * in length from each other and from `timeframe`, so every series is resampled
 * onto a shared grid by fractional position instead of raw index.
 */
export type ShotSeries = {
  timeS: number[];
  pressure: number[];
  pressureGoal: number[];
  flow: number[];
  flowGoal: number[];
  tempC: number[];
  tempGoalC: number[];
  weightG: number[];
  maxTimeS: number;
  points: number;
};

const SERIES_POINTS = 96;

function resampleTo(values: number[], count: number): number[] {
  if (values.length === 0) return [];
  if (values.length === 1) return new Array(count).fill(values[0]);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const pos = (i / (count - 1)) * (values.length - 1);
    out.push(values[Math.round(pos)] ?? 0);
  }
  return out;
}

export function buildShotSeries(raw: RawShot, points = SERIES_POINTS): ShotSeries {
  const channels = resolveChannels(raw);
  const pressureRaw = pickChannel(channels, PRESSURE_KEYS);
  const flowRaw = pickChannel(channels, FLOW_KEYS);
  const sampleCount = Math.max(pressureRaw.length, flowRaw.length);
  const empty: ShotSeries = {
    timeS: [],
    pressure: [],
    pressureGoal: [],
    flow: [],
    flowGoal: [],
    tempC: [],
    tempGoalC: [],
    weightG: [],
    maxTimeS: 0,
    points: 0,
  };
  if (sampleCount === 0) return empty;

  const n = Math.min(points, sampleCount);
  const timeframe = resolveTimeframe(raw);
  const durationS = toOptionalNumber(raw.duration);

  // Fall back to an even grid across the shot duration (or 0.1s ticks, the DE1
  // sample interval) when the payload omits `timeframe`.
  const timeS =
    timeframe.length > 0
      ? resampleTo(timeframe, n)
      : Array.from(
          { length: n },
          (_, i) => ((durationS ?? sampleCount * 0.1) * i) / Math.max(1, n - 1),
        );

  return {
    timeS,
    pressure: resampleTo(pressureRaw, n),
    pressureGoal: resampleTo(pickChannel(channels, PRESSURE_GOAL_KEYS), n),
    flow: resampleTo(flowRaw, n),
    flowGoal: resampleTo(pickChannel(channels, FLOW_GOAL_KEYS), n),
    tempC: resampleTo(pickChannel(channels, TEMP_KEYS), n),
    tempGoalC: resampleTo(pickChannel(channels, TEMP_GOAL_KEYS), n),
    weightG: resampleTo(pickChannel(channels, WEIGHT_KEYS), n),
    maxTimeS: timeS[timeS.length - 1] ?? durationS ?? 0,
    points: n,
  };
}

export function ratio(s: Shot): string | null {
  if (!s.doseG || !s.yieldG) return null;
  return (s.yieldG / s.doseG).toFixed(2);
}

export function fmtTime(d: Date | null): string {
  if (!d) return "--";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Compact clock for narrow ribbon cells: `7:02a` / `4:21p` (no wrap). */
export function fmtTimeCompact(d: Date | null): string {
  if (!d) return "--";
  const h24 = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, "0");
  const h12 = h24 % 12 || 12;
  const ap = h24 < 12 ? "a" : "p";
  return `${h12}:${mins}${ap}`;
}

export function fmtDayShort(d: Date | null): string {
  if (!d) return "--";
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function fmtRelative(d: Date | null): string {
  if (!d) return "";
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  return `${diffD}d ago`;
}

// Color status for ratio (target ~1:2 espresso). Returns one of our CSS var names.
export function ratioStatusVar(s: Shot): string {
  if (!s.doseG || !s.yieldG) return "var(--espresso-crema)";
  const r = s.yieldG / s.doseG;
  const distance = Math.abs(r - 2);
  if (distance < 0.2) return "var(--espresso-good)";
  if (distance < 0.5) return "var(--espresso-honey)";
  return "var(--espresso-warn)";
}

// SVG path builders
export function buildPath(values: number[], w: number, h: number, pad = 2) {
  if (values.length === 0) return "";
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const step = innerW / Math.max(1, values.length - 1);
  return values
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + innerH - v * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function buildArea(values: number[], w: number, h: number, pad = 2) {
  const line = buildPath(values, w, h, pad);
  if (!line) return "";
  return `${line} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
}
