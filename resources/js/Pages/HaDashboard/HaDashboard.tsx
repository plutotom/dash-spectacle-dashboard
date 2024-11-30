import HaDashboardLayout from '@/Layouts/HaDashboardLayout';
import { Event, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DashboardProps {
    calendar: {
        events: Event[];
        error: string | null;
    };
}

export default function HaDashboard({ calendar }: DashboardProps) {
    const { flash } = usePage<PageProps>().props;

    return (
        <HaDashboardLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">HA Dashboard</h2>}>
            <Head title="HA Dashboard" />

            <div className="flex h-screen flex-col">
                <div className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>

                    {/* Flash Messages */}
                    {flash && (
                        <>
                            {flash.success && <div className="mb-4 rounded bg-green-100 p-4 text-green-700">{flash.success}</div>}
                            {flash.error && <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{flash.error}</div>}
                        </>
                    )}

                    {/* Calendar Section */}
                    <div className="mt-6">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-6 w-6" />
                            <h2 className="text-xl font-semibold">Calendar</h2>
                        </div>

                        {calendar.error ? (
                            <div className="mt-4 rounded bg-red-100 p-4 text-red-700">{calendar.error}</div>
                        ) : (
                            <div className="mt-4">
                                {calendar.events.length > 0 ? (
                                    <div className="space-y-4">
                                        {calendar.events.map((event) => (
                                            <div key={event.id} className="rounded border p-4 shadow-sm">
                                                <h3 className="font-medium">{event.name}</h3>
                                                <p className="text-sm text-gray-600">{new Date(event.startDateTime).toLocaleString()}</p>
                                                {event.description && <p className="mt-2 text-sm">{event.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No upcoming events</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HaDashboardLayout>
    );
}
