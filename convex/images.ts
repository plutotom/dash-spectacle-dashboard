import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

const DEFAULT_MAX_UPLOADS = 5;

export const getImages = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      return [];
    }

    // If arg is provided, check if admin or self
    let targetUserId = currentUserId;
    if (args.userId && args.userId !== currentUserId) {
      const currentUser = await ctx.db.get(currentUserId);
      if (currentUser?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      targetUserId = args.userId;
    }

    return await ctx.db
      .query("images")
      .withIndex("by_user", (q) => q.eq("userId", targetUserId))
      .order("desc")
      .collect();
  },
});

export const saveImage = mutation({
  args: {
    url: v.string(),
    name: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const currentCount = user.imageCount || 0;
    const maxUploads = user.maxUploads ?? DEFAULT_MAX_UPLOADS;

    if (currentCount >= maxUploads) {
      throw new Error(`Upload limit reached (${maxUploads} images).`);
    }

    // Save image
    await ctx.db.insert("images", {
      userId,
      url: args.url,
      name: args.name,
      size: args.size,
      uploadedAt: Date.now(),
    });

    // Update count
    await ctx.db.patch(userId, {
      imageCount: currentCount + 1,
    });
  },
});

export const deleteImage = mutation({
  args: { imageId: v.id("images") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error("Image not found");
    }

    const user = await ctx.db.get(userId);
    if (image.userId !== userId && user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.imageId);

    // Update count
    const imageOwner = await ctx.db.get(image.userId);
    if (imageOwner && (imageOwner.imageCount || 0) > 0) {
      await ctx.db.patch(image.userId, {
        imageCount: (imageOwner.imageCount || 1) - 1,
      });
    }
  },
});

export const getBackgroundImage = query({
  args: { seed: v.number() },
  handler: async (ctx, args) => {
    const images = await ctx.db.query("images").order("desc").collect();
    if (images.length === 0) return null;
    const index = args.seed % images.length;
    return images[index];
  },
});

export const deleteImages = mutation({
  args: { imageIds: v.array(v.id("images")) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    for (const imageId of args.imageIds) {
      const image = await ctx.db.get(imageId);
      if (image) {
        await ctx.db.delete(imageId);

        // Update image count for owner
        const imageOwner = await ctx.db.get(image.userId);
        if (imageOwner && (imageOwner.imageCount || 0) > 0) {
          await ctx.db.patch(image.userId, {
            imageCount: (imageOwner.imageCount || 1) - 1,
          });
        }
      }
    }
  },
});

export const getAllImages = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const images = await ctx.db.query("images").order("desc").collect();

    const imagesWithInfo = await Promise.all(
      images.map(async (img) => {
        const author = await ctx.db.get(img.userId);
        return {
          ...img,
          authorName: author?.name,
          authorEmail: author?.email,
        };
      }),
    );

    return imagesWithInfo;
  },
});
