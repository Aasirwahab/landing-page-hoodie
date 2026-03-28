import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getProduct = internalQuery({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateOrderSessionId = internalMutation({
  args: {
    oldSessionId: v.string(),
    newSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.oldSessionId)
      )
      .first();
    if (order) {
      await ctx.db.patch(order._id, { stripeSessionId: args.newSessionId });
    }
  },
});

const MAX_FIELD_LENGTH = 255;

function validateAddress(address: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}) {
  if (!address.line1 || address.line1.trim().length === 0) {
    throw new Error("Address line 1 is required");
  }
  if (address.line1.length > MAX_FIELD_LENGTH) {
    throw new Error("Address line 1 is too long");
  }
  if (address.line2 && address.line2.length > MAX_FIELD_LENGTH) {
    throw new Error("Address line 2 is too long");
  }
  if (!address.city || address.city.trim().length === 0) {
    throw new Error("City is required");
  }
  if (address.city.length > MAX_FIELD_LENGTH) {
    throw new Error("City is too long");
  }
  if (!address.state || address.state.trim().length === 0) {
    throw new Error("State is required");
  }
  if (address.state.length > 100) {
    throw new Error("State is too long");
  }
  if (!address.zip || !/^[a-zA-Z0-9\s\-]{3,20}$/.test(address.zip)) {
    throw new Error("Invalid ZIP/postal code");
  }
  if (!address.country || !/^[A-Z]{2}$/.test(address.country)) {
    throw new Error("Invalid country code (use 2-letter ISO code)");
  }
}

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
    couponCode: v.optional(v.string()),
    discount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Validate shipping address server-side
    validateAddress(args.shippingAddress);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) throw new Error("User not found");

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
      couponCode: args.couponCode,
      discount: args.discount,
      statusHistory: [{ status: "pending", timestamp: Date.now() }],
    });

    // Increment coupon usage if applied
    if (args.couponCode) {
      const coupon = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", args.couponCode!))
        .first();
      if (coupon) {
        await ctx.db.patch(coupon._id, { usedCount: coupon.usedCount + 1 });
      }
    }
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

    const currentHistory = order.statusHistory ?? [];
    const statusHistory = [
      ...currentHistory,
      { status: "paid", timestamp: Date.now() },
    ];

    await ctx.db.patch(order._id, { status: "paid", statusHistory });

    // Decrement stock for each item
    for (const item of order.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) continue;

      if (product.sizes && item.size) {
        const updatedSizes = product.sizes.map((s) => {
          if (s.size === item.size && s.quantity !== undefined) {
            const newQty = Math.max(0, s.quantity - item.quantity);
            return { ...s, quantity: newQty, inStock: newQty > 0 };
          }
          return s;
        });
        const allOutOfStock = updatedSizes.every((s) => !s.inStock);
        await ctx.db.patch(product._id, {
          sizes: updatedSizes,
          inStock: !allOutOfStock,
        });
      }
    }

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
