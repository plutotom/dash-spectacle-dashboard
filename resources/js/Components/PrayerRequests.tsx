import React, { useEffect, useRef, useState } from 'react';

interface PrayerRequest {
    id: number;
    prayer_request_from: string | null;
    prayer_for: string | null;
    is_answered: boolean;
    prayer_request: string | null;
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
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idleTimeoutMs = 1000 * 10; // 10 seconds

    useEffect(() => {
        const fetchPrayerRequests = async () => {
            try {
                const response = await fetch(endpoint);
                setError(null);
                if (!response.ok) throw new Error('Failed to fetch prayer requests');
                const data = await response.json();
                const requestsData = data.data || [];
                setRequests(limit ? requestsData.slice(0, limit) : requestsData);
                setError(null);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch prayer requests');
                setLoading(false);
            }
        };

        fetchPrayerRequests();

        const interval = setInterval(
            () => {
                fetchPrayerRequests();
            },
            1000 * 60 * 1 // 1 minute
        );

        return () => clearInterval(interval);
    }, [endpoint, limit]);

    useEffect(() => {
        const resetIdleTimer = () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
            idleTimerRef.current = setTimeout(() => {
                // You can add any idle timeout logic here if needed
                console.log('User has been idle for 10 seconds');
            }, idleTimeoutMs);
        };

        const activityHandler = () => resetIdleTimer();
        const events: (keyof DocumentEventMap)[] = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
        events.forEach((event) => window.addEventListener(event, activityHandler, { passive: true } as AddEventListenerOptions));

        // start timer on mount
        resetIdleTimer();

        return () => {
            events.forEach((event) => window.removeEventListener(event, activityHandler));
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
        };
    }, []);

    if (loading) return <div className="text-primary-foreground opacity-70">Loading prayer requests...</div>;

    return (
        <div className="w-full">
            <div
                className="max-h-[60vh] overflow-y-auto"
                style={{
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE and Edge
                }}
            >
                <div
                    style={{
                        overflowY: 'auto',
                        maxHeight: '60vh',
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
                                      <div className="flex items-center justify-between text-sm text-gray-300">
                                          <span className="text-xs font-medium">{req.prayer_request_from || 'Unnamed'}</span>
                                          <span className="text-lg">{req.is_answered ? '●' : '○'}</span>
                                      </div>
                                      <div className={`text-sm text-white ${req.is_answered ? 'line-through' : ''}`}>
                                          {req.prayer_for && (
                                              <div className="">
                                                  <span className="font-medium">For:</span> {req.prayer_for}
                                              </div>
                                          )}
                                          {req.prayer_request && (
                                              <div className="text-green-200">
                                                  <span className="font-medium">Request:</span> {req.prayer_request}
                                              </div>
                                          )}
                                      </div>
                                      <div className="text-xs text-gray-300">
                                          {req.answered_at && <span>Answered: {new Date(req.answered_at).toLocaleDateString()}</span>}
                                      </div>
                                  </div>
                              ))}
                    </div>
                    {error && <div className="text-red-500">Error: {error}</div>}
                </div>
            </div>
        </div>
    );
};

export default PrayerRequests;
