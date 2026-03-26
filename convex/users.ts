import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const ADMIN_EMAILS = ["nawrifwahab342@gmail.com"];

export const getOrCreateUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (existing) return existing;

    const email = identity.email ?? "";
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" as const : "customer" as const;

    const id = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email,
      name: identity.name ?? undefined,
      role,
      addresses: [],
      wishlist: [],
    });

    return await ctx.db.get(id);
  },
});

export const getUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

export const isAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    return user?.role === "admin";
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    addresses: v.optional(
      v.array(
        v.object({
          label: v.string(),
          line1: v.string(),
          line2: v.optional(v.string()),
          city: v.string(),
          state: v.string(),
          zip: v.string(),
          country: v.string(),
          isDefault: v.boolean(),
        })
      )
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

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.addresses !== undefined) updates.addresses = args.addresses;

    await ctx.db.patch(user._id, updates);
  },
});

export const toggleWishlistItem = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    const wishlist = user.wishlist ?? [];
    const index = wishlist.indexOf(args.productId);

    if (index === -1) {
      wishlist.push(args.productId);
    } else {
      wishlist.splice(index, 1);
    }

    await ctx.db.patch(user._id, { wishlist });
    return index === -1;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") return [];

    return await ctx.db.query("users").collect();
  },
});
