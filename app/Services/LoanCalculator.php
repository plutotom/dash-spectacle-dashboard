<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\LoanLedgerEntry;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class LoanCalculator
{
    /**
     * Summarize the loan state as of $now.
     * - APR in basis points (bps)
     * - Day count: actual/365
     * - Interest accrues on principal only; payments reduce interest first
     *
     * @param  Collection<int, LoanLedgerEntry>  $entries
     * @return array<string,int|string|null>
     */
    public function summarize(Loan $loan, Collection $entries, Carbon $now): array
    {
        $rate = $loan->apr_bps / 10000.0;

        $principalCents = 0;
        $accruedInterestCents = 0;

        $lastTs = $loan->started_at instanceof Carbon ? $loan->started_at->copy() : Carbon::parse($loan->started_at);

        // entries are expected chronological
        foreach ($entries as $entry) {
            $entryTs = $entry->effective_at instanceof Carbon ? $entry->effective_at->copy() : Carbon::parse($entry->effective_at);

            if ($entryTs->lessThan($lastTs)) {
                $entryTs = $lastTs->copy();
            }

            // accrue interest between lastTs and entryTs on principal only
            [$accrualCents] = $this->accrueBetween($principalCents, $rate, $lastTs, $entryTs);
            $accruedInterestCents += $accrualCents;

            // apply entry
            if ($entry->type === 'disbursement') {
                $principalCents += (int) $entry->amount_cents;
            } elseif ($entry->type === 'payment') {
                $payment = -(int) $entry->amount_cents; // amount_cents negative for payments; normalize
                // reduce interest first
                $payInterest = min($payment, max(0, $accruedInterestCents));
                $accruedInterestCents -= $payInterest;
                $remaining = $payment - $payInterest;
                if ($remaining > 0) {
                    $principalCents = max(0, $principalCents - $remaining);
                }
            }

            $lastTs = $entryTs;
        }

        // accrue to now
        [$accrualToNowCents, $perDayCents] = $this->accrueBetween($principalCents, $rate, $lastTs, $now);
        $accruedInterestCents += $accrualToNowCents;

        // per-interval speeds based on current principal and APR
        $perHourCents = (int) round($perDayCents / 24.0);
        $perMinuteCents = (int) round($perDayCents / 1440.0);
        $perSecondCents = (int) round($perDayCents / 86400.0);

        // today's accrued (since midnight)
        $midnight = $now->copy()->startOfDay();
        [$todayAccrualCents] = $this->accrueBetween($principalCents, $rate, max($midnight, $lastTs), $now);

        return [
            'currentBalanceCents' => $principalCents + $accruedInterestCents,
            'principalCents' => $principalCents,
            'accruedInterestCents' => $accruedInterestCents,
            'perDayCents' => $perDayCents,
            'perHourCents' => $perHourCents,
            'perMinuteCents' => $perMinuteCents,
            'perSecondCents' => $perSecondCents,
            'todayAccruedCents' => $todayAccrualCents,
            'aprBps' => $loan->apr_bps,
            'startedAt' => $loan->started_at?->toISOString(),
            'asOf' => $now->toISOString(),
        ];
    }

    /**
     * Accrue simple interest between two timestamps using actual/365.
     * Returns [totalAccruedCents, perDayCents].
     */
    private function accrueBetween(int $principalCents, float $rate, Carbon $from, Carbon $to): array
    {
        if ($to->lessThanOrEqualTo($from) || $principalCents <= 0 || $rate <= 0) {
            return [0, 0];
        }

        $days = $from->floatDiffInDays($to);
        $perDayCents = (int) round($principalCents * ($rate / 365.0));
        $accrued = (int) round($perDayCents * $days);

        return [$accrued, $perDayCents];
    }
}

