import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface PrayerRequest {
    id: number;
    prayer_request_from: string | null;
    prayer_for: string | null;
    is_answered: boolean;
    prayer_request: string | null;
    answered_at: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: PrayerRequest[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function PrayerRequestsIndex() {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });
    const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered'>('all');
    const [showForm, setShowForm] = useState(false);
    const [editingRequest, setEditingRequest] = useState<PrayerRequest | null>(null);
    console.log(usePage().props);
    const [formData, setFormData] = useState({
        //@ts-expect-error - ignore the type error for the auth user
        prayer_request_from: usePage().props.auth?.user?.first_name || 'Unnamed',
        prayer_for: '',
        prayer_request: '',
        is_answered: false,
    });

    const fetchRequests = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`/prayer-requests/manage/data?page=${page}&filter=${filter}`);
            const data: PaginatedData = response.data;
            setRequests(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                per_page: data.per_page,
                total: data.total,
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch prayer requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingRequest) {
                await axios.put(`/prayer-requests/${editingRequest.id}`, formData);
            } else {
                await axios.post('/prayer-requests', formData);
            }
            setShowForm(false);
            setEditingRequest(null);
            setFormData({ prayer_request_from: '', prayer_for: '', prayer_request: '', is_answered: false });
            fetchRequests(pagination.current_page);
        } catch (err) {
            setError('Failed to save prayer request');
            console.error(err);
        }
    };

    const handleEdit = (request: PrayerRequest) => {
        setEditingRequest(request);
        setFormData({
            prayer_request_from: request.prayer_request_from || '',
            prayer_for: request.prayer_for || '',
            prayer_request: request.prayer_request || '',
            is_answered: request.is_answered,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this prayer request?')) {
            try {
                await axios.delete(`/prayer-requests/${id}`);
                fetchRequests(pagination.current_page);
            } catch (err) {
                setError('Failed to delete prayer request');
                console.error(err);
            }
        }
    };

    const handleMarkAnswered = async (id: number, isAnswered: boolean) => {
        try {
            if (isAnswered) {
                await axios.post(`/prayer-requests/${id}/mark-unanswered`);
            } else {
                await axios.post(`/prayer-requests/${id}/mark-answered`);
            }
            fetchRequests(pagination.current_page);
        } catch (err) {
            setError('Failed to update prayer request');
            console.error(err);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingRequest(null);
        setFormData({ prayer_request_from: '', prayer_for: '', prayer_request: '', is_answered: false });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Prayer Requests</h2>}>
            <Head title="Prayer Requests" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold">Prayer Requests</h1>
                                <button onClick={() => setShowForm(true)} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                                    Add Prayer Request
                                </button>
                            </div>

                            {/* Filter buttons */}
                            <div className="mb-4 flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`rounded px-4 py-2 ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    All ({pagination.total})
                                </button>
                                <button
                                    onClick={() => setFilter('unanswered')}
                                    className={`rounded px-4 py-2 ${filter === 'unanswered' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Unanswered
                                </button>
                                <button
                                    onClick={() => setFilter('answered')}
                                    className={`rounded px-4 py-2 ${filter === 'answered' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Answered
                                </button>
                            </div>

                            {/* Form Modal */}
                            {showForm && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                                        <h2 className="mb-4 text-xl font-bold">{editingRequest ? 'Edit Prayer Request' : 'Add Prayer Request'}</h2>
                                        <form onSubmit={handleSubmit}>
                                            {/* <div className="mb-4">
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Your Name *</label>
                                                <input
                                                    type="text"
                                                    value={formData.prayer_request_from}
                                                    onChange={(e) => setFormData({ ...formData, prayer_request_from: e.target.value })}
                                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                                    required
                                                />
                                            </div> */}
                                            <div className="mb-4">
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Who is requesting prayer?</label>
                                                <input
                                                    type="text"
                                                    value={formData.prayer_for}
                                                    onChange={(e) => setFormData({ ...formData, prayer_for: e.target.value })}
                                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                                />
                                            </div>
                                            {/* <div className="mb-4">
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Prayer Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.prayer_date}
                                                    onChange={(e) => setFormData({ ...formData, prayer_date: e.target.value })}
                                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                                />
                                            </div> */}
                                            <div className="mb-4">
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Prayer Request</label>
                                                <textarea
                                                    value={formData.prayer_request}
                                                    onChange={(e) => setFormData({ ...formData, prayer_request: e.target.value })}
                                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.is_answered}
                                                        onChange={(e) => setFormData({ ...formData, is_answered: e.target.checked })}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">Is Answered</span>
                                                </label>
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700">
                                                    {editingRequest ? 'Update' : 'Create'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={resetForm}
                                                    className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Error message */}
                            {error && <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>}

                            {/* Loading state */}
                            {loading && <div className="py-4 text-center">Loading...</div>}

                            {/* Prayer requests list */}
                            {!loading && (
                                <div className="space-y-4">
                                    {requests.length === 0 ? (
                                        <div className="py-8 text-center text-gray-500">No prayer requests found.</div>
                                    ) : (
                                        requests.map((request) => (
                                            <div
                                                key={request.id}
                                                className={`rounded-lg border p-4 ${
                                                    request.is_answered ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <h3 className={`text-lg font-semibold ${request.is_answered ? 'text-gray-500 line-through' : ''}`}>
                                                                {request.prayer_request_from || 'Unnamed'}
                                                            </h3>
                                                            <span className="text-xl">{request.is_answered ? '✅' : '🙏'}</span>
                                                        </div>
                                                        {request.prayer_for && (
                                                            <p className="mb-1 text-sm text-gray-600">
                                                                <strong>For:</strong> {request.prayer_for}
                                                            </p>
                                                        )}
                                                        {request.prayer_request && (
                                                            <p className="mb-1 text-sm text-green-700">
                                                                <strong>Answer:</strong> {request.prayer_request}
                                                            </p>
                                                        )}
                                                        <div className="text-xs text-gray-500">
                                                            {request.answered_at && <span>Answered: {new Date(request.answered_at).toLocaleDateString()}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(request)}
                                                            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleMarkAnswered(request.id, request.is_answered)}
                                                            className={`rounded px-2 py-1 text-xs ${
                                                                request.is_answered
                                                                    ? 'bg-yellow-500 text-white hover:bg-yellow-700'
                                                                    : 'bg-green-500 text-white hover:bg-green-700'
                                                            }`}
                                                        >
                                                            {request.is_answered ? 'Unmark' : 'Mark'} Answered
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(request.id)}
                                                            className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {!loading && pagination.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fetchRequests(pagination.current_page - 1)}
                                            disabled={pagination.current_page === 1}
                                            className="rounded border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-3 py-2">
                                            Page {pagination.current_page} of {pagination.last_page}
                                        </span>
                                        <button
                                            onClick={() => fetchRequests(pagination.current_page + 1)}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className="rounded border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
