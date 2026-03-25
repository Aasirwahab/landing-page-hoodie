import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getProduct = internalQuery({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createOrder = internalMutation({
  args: {
    clerkId: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        title: v.string(),
        color: v.string(),
        price: v.number(),
        quantity: v.number(),
        size: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    total: v.number(),
    stripeSessionId: v.string(),
    shippingAddress: v.object({
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) throw new Error("User not found");

    // Map productId strings to proper Ids
    const items = args.items.map((item) => ({
      productId: item.productId as any,
      title: item.title,
      color: item.color,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      imageUrl: item.imageUrl,
    }));

    await ctx.db.insert("orders", {
      userId: user._id,
      items,
      subtotal: args.subtotal,
      tax: args.tax,
      shipping: args.shipping,
      total: args.total,
      status: "pending",
      stripeSessionId: args.stripeSessionId,
      shippingAddress: args.shippingAddress,
    });
  },
});

export const markOrderPaid = internalMutation({
  args: {
    stripeSessionId: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .first();
    if (!order) return;
    if (order.status !== "pending") return;

    await ctx.db.patch(order._id, { status: "paid" });

    // Clear user's cart
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (user) {
      const cart = await ctx.db
        .query("cart")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();
      if (cart) {
        await ctx.db.patch(cart._id, { items: [] });
      }
    }
  },
});
