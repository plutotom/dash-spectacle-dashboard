import React, { useEffect, useState } from 'react';

interface PrayerRequest {
    id: number;
    name: string | null;
    person: string | null;
    is_answered: boolean;
    answer: string | null;
    prayer_date: string | null;
    answered_at: string | null;
}

interface PrayerRequestsProps {
    endpoint?: string;
    limit?: number;
}

const PrayerRequests: React.FC<PrayerRequestsProps> = ({ endpoint = '/prayer-requests/dashboard', limit }) => {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(endpoint)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch prayer requests');
                return res.json();
            })
            .then((data) => {
                const requestsData = data.data || [];
                setRequests(limit ? requestsData.slice(0, limit) : requestsData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [endpoint, limit]);

    if (loading) return <div className="text-primary-foreground opacity-70">Loading prayer requests...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="w-full">
            <div
                className="max-h-[30vh] overflow-y-auto"
                style={{
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE and Edge
                }}
            >
                <div
                    style={{
                        overflowY: 'auto',
                        maxHeight: '30vh',
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none', // IE and Edge
                    }}
                    className="w-full"
                >
                    {/* Hide scrollbar for Chrome, Safari and Opera */}
                    <style>
                        {`
                            [data-hide-scrollbar]::-webkit-scrollbar {
                                display: none;
                            }
                        `}
                    </style>
                    <div data-hide-scrollbar>
                        {requests.length === 0
                            ? !loading && <div className="text-primary-foreground opacity-70">No prayer requests available</div>
                            : requests.map((req) => (
                                  <div
                                      key={req.id}
                                      className={`my-1 flex flex-col rounded-xl bg-white bg-opacity-10 p-1 backdrop-blur-sm transition-colors ${
                                          req.is_answered ? 'opacity-60' : ''
                                      }`}
                                  >
                                      <div className="mb-1 flex items-center justify-between text-sm text-gray-300">
                                          <span className="text-xs font-medium">{req.name || 'Unnamed'}</span>
                                          <span className="text-lg">{req.is_answered ? '✅' : '🙏'}</span>
                                      </div>
                                      <div className={`text-sm text-white ${req.is_answered ? 'line-through' : ''}`}>
                                          {req.person && (
                                              <div className="mb-1">
                                                  <span className="font-medium">Person:</span> {req.person}
                                              </div>
                                          )}
                                          {req.answer && (
                                              <div className="mb-1 text-green-200">
                                                  <span className="font-medium">Answer:</span> {req.answer}
                                              </div>
                                          )}
                                      </div>
                                      <div className="mt-1 text-xs text-gray-300">
                                          {req.prayer_date && <span>Prayer Date: {new Date(req.prayer_date).toLocaleDateString()}</span>}
                                          {req.answered_at && <span className="ml-2">Answered: {new Date(req.answered_at).toLocaleDateString()}</span>}
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrayerRequests;
