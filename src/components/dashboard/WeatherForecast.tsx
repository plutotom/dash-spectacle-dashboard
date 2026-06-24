"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface ForecastDay {
  date: string;
  day: {
    maxtemp_f: number;
    mintemp_f: number;
    condition: {
      text: string;
    };
  };
}

export function WeatherForecast() {
  const forecastData = useQuery(api.weather.get, { type: "forecast" });

  if (forecastData === undefined) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
      </div>
    );
  }

  if (!forecastData) {
    return null;
  }

  const forecastDays: ForecastDay[] =
    forecastData.data?.forecast?.forecastday || [];

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/5 transition-all hover:bg-black/30">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {forecastDays.map((day, index) => (
          <div
            key={index}
            className="shrink-0 text-center px-3 py-2 rounded-md min-w-[72px] hover:bg-white/5 transition-colors"
          >
            <div className="text-xs text-white/50 uppercase font-medium">
              {format(new Date(day.date + "T00:00:00"), "EEE")}
            </div>
            <div className="text-xl font-normal text-white my-1">
              {Math.round(day.day.maxtemp_f)}°
            </div>
            <div className="text-xs text-white/40">
              {Math.round(day.day.mintemp_f)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
