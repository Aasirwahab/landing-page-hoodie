import { query } from "./_generated/server";
import { v } from "convex/values";

export const getRevenueOverTime = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const days = args.days ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const orders = await ctx.db.query("orders").collect();
    const paidOrders = orders.filter(
      (o) =>
        o._creationTime >= cutoff &&
        o.status !== "cancelled" &&
        o.status !== "pending"
    );

    // Group by day
    const dailyMap = new Map<string, { revenue: number; count: number }>();
    for (const order of paidOrders) {
      const date = new Date(order._creationTime).toISOString().split("T")[0];
      const existing = dailyMap.get(date) || { revenue: 0, count: 0 };
      dailyMap.set(date, {
        revenue: existing.revenue + order.total,
        count: existing.count + 1,
      });
    }

    // Fill in missing days
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const data = dailyMap.get(date) || { revenue: 0, count: 0 };
      result.push({ date, revenue: data.revenue, orderCount: data.count });
    }

    return result;
  },
});

export const getTopProducts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const maxItems = args.limit ?? 5;
    const orders = await ctx.db.query("orders").collect();
    const validOrders = orders.filter(
      (o) => o.status !== "cancelled" && o.status !== "pending"
    );

    const productMap = new Map<
      string,
      { title: string; color: string; totalQuantity: number; totalRevenue: number }
    >();

    for (const order of validOrders) {
      for (const item of order.items) {
        const key = item.title + " - " + item.color;
        const existing = productMap.get(key) || {
          title: item.title,
          color: item.color,
          totalQuantity: 0,
          totalRevenue: 0,
        };
        productMap.set(key, {
          ...existing,
          totalQuantity: existing.totalQuantity + item.quantity,
          totalRevenue: existing.totalRevenue + item.price * item.quantity,
        });
      }
    }

    return Array.from(productMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, maxItems);
  },
});

export const getOrderStatusBreakdown = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const orders = await ctx.db.query("orders").collect();
    const statusMap = new Map<string, number>();

    for (const order of orders) {
      statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);
    }

    return Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }));
  },
});

export const getSummaryStats = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const allOrders = await ctx.db.query("orders").collect();
    const cutoff = args.days
      ? Date.now() - args.days * 24 * 60 * 60 * 1000
      : 0;

    const orders = allOrders.filter(
      (o) =>
        o._creationTime >= cutoff &&
        o.status !== "cancelled" &&
        o.status !== "pending"
    );

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const allUsers = await ctx.db.query("users").collect();
    const totalCustomers = allUsers.filter((u) => u.role === "customer").length;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: Math.round(averageOrderValue),
      totalCustomers,
    };
  },
});
