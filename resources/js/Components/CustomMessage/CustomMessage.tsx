import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: number;
    content: string;
    created_at: string;
    name: string;
}

export default function CustomMessage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [composerVisible, setComposerVisible] = useState(true);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idleTimeoutMs = 1000 * 10; // 10 seconds

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('/messages/feed');
                setError(null);
                setMessages(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed' + JSON.stringify(err));
                setLoading(false);
            }
        };

        fetchMessages();

        const interval = setInterval(
            () => {
                fetchMessages();
            },
            1000 * 60 * 1 // 1 minute
        );

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const resetIdleTimer = () => {
            setComposerVisible(true);
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
            idleTimerRef.current = setTimeout(() => {
                setComposerVisible(false);
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

    // if (loading) return <div>Loading messages...</div>;
    // if (error) return <div className="text-red-500">{error}</div>;

    // @ts-expect-error - lazy and not setting type
    const canPost = usePage().props.auth?.user ?? false;
    return (
        <div className="w-full">
            {loading && <div>Loading messages...</div>}

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
                        {messages.length === 0
                            ? !loading && <div className="text-muted-foreground">No messages available</div>
                            : messages.map((message) => (
                                  <div key={message.id} className="my-1 flex flex-col rounded-xl bg-white bg-opacity-10 p-1 backdrop-blur-sm transition-colors">
                                      <div className="mb-1 flex items-center justify-between text-sm text-gray-300">
                                          <span className="text-xs font-medium">{message.name}</span>
                                          <span>{new Date(message.created_at).toLocaleTimeString()}</span>
                                      </div>
                                      <p className="text-sm text-white">{message.content}</p>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {canPost && (
                <form
                    className={`mt-2 flex gap-2 transition-opacity duration-500 ${composerVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const formData = new FormData(form);
                        const content = String(formData.get('content') || '').trim();
                        if (!content) return;
                        try {
                            await axios.post('/messages', { content });
                            form.reset();
                            // refresh feed
                            const response = await axios.get('/messages/feed');
                            setMessages(response.data.data);
                            setError(null);
                        } catch (err) {
                            setError('Failed' + JSON.stringify(err));
                        }
                    }}
                >
                    <input
                        name="content"
                        placeholder="Write a message..."
                        className="flex-1 rounded border border-gray-300 p-2 text-sm text-black"
                        onFocus={() => setComposerVisible(true)}
                    />
                    <button type="submit" className="rounded bg-blue-600 px-3 py-2 text-sm text-white">
                        Send
                    </button>
                </form>
            )}
        </div>
    );
}
