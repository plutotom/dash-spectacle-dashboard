import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Get recent messages for dashboard feed (public) - includes user info
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const messages = await ctx.db.query("messages").order("desc").take(limit);

    // Enrich with user info
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.userId);
        return {
          ...message,
          userEmail: user?.email ?? "Unknown",
        };
      }),
    );

    return messagesWithUsers;
  },
});

// Create a new message (authenticated users)
export const create = mutation({
  args: {
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("messages", {
      userId,
      name: args.name,
      content: args.content,
    });
  },
});

// Update a message (admin only - for now allow any authenticated user)
export const update = mutation({
  args: {
    id: v.id("messages"),
    name: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.content !== undefined && { content: args.content }),
    });
  },
});

// Delete a message (admin only - for now allow any authenticated user)
export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    await ctx.db.delete(args.id);
  },
});
