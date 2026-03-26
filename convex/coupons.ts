import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") return [];

    return await ctx.db.query("coupons").collect();
  },
});

export const getByCodeInternal = internalQuery({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();
    if (!coupon) return null;
    if (!coupon.active) return null;
    if (coupon.expiresAt && coupon.expiresAt < Date.now()) return null;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
    return coupon;
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();
    if (!coupon) return null;
    if (!coupon.active) return null;
    if (coupon.expiresAt && coupon.expiresAt < Date.now()) return null;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
    return coupon;
  },
});

export const create = mutation({
  args: {
    code: v.string(),
    type: v.union(v.literal("percentage"), v.literal("fixed")),
    value: v.number(),
    minOrderAmount: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    await ctx.db.insert("coupons", {
      code: args.code.toUpperCase(),
      type: args.type,
      value: args.value,
      minOrderAmount: args.minOrderAmount,
      maxUses: args.maxUses,
      usedCount: 0,
      expiresAt: args.expiresAt,
      active: args.active,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("coupons"),
    code: v.optional(v.string()),
    type: v.optional(v.union(v.literal("percentage"), v.literal("fixed"))),
    value: v.optional(v.number()),
    minOrderAmount: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const { id, ...updates } = args;
    const patch: Record<string, any> = {};
    if (updates.code !== undefined) patch.code = updates.code.toUpperCase();
    if (updates.type !== undefined) patch.type = updates.type;
    if (updates.value !== undefined) patch.value = updates.value;
    if (updates.minOrderAmount !== undefined) patch.minOrderAmount = updates.minOrderAmount;
    if (updates.maxUses !== undefined) patch.maxUses = updates.maxUses;
    if (updates.expiresAt !== undefined) patch.expiresAt = updates.expiresAt;
    if (updates.active !== undefined) patch.active = updates.active;

    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    await ctx.db.delete(args.id);
  },
});
