import { formatDateToHumanReadable } from '@/lib/utils';
import { weatherService } from '@/services/weatherService';
import type { WeatherForecast } from '@/types/weather';
import { useEffect, useState } from 'react';

const ForecastWeather = () => {
    const [forecast, setForecast] = useState<WeatherForecast | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const loadForecast = async () => {
            try {
                const data = await weatherService.getForecast();
                setForecast(data);
                setLastUpdated(new Date());
            } catch (error) {
                console.error('Failed to load forecast:', error);
            } finally {
                setLoading(false);
            }
        };

        loadForecast();
        const intervalId = setInterval(loadForecast, 20 * 60 * 1000); // Update every 20 minutes
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div>Loading forecast...</div>;
    if (!forecast) return <div>Unable to load forecast</div>;

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 transition-colors">
                {forecast.forecast.map((day) => (
                    <div key={day.date_epoch} className="flex flex-col justify-around p-4 text-primary-foreground">
                        <div className="text-lg font-semibold">{formatDateToHumanReadable(new Date(day.date))}</div>
                        <div>
                            <img src={day.day.condition.icon} alt={day.day.condition.text} className="mx-auto h-16 w-16" />
                            <div className="text-center align-baseline">
                                {/* <div className="font-medium">{day.day.condition.text}</div> */}
                                <div className="text-lg">
                                    <span className="">{Math.round(day.day.maxtemp_f)}°</span>
                                    {' / '}
                                    <span className="">{Math.round(day.day.mintemp_f)}°</span>
                                </div>
                                <div className="text text-sm text-gray-400">{day.day.daily_chance_of_rain}%</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-sm text-gray-400">Last updated: {lastUpdated?.toLocaleTimeString()}</div>
        </div>
    );
};

export default ForecastWeather;
