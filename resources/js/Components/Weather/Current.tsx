import { weatherService } from '@/services/weatherService';
import { Weather } from '@/types/weather';
import { useEffect, useState } from 'react';
import { MdWifiTethering } from 'react-icons/md';

export function CurrentWeather() {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setError(null);
                const data = await weatherService.getCurrentWeather();
                console.log(data);
                setWeather(data);
                setLastUpdated(new Date());
            } catch (err) {
                setError('Failed to fetch current weather');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchWeather();

        // Set up interval for subsequent fetches (15 minutes = 15 * 60 * 1000 milliseconds)
        const intervalId = setInterval(fetchWeather, 15 * 60 * 1000);

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="">Loading Weather...</div>
            </div>
        );
    }

    if (!weather || !weather.current) {
        return (
            <div className="h-40 w-full">
                <div className="inline-block h-40 w-full rounded-md bg-white bg-opacity-10 p-4 backdrop-blur-sm transition-colors">
                    <div className="flex h-full items-center justify-center text-primary-foreground opacity-70">Weather unavailable</div>
                </div>
                {error && <div className="p-4 text-muted-foreground">Error loading Current Weather: {error}</div>}
            </div>
        );
    }

    return (
        <div className="h-40 w-full">
            <div className="inline-block h-40 w-full rounded-md bg-white bg-opacity-10 p-4 backdrop-blur-sm transition-colors">
                <div className="flex flex-col justify-between text-primary-foreground">
                    <div className="flex flex-row gap-1 align-middle">
                        <h1 className="text-5xl">{weather?.current?.home_assistant_current_temp ?? '-'}°</h1>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <MdWifiTethering />
                        <h3 className="text-base">{weather?.current?.temp_f ?? '-'}°</h3>
                    </div>
                    <div className="text-small text-muted-foreground">{lastUpdated?.toLocaleString()}</div>
                </div>
            </div>
            {error && <div className="p-4 text-muted-foreground">Error loading Current Weather: {error}</div>}
        </div>
    );
}
