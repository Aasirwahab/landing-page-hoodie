import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const order = await ctx.db.get(args.id);
    if (!order) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;

    if (order.userId !== user._id && user.role !== "admin") return null;

    return order;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") return [];

    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");

    const currentHistory = order.statusHistory ?? [];
    const statusHistory = [
      ...currentHistory,
      { status: args.status, timestamp: Date.now() },
    ];

    await ctx.db.patch(args.id, { status: args.status, statusHistory });
  },
});

export const addTrackingNumber = mutation({
  args: {
    id: v.id("orders"),
    trackingNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    await ctx.db.patch(args.id, { trackingNumber: args.trackingNumber });
  },
});

const CARRIER_TRACKING_URLS: Record<string, (num: string) => string> = {
  fedex: (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}`,
  ups: (n) => `https://www.ups.com/track?tracknum=${n}`,
  usps: (n) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}`,
  dhl: (n) => `https://www.dhl.com/en/express/tracking.html?AWB=${n}`,
};

export const updateShipping = mutation({
  args: {
    id: v.id("orders"),
    trackingNumber: v.string(),
    shippingCarrier: v.string(),
    trackingUrl: v.optional(v.string()),
    estimatedDelivery: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const trackingUrl =
      args.trackingUrl ||
      (CARRIER_TRACKING_URLS[args.shippingCarrier]
        ? CARRIER_TRACKING_URLS[args.shippingCarrier](args.trackingNumber)
        : undefined);

    await ctx.db.patch(args.id, {
      trackingNumber: args.trackingNumber,
      shippingCarrier: args.shippingCarrier,
      trackingUrl,
      estimatedDelivery: args.estimatedDelivery,
    });
  },
});

export const getByStripeSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.sessionId)
      )
      .first();
    if (!order) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;
    if (order.userId !== user._id && user.role !== "admin") return null;

    return order;
  },
});
