import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

type Message = {
    id: number;
    content: string;
    created_at: string;
    name?: string;
};

export default function Manage({ messages }: { messages: { data: Message[]; links: any[] } }) {
    const page = usePage();
    const user = (page.props as any).auth?.user as { role?: string } | undefined;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manage Messages</h2>}>
            <Head title="Manage Messages" />

            <div className="mx-auto max-w-4xl space-y-4 p-4">
                {user?.role !== 'admin' && <div className="rounded bg-yellow-100 p-3 text-yellow-900">You do not have permission to manage messages.</div>}

                {user?.role === 'admin' && (
                    <div className="space-y-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const data = new FormData(form);
                                const content = String(data.get('content') || '').trim();
                                if (!content) return;
                                router.post(route('messages.store'), { content });
                                form.reset();
                            }}
                            className="flex gap-2"
                        >
                            <input name="content" className="flex-1 rounded border p-2 text-sm" placeholder="New message" />
                            <button className="rounded bg-blue-600 px-3 py-2 text-white">Add</button>
                        </form>

                        <div className="divide-y divide-gray-200 rounded border">
                            {messages.data.map((m) => (
                                <div key={m.id} className="flex items-center gap-2 p-2">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const data = new FormData(e.currentTarget);
                                            const content = String(data.get('content') || '').trim();
                                            router.put(route('messages.update', { message: m.id }), { content });
                                        }}
                                        className="flex flex-1 items-center gap-2"
                                    >
                                        <input name="content" defaultValue={m.content} className="flex-1 rounded border p-2 text-sm" />
                                        <button className="rounded bg-green-600 px-3 py-2 text-white">Save</button>
                                    </form>
                                    <button
                                        onClick={() => router.delete(route('messages.destroy', { message: m.id }))}
                                        className="rounded bg-red-600 px-3 py-2 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
