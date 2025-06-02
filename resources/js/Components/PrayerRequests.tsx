import React, { useEffect, useState } from 'react';

interface PrayerRequest {
    id: number;
    name: string | null;
    person: string | null;
    is_answered: boolean;
    answer: string | null;
    prayer_date: string | null;
}

const PrayerRequests: React.FC = () => {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/prayer-requests')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch prayer requests');
                return res.json();
            })
            .then((data) => {
                setRequests(data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading prayer requests...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="mt-4">
            <h2 className="mb-2 text-lg font-bold">Prayer Requests</h2>
            <div className="flex flex-wrap gap-4">
                {requests.length === 0 ? (
                    <div className="w-full text-center">No prayer requests found.</div>
                ) : (
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="flex min-w-[220px] max-w-xs flex-1 flex-col justify-between rounded border border-gray-200 bg-white p-4 shadow"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-lg font-semibold">{req.name || 'Unnamed'}</span>
                                <span className="text-xl">{req.is_answered ? '✅' : '🙏'}</span>
                            </div>
                            <div className="mb-1 text-sm text-gray-700">
                                <span className="font-medium">Person:</span> {req.person || '-'}
                            </div>
                            {req.answer && (
                                <div className="mb-1 text-sm text-green-700">
                                    <span className="font-medium">Answer:</span> {req.answer}
                                </div>
                            )}
                            <div className="mt-2 text-xs text-gray-500">
                                <span className="font-medium">Prayer Date:</span> {req.prayer_date ? new Date(req.prayer_date).toLocaleDateString() : '-'}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PrayerRequests;
