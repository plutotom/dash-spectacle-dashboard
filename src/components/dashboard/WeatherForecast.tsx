"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays } from "date-fns";

interface ForecastDay {
  date: Date;
  high: number;
  low: number;
  condition: string;
  icon?: string;
}

export function WeatherForecast() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    try {
      // This will be replaced with actual API call via Convex action
      // For now, using placeholder data
      const today = new Date();
      const mockForecast: ForecastDay[] = Array.from({ length: 5 }, (_, i) => ({
        date: addDays(today, i),
        high: 75 + Math.floor(Math.random() * 10),
        low: 55 + Math.floor(Math.random() * 10),
        condition: ["Sunny", "Cloudy", "Partly Cloudy", "Rain", "Clear"][i % 5],
      }));
      setForecast(mockForecast);
      setError(null);
    } catch {
      setError("Failed to load forecast");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast();
    // Refresh every 20 minutes
    const interval = setInterval(fetchForecast, 20 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchForecast]);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 flex items-center justify-center h-24">
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="shrink-0 text-center px-4 py-2 rounded-lg bg-white/5 min-w-[80px]"
          >
            <div className="text-xs text-gray-400 uppercase">
              {format(day.date, "EEE")}
            </div>
            <div className="text-2xl font-light text-white mt-1">
              {day.high}°
            </div>
            <div className="text-xs text-gray-500">{day.low}°</div>
            <div className="text-xs text-gray-400 mt-1 truncate">
              {day.condition}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
