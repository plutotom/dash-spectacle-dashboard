"use client";

import { useQuery } from "convex/react";
import { Coffee, Loader2, WifiOff } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import {
  buildShotSeries,
  fmtRelative,
  normalizeShot,
  ratio,
  type RawShot,
  type Shot,
  type ShotSeries,
} from "./shared";

/**
 * Alternative to EspressoGlassTile: a machine-style telemetry graph for a
 * single shot (the latest one), in the spirit of the DE1 / Decent tablet chart.
 *
 * Left axis is shared by pressure (bar) and flow (ml/s); temperature rides its
 * own right-hand axis; weight is scaled to its own peak because grams and bar
 * share no meaningful range.
 */

// Left axis covers both pressure (bar) and flow (ml/s).
const LEFT_MAX = 12;
const LEFT_TICKS = [0, 2, 4, 6, 8, 10, 12];
// Right axis: brew temperature. Fixed so the trace doesn't jitter shot to shot.
const TEMP_MIN = 80;
const TEMP_MAX = 100;
const TEMP_TICKS = [80, 90, 100];

const VIEW_W = 480;
const VIEW_H = 200;
const PAD_L = 24;
const PAD_R = 30;
const PAD_T = 10;
const PAD_B = 18;
const PLOT_W = VIEW_W - PAD_L - PAD_R;
const PLOT_H = VIEW_H - PAD_T - PAD_B;

