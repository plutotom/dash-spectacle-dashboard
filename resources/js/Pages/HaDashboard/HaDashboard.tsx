import { Calendar } from '@/Components/Calendar/Calendar';
import CustomMessage from '@/Components/CustomMessage/CustomMessage';
import { CurrentWeather } from '@/Components/Weather/Current';
import ForecastWeather from '@/Components/Weather/Forcast';
import HaDashboardLayout from '@/Layouts/HaDashboardLayout';

export default function HaDashboard() {
    return (
        <HaDashboardLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">HA Dashboard</h2>}>
            <div className="relative flex h-screen flex-col gap-1 p-4">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <div className="text-5xl text-primary-foreground">
                            {new Date()
                                .toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                })
                                .replace('AM', '')
                                .replace('PM', '')}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl text-primary-foreground">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                })}
                            </span>
                            <span className="text-lg text-primary-foreground">
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
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
                <div className="flex gap-4">
                    <div className="w-full max-w-7xl">
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
