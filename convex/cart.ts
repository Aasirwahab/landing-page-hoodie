import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;

    const cart = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!cart) return { items: [], total: 0, itemCount: 0 };

    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    const validItems = itemsWithProducts.filter((i) => i.product !== null);
    const total = validItems.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0
    );
    const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: validItems,
      total,
      itemCount,
    };
  },
});

export const addItem = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.optional(v.number()),
    size: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    let cart = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    const qty = args.quantity ?? 1;

    if (!cart) {
      await ctx.db.insert("cart", {
        userId: user._id,
        items: [{ productId: args.productId, quantity: qty, size: args.size }],
      });
      return;
    }

    const existingIndex = cart.items.findIndex(
      (i) => i.productId === args.productId && i.size === args.size
    );

    const newItems = [...cart.items];
    if (existingIndex >= 0) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + qty,
      };
    } else {
      newItems.push({
        productId: args.productId,
        quantity: qty,
        size: args.size,
      });
    }

    await ctx.db.patch(cart._id, { items: newItems });
  },
});

export const removeItem = mutation({
  args: {
    productId: v.id("products"),
    size: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    const cart = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!cart) return;

    const newItems = cart.items.filter(
      (i) => !(i.productId === args.productId && i.size === args.size)
    );

    await ctx.db.patch(cart._id, { items: newItems });
  },
});

export const updateQuantity = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    size: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    const cart = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!cart) return;

    if (args.quantity <= 0) {
      const newItems = cart.items.filter(
        (i) => !(i.productId === args.productId && i.size === args.size)
      );
      await ctx.db.patch(cart._id, { items: newItems });
      return;
    }

    const newItems = cart.items.map((i) =>
      i.productId === args.productId && i.size === args.size
        ? { ...i, quantity: args.quantity }
        : i
    );

    await ctx.db.patch(cart._id, { items: newItems });
  },
});

export const clearCart = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    const cart = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!cart) return;

    await ctx.db.patch(cart._id, { items: [] });
  },
});

export const mergeLocalCart = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        size: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    if (args.items.length === 0) return;

    let cart = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) {
      await ctx.db.insert("cart", {
        userId: user._id,
        items: args.items,
      });
      return;
    }

    const merged = [...cart.items];
    for (const localItem of args.items) {
      const existingIndex = merged.findIndex(
        (i) => i.productId === localItem.productId && i.size === localItem.size
      );
      if (existingIndex >= 0) {
        merged[existingIndex] = {
          ...merged[existingIndex],
          quantity: merged[existingIndex].quantity + localItem.quantity,
        };
      } else {
        merged.push(localItem);
      }
    }

    await ctx.db.patch(cart._id, { items: merged });
  },
});