export function EspressoShotGraphTile() {
  const list = useQuery(api.espresso.getList);
  const detail = useQuery(api.espresso.getLatestDetail);

  if (list === undefined || detail === undefined) return <Skeleton />;

  if (!list || list.shots.length === 0) {
    return (
      <Frame>
        <div className="flex items-center gap-2 text-espresso-crema-soft/70">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">No espresso shots yet</span>
        </div>
      </Frame>
    );
  }

  // Detail is cached separately from the list and can lag one refresh, so only
  // merge its curves when it's the same shot the list head describes.
  const headRaw = list.shots[0] as RawShot;
  const detailRaw = detail?.shot as RawShot | undefined;
  const matchesHead = detailRaw !== undefined && String(detailRaw.id) === String(headRaw.id);
  const raw: RawShot = matchesHead ? ({ ...headRaw, ...detailRaw } as RawShot) : headRaw;

  const shot: Shot = normalizeShot(raw);
  const series = buildShotSeries(raw);

  if (series.points === 0) {
    return (
      <Frame>
        <Header shot={shot} />
        <div className="h-[120px] flex items-center justify-center text-xs text-espresso-crema/50">
          No curve data for this shot
        </div>
      </Frame>
    );
  }

  const peakPressure = Math.max(...series.pressure);
  const peakFlow = series.flow.length > 0 ? Math.max(...series.flow) : null;
  const avgTemp = series.tempC.length > 0 ? mean(series.tempC) : null;
  const finalWeight = series.weightG.at(-1) ?? shot.yieldG;

  return (
    <Frame>
      <Header shot={shot} />

      <ShotChart series={series} />

      {/* legend + peak readouts */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-espresso-crema/55">
        <Legend color="var(--espresso-pressure)" label="Pressure">
          {peakPressure.toFixed(1)} bar peak
        </Legend>
        {peakFlow !== null && (
          <Legend color="var(--espresso-flow)" label="Flow">
            {peakFlow.toFixed(1)} ml/s peak
          </Legend>
        )}
        {avgTemp !== null && (
          <Legend color="var(--espresso-temp)" label="Temp">
            {avgTemp.toFixed(1)} °C avg
          </Legend>
        )}
        {finalWeight != null && (
          <Legend color="var(--espresso-weight)" label="Weight" dotted>
            {finalWeight.toFixed(1)} g
          </Legend>
        )}
      </div>

      {/* footer summary */}
      <div className="mt-2 pt-2 border-t border-espresso-edge flex items-center justify-between text-[11px] text-espresso-crema/70 tabular-nums">
        <span>
          {shot.doseG?.toFixed(1) ?? "--"}g in → {shot.yieldG?.toFixed(1) ?? "--"}g out
        </span>
        <span>{ratio(shot) ? `1:${ratio(shot)}` : "--"}</span>
        <span>{shot.durationS?.toFixed(1) ?? series.maxTimeS.toFixed(1)}s</span>
      </div>
    </Frame>
  );
}

function ShotChart({ series }: { series: ShotSeries }) {
  const maxT = series.maxTimeS > 0 ? series.maxTimeS : 1;
  const weightMax = series.weightG.length > 0 ? Math.max(...series.weightG) : 0;

  const x = (t: number) => PAD_L + (t / maxT) * PLOT_W;
  const yLeft = (v: number) => PAD_T + PLOT_H - (clamp(v, 0, LEFT_MAX) / LEFT_MAX) * PLOT_H;
  const yTemp = (v: number) =>
    PAD_T + PLOT_H - ((clamp(v, TEMP_MIN, TEMP_MAX) - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * PLOT_H;
  const yWeight = (v: number) =>
    PAD_T + PLOT_H - (weightMax > 0 ? clamp(v / weightMax, 0, 1) : 0) * PLOT_H;

  const timeTickStep = maxT <= 20 ? 5 : maxT <= 60 ? 10 : 20;
  const timeTicks: number[] = [];
  for (let t = 0; t <= maxT; t += timeTickStep) timeTicks.push(t);

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full" role="img">
      {/* horizontal grid + left axis labels */}
      {LEFT_TICKS.map((tick) => (
        <g key={`h-${tick}`}>
          <line
            x1={PAD_L}
            x2={PAD_L + PLOT_W}
            y1={yLeft(tick)}
            y2={yLeft(tick)}
            stroke="var(--espresso-crema)"
            strokeOpacity={tick === 0 ? 0.28 : 0.1}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={PAD_L - 4}
            y={yLeft(tick) + 3}
            textAnchor="end"
            fontSize={8}
            fill="var(--espresso-crema)"
            fillOpacity={0.45}
          >
            {tick}
          </text>
        </g>
      ))}

      {/* time grid + labels */}
      {timeTicks.map((t) => (
        <g key={`v-${t}`}>
          <line
            x1={x(t)}
            x2={x(t)}
            y1={PAD_T}
            y2={PAD_T + PLOT_H}
            stroke="var(--espresso-crema)"
            strokeOpacity={0.07}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={x(t)}
            y={VIEW_H - 5}
            textAnchor="middle"
            fontSize={8}
            fill="var(--espresso-crema)"
            fillOpacity={0.4}
          >
            {t}s
          </text>
        </g>
      ))}

      {/* right temperature axis labels */}
      {series.tempC.length > 0 &&
        TEMP_TICKS.map((tick) => (
          <text
            key={`t-${tick}`}
            x={PAD_L + PLOT_W + 4}
            y={yTemp(tick) + 3}
            fontSize={8}
            fill="var(--espresso-temp)"
            fillOpacity={0.6}
          >
            {tick}
          </text>
        ))}

      {/* goal traces sit behind the measured ones */}
      <Trace
        xs={series.timeS}
        ys={series.pressureGoal}
        toX={x}
        toY={yLeft}
        color="var(--espresso-pressure)"
        opacity={0.35}
        dash="4 4"
        width={1}
      />
      <Trace
        xs={series.timeS}
        ys={series.flowGoal}
        toX={x}
        toY={yLeft}
        color="var(--espresso-flow)"
        opacity={0.35}
        dash="4 4"
        width={1}
      />

      {/* pressure: filled area reads as the "body" of the shot */}
      {series.pressure.length > 0 && (
        <path
          d={areaPath(series.timeS, series.pressure, x, yLeft)}
          fill="var(--espresso-pressure)"
          opacity={0.12}
        />
      )}

      <Trace
        xs={series.timeS}
        ys={series.weightG}
        toX={x}
        toY={yWeight}
        color="var(--espresso-weight)"
        opacity={0.55}
        dash="1 3"
        width={1.5}
      />
      <Trace
        xs={series.timeS}
        ys={series.tempC}
        toX={x}
        toY={yTemp}
        color="var(--espresso-temp)"
        opacity={0.85}
        width={1.5}
      />
      <Trace
        xs={series.timeS}
        ys={series.flow}
        toX={x}
        toY={yLeft}
        color="var(--espresso-flow)"
        opacity={1}
        width={2}
      />
      <Trace
        xs={series.timeS}
        ys={series.pressure}
        toX={x}
        toY={yLeft}
        color="var(--espresso-pressure)"
        opacity={1}
        width={2}
      />

      {/* axis unit captions */}
      <text x={PAD_L} y={PAD_T - 2} fontSize={7} fill="var(--espresso-crema)" fillOpacity={0.4}>
        bar · ml/s
      </text>
      {series.tempC.length > 0 && (
        <text
          x={PAD_L + PLOT_W + 4}
          y={PAD_T - 2}
          fontSize={7}
          fill="var(--espresso-temp)"
          fillOpacity={0.5}
        >
          °C
        </text>
      )}
    </svg>
  );
}

function Trace({
  xs,
  ys,
  toX,
  toY,
  color,
  opacity,
  dash,
  width,
}: {
  xs: number[];
  ys: number[];
  toX: (v: number) => number;
  toY: (v: number) => number;
  color: string;
  opacity: number;
  dash?: string;
  width: number;
}) {
  if (ys.length === 0) return null;
  return (
    <path
      d={linePath(xs, ys, toX, toY)}
      fill="none"
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeDasharray={dash}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

function linePath(
  xs: number[],
  ys: number[],
  toX: (v: number) => number,
  toY: (v: number) => number,
) {
  return ys
    .map((v, i) => {
      const px = toX(xs[i] ?? 0);
      const py = toY(v);
      return `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`;
    })
    .join(" ");
}

function areaPath(
  xs: number[],
  ys: number[],
  toX: (v: number) => number,
  toY: (v: number) => number,
) {
  const line = linePath(xs, ys, toX, toY);
  if (!line) return "";
  const baseline = PAD_T + PLOT_H;
  const lastX = toX(xs[ys.length - 1] ?? 0);
  const firstX = toX(xs[0] ?? 0);
  return `${line} L${lastX.toFixed(2)},${baseline} L${firstX.toFixed(2)},${baseline} Z`;
}

function Header({ shot }: { shot: Shot }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Coffee className="w-4 h-4 text-espresso-honey" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-espresso-crema/70">
          Shot graph · {fmtRelative(shot.date)}
        </span>
      </div>
      <span className="text-[11px] text-espresso-crema/50 truncate max-w-[140px]">
        {shot.profile}
      </span>
    </div>
  );
}

function Legend({
  color,
  label,
  dotted,
  children,
}: {
  color: string;
  label: string;
  dotted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <span
        className="inline-block w-3 h-[2px]"
        style={{
          background: dotted
            ? `repeating-linear-gradient(to right, ${color} 0 1px, transparent 1px 3px)`
            : color,
        }}
      />
      <span>{label}</span>
      <span className="tabular-nums text-espresso-crema/75">{children}</span>
    </span>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-espresso-edge bg-espresso-glass backdrop-blur-md p-4 text-espresso-crema-soft shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-espresso-edge bg-espresso-glass-soft backdrop-blur-md p-4 h-[240px] flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-espresso-crema/50" />
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function mean(values: number[]) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
