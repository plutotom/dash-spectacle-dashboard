import { useEffect, useMemo, useRef, useState } from 'react';

type LoanSummary = {
    currentBalanceCents: number;
    principalCents: number;
    accruedInterestCents: number;
    perDayCents: number;
    perHourCents: number;
    perMinuteCents: number;
    perSecondCents: number;
    todayAccruedCents: number;
    aprBps: number | null;
    startedAt: string | null;
    asOf: string;
    loanCount?: number;
};

function formatMoney(cents: number): string {
    const sign = cents < 0 ? '-' : '';
    const abs = Math.abs(cents);
    return `${sign}$${(abs / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function LoanWidget() {
    const [data, setData] = useState<LoanSummary | null>(null);
    const [displayCents, setDisplayCents] = useState<number | null>(null);
    const lastSync = useRef<Date | null>(null);

    const fetchSummary = async () => {
        const res = await fetch(`/api/loan/summary?t=${Date.now()}`, { cache: 'no-store' });
        const json: LoanSummary = await res.json();
        setData(json);
        setDisplayCents(json.currentBalanceCents);
        lastSync.current = new Date(json.asOf);
    };

    useEffect(() => {
        fetchSummary();
        const interval = setInterval(fetchSummary, 60_000);
        return () => clearInterval(interval);
    }, []);

    // Animate locally using perSecondCents
    useEffect(() => {
        if (!data) return;
        let raf = 0;
        const start = performance.now();
        const startDisplay = displayCents ?? data.currentBalanceCents;
        const perSecond = data.perSecondCents;
        const tick = (t: number) => {
            const elapsedSec = (t - start) / 1000;
            const delta = Math.round(perSecond * elapsedSec);
            setDisplayCents(startDisplay + delta);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [data?.perSecondCents]);

    const rows = useMemo(() => {
        if (!data) return [] as Array<[string, string]>;
        const aprLabel = data.aprBps !== null ? `${(data.aprBps / 100).toFixed(2)}%` : 'Multiple';
        const rowsBase: Array<[string, string]> = [
            ['Principal', formatMoney(data.principalCents)],
            ['Accrued Interest', formatMoney(data.accruedInterestCents)],
            ['Interest Today', formatMoney(data.todayAccruedCents)],
            ['APR', aprLabel],
        ];
        if (data.loanCount && data.loanCount > 1) {
            rowsBase.unshift(['Loans', String(data.loanCount)]);
        }
        return rowsBase;
    }, [data]);

    if (!data || displayCents === null) {
        return (
            <div className="rounded-lg border border-gray-800 bg-black/40 p-4 text-primary-foreground">
                <div className="text-lg">Student Loan</div>
                <div className="mt-2 text-3xl">Loading…</div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4 text-primary-foreground">
            <div className="mb-2 flex items-center justify-between">
                <div className="text-lg">Student Loan</div>
                <div className="text-xs text-gray-400">As of {new Date(data.asOf).toLocaleTimeString()}</div>
            </div>

            <div className="text-5xl font-semibold">{formatMoney(displayCents)}</div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {rows.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded bg-white/5 px-2 py-1">
                        <span className="text-gray-400">{k}</span>
                        <span>{v}</span>
                    </div>
                ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald-500/15 px-2 py-1">+{formatMoney(data.perDayCents)}/day</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1">+{formatMoney(data.perHourCents)}/hr</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1">+{formatMoney(data.perMinuteCents)}/min</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1">+{formatMoney(data.perSecondCents)}/sec</span>
            </div>
        </div>
    );
}
