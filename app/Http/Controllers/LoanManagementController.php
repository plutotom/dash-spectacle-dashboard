<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanEntryRequest;
use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Loan;
use App\Models\LoanLedgerEntry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LoanManagementController extends Controller
{
    public function index(): Response
    {
        $loans = Loan::query()
            ->with(['entries' => function ($q) {
                $q->orderByDesc('effective_at')
                    ->select(['id', 'loan_id', 'type', 'amount_cents', 'effective_at', 'note', 'created_at', 'updated_at']);
            }])
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'apr_bps', 'day_count_basis', 'started_at', 'created_at', 'updated_at']);

        return Inertia::render('Loans/Index', [
            'loans' => $loans,
        ]);
    }

    public function store(StoreLoanRequest $request): RedirectResponse
    {
        Loan::create($request->validated());

        return redirect()->route('loans.index');
    }

    public function update(UpdateLoanRequest $request, Loan $loan): RedirectResponse
    {
        $loan->update($request->validated());

        return redirect()->route('loans.index');
    }

    public function destroy(Loan $loan): RedirectResponse
    {
        $loan->delete();

        return redirect()->route('loans.index');
    }

    public function storeEntry(StoreLoanEntryRequest $request, Loan $loan): RedirectResponse
    {
        $loan->entries()->create($request->validated());

        return redirect()->route('loans.index');
    }

    public function updateEntry(StoreLoanEntryRequest $request, Loan $loan, LoanLedgerEntry $entry): RedirectResponse
    {
        // Optional: ensure the entry belongs to the loan
        if ($entry->loan_id !== $loan->id) {
            abort(404);
        }
        $entry->update($request->validated());

        return redirect()->route('loans.index');
    }

    public function destroyEntry(Loan $loan, LoanLedgerEntry $entry): RedirectResponse
    {
        if ($entry->loan_id !== $loan->id) {
            abort(404);
        }
        $entry->delete();

        return redirect()->route('loans.index');
    }
}
