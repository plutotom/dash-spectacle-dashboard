"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

export function CurrentWeather() {
  const weatherData = useQuery(api.weather.get, { type: "current" });
  const fetchCurrent = useAction(api.weather.fetchCurrent);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // If no data or stale, fetch new data
    if (weatherData === undefined) return; // Loading initial state

    if (!weatherData || weatherData.isStale) {
      const refresh = async () => {
        setIsRefreshing(true);
        try {
          await fetchCurrent();
        } catch (e) {
          console.error("Failed to auto-refresh weather:", e);
        } finally {
          setIsRefreshing(false);
        }
      };
      void refresh();
    }

    const timer = setInterval(
      () => {
        void fetchCurrent();
      },
      15 * 60 * 1000,
    ); // 15 minutes

    return () => clearInterval(timer);
  }, [weatherData, fetchCurrent]);

  // Loading state (initial load only)
  if (weatherData === undefined) {
    return (
      <div className="flex items-center justify-center h-20">
        <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
      </div>
    );
  }

  // Error/Empty state
  if (!weatherData && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-20 text-white/50">
        <WifiOff className="w-5 h-5 mr-2" />
        <span className="text-sm">Unavailable</span>
      </div>
    );
  }

  // Display Logic
  const data = weatherData?.data || {};
  const current = data.current || {};

  const apiTemp = current.temp_f;
  const haTemp = current.home_assistant_current_temp;
  const condition = current.condition?.text ?? "Unknown";

  // Minimal compact view
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/5 transition-all hover:bg-black/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Main Temp */}
          <div className="flex flex-col">
            <div className="text-3xl font-light text-white leading-none">
              {apiTemp !== undefined ? Math.round(apiTemp) : "--"}°
            </div>
            <div className="text-white/60 text-xs mt-1">{condition}</div>
          </div>

          {/* Indoor Temp (Small) */}
          {haTemp !== undefined && (
            <div className="border-l border-white/10 pl-3 flex flex-col justify-center">
              <span className="text-[10px] text-green-400/80 uppercase tracking-wider font-medium">
                Indoor
              </span>
              <span className="text-lg font-light text-white/90 leading-none mt-0.5">
                {Math.round(haTemp)}°
              </span>
            </div>
          )}
        </div>

        {/* Status Icon */}
        <div className="flex flex-col items-end gap-1">
          {isRefreshing ? (
            <Loader2 className="w-3 h-3 text-white/50 animate-spin" />
          ) : (
            <Wifi
              className={`w-3 h-3 ${haTemp !== undefined ? "text-green-400/50" : "text-blue-400/50"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
