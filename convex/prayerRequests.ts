import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Get prayer requests for dashboard widget (public, limited)
export const listForDashboard = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db.query("prayerRequests").order("desc").take(8);
    return requests;
  },
});

// Get all prayer requests with optional filter (authenticated)
export const listAll = query({
  args: {
    filter: v.optional(
      v.union(v.literal("all"), v.literal("answered"), v.literal("unanswered")),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const filter = args.filter ?? "all";

    let requests;
    if (filter === "answered") {
      requests = await ctx.db
        .query("prayerRequests")
        .withIndex("by_answered", (q) => q.eq("isAnswered", true))
        .order("desc")
        .take(limit);
    } else if (filter === "unanswered") {
      requests = await ctx.db
        .query("prayerRequests")
        .withIndex("by_answered", (q) => q.eq("isAnswered", false))
        .order("desc")
        .take(limit);
    } else {
      requests = await ctx.db.query("prayerRequests").order("desc").take(limit);
    }

    return requests;
  },
});

// Create a new prayer request (admin only)
export const create = mutation({
  args: {
    prayerRequestFrom: v.optional(v.string()),
    prayerFor: v.optional(v.string()),
    prayerRequest: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can create prayer requests");
    }

    return await ctx.db.insert("prayerRequests", {
      prayerRequestFrom: args.prayerRequestFrom,
      prayerFor: args.prayerFor,
      prayerRequest: args.prayerRequest,
      isAnswered: false,
    });
  },
});

// Update a prayer request (admin only)
export const update = mutation({
  args: {
    id: v.id("prayerRequests"),
    prayerRequestFrom: v.optional(v.string()),
    prayerFor: v.optional(v.string()),
    prayerRequest: v.optional(v.string()),
    isAnswered: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can update prayer requests");
    }

    const request = await ctx.db.get(args.id);
    if (!request) {
      throw new Error("Prayer request not found");
    }

    const updates: Record<string, unknown> = {};
    if (args.prayerRequestFrom !== undefined)
      updates.prayerRequestFrom = args.prayerRequestFrom;
    if (args.prayerFor !== undefined) updates.prayerFor = args.prayerFor;
    if (args.prayerRequest !== undefined)
      updates.prayerRequest = args.prayerRequest;
    if (args.isAnswered !== undefined) {
      updates.isAnswered = args.isAnswered;
      updates.answeredAt = args.isAnswered ? Date.now() : undefined;
    }

    await ctx.db.patch(args.id, updates);
  },
});

// Toggle answered status (admin only)
export const markAnswered = mutation({
  args: {
    id: v.id("prayerRequests"),
    isAnswered: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can mark prayer requests as answered");
    }

    await ctx.db.patch(args.id, {
      isAnswered: args.isAnswered,
      answeredAt: args.isAnswered ? Date.now() : undefined,
    });
  },
});

// Delete a prayer request (admin only)
export const remove = mutation({
  args: {
    id: v.id("prayerRequests"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can delete prayer requests");
    }

    await ctx.db.delete(args.id);
  },
});
