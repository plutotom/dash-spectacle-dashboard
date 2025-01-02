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
                console.log(response.data.data);
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
        <div className="">
            <div className="max-h-[30vh] overflow-y-auto">
                {messages.map((message) => (
                    <div key={message.id} className="my-1 flex w-1/3 flex-col rounded-xl bg-white bg-opacity-10 p-1 backdrop-blur-sm transition-colors">
                        <div className="mb-1 flex items-center justify-between text-sm text-gray-300">
                            <span className="font-medium">{message.name}</span>
                            <span>{new Date(message.created_at).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-lg text-white">{message.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
