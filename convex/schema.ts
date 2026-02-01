import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.string()),
    imageCount: v.optional(v.number()),
    maxUploads: v.optional(v.number()),
  }).index("email", ["email"]),

  // User uploaded images
  images: defineTable({
    userId: v.id("users"),
    url: v.string(),
    storageId: v.optional(v.string()),
    uploadedAt: v.number(),
    name: v.string(),
    size: v.number(),
  }).index("by_user", ["userId"]),

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

  // Weather data cache (current and forecast)
  weather: defineTable({
    type: v.string(), // "current" | "forecast"
    data: v.any(), // JSON response from API
    updatedAt: v.number(),
  }).index("by_type", ["type"]),
});

export default schema;
