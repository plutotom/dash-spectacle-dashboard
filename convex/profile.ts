import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Role type for type safety
export type UserRole = "admin" | "user";

// Get the current user's profile including role
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return {
      _id: user._id,
      email: user.email,
      name: user.name ?? "",
      role: (user.role as UserRole) ?? "user",
      imageCount: user.imageCount || 0,
      maxUploads: user.maxUploads ?? 0,
    };
  },
});

// Check if current user is admin
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return false;
    }
    const user = await ctx.db.get(userId);
    return user?.role === "admin";
  },
});

// Update the current user's profile
export const updateProfile = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    await ctx.db.patch(userId, {
      name: args.name.trim(),
    });
  },
});

// Admin only: Update a user's role
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Check if current user is admin
    const currentUser = await ctx.db.get(currentUserId);
    if (currentUser?.role !== "admin") {
      throw new Error("Only admins can change user roles");
    }

    // Update the target user's role
    await ctx.db.patch(args.userId, {
      role: args.role,
    });
  },
});

// Admin only: Update a user's upload limit
export const updateUserLimit = mutation({
  args: {
    userId: v.id("users"),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (currentUser?.role !== "admin") {
      throw new Error("Only admins can change user limits");
    }

    await ctx.db.patch(args.userId, {
      maxUploads: args.limit,
    });
  },
});

// Admin only: Get all users with their roles
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    // Check if current user is admin
    const currentUser = await ctx.db.get(userId);
    if (currentUser?.role !== "admin") {
      return [];
    }

    const users = await ctx.db.query("users").collect();
    return users.map((user) => ({
      _id: user._id,
      email: user.email,
      name: user.name ?? "",
      role: (user.role as UserRole) ?? "user",
      imageCount: user.imageCount || 0,
      maxUploads: user.maxUploads ?? 0, // Default to 0 if not set (admin must approve)
    }));
  },
});

// Bootstrapping: Claim admin role if no admins exist
export const claimAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if any admin exists
    const adminUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .first();

    if (adminUser) {
      throw new Error(
        "Admin already exists. Request access from an existing admin.",
      );
    }

    // Make current user admin
    await ctx.db.patch(userId, {
      role: "admin",
    });

    return true;
  },
});
