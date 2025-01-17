import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Message, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface MessagesPageProps extends PageProps {
    messages: {
        data: Message[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ messages, auth }: MessagesPageProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showFullContent, setShowFullContent] = useState<boolean>(false);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        content: '',
    });

    const deleteMessage = (id: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            setDeletingId(id);
            router.delete(route('messages.destroy', id), {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const startEdit = (message: Message) => {
        setEditingMessage(message);
        setEditForm({
            name: message.name,
            content: message.content,
        });
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setEditForm({ name: '', content: '' });
    };

    const saveEdit = (id: number) => {
        router.put(route('messages.update', id), editForm, {
            onSuccess: () => {
                setEditingMessage(null);
                setEditForm({ name: '', content: '' });
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Messages</h2>}>
            <Head title="Messages" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Content
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {messages.data.map((message) => (
                                            <tr key={message.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-gray-900 dark:text-gray-100">
                                                    {editingMessage?.id === message.id ? (
                                                        <input
                                                            type="text"
                                                            value={editForm.name}
                                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                            className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                                                        />
                                                    ) : (
                                                        message.name
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                                    {editingMessage?.id === message.id ? (
                                                        <textarea
                                                            value={editForm.content}
                                                            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                                            className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                                                            rows={3}
                                                        />
                                                    ) : message.content.length > 50 ? (
                                                        <div className="flex flex-col items-start">
                                                            {showFullContent ? message.content : message.content.substring(0, 50) + '...'}

                                                            <button
                                                                onClick={() => setShowFullContent(!showFullContent)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                {showFullContent ? 'Show less' : 'Read more'}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        message.content
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-gray-900 dark:text-gray-100">
                                                    {new Date(message.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {editingMessage?.id === message.id ? (
                                                        <div className="flex space-x-2">
                                                            <button onClick={() => saveEdit(message.id)} className="text-green-600 hover:text-green-900">
                                                                Save
                                                            </button>
                                                            <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex space-x-2">
                                                            <button onClick={() => startEdit(message)} className="text-blue-600 hover:text-blue-900">
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteMessage(message.id)}
                                                                disabled={deletingId === message.id}
                                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                            >
                                                                {deletingId === message.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
