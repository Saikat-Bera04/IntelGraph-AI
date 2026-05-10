import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const saveInvestigation = mutation({
  args: {
    query: v.string(),
    llmResponse: v.optional(v.string()),
    graphragResponse: v.optional(v.string()),
    metrics: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }

    const investigationId = await ctx.db.insert("investigations", {
      userId,
      query: args.query,
      llmResponse: args.llmResponse,
      graphragResponse: args.graphragResponse,
      metrics: args.metrics,
      createdAt: Date.now(),
    });

    return investigationId;
  },
});

export const getInvestigations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("investigations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
