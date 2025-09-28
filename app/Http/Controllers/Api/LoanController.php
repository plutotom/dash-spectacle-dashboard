<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLoanEntryRequest;
use App\Models\Loan;
use App\Services\LoanCalculator;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function summary(Request $request)
    {
        $now = now();
        $loanId = $request->query('loan_id');
        $calculator = app(LoanCalculator::class);

        if ($loanId) {
            $loan = Loan::findOrFail($loanId);
            $entries = $loan->entries()->orderBy('effective_at')->get();
            $calc = $calculator->summarize($loan, $entries, $now);

            return response()->json($calc);
        }

        // Aggregate across all loans
        $loans = Loan::all();
        if ($loans->isEmpty()) {
            abort(404, 'No loans configured');
        }

        $totals = [
            'currentBalanceCents' => 0,
            'principalCents' => 0,
            'accruedInterestCents' => 0,
            'perDayCents' => 0,
            'perHourCents' => 0,
            'perMinuteCents' => 0,
            'perSecondCents' => 0,
            'todayAccruedCents' => 0,
        ];
        $minStartedAt = null;
        $breakdown = [];

        foreach ($loans as $loan) {
            $entries = $loan->entries()->orderBy('effective_at')->get();
            $calc = $calculator->summarize($loan, $entries, $now);

            foreach ($totals as $k => $_) {
                $totals[$k] += (int) ($calc[$k] ?? 0);
            }
            if ($loan->started_at) {
                $minStartedAt = $minStartedAt ? min($minStartedAt, $loan->started_at->toISOString()) : $loan->started_at->toISOString();
            }
            $breakdown[] = [
                'loanId' => $loan->id,
                'name' => $loan->name,
                'summary' => $calc,
            ];
        }

        return response()->json(array_merge($totals, [
            'aprBps' => null, // multiple APRs
            'startedAt' => $minStartedAt,
            'asOf' => $now->toISOString(),
            'loanCount' => $loans->count(),
            'breakdown' => $breakdown,
        ]));
    }

    public function indexEntries(Request $request)
    {
        $loan = Loan::firstOrFail();

        $entries = $loan->entries()
            ->orderByDesc('effective_at')
            ->paginate(50);

        return response()->json($entries);
    }

    public function storeEntry(StoreLoanEntryRequest $request)
    {
        $loan = Loan::firstOrFail();

        $entry = $loan->entries()->create($request->validated());

        return response()->json($entry, 201);
    }
}
