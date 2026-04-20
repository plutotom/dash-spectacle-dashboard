// Shared types + helpers for espresso shot widgets.
// Visualizer.coffee payloads are intentionally loose — we coerce to a
// stable internal shape and provide safe fallbacks everywhere.

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
  duration?: number | string;
  data?: {
    timeframe?: number[];
    data?: Record<string, number[]>;
  };
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
  const series = raw.data?.data ?? {};
  const pressureKey = ["espresso_pressure", "pressure", "p"].find(
    (k) => series[k],
  );
  const flowKey = ["espresso_flow", "flow", "f"].find((k) => series[k]);

  return {
    id: raw.id,
    profile: raw.profile_title ?? "Untitled profile",
    bean: raw.bean_type ?? "Unknown bean",
    roaster: raw.bean_brand ?? "",
    date: raw.start_time ? new Date(raw.start_time) : null,
    doseG: toOptionalNumber(raw.bean_weight),
    yieldG: toOptionalNumber(raw.drink_weight),
    durationS: toOptionalNumber(raw.duration),
    enjoyment: (() => {
      const e = toOptionalNumber(raw.espresso_enjoyment);
      return e === null ? null : Math.max(0, Math.min(1, e / 100));
    })(),
    pressure: pressureKey
      ? downsample(normalize(series[pressureKey], PRESSURE_MAX))
      : [],
    flow: flowKey ? downsample(normalize(series[flowKey], FLOW_MAX)) : [],
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
