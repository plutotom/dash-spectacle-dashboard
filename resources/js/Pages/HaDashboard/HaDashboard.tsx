import CustomMessage from '@/Components/CustomMessage/CustomMessage';
import HaDashboardLayout from '@/Layouts/HaDashboardLayout';
import { Head } from '@inertiajs/react';

export default function HaDashboard() {
    return (
        <HaDashboardLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">HA Dashboard</h2>}>
            <Head title="HA Dashboard" />

            <div className="flex h-screen flex-col">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                {/* <CurrentWeather /> */}
                {/* <ForecastWeather /> */}
                <CustomMessage />

                {/* <Calendar /> */}
            </div>
        </HaDashboardLayout>
    );
}
