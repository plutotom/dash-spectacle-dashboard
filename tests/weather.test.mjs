import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTypeScript } from "./load-typescript.mjs";

const { parseWeatherSnapshot, parseWeatherResponse, readCachedWeather, cacheWeather } =
  await loadTypeScript("../src/lib/weather.ts");
const snapshot = {
  current: 72,
  forecast: ["2026-10-04", "2026-10-05", "2026-10-06"].map((date) => ({ date, high: 75, low: 60 })),
  updatedAt: "2026-10-04T12:00:00Z",
};

test("rejects malformed cache dates, impossible dates, and invalid temperatures", () => {
  for (const badDate of ["invalid-date", "2026-02-30", "2026-13-01", "2026-1-01", null]) {
    assert.equal(
      parseWeatherSnapshot({
        ...snapshot,
        forecast: [{ ...snapshot.forecast[0], date: badDate }, ...snapshot.forecast.slice(1)],
      }),
      null,
    );
  }
  for (const value of [
    null,
    [],
    {},
    { ...snapshot, current: "72" },
    { ...snapshot, updatedAt: "invalid" },
    { ...snapshot, forecast: [null, null, null] },
  ]) {
    assert.equal(parseWeatherSnapshot(value), null);
  }
  const accepted = parseWeatherSnapshot(snapshot);
  assert.deepEqual(accepted, snapshot);
  assert.doesNotThrow(() =>
    accepted.forecast.forEach((day) =>
      new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(`${day.date}T12:00:00`)),
    ),
  );
});

test("validates network data before it reaches rendering or the cache", () => {
  const response = {
    current: { temperature_2m: 72 },
    daily: {
      time: snapshot.forecast.map((day) => day.date),
      temperature_2m_max: [75, 76, 77],
      temperature_2m_min: [60, 61, 62],
    },
  };
  assert.equal(parseWeatherResponse(response).forecast.length, 3);
  for (const bad of [
    null,
    {},
    { ...response, daily: { ...response.daily, time: ["2026-02-30", "2026-10-05", "2026-10-06"] } },
    { ...response, daily: { ...response.daily, temperature_2m_min: [60] } },
  ]) {
    assert.throws(() => parseWeatherResponse(bad), /Weather provider/);
  }
});

test("corrupt or blocked storage is optional and does not destroy live weather", () => {
  const previousWindow = globalThis.window;
  try {
    globalThis.window = {
      localStorage: {
        getItem: () => "{bad json",
        setItem: () => {
          throw new Error("QuotaExceededError");
        },
      },
    };
    assert.equal(readCachedWeather(), null);
    assert.equal(cacheWeather(snapshot), false);
    assert.equal(snapshot.current, 72);
    Object.defineProperty(globalThis.window, "localStorage", {
      get() {
        throw new Error("SecurityError");
      },
    });
    assert.equal(readCachedWeather(), null);
    assert.equal(cacheWeather(snapshot), false);
  } finally {
    globalThis.window = previousWindow;
  }
});
