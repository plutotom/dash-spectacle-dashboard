import { weatherService } from '@/services/weatherService';
import { Weather } from '@/types/weather';
import { useEffect, useState } from 'react';

export function CurrentWeather() {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await weatherService.getCurrentWeather();
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

    if (error) {
        return <div className="p-4 text-destructive">Error loading weather: {error}</div>;
    }

    return (
        <div className="">
            <div className="inline-block rounded-md bg-white bg-opacity-10 p-4 backdrop-blur-sm transition-colors">
                <div className="flex flex-col justify-between text-primary-foreground">
                    <div className="flex items-end">
                        <h1 className="text-3xl">{weather?.current.temp_f}°</h1>
                        <span className="ml-2 pr-1 text-sm">But Feels like</span>
                        <h1 className="text-xl">{weather.current.feelslike_f}°</h1>
                    </div>
                    <div className="text-sm">
                        Wind: {weather.current.wind_dir} {weather.current.wind_mph}MPH
                    </div>
                    <div className="text-2xs mt-2 text-gray-400">Last updated: {lastUpdated?.toLocaleTimeString()}</div>
                </div>
            </div>
        </div>
    );
}
