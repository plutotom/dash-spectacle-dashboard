import { Calendar } from '@/Components/Calendar/Calendar';
import CustomMessage from '@/Components/CustomMessage/CustomMessage';
import { CurrentWeather } from '@/Components/Weather/Current';
import ForecastWeather from '@/Components/Weather/Forcast';
import HaDashboardLayout from '@/Layouts/HaDashboardLayout';

export default function HaDashboard() {
    return (
        <HaDashboardLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">HA Dashboard</h2>}>
            <div className="relative flex h-screen flex-col gap-4 p-4">
                <BackgroundGradient />

                <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <div className="text-2xl font-semibold">12:00 PM</div>
                        <div className="text-xl font-semibold">Monday, Jan 1</div>
                    </div>
                    <div className="w-1/4">
                        <CurrentWeather />
                    </div>
                </div>

                <div className="flex flex-1 gap-4">
                    <div className="w-full">
                        <ForecastWeather />
                    </div>
                </div>
                <div className="flex justify-center gap-4">
                    <div className="">
                        <h1>Messages</h1>
                        <CustomMessage />
                    </div>
                </div>

                <div className="h-1/3">
                    <Calendar />
                </div>
            </div>
        </HaDashboardLayout>
    );
}

function BackgroundGradient() {
    return (
        <div
            className="pointer-events-none absolute inset-0"
            style={{
                background: `
        linear-gradient(to bottom,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 20%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, .2) 50%
        )
    `,
            }}
        ></div>
    );
}
