"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";

// Fixed home location (60120 / Elgin, Illinois). No geolocation is needed.
const LATITUDE = 42.0354;
const LONGITUDE = -88.2826;
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10_000;
const CACHE_KEY = "dash-spectacle-weather-v2";

const WEATHER_URL = new URL("https://api.open-meteo.com/v1/forecast");
WEATHER_URL.search = new URLSearchParams({
  latitude: String(LATITUDE),
  longitude: String(LONGITUDE),
  current: "temperature_2m",
  daily: "temperature_2m_max,temperature_2m_min",
  temperature_unit: "fahrenheit",
  forecast_days: "3",
  timezone: "auto",
}).toString();

type WeatherSnapshot = {
  current: number;
  forecast: Array<{ date: string; high: number; low: number }>;
  updatedAt: string;
};

type OpenMeteoResponse = {
  current?: { temperature_2m?: number };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};

function readCachedWeather(): WeatherSnapshot | null {
  try {
    const value = window.localStorage.getItem(CACHE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as WeatherSnapshot;

    if (
      !Number.isFinite(parsed.current) ||
      !Array.isArray(parsed.forecast) ||
      parsed.forecast.length < 3 ||
      parsed.forecast.some(
        (day) =>
          typeof day.date !== "string" || !Number.isFinite(day.high) || !Number.isFinite(day.low),
      ) ||
      Number.isNaN(Date.parse(parsed.updatedAt))
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function requestWeather(signal: AbortSignal): Promise<WeatherSnapshot> {
  const response = await fetch(WEATHER_URL, { cache: "no-store", signal });

  if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);

  const data = (await response.json()) as OpenMeteoResponse;
  const current = data.current?.temperature_2m;
  const dates = data.daily?.time;
  const highs = data.daily?.temperature_2m_max;
  const lows = data.daily?.temperature_2m_min;

  if (
    !Number.isFinite(current) ||
    !dates ||
    !highs ||
    !lows ||
    dates.length < 3 ||
    highs.length < 3 ||
    lows.length < 3
  ) {
    throw new Error("Open-Meteo returned incomplete weather data");
  }

  return {
    current: current as number,
    forecast: dates.slice(0, 3).map((date, index) => ({
      date,
      high: highs[index],
      low: lows[index],
    })),
    updatedAt: new Date().toISOString(),
  };
}

export function CurrentWeather() {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const refresh = useCallback(async (manual = false) => {
    if (manual) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    // Three attempts with short exponential backoff: immediately, 1s, then 2s.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const snapshot = await requestWeather(controller.signal);
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
        setWeather(snapshot);
        setIsOffline(false);
        setIsLoading(false);
        setIsRefreshing(false);
        window.clearTimeout(timeout);
        return;
      } catch {
        window.clearTimeout(timeout);
        if (attempt < 2) await delay(2 ** attempt * 1000);
      }
    }

    setWeather((current) => current ?? readCachedWeather());
    setIsOffline(true);
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      const cached = readCachedWeather();
      if (cached) {
        setWeather(cached);
        setIsLoading(false);
      }
      void refresh();
    }, 0);

    const interval = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const updatedLabel = weather
    ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(
        new Date(weather.updatedAt),
      )
    : null;

  if (isLoading && !weather) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-white/5 bg-black/20 p-3 backdrop-blur-sm transition-all hover:bg-black/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="text-4xl leading-none font-light text-white">
                {weather ? Math.round(weather.current) : "--"}°
              </div>
              <div className="mt-1 text-sm text-white/60">
                {isOffline ? "Saved weather" : "Current temperature"}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={() => void refresh(true)}
              disabled={isRefreshing}
              aria-label="Refresh weather"
              className="rounded p-1 text-white/40 transition hover:bg-white/5 hover:text-white/70 disabled:cursor-wait"
            >
              {isRefreshing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : isOffline ? (
                <WifiOff className="h-3 w-3 text-white/30" />
              ) : (
                <Wifi className="h-3 w-3 text-blue-400/50" />
              )}
            </button>
            <span className="text-[10px] text-white/35">
              {updatedLabel ? `Updated ${updatedLabel}` : "Unavailable"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative rounded-lg border border-white/5 bg-black/20 p-2 pb-5 backdrop-blur-sm transition-all hover:bg-black/30">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {weather?.forecast.map((day) => (
            <div
              key={day.date}
              className="min-w-[72px] shrink-0 rounded-md px-3 py-2 text-center transition-colors hover:bg-white/5"
            >
              <div className="text-xs font-medium text-white/50 uppercase">
                {new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(
                  new Date(`${day.date}T12:00:00`),
                )}
              </div>
              <div className="my-1 text-xl font-normal text-white">{Math.round(day.high)}°</div>
              <div className="text-xs text-white/40">{Math.round(day.low)}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
