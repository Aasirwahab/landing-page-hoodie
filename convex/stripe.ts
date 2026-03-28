"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import Stripe from "stripe";
// internal.coupons.getByCodeInternal is used for coupon validation

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
    couponCode: v.optional(v.string()),
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

    // Fetch store settings for tax & shipping
    const settings = await ctx.runQuery(internal.settings.getAllInternal);
    const taxRate = parseFloat(settings.taxRate) / 100;
    const shippingEnabled = settings.shippingEnabled === "true";
    const shippingFlatRate = parseInt(settings.shippingFlatRate);
    const freeShippingThreshold = parseInt(settings.freeShippingThreshold);

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = !shippingEnabled
      ? 0
      : freeShippingThreshold > 0 && subtotal >= freeShippingThreshold
        ? 0
        : shippingFlatRate;
    const tax = Math.round(subtotal * taxRate);

    // Validate and apply coupon if provided
    let discount = 0;
    let validatedCouponCode: string | undefined;
    if (args.couponCode) {
      const coupon = await ctx.runQuery(internal.coupons.getByCodeInternal, {
        code: args.couponCode,
      });
      if (coupon) {
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          throw new Error(
            `Minimum order amount of $${(coupon.minOrderAmount / 100).toFixed(2)} not met`
          );
        }
        if (coupon.type === "percentage") {
          discount = Math.round(subtotal * (coupon.value / 100));
        } else {
          discount = Math.min(coupon.value, subtotal);
        }
        validatedCouponCode = args.couponCode.toUpperCase();
      }
    }

    const total = subtotal + shipping + tax - discount;

    // Add shipping and tax as line items so Stripe total matches
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping" },
          unit_amount: shipping,
        },
        quantity: 1,
      });
    }
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Tax (${settings.taxRate}%)` },
          unit_amount: tax,
        },
        quantity: 1,
      });
    }

    // Apply discount as Stripe coupon
    let stripeDiscounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (discount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: discount,
        currency: "usd",
        duration: "once",
        name: validatedCouponCode || "Discount",
      });
      stripeDiscounts = [{ coupon: stripeCoupon.id }];
    }

    // Create order FIRST to avoid race condition where webhook fires
    // before order exists in the database
    const pendingSessionId = `pending_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    await ctx.runMutation(internal.stripeHelpers.createOrder, {
      clerkId: identity.subject,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      stripeSessionId: pendingSessionId,
      shippingAddress: args.shippingAddress,
      couponCode: validatedCouponCode,
      discount: discount > 0 ? discount : undefined,
    });

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
      ...(stripeDiscounts.length > 0 ? { discounts: stripeDiscounts } : {}),
    });

    // Update the order with the real Stripe session ID
    await ctx.runMutation(internal.stripeHelpers.updateOrderSessionId, {
      oldSessionId: pendingSessionId,
      newSessionId: session.id,
    });

    return session.url;
  },
});

export const webhookMarkOrderPaid = action({
  args: {
    stripeSessionId: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(args.stripeSessionId);
    if (session.payment_status !== "paid") {
      throw new Error("Payment not confirmed by Stripe");
    }
    await ctx.runMutation(internal.stripeHelpers.markOrderPaid, {
      stripeSessionId: args.stripeSessionId,
      clerkId: args.clerkId,
    });
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
