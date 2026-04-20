"use client";

import { useEffect, useState } from "react";
import { useQuery, useAction } from "convex/react";
import { Coffee, Loader2, WifiOff } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import {
  buildArea,
  buildPath,
  fmtDayShort,
  fmtRelative,
  fmtTime,
  normalizeShot,
  ratio,
  type RawShot,
  type Shot,
} from "./shared";

const REFRESH_MS = 5 * 60 * 1000;

export function EspressoGlassTile() {
  const list = useQuery(api.espresso.getList);
  const detail = useQuery(api.espresso.getLatestDetail);
  const fetchShots = useAction(api.espresso.fetchShots);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (list === undefined) return;
    if (!list || list.isStale) {
      const run = async () => {
        setRefreshing(true);
        try {
          await fetchShots();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("espresso refresh failed", e);
        } finally {
          setRefreshing(false);
        }
      };
      void run();
    }
    const t = setInterval(() => {
      void fetchShots();
    }, REFRESH_MS);
    return () => clearInterval(t);
  }, [list, fetchShots]);

  // Loading
  if (list === undefined || detail === undefined) {
    return <Skeleton />;
  }

  // Empty / error
  if (!list || list.shots.length === 0) {
    return (
      <div className="rounded-2xl border border-espresso-edge bg-espresso-glass-soft backdrop-blur-md p-4 flex items-center gap-2 text-espresso-crema-soft/70">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm">No espresso shots yet</span>
      </div>
    );
  }

  const shots: Shot[] = list.shots.map((r) => normalizeShot(r as RawShot));
  // List is sorted newest-first by the action; detail is cached separately and can
  // lag one refresh — only merge detail curves/stats when it matches the list head.
  const listFirstRaw = list.shots[0] as RawShot;
  const detailRaw = detail?.shot as RawShot | undefined;
  console.log("detailRaw", detailRaw);
  const detailMatchesHead =
    detailRaw !== undefined && String(detailRaw.id) === String(listFirstRaw.id);
  const latestRaw = (
    detailMatchesHead
      ? ({ ...listFirstRaw, ...detailRaw } as RawShot)
      : listFirstRaw
  ) as RawShot;
  const latest: Shot = normalizeShot(latestRaw);
  const recent = shots.slice(1, 5);

  const isFresh =
    latest.date && Date.now() - latest.date.getTime() < 10 * 60 * 1000;

  return (
    <div
      className={`relative rounded-2xl border border-espresso-edge bg-espresso-glass backdrop-blur-md p-4 text-espresso-crema-soft shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${
        isFresh ? "espresso-fresh" : ""
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-espresso-honey" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-espresso-crema/70">
            Last pull · {fmtRelative(latest.date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {refreshing && (
            <Loader2 className="w-3 h-3 animate-spin text-espresso-crema/50" />
          )}
          <span className="text-[11px] text-espresso-crema/50 truncate max-w-[140px]">
            {latest.profile}
          </span>
        </div>
      </div>

      {/* main stats — portrait-friendly 2x2 grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
        <Stat
          label="Yield"
          value={latest.yieldG?.toFixed(1) ?? "--"}
          unit="g"
          big
        />
        <Stat
          label="Time"
          value={latest.durationS?.toFixed(1) ?? "--"}
          unit="s"
          big
        />
        <Stat
          label="Ratio"
          value={ratio(latest) ? `1:${ratio(latest)}` : "--"}
        />
        <Stat label="Dose" value={latest.doseG?.toFixed(1) ?? "--"} unit="g" />
      </div>

      {/* curves */}
      {(latest.pressure.length > 0 || latest.flow.length > 0) && (
        <>
          <CurveChart pressure={latest.pressure} flow={latest.flow} />
          <div className="flex items-center gap-3 text-[10px] text-espresso-crema/50 mt-1">
            <Legend dotColor="var(--espresso-pressure)" label="Pressure" />
            <Legend dotColor="var(--espresso-flow)" label="Flow" dashed />
            <span className="ml-auto truncate text-espresso-crema/60">
              {[latest.bean, latest.roaster].filter(Boolean).join(" · ")}
            </span>
          </div>
        </>
      )}

      {/* recent ribbon */}
      {recent.length > 0 && (
        <div className="mt-3 pt-3 border-t border-espresso-edge grid grid-cols-4 gap-2">
          {recent.map((s) => (
            <div
              key={s.id}
              className="rounded-md bg-espresso-ink-soft/30 hover:bg-espresso-ink-soft/45 transition px-2 py-1.5"
            >
              <div className="text-[9px] text-espresso-crema/45 uppercase tracking-wider">
                {fmtDayShort(s.date)} · {fmtTime(s.date)}
              </div>
              <div className="text-sm font-light tabular-nums">
                {s.yieldG?.toFixed(0) ?? "--"}g
                <span className="text-espresso-crema/40">
                  {" "}
                  · {s.durationS?.toFixed(0) ?? "--"}s
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  big,
}: {
  label: string;
  value: string;
  unit?: string;
  big?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.18em] text-espresso-crema/55">
        {label}
      </span>
      <span
        className={`tabular-nums font-light leading-none ${
          big ? "text-3xl mt-0.5" : "text-xl mt-0.5"
        }`}
      >
        {value}
        {unit && (
          <span className="text-espresso-crema/45 text-sm ml-0.5">{unit}</span>
        )}
      </span>
    </div>
  );
}

function CurveChart({
  pressure,
  flow,
}: {
  pressure: number[];
  flow: number[];
}) {
  const w = 320;
  const h = 64;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-16 overflow-visible"
      preserveAspectRatio="none"
    >
      <path
        d={buildArea(pressure, w, h)}
        fill="var(--espresso-pressure)"
        opacity={0.12}
      />
      <path
        d={buildPath(pressure, w, h)}
        fill="none"
        stroke="var(--espresso-pressure)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={buildPath(flow, w, h)}
        fill="none"
        stroke="var(--espresso-flow)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Legend({
  dotColor,
  label,
  dashed,
}: {
  dotColor: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="inline-block w-3 h-[2px]"
        style={{
          background: dashed
            ? `repeating-linear-gradient(to right, ${dotColor} 0 2px, transparent 2px 4px)`
            : dotColor,
        }}
      />
      {label}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-espresso-edge bg-espresso-glass-soft backdrop-blur-md p-4 h-[260px] flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-espresso-crema/50" />
    </div>
  );
}
