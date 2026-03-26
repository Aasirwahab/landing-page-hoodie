import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .collect();

    const approved = reviews.filter((r) => r.approved);

    const withUsers = await Promise.all(
      approved.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        return {
          ...review,
          userName: user?.name || "Anonymous",
        };
      })
    );

    return withUsers;
  },
});

export const getAverageRating = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .collect();

    const approved = reviews.filter((r) => r.approved);
    if (approved.length === 0) return { average: 0, count: 0 };

    const sum = approved.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: Math.round((sum / approved.length) * 10) / 10,
      count: approved.length,
    };
  },
});

export const getUserReview = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return reviews.find((r) => r.productId === args.productId) || null;
  },
});

export const submit = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Check if user already reviewed this product
    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const alreadyReviewed = existing.find(
      (r) => r.productId === args.productId
    );
    if (alreadyReviewed) {
      // Update existing review
      await ctx.db.patch(alreadyReviewed._id, {
        rating: args.rating,
        text: args.text,
        approved: false,
      });
      return alreadyReviewed._id;
    }

    return await ctx.db.insert("reviews", {
      productId: args.productId,
      userId: user._id,
      rating: args.rating,
      text: args.text,
      approved: false,
    });
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    const reviews = await ctx.db.query("reviews").collect();

    const withDetails = await Promise.all(
      reviews.map(async (review) => {
        const [reviewUser, product] = await Promise.all([
          ctx.db.get(review.userId),
          ctx.db.get(review.productId),
        ]);
        return {
          ...review,
          userName: reviewUser?.name || reviewUser?.email || "Unknown",
          productTitle: product?.title || "Deleted Product",
        };
      })
    );

    return withDetails;
  },
});

export const approve = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || user.role !== "admin") throw new Error("Not authorized");

    await ctx.db.patch(args.id, { approved: true });
  },
});

export const reject = mutation({
  args: { id: v.id("reviews") },
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
