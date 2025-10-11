import axios from 'axios';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('/api/messages');
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

    // if (loading) return <div>Loading messages...</div>;
    // if (error) return <div className="text-red-500">{error}</div>;

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
        </div>
    );
}
