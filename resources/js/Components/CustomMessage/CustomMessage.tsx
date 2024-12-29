import axios from 'axios';
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

        const interval = setInterval(
            () => {
                fetchMessages();
            },
            1000 * 60 * 1 // 1 minute
        );

        return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading messages...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="rounded-lg p-4 shadow dark:bg-gray-800">
            <div className="space-y-3">
                {messages.map((message) => (
                    <div key={message.id} className="p-3">
                        <p className="text-white">{message.content} - dummy message</p>
                        <span className="text-sm text-gray-500">{new Date(message.created_at).toLocaleDateString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
