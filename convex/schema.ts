import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // Messages for the family message feed
  messages: defineTable({
    userId: v.id("users"),
    name: v.string(),
    content: v.string(),
  }),

  // Prayer request tracking
  prayerRequests: defineTable({
    prayerRequestFrom: v.optional(v.string()),
    prayerFor: v.optional(v.string()),
    prayerRequest: v.optional(v.string()),
    isAnswered: v.boolean(),
    answeredAt: v.optional(v.number()),
  }).index("by_answered", ["isAnswered"]),

  // Key-value settings store
  settings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
});

export default schema;
