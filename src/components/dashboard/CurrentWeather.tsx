"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

export function CurrentWeather() {
  const weatherData = useQuery(api.weather.get, { type: "current" });

  if (weatherData === undefined) {
    return (
      <div className="flex items-center justify-center h-20">
        <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center h-20 text-white/50">
        <WifiOff className="w-5 h-5 mr-2" />
        <span className="text-sm">Unavailable</span>
      </div>
    );
  }

  const data = weatherData.data || {};
  const current = data.current || {};

  const apiTemp = current.temp_f;
  const haTemp = current.home_assistant_current_temp;
  const condition = current.condition?.text ?? "Unknown";

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/5 transition-all hover:bg-black/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-4xl font-light text-white leading-none">
              {apiTemp !== undefined ? Math.round(apiTemp) : "--"}°
            </div>
            <div className="text-white/60 text-sm mt-1">{condition}</div>
          </div>

          {haTemp !== undefined && (
            <div className="border-l border-white/10 pl-3 flex flex-col justify-center">
              <span className="text-xs text-green-400/80 uppercase tracking-wider font-medium">
                Indoor
              </span>
              <span className="text-xl font-light text-white/90 leading-none mt-0.5">
                {Math.round(haTemp)}°
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <Wifi
            className={`w-3 h-3 ${
              weatherData.isStale
                ? "text-white/30"
                : haTemp !== undefined
                  ? "text-green-400/50"
                  : "text-blue-400/50"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
