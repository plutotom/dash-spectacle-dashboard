"use client";

import { useEffect, useState } from "react";
import { useQuery, useAction } from "convex/react";
import { Coffee, Loader2, TrendingUp, WifiOff } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import {
  fmtTime,
  normalizeShot,
  ratio,
  ratioStatusVar,
  type RawShot,
  type Shot,
} from "./shared";

const REFRESH_MS = 5 * 60 * 1000;

export function EspressoTickerStrip() {
  const list = useQuery(api.espresso.getList);
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
          console.error("espresso ticker refresh failed", e);
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

  if (list === undefined) {
    return <Skeleton />;
  }

  if (!list || list.shots.length === 0) {
    return (
      <div className="rounded-2xl border border-espresso-edge bg-espresso-glass-soft backdrop-blur-md p-4 flex items-center gap-2 text-espresso-crema-soft/70">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm">No espresso shots yet</span>
      </div>
    );
  }

  const shots: Shot[] = list.shots
    .slice(0, 5)
    .map((r) => normalizeShot(r as RawShot));

  const todayCount = shots.filter((s) => s.date && isToday(s.date)).length;

  const ratiosToday = shots
    .filter((s) => s.date && isToday(s.date))
    .map((s) => (s.doseG && s.yieldG ? s.yieldG / s.doseG : null))
    .filter((r): r is number => r !== null);
  const avgRatio = ratiosToday.length
    ? ratiosToday.reduce((a, b) => a + b, 0) / ratiosToday.length
    : null;

  return (
    <div className="rounded-2xl border border-espresso-edge bg-espresso-glass backdrop-blur-md text-espresso-crema-soft shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden">
      {/* Header — portrait friendly, not edge-to-edge ticker */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-espresso-edge">
        <div>
          <div className="flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-espresso-honey" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-espresso-crema/65">
              Espresso · today
            </span>
            {refreshing && (
              <Loader2 className="w-3 h-3 animate-spin text-espresso-crema/50 ml-1" />
            )}
          </div>
          <div className="text-2xl font-extralight tabular-nums leading-tight mt-0.5">
            {todayCount}{" "}
            <span className="text-espresso-crema/45 text-sm">
              {todayCount === 1 ? "pull" : "pulls"}
            </span>
          </div>
        </div>
        {avgRatio !== null && (
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.22em] text-espresso-crema/65 flex items-center gap-1 justify-end">
              <TrendingUp className="w-3 h-3" /> avg ratio
            </div>
            <div className="text-2xl font-extralight tabular-nums">
              1:{avgRatio.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Vertical stack — best for portrait dashboard */}
      <ul className="divide-y divide-espresso-edge">
        {shots.map((s, i) => (
          <ShotRow key={s.id} shot={s} latest={i === 0} />
        ))}
      </ul>
    </div>
  );
}

function ShotRow({ shot, latest }: { shot: Shot; latest: boolean }) {
  return (
    <li
      className={`flex items-center gap-3 px-4 py-3 transition ${
        latest ? "bg-espresso-honey/5" : "hover:bg-espresso-ink-soft/20"
      }`}
    >
      <ShotRing shot={shot} latest={latest} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] uppercase tracking-wider text-espresso-crema/55">
            {fmtTime(shot.date)}
          </span>
          {latest && (
            <span className="text-[9px] uppercase tracking-[0.2em] text-espresso-honey">
              Latest
            </span>
          )}
        </div>
        <div className="text-sm font-light truncate text-espresso-crema-soft">
          {shot.bean}
          {shot.roaster ? (
            <span className="text-espresso-crema/45"> · {shot.roaster}</span>
          ) : null}
        </div>
        <div className="text-[11px] text-espresso-crema/55 truncate">
          {shot.profile}
        </div>
      </div>
      <div className="text-right tabular-nums shrink-0">
        <div className="text-base font-light leading-none">
          {shot.yieldG?.toFixed(1) ?? "--"}
          <span className="text-espresso-crema/45 text-xs">g</span>
        </div>
        <div className="text-[11px] text-espresso-crema/55 mt-0.5">
          {shot.durationS?.toFixed(0) ?? "--"}s
        </div>
      </div>
    </li>
  );
}

function ShotRing({ shot, latest }: { shot: Shot; latest: boolean }) {
  const target = 36;
  const yieldG = shot.yieldG ?? 0;
  const pct = Math.min(yieldG / target, 1);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const stroke = ratioStatusVar(shot);
  const ratioLabel = ratio(shot);
  return (
    <div
      className={`relative w-12 h-12 shrink-0 ${
        latest ? "espresso-ring-glow" : ""
      }`}
    >
      <svg viewBox="0 0 44 44" className="w-12 h-12 -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--espresso-edge)"
          strokeWidth="3"
        />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-light tabular-nums text-espresso-crema-soft">
        {ratioLabel ? `1:${ratioLabel}` : "--"}
      </div>
    </div>
  );
}

function isToday(d: Date): boolean {
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-espresso-edge bg-espresso-glass-soft backdrop-blur-md p-4 h-[260px] flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-espresso-crema/50" />
    </div>
  );
}
