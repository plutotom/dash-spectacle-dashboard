import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { User as AppUser, PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type User = {
    id: number;
    name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    role?: 'admin' | 'user' | string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

export default function Manage({ users }: { users: { data: User[]; links: PaginationLink[] } }) {
    const page = usePage<PageProps>();
    const authUser = page.props.auth?.user as (AppUser & { role?: string }) | undefined;
    // We'll use router.put/delete to send data payloads

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manage Users</h2>}>
            <Head title="Manage Users" />

            <div className="mx-auto max-w-5xl space-y-4 p-4">
                {authUser?.role !== 'admin' && <div className="rounded bg-yellow-100 p-3 text-yellow-900">You do not have permission to manage users.</div>}

                {authUser?.role === 'admin' && (
                    <div className="overflow-x-auto rounded border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                                    <th className="px-3 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.data.map((u) => (
                                    <tr key={u.id} className="align-top">
                                        <td className="px-3 py-2 text-sm text-gray-700">{u.id}</td>
                                        <td className="px-3 py-2">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const data = new FormData(e.currentTarget);
                                                    const password = String(data.get('password') || '');
                                                    const passwordConfirmation = String(data.get('password_confirmation') || '');

                                                    // Only include password if both fields are filled and match
                                                    const formData: Record<string, string> = {
                                                        name: String(data.get('name') || ''),
                                                        first_name: String(data.get('first_name') || ''),
                                                        last_name: String(data.get('last_name') || ''),
                                                        email: String(data.get('email') || ''),
                                                        role: String(data.get('role') || 'user'),
                                                    };

                                                    if (password && password === passwordConfirmation) {
                                                        formData.password = password;
                                                        formData.password_confirmation = passwordConfirmation;
                                                    } else if (password || passwordConfirmation) {
                                                        alert('Passwords do not match or are incomplete');
                                                        return;
                                                    }

                                                    router.put(route('users.update', { user: u.id }), formData, {
                                                        headers: {
                                                            'X-CSRF-TOKEN':
                                                                (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                                                        },
                                                        onError: (errors) => {
                                                            console.error('Validation errors:', errors);
                                                            alert('Please check the form for errors: ' + Object.values(errors).flat().join(', '));
                                                        },
                                                        onSuccess: () => {
                                                            alert('User updated successfully!');
                                                        },
                                                    });
                                                }}
                                                className="flex flex-col gap-2 md:flex-row md:items-center"
                                            >
                                                <input name="name" defaultValue={u.name} className="rounded border p-2 text-sm" placeholder="Name" />
                                                <input
                                                    name="first_name"
                                                    defaultValue={u.first_name || ''}
                                                    className="rounded border p-2 text-sm"
                                                    placeholder="First"
                                                />
                                                <input
                                                    name="last_name"
                                                    defaultValue={u.last_name || ''}
                                                    className="rounded border p-2 text-sm"
                                                    placeholder="Last"
                                                />
                                                <input
                                                    name="email"
                                                    defaultValue={u.email}
                                                    className="min-w-[220px] rounded border p-2 text-sm"
                                                    placeholder="Email"
                                                />
                                                <select name="role" defaultValue={u.role || 'user'} className="rounded border p-2 text-sm">
                                                    <option value="user">user</option>
                                                    <option value="admin">admin</option>
                                                </select>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    className="rounded border p-2 text-sm"
                                                    placeholder="New password (optional)"
                                                />
                                                <input
                                                    name="password_confirmation"
                                                    type="password"
                                                    className="rounded border p-2 text-sm"
                                                    placeholder="Confirm password"
                                                />
                                                <button className="rounded bg-green-600 px-3 py-2 text-sm text-white">Save</button>
                                            </form>
                                        </td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2 text-right">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this user?')) {
                                                        router.delete(route('users.destroy', { user: u.id }), {
                                                            onSuccess: () => {
                                                                alert('User deleted successfully!');
                                                            },
                                                        });
                                                    }
                                                }}
                                                className="rounded bg-red-600 px-3 py-2 text-sm text-white"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
