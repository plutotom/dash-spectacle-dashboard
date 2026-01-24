import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Get public settings (no auth required)
export const getPublic = query({
  args: {},
  handler: async (ctx) => {
    const showPrayerRequests = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "show_prayer_requests"))
      .first();

    return {
      showPrayerRequests: showPrayerRequests?.value ?? true,
    };
  },
});

// Get a specific setting by key (authenticated)
export const get = query({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return setting?.value ?? null;
  },
});

// Set a setting value (admin only - for now allow any authenticated user)
export const set = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", {
        key: args.key,
        value: args.value,
      });
    }
  },
});
