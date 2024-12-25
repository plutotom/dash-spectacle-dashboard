import axios from 'axios';
import Echo from 'laravel-echo';
import { useEffect, useState } from 'react';

interface Message {
    id: number;
    content: string;
    created_at: string;
}

export default function CustomMessage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('/api/messages');

                setMessages(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load messages');
                setLoading(false);
            }
        };

        fetchMessages();

        window.Pusher.logToConsole = true;

        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
            wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
            wsPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
            enabledTransports: ['ws', 'wss'],
        });

        const channel = window.Echo.channel('messages');

        channel.listen('.messages', (data: any) => {
            console.log('Received message:', data);
            setMessages((prevMessages) => [data.message, ...prevMessages]);
        });

        return () => {
            channel.unbind('.messages');
            window.Echo.disconnect();
        };
    }, []);

    if (loading) return <div>Loading messages...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold">Recent Messages</h2>
            <div className="space-y-3">
                {messages.map((message) => (
                    <div key={message.id} className="rounded border border-gray-200 p-3 dark:border-gray-700">
                        <p className="text-gray-800 dark:text-gray-200">{message.content}</p>
                        <span className="text-sm text-gray-500">{new Date(message.created_at).toLocaleDateString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
