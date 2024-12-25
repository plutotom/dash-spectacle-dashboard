import { weatherService } from '@/services/weatherService';
import type { WeatherForecast } from '@/types/weather';
import { useEffect, useState } from 'react';

const ForecastWeather = () => {
    const [forecast, setForecast] = useState<WeatherForecast | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadForecast = async () => {
            try {
                const data = await weatherService.getForecast();
                setForecast(data);
            } catch (error) {
                console.error('Failed to load forecast:', error);
            } finally {
                setLoading(false);
            }
        };

        loadForecast();
    }, []);

    if (loading) return <div>Loading forecast...</div>;
    if (!forecast) return <div>Unable to load forecast</div>;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {forecast.forecast.map((day) => (
                <div key={day.date_epoch} className="rounded-lg bg-white p-4 shadow">
                    <div className="text-lg font-semibold">{new Date(day.date).toLocaleDateString()}</div>
                    <img src={day.day.condition.icon} alt={day.day.condition.text} className="mx-auto h-16 w-16" />
                    <div className="text-center">
                        <div className="font-medium">{day.day.condition.text}</div>
                        <div className="text-sm">
                            <span className="text-red-500">{Math.round(day.day.maxtemp_f)}°</span>
                            {' / '}
                            <span className="text-blue-500">{Math.round(day.day.mintemp_f)}°</span>
                        </div>
                        <div className="text-sm text-gray-600">Rain: {day.day.daily_chance_of_rain}%</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ForecastWeather;
