import { Event } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

export default function HaDashboard({ events }: { events: Event[] }) {
    console.log(events);
    return (
        <>
            <Head title="HA Dashboard" />

            <div className="flex h-screen flex-col">
                <div className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <h1>yoyo!</h1>
                    <Calendar className="mx-auto max-w-3xl" />
                </div>
            </div>
        </>
    );
}
