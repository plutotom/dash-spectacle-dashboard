import { Calendar } from '@/Components/Calendar/Calendar';
import CustomMessage from '@/Components/CustomMessage/CustomMessage';
import { CurrentWeather } from '@/Components/Weather/Current';
import ForecastWeather from '@/Components/Weather/Forcast';
import HaDashboardLayout from '@/Layouts/HaDashboardLayout';
import RemountingErrorBoundary from '@/Layouts/RemountingErrorBoundary';
import { useEffect, useState } from 'react';

export default function HaDashboard() {
    return (
        <HaDashboardLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">HA Dashboard</h2>}>
            <div className="relative flex h-screen flex-col gap-4 p-4">
                <BackgroundGradient />

                <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <div className="text-5xl text-primary-foreground">
                            <DateTimeCard />
                        </div>
                    </div>
                    <div className="w-1/4">
                        <CurrentWeather />
                    </div>
                </div>

                <div className="flex flex-1 gap-4">
                    <div className="w-full">
                        <RemountingErrorBoundary intervalMs={1000 * 60 * 1}>
                            <ForecastWeather />
                        </RemountingErrorBoundary>
                    </div>
                </div>
                <div className="flex w-full items-center justify-start lg:w-1/2">
                    <div className="w-full">
                        <RemountingErrorBoundary intervalMs={1000 * 60 * 1}>
                            <CustomMessage />
                        </RemountingErrorBoundary>
                    </div>
                </div>

                <div className="h-1/3">
                    <RemountingErrorBoundary intervalMs={10000}>
                        <Calendar />
                    </RemountingErrorBoundary>
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

function DateTimeCard() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update time immediately
        setCurrentTime(new Date());

        // Set up interval to update every minute
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000 * 60); // 1 minute

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);
    return (
        <div>
            <div className="text-8xl text-primary-foreground">
                {currentTime
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
                    {currentTime.toLocaleDateString('en-US', {
                        weekday: 'long',
                    })}
                </span>
                <span className="text-lg text-primary-foreground">
                    {currentTime.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </span>
            </div>
        </div>
    );
}
