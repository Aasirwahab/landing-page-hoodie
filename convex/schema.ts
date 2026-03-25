import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    title: v.string(),
    color: v.string(),
    price: v.number(),
    priceFormatted: v.string(),
    background: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    thumbBackground: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    category: v.union(v.literal("men"), v.literal("women"), v.literal("unisex")),
    featured: v.boolean(),
    inStock: v.boolean(),
    sizes: v.optional(
      v.array(
        v.object({
          size: v.string(),
          inStock: v.boolean(),
        })
      )
    ),
    tags: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .searchIndex("search_products", {
      searchField: "title",
      filterFields: ["category", "color"],
    }),

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("admin")),
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
    wishlist: v.optional(v.array(v.id("products"))),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  cart: defineTable({
    userId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        size: v.optional(v.string()),
      })
    ),
  }).index("by_userId", ["userId"]),

  orders: defineTable({
    userId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
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
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    shippingAddress: v.object({
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
    stripePaymentIntentId: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_stripeSessionId", ["stripeSessionId"]),

  reviews: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    rating: v.number(),
    text: v.optional(v.string()),
    approved: v.boolean(),
  })
    .index("by_productId", ["productId"])
    .index("by_userId", ["userId"]),
});
