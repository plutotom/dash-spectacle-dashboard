import qrCode2 from '@/assets/images/Chleo Grad QR Code.svg';
import { Calendar } from '@/Components/Calendar/Calendar';
import CustomMessage from '@/Components/CustomMessage/CustomMessage';
import { CurrentWeather } from '@/Components/Weather/Current';
import ForecastWeather from '@/Components/Weather/Forcast';
import HaDashboardLayout from '@/Layouts/HaDashboardLayout';
import { useEffect, useState } from 'react';

export default function HaDashboard() {
    return (
        <HaDashboardLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">HA Dashboard</h2>}>
            <div className="relative flex h-screen flex-col gap-1 p-4">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <DateTimeCard />
                    </div>
                    <div className="h-40 w-1/3 justify-end">
                        <div className="flex items-center">
                            <img onClick={() => (window.location.href = '/my-wife/thesis')} src={qrCode2} className="h-40"></img>
                            <CurrentWeather />
                        </div>
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
