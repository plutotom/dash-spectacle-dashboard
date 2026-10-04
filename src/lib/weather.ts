export const WEATHER_CACHE_KEY = "dash-spectacle-weather-v2";

export type WeatherSnapshot = {
  current: number;
  forecast: Array<{ date: string; high: number; low: number }>;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isForecastDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Treat both the browser cache and the provider response as untrusted JSON.
export function parseWeatherSnapshot(value: unknown): WeatherSnapshot | null {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.current) ||
    typeof value.updatedAt !== "string" ||
    !Number.isFinite(Date.parse(value.updatedAt)) ||
    !Array.isArray(value.forecast) ||
    value.forecast.length < 3
  ) {
    return null;
  }

  const forecast: WeatherSnapshot["forecast"] = [];
  for (const day of value.forecast.slice(0, 3)) {
    if (
      !isRecord(day) ||
      !isForecastDate(day.date) ||
      !isFiniteNumber(day.high) ||
      !isFiniteNumber(day.low)
    ) {
      return null;
    }
    forecast.push({ date: day.date, high: day.high, low: day.low });
  }
  return { current: value.current, forecast, updatedAt: value.updatedAt };
}

export function parseWeatherResponse(value: unknown): WeatherSnapshot {
  if (!isRecord(value) || !isRecord(value.current) || !isRecord(value.daily)) {
    throw new Error("Weather provider returned an invalid response");
  }
  const { time, temperature_2m_max: highs, temperature_2m_min: lows } = value.daily;
  if (!Array.isArray(time) || !Array.isArray(highs) || !Array.isArray(lows)) {
    throw new Error("Weather provider returned an incomplete forecast");
  }
  const snapshot = parseWeatherSnapshot({
    current: value.current.temperature_2m,
    forecast: time.slice(0, 3).map((date, index) => ({
      date,
      high: highs[index],
      low: lows[index],
    })),
    updatedAt: new Date().toISOString(),
  });
  if (!snapshot) throw new Error("Weather provider returned invalid dates or temperatures");
  return snapshot;
}

export function readCachedWeather(): WeatherSnapshot | null {
  try {
    const value = window.localStorage.getItem(WEATHER_CACHE_KEY);
    return value ? parseWeatherSnapshot(JSON.parse(value)) : null;
  } catch {
    return null;
  }
}

// Caching is optional: its failure must never discard a successful download.
export function cacheWeather(snapshot: WeatherSnapshot): boolean {
  try {
    window.localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}
