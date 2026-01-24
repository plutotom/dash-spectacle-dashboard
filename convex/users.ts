import { query } from "./_generated/server";
import { auth } from "./auth";

// Get the current authenticated user
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    return user;
  },
});

// Get all users (for admin purposes)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    const users = await ctx.db.query("users").collect();
    return users.map((user) => ({
      _id: user._id,
      email: user.email,
      name: user.name,
    }));
  },
});
