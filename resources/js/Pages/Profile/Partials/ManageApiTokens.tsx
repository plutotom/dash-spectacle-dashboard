import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react'; // Changed icons to Lucide React icons
import { useState } from 'react';

interface ApiToken {
    id: number;
    name: string;
    token: string;
}

export default function ManageApiTokens({ className = '', tokens = [] }: { className?: string; tokens: ApiToken[] }) {
    const [editing, setEditing] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const form = useForm({
        name: '',
        token: '',
    });

    const createToken = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('api-tokens.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setIsCreating(false);
            },
        });
    };

    const updateToken = (token: ApiToken) => {
        form.put(route('api-tokens.update', token.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditing(null);
                form.reset();
            },
        });
    };

    const deleteToken = (token: ApiToken) => {
        if (confirm('Are you sure you want to delete this token?')) {
            form.delete(route('api-tokens.destroy', token.id));
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">API Tokens</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your API tokens that can be used to access your application.</p>
            </header>

            <div className="mt-6">
                <div className="mb-4 flex justify-end">
                    <PrimaryButton onClick={() => setIsCreating(true)} disabled={isCreating}>
                        <Plus className="mr-2 h-4 w-4" /> {/* Changed icon to Plus from Lucide React */}
                        New Token
                    </PrimaryButton>
                </div>

                {isCreating && (
                    <form onSubmit={createToken} className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    autoFocus // Added auto focus to the name field
                                />
                                <InputError message={form.errors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="token" value="Token" />
                                <TextInput
                                    id="token"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={form.data.token}
                                    onChange={(e) => form.setData('token', e.target.value)}
                                />
                                <InputError message={form.errors.token} className="mt-2" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <PrimaryButton className="ml-4" disabled={form.processing}>
                                Save
                            </PrimaryButton>
                        </div>
                    </form>
                )}

                <div className="space-y-4">
                    {tokens.map((token) => (
                        <div key={token.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                            {editing === token.id ? (
                                <div className="grid flex-1 grid-cols-2 gap-4">
                                    <TextInput type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="w-full" />
                                    <TextInput type="text" value={form.data.token} onChange={(e) => form.setData('token', e.target.value)} className="w-full" />
                                    <div className="col-span-2 flex justify-end">
                                        <PrimaryButton onClick={() => updateToken(token)} disabled={form.processing}>
                                            Save
                                        </PrimaryButton>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <div className="font-medium">{token.name}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{token.token}</div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditing(token.id);
                                                form.setData({ name: token.name, token: token.token });
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <Pencil className="h-5 w-5" /> {/* Changed icon to Pencil from Lucide React */}
                                        </button>
                                        <button onClick={() => deleteToken(token)} className="text-red-400 hover:text-red-600">
                                            <Trash className="h-5 w-5" /> {/* Changed icon to Trash from Lucide React */}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
