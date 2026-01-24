"use client";

import { useState, useEffect, useCallback } from "react";
import { Wifi } from "lucide-react";

interface WeatherData {
  temp_f: number;
  condition: string;
  icon?: string;
  lastUpdated?: Date;
}

export function CurrentWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      // This will be replaced with actual API call via Convex action
      // For now, using placeholder data
      setWeather({
        temp_f: 72,
        condition: "Partly Cloudy",
        lastUpdated: new Date(),
      });
      setError(null);
    } catch {
      setError("Failed to load weather");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 h-40 flex items-center justify-center">
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 h-40 flex flex-col justify-between border border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-5xl font-light text-white">
            {weather?.temp_f}°
          </div>
          <div className="text-gray-300 text-sm mt-1">{weather?.condition}</div>
        </div>
        <Wifi className="w-5 h-5 text-green-400" />
      </div>
      {weather?.lastUpdated && (
        <div className="text-xs text-gray-500">
          Updated {weather.lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
