import { weatherService } from '@/services/weatherService';
import { Weather } from '@/types/weather';
import { useEffect, useState } from 'react';

interface CurrentWeatherProps {
    className?: string;
}

export function CurrentWeather({ className }: CurrentWeatherProps) {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await weatherService.getCurrentWeather();
                setWeather(data);
            } catch (err) {
                setError('Failed to fetch current weather');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
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
        <div className={`rounded-lg shadow-sm ${className}`}>
            <div className="p-4">
                <h2 className="mb-4 text-xl font-semibold">Current Weather</h2>
                <div className="space-y-4">
                    <div className="rounded-md border border-border p-4 transition-colors hover:bg-accent">
                        <h3 className="font-medium text-foreground">{weather?.location.name}</h3>
                        <div className="mt-1 text-sm text-muted-foreground">{weather?.current.temp_f}°F</div>
                        <div className="mt-2 text-sm text-muted-foreground">{weather?.current.condition.text}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
