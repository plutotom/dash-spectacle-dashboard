import { CurrentWeather } from '@/Components/Weather/Current';
import HaDashboardLayout from '@/Layouts/HaDashboardLayout';
import { Head } from '@inertiajs/react';

export default function HaDashboard() {
    return (
        <HaDashboardLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">HA Dashboard</h2>}>
            <Head title="HA Dashboard" />

            <div className="flex h-screen flex-col">
                <div className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>

                <div>
                    {/* <Calendar /> */}
                    <CurrentWeather />
                </div>
            </div>
        </HaDashboardLayout>
    );
}
