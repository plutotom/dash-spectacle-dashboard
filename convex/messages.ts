import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";

// Helper to check if user is admin or owns the message
async function canModifyMessage(
  ctx: QueryCtx,
  userId: Id<"users">,
  messageUserId: Id<"users">,
): Promise<boolean> {
  const user = await ctx.db.get(userId);
  // Admins can modify any message, users can only modify their own
  return user?.role === "admin" || userId === messageUserId;
}

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
// Name is fetched from user profile, not passed in
export const create = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Fetch user to get their name
    const user = await ctx.db.get(userId);
    const name = user?.name || user?.email || "Anonymous";

    return await ctx.db.insert("messages", {
      userId,
      name, // Store snapshot of name at time of posting
      content: args.content,
    });
  },
});

// Update a message (owner or admin only)
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

    // Check permissions
    const canModify = await canModifyMessage(ctx, userId, message.userId);

    if (!canModify) {
      throw new Error("You can only edit your own messages");
    }

    await ctx.db.patch(args.id, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.content !== undefined && { content: args.content }),
    });
  },
});

// Delete a message (owner or admin only)
export const remove = mutation({
  args: {
    id: v.id("messages"),
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

    // Check permissions
    const canModify = await canModifyMessage(ctx, userId, message.userId);

    if (!canModify) {
      throw new Error("You can only delete your own messages");
    }

    await ctx.db.delete(args.id);
  },
});
