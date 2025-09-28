import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type LoanEntry = {
    id: number;
    loan_id: number;
    type: 'disbursement' | 'payment';
    amount_cents: number;
    effective_at: string;
    note?: string | null;
    created_at: string;
    updated_at: string;
};

type Loan = {
    id: number;
    name: string;
    apr_bps: number;
    day_count_basis: string;
    started_at: string;
    created_at: string;
    updated_at: string;
    entries?: LoanEntry[];
};

export default function LoansIndex() {
    const { props } = usePage<{ loans: Loan[] }>();
    const loans = props.loans ?? [];

    const [form, setForm] = useState({
        name: '',
        apr_bps: 795,
        day_count_basis: 'actual_365',
        started_at: new Date().toISOString(),
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.post('/loans', form);
    };

    const remove = (id: number) => {
        if (confirm('Delete this loan?')) router.delete(`/loans/${id}`);
    };

    const save = (loan: Loan) => {
        router.put(`/loans/${loan.id}`, loan);
    };

    // Per-loan new entry form state
    const [newEntry, setNewEntry] = useState<Record<number, { type: 'disbursement' | 'payment'; amount_cents: number; effective_at: string; note: string }>>(
        {}
    );

    const ensureEntryState = (loanId: number) => {
        if (!newEntry[loanId]) {
            setNewEntry({
                ...newEntry,
                [loanId]: {
                    type: 'disbursement',
                    amount_cents: 0,
                    effective_at: new Date().toISOString(),
                    note: '',
                },
            });
        }
    };

    const addEntry = (loanId: number) => {
        const entry = newEntry[loanId];
        if (!entry) return;
        const payload = { ...entry } as any;
        if (payload.type === 'payment') {
            payload.amount_cents = -Math.abs(payload.amount_cents);
        } else {
            payload.amount_cents = Math.abs(payload.amount_cents);
        }
        payload.effective_at = new Date(payload.effective_at).toISOString();
        router.post(`/loans/${loanId}/entries`, payload);
    };

    const deleteEntry = (loanId: number, entryId: number) => {
        if (confirm('Delete this entry?')) router.delete(`/loans/${loanId}/entries/${entryId}`);
    };

    const saveEntry = (loanId: number, entry: LoanEntry) => {
        const payload: any = { ...entry };
        // normalize amount sign by type
        if (payload.type === 'payment') payload.amount_cents = -Math.abs(payload.amount_cents);
        if (payload.type === 'disbursement') payload.amount_cents = Math.abs(payload.amount_cents);
        payload.effective_at = new Date(payload.effective_at).toISOString();
        router.put(`/loans/${loanId}/entries/${entry.id}`, payload);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Loans</h2>}>
            <Head title="Loans" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl space-y-8 sm:px-6 lg:px-8">
                    <section className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold">Create Loan</h3>
                        <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                            <input
                                className="rounded border border-gray-300 p-2 dark:bg-gray-900"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                className="rounded border border-gray-300 p-2 dark:bg-gray-900"
                                type="number"
                                placeholder="APR bps"
                                value={form.apr_bps}
                                onChange={(e) => setForm({ ...form, apr_bps: Number(e.target.value) })}
                            />
                            <select
                                className="rounded border border-gray-300 p-2 dark:bg-gray-900"
                                value={form.day_count_basis}
                                onChange={(e) => setForm({ ...form, day_count_basis: e.target.value })}
                            >
                                <option value="actual_365">actual_365</option>
                            </select>
                            <input
                                className="rounded border border-gray-300 p-2 dark:bg-gray-900"
                                type="datetime-local"
                                value={new Date(form.started_at).toISOString().slice(0, 16)}
                                onChange={(e) => setForm({ ...form, started_at: new Date(e.target.value).toISOString() })}
                            />
                            <div className="sm:col-span-4">
                                <button className="rounded bg-blue-600 px-4 py-2 text-white">Create</button>
                            </div>
                        </form>
                    </section>

                    <section className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold">Existing Loans</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-2">Name</th>
                                        <th className="p-2">APR</th>
                                        <th className="p-2">Day Count</th>
                                        <th className="p-2">Started</th>
                                        <th className="p-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.map((loan) => (
                                        <>
                                            <tr key={`loan-${loan.id}`} className="border-b border-gray-800">
                                                <td className="p-2">
                                                    <input
                                                        className="w-full rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                        value={loan.name}
                                                        onChange={(e) => (loan.name = e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        className="w-24 rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                        type="number"
                                                        value={loan.apr_bps}
                                                        onChange={(e) => (loan.apr_bps = Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <select
                                                        className="rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                        value={loan.day_count_basis}
                                                        onChange={(e) => (loan.day_count_basis = e.target.value)}
                                                    >
                                                        <option value="actual_365">actual_365</option>
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        className="rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                        type="datetime-local"
                                                        value={new Date(loan.started_at).toISOString().slice(0, 16)}
                                                        onChange={(e) => (loan.started_at = new Date(e.target.value).toISOString())}
                                                    />
                                                </td>
                                                <td className="space-x-2 p-2">
                                                    <button className="rounded bg-green-600 px-3 py-1 text-white" onClick={() => save(loan)}>
                                                        Save
                                                    </button>
                                                    <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => remove(loan.id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr key={`entries-${loan.id}`}>
                                                <td colSpan={5} className="bg-gray-50 p-3 dark:bg-gray-900/40">
                                                    <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Ledger Entries</div>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full text-left text-xs">
                                                            <thead>
                                                                <tr>
                                                                    <th className="p-2">Type</th>
                                                                    <th className="p-2">Amount (cents)</th>
                                                                    <th className="p-2">Effective</th>
                                                                    <th className="p-2">Note</th>
                                                                    <th className="p-2"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {loan.entries?.map((entry) => (
                                                                    <tr key={entry.id} className="border-t border-gray-200 dark:border-gray-800">
                                                                        <td className="p-2">
                                                                            <select
                                                                                className="rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                                                value={entry.type}
                                                                                onChange={(e) => (entry.type = e.target.value as any)}
                                                                            >
                                                                                <option value="disbursement">disbursement</option>
                                                                                <option value="payment">payment</option>
                                                                            </select>
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <input
                                                                                className="w-32 rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                                                type="number"
                                                                                value={entry.amount_cents}
                                                                                onChange={(e) => (entry.amount_cents = Number(e.target.value))}
                                                                            />
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <input
                                                                                className="rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                                                type="datetime-local"
                                                                                value={new Date(entry.effective_at).toISOString().slice(0, 16)}
                                                                                onChange={(e) => (entry.effective_at = new Date(e.target.value).toISOString())}
                                                                            />
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <input
                                                                                className="w-full rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                                                value={entry.note ?? ''}
                                                                                onChange={(e) => (entry.note = e.target.value)}
                                                                            />
                                                                        </td>
                                                                        <td className="space-x-2 p-2 text-right">
                                                                            <button
                                                                                className="rounded bg-green-600 px-2 py-1 text-white"
                                                                                onClick={() => saveEntry(loan.id, entry)}
                                                                            >
                                                                                Save
                                                                            </button>
                                                                            <button
                                                                                className="rounded bg-red-600 px-2 py-1 text-white"
                                                                                onClick={() => deleteEntry(loan.id, entry.id)}
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                <tr className="border-t border-gray-300 dark:border-gray-700">
                                                                    <td className="p-2">
                                                                        {ensureEntryState(loan.id)}
                                                                        <select
                                                                            className="rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                                            value={newEntry[loan.id]?.type ?? 'disbursement'}
                                                                            onChange={(e) =>
                                                                                setNewEntry({
                                                                                    ...newEntry,
                                                                                    [loan.id]: {
                                                                                        ...(newEntry[loan.id] ?? {
                                                                                            type: 'disbursement',
                                                                                            amount_cents: 0,
                                                                                            effective_at: new Date().toISOString(),
                                                                                            note: '',
                                                                                        }),
                                                                                        type: e.target.value as any,
                                                                                    },
                                                                                })
                                                                            }
                                                                        >
                                                                            <option value="disbursement">disbursement</option>
                                                                            <option value="payment">payment</option>
                                                                        </select>
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <input
                                                                            className="w-32 rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                                            type="number"
                                                                            value={newEntry[loan.id]?.amount_cents ?? 0}
                                                                            onChange={(e) =>
                                                                                setNewEntry({
                                                                                    ...newEntry,
                                                                                    [loan.id]: {
                                                                                        ...(newEntry[loan.id] ?? {
                                                                                            type: 'disbursement',
                                                                                            amount_cents: 0,
                                                                                            effective_at: new Date().toISOString(),
                                                                                            note: '',
                                                                                        }),
                                                                                        amount_cents: Number(e.target.value),
                                                                                    },
                                                                                })
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <input
                                                                            className="rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                                            type="datetime-local"
                                                                            value={new Date(newEntry[loan.id]?.effective_at ?? new Date().toISOString())
                                                                                .toISOString()
                                                                                .slice(0, 16)}
                                                                            onChange={(e) =>
                                                                                setNewEntry({
                                                                                    ...newEntry,
                                                                                    [loan.id]: {
                                                                                        ...(newEntry[loan.id] ?? {
                                                                                            type: 'disbursement',
                                                                                            amount_cents: 0,
                                                                                            effective_at: new Date().toISOString(),
                                                                                            note: '',
                                                                                        }),
                                                                                        effective_at: new Date(e.target.value).toISOString(),
                                                                                    },
                                                                                })
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <input
                                                                            className="w-full rounded border border-gray-300 p-1 dark:bg-gray-900"
                                                                            value={newEntry[loan.id]?.note ?? ''}
                                                                            onChange={(e) =>
                                                                                setNewEntry({
                                                                                    ...newEntry,
                                                                                    [loan.id]: {
                                                                                        ...(newEntry[loan.id] ?? {
                                                                                            type: 'disbursement',
                                                                                            amount_cents: 0,
                                                                                            effective_at: new Date().toISOString(),
                                                                                            note: '',
                                                                                        }),
                                                                                        note: e.target.value,
                                                                                    },
                                                                                })
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td className="p-2 text-right">
                                                                        <button
                                                                            className="rounded bg-blue-600 px-3 py-1 text-white"
                                                                            onClick={() => addEntry(loan.id)}
                                                                        >
                                                                            Add
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
