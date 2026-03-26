import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Default settings
const DEFAULTS: Record<string, string> = {
  shippingFlatRate: "0", // in cents
  freeShippingThreshold: "0", // in cents, 0 = always free
  taxRate: "8", // percentage
  shippingEnabled: "true",
  storeName: "POSSESSD",
  storeEmail: "",
};

export const getAllInternal = internalQuery({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    const result: Record<string, string> = { ...DEFAULTS };
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    const result: Record<string, string> = { ...DEFAULTS };
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  },
});

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return setting?.value ?? DEFAULTS[args.key] ?? null;
  },
});

export const set = mutation({
  args: {
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", { key: args.key, value: args.value });
    }
  },
});

export const setBatch = mutation({
  args: {
    settings: v.array(v.object({ key: v.string(), value: v.string() })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    for (const { key, value } of args.settings) {
      const existing = await ctx.db
        .query("settings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, { value });
      } else {
        await ctx.db.insert("settings", { key, value });
      }
    }
  },
});
