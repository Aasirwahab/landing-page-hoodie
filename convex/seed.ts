import { mutation } from "./_generated/server";

export const seedProducts = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    if (existing.length > 0) {
      return `Already have ${existing.length} products. Skipping seed.`;
    }

    const products = [
      {
        title: "POSSESSD",
        color: "Blood Orange",
        price: 124900,
        priceFormatted: "$1,249.00",
        background: "linear-gradient(to bottom, #FE783D, #121826)",
        imageUrl: "/images/1.webp",
        thumbBackground: "#fff",
        slug: "possessd-blood-orange",
        description:
          "Premium urban outerwear in a bold Blood Orange colorway. Crafted with cutting-edge materials for unmatched style and warmth.",
        category: "unisex" as const,
        featured: true,
        inStock: true,
        sizes: [
          { size: "XS", inStock: true },
          { size: "S", inStock: true },
          { size: "M", inStock: true },
          { size: "L", inStock: true },
          { size: "XL", inStock: true },
        ],
        tags: ["new-arrival", "premium"],
        sortOrder: 1,
      },
      {
        title: "POSSESSD",
        color: "Ocean Blue",
        price: 124900,
        priceFormatted: "$1,249.00",
        background: "linear-gradient(to bottom, #1E90FF, #121826)",
        imageUrl: "/images/2.webp",
        thumbBackground: "#fff",
        slug: "possessd-ocean-blue",
        description:
          "Premium urban outerwear in a serene Ocean Blue colorway. Designed for the modern explorer who demands elegance.",
        category: "unisex" as const,
        featured: true,
        inStock: true,
        sizes: [
          { size: "XS", inStock: true },
          { size: "S", inStock: true },
          { size: "M", inStock: true },
          { size: "L", inStock: true },
          { size: "XL", inStock: false },
        ],
        tags: ["new-arrival", "premium"],
        sortOrder: 2,
      },
      {
        title: "POSSESSD",
        color: "Royal Purple",
        price: 124900,
        priceFormatted: "$1,249.00",
        background: "linear-gradient(to bottom, #7B2D8E, #121826)",
        imageUrl: "/images/3.webp",
        thumbBackground: "#fff",
        slug: "possessd-royal-purple",
        description:
          "Premium urban outerwear in a regal Royal Purple colorway. A statement piece that commands attention.",
        category: "unisex" as const,
        featured: true,
        inStock: true,
        sizes: [
          { size: "XS", inStock: true },
          { size: "S", inStock: true },
          { size: "M", inStock: true },
          { size: "L", inStock: true },
          { size: "XL", inStock: true },
        ],
        tags: ["new-arrival", "premium"],
        sortOrder: 3,
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }

    return `Seeded ${products.length} products successfully.`;
  },
});
