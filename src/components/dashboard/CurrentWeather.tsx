"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { TimedNotice } from "@/components/errors/TimedNotice";
import {
  cacheWeather,
  parseWeatherResponse,
  readCachedWeather,
  type WeatherSnapshot,
} from "@/lib/weather";

// Fixed home location (60120 / Elgin, Illinois). No geolocation is needed.
const LATITUDE = 42.0354;
const LONGITUDE = -88.2826;
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10_000;

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

async function requestWeather(signal: AbortSignal): Promise<WeatherSnapshot> {
  const response = await fetch(WEATHER_URL, { cache: "no-store", signal });

  if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);

  return parseWeatherResponse(await response.json());
}

export function CurrentWeather() {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheUnavailable, setCacheUnavailable] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);

  const refresh = useCallback(async (manual = false) => {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    if (manual) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    // The deadline also bounds retries; cleanup aborts the entire operation.
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS * 3);
    let lastError = "Weather request failed";
    try {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        if (controller.signal.aborted) break;
        try {
          const snapshot = await requestWeather(controller.signal);
          if (activeRequest.current !== controller) return;
          if (controller.signal.aborted) throw new Error("Weather request timed out");
          setCacheUnavailable(!cacheWeather(snapshot));
          setWeather(snapshot);
          setError(null);
          return;
        } catch (cause) {
          lastError = cause instanceof Error ? cause.message : "Weather request failed";
        }
        if (attempt < 2 && !controller.signal.aborted) {
          await new Promise((resolve) => window.setTimeout(resolve, 2 ** attempt * 1000));
        }
      }
      // An unmounted widget must not update state after cleanup.
      if (activeRequest.current !== controller) return;
      setWeather((current) => current ?? readCachedWeather());
      setError(
        controller.signal.aborted ? "Weather request timed out after 30 seconds" : lastError,
      );
    } finally {
      window.clearTimeout(timeout);
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
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
      activeRequest.current?.abort();
      activeRequest.current = null;
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
                {error
                  ? weather
                    ? "Saved weather"
                    : "Weather unavailable"
                  : "Current temperature"}
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
              ) : error ? (
                <WifiOff className="h-3 w-3 text-white/30" />
              ) : (
                <Wifi className="h-3 w-3 text-blue-400/50" />
              )}
            </button>
            <span className="text-xs text-white/70">
              {updatedLabel
                ? `Updated ${new Date(weather!.updatedAt).toLocaleDateString()} ${updatedLabel}`
                : "Unavailable"}
            </span>
          </div>
        </div>
      </div>

      {error ? (
        <TimedNotice key={error}>
          <div
            role="status"
            className="rounded-lg border border-amber-300/60 bg-black/80 p-3 text-base text-amber-100"
          >
            Weather error: {error}. {weather ? "Showing the last saved reading. " : ""}
            Retrying every 15 minutes; use the refresh button to retry now.
          </div>
        </TimedNotice>
      ) : null}
      {cacheUnavailable ? (
        <TimedNotice>
          <p role="status" className="rounded-lg bg-black/80 p-3 text-base text-amber-100">
            Live weather is working. Browser storage is unavailable, so it cannot be saved for
            offline use.
          </p>
        </TimedNotice>
      ) : null}

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
