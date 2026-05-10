import { mutation } from "./_generated/server";

export const clearDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear custom tables
    const investigations = await ctx.db.query("investigations").collect();
    for (const doc of investigations) {
      await ctx.db.delete(doc._id);
    }

    // Clear auth tables (except maybe system ones if any)
    const tables = ["users", "authAccounts", "authSessions", "authVerificationCodes", "authVerifiers", "authRefreshTokens", "authRateLimits"];
    for (const tableName of tables) {
      try {
        // @ts-ignore
        const docs = await ctx.db.query(tableName).collect();
        for (const doc of docs) {
          await ctx.db.delete(doc._id);
        }
      } catch (e) {
        console.log(`Table ${tableName} not found or error deleting:`, e);
      }
    }

    return { success: true, message: "Database cleared" };
  },
});
