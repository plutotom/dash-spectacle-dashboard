/* eslint-disable no-console */
import { internalMutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// --- Constants ---
const DEFAULT_ZIP = "60120"; // User's default zip
const CACHE_TTL_CURRENT = 15 * 60 * 1000; // 15 minutes
const CACHE_TTL_FORECAST = 20 * 60 * 1000; // 20 minutes

// --- Queries ---

export const get = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("weather")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .first();

    if (!record) return null;

    // Check if stale
    const isStale =
      Date.now() - record.updatedAt >
      (args.type === "current" ? CACHE_TTL_CURRENT : CACHE_TTL_FORECAST);

    return {
      ...record,
      isStale,
    };
  },
});

// --- Mutations ---

export const updateWeather = internalMutation({
  args: { type: v.string(), data: v.any() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("weather")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: args.data,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("weather", {
        type: args.type,
        data: args.data,
        updatedAt: Date.now(),
      });
    }
  },
});

// --- Actions ---

export const fetchCurrent = action({
  args: {},
  handler: async (ctx) => {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const zip = process.env.WEATHER_ZIP_CODE || DEFAULT_ZIP;

      if (!apiKey) {
        console.error("Missing WEATHER_API_KEY");
        return null;
      }

      // 1. Fetch from WeatherAPI
      const weatherRes = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${zip}`,
      );

      if (!weatherRes.ok) {
        console.error("WeatherAPI failed", await weatherRes.text());
        return null;
      }

      const weatherData = await weatherRes.json();

      // 2. Fetch from Home Assistant (Optional)
      const haUrl = process.env.HOMEASSISTANT_URL;
      const haToken = process.env.HOMEASSISTANT_TOKEN;
      const haSensor = process.env.HOMEASSISTANT_LOCAL_TEMPERATURE_ID;

      if (haUrl && haToken) {
        console.log("Attempting to fetch from Home Assistant...");
        try {
          const haRes = await fetch(`${haUrl}/api/states/sensor.${haSensor}`, {
            headers: {
              Authorization: `Bearer ${haToken}`,
              "Content-Type": "application/json",
            },
          });

          if (haRes.ok) {
            const haData = await haRes.json();
            // Inject HA data into the response structure to match PHP logic
            if (!weatherData.current) weatherData.current = {};
            weatherData.current.home_assistant_current_temp = parseFloat(
              haData.state,
            );
            weatherData.current.home_assistant_updated = haData.last_updated;
          } else {
            console.error(
              "Home Assistant fetch failed with status:",
              haRes.status,
              await haRes.text(),
            );
          }
        } catch (e) {
          console.error("Home Assistant fetch failed", e);
          // Continue without HA data
        }
      } else {
        console.log("Home Assistant credentials missing (URL or Token).");
      }

      // 3. Save to DB
      await ctx.runMutation(internal.weather.updateWeather, {
        type: "current",
        data: weatherData,
      });

      return weatherData;
    } catch (e) {
      console.error("fetchCurrent action failed", e);
      return null;
    }
  },
});

export const fetchForecast = action({
  args: {},
  handler: async (ctx) => {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const zip = process.env.WEATHER_ZIP_CODE || DEFAULT_ZIP;

      if (!apiKey) {
        console.error("Missing WEATHER_API_KEY");
        return null;
      }

      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${zip}&days=3`,
      );

      if (!response.ok) {
        console.error("WeatherAPI forecast failed", await response.text());
        return null;
      }

      const data = await response.json();

      await ctx.runMutation(internal.weather.updateWeather, {
        type: "forecast",
        data: data,
      });

      return data;
    } catch (e) {
      console.error("fetchForecast action failed", e);
      return null;
    }
  },
});
