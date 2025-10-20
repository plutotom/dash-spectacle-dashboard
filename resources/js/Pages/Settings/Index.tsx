import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Settings {
    show_prayer_requests: boolean;
}

export default function SettingsIndex({ settings }: { settings: Settings }) {
    const page = usePage();
    const user = (page.props as any).auth?.user as { role?: string } | undefined;

    const [formData, setFormData] = useState({
        show_prayer_requests: settings.show_prayer_requests,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        router.put('/settings', formData, {
            onFinish: () => setSaving(false),
        });
    };

    if (user?.role !== 'admin') {
        return (
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Settings</h2>}>
                <Head title="Settings" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="rounded bg-yellow-100 p-3 text-yellow-900">You do not have permission to access settings.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Settings</h2>}>
            <Head title="Settings" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="mb-6 text-2xl font-bold">Dashboard Settings</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <h3 className="mb-4 text-lg font-semibold">Prayer Requests</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="show_prayer_requests" className="text-sm font-medium text-gray-700">
                                                Show Prayer Requests on Dashboard
                                            </label>
                                            <p className="text-sm text-gray-500">When enabled, prayer requests will be displayed on the public HA Dashboard.</p>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="show_prayer_requests"
                                                checked={formData.show_prayer_requests}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        show_prayer_requests: e.target.checked,
                                                    })
                                                }
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
