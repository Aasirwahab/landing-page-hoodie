"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export const createCheckoutSession = action({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        size: v.optional(v.string()),
      })
    ),
    shippingAddress: v.object({
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const stripe = getStripe();
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItems: {
      productId: string;
      title: string;
      color: string;
      price: number;
      quantity: number;
      size?: string;
      imageUrl?: string;
    }[] = [];

    for (const item of args.items) {
      const product = await ctx.runQuery(
        internal.stripeHelpers.getProduct,
        { id: item.productId }
      );
      if (!product) continue;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${product.title} - ${product.color}`,
            description: item.size ? `Size: ${item.size}` : undefined,
            images: product.imageUrl
              ? [`${args.successUrl.split("/checkout")[0]}${product.imageUrl}`]
              : undefined,
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });

      orderItems.push({
        productId: item.productId,
        title: product.title,
        color: product.color,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        imageUrl: product.imageUrl,
      });
    }

    if (lineItems.length === 0) throw new Error("No valid items");

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 0;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shipping + tax;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${args.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: args.cancelUrl,
      customer_email: identity.email ?? undefined,
      metadata: {
        clerkId: identity.subject,
      },
    });

    await ctx.runMutation(internal.stripeHelpers.createOrder, {
      clerkId: identity.subject,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      stripeSessionId: session.id,
      shippingAddress: args.shippingAddress,
    });

    return session.url;
  },
});

export const verifySession = action({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const stripe = getStripe();
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const session = await stripe.checkout.sessions.retrieve(args.sessionId);

    if (session.payment_status === "paid") {
      await ctx.runMutation(internal.stripeHelpers.markOrderPaid, {
        stripeSessionId: args.sessionId,
        clerkId: identity.subject,
      });
    }

    return {
      status: session.payment_status,
      sessionId: session.id,
    };
  },
});
