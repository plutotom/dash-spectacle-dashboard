import { Weather, WeatherForecast } from '@/types/weather';
import axios from 'axios';

export const weatherService = {
    async getCurrentWeather(): Promise<Weather> {
        const response = await axios.get<{ data: Weather }>('/api/weather/current');
        return response.data.data;
    },

    async getForecast(): Promise<WeatherForecast> {
        const response = await axios.get<{ data: WeatherForecast }>('/api/weather/forecast');
        return response.data.data;
    },
};
