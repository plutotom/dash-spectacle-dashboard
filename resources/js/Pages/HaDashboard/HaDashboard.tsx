import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function HaDashboard({ auth }: PageProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-screen flex-col">
                <div className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
            </div>

            {auth.user && (
                <div className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
            )}
        </>
    );
}
