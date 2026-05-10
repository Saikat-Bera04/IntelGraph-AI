import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  // Add your custom tables here
  investigations: defineTable({
    userId: v.id("users"),
    query: v.string(),
    llmResponse: v.optional(v.string()),
    graphragResponse: v.optional(v.string()),
    metrics: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
