import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const pipelineMetrics = {
  tokens_used: v.number(),
  latency_seconds: v.number(),
  cost_usd: v.number(),
  accuracy_score: v.number(),
};

export default defineSchema({
  ...authTables,
  // Add your custom tables here
  investigations: defineTable({
    userId: v.id("users"),
    query: v.string(),
    llmResponse: v.optional(v.string()),
    graphragResponse: v.optional(v.string()),
    metrics: v.optional(
      v.object({
        llm: v.optional(v.object(pipelineMetrics)),
        rag: v.optional(v.object(pipelineMetrics)),
        graphrag: v.optional(v.object(pipelineMetrics)),
      })
    ),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
