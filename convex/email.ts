"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

const FROM_EMAIL = "POSSESSD <onboarding@resend.dev>";
const SITE_URL = "https://landing-page-hoodie.vercel.app";

function formatPrice(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function baseTemplate(title: string, content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="text-align:center;padding:32px 0 24px;">
              <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:4px;color:#fff;">POSSESSD</h1>
              <div style="width:40px;height:2px;background:#FF6B35;margin:12px auto 0;"></div>
            </td>
          </tr>
          <!-- Title -->
          <tr>
            <td style="text-align:center;padding:0 0 32px;">
              <h2 style="margin:0;font-size:22px;font-weight:400;color:#fff;">${title}</h2>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:32px 0 0;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">
                &copy; ${new Date().getFullYear()} POSSESSD. All rights reserved.
              </p>
              <p style="margin:8px 0 0;font-size:12px;">
                <a href="${SITE_URL}" style="color:#FF6B35;text-decoration:none;">Visit our store</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function orderItemsHtml(items: Array<{ title: string; color: string; price: number; quantity: number; size?: string }>) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <strong style="color:#fff;">${item.title}</strong><br>
          <span style="font-size:13px;color:rgba(255,255,255,0.5);">${item.color}${item.size ? ` / ${item.size}` : ""} &middot; Qty ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;color:#fff;font-weight:600;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");
}

function paidEmail(order: OrderData) {
  const content = `
    <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:15px;">
      Thank you for your order! We've received your payment and will begin processing it shortly.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="font-size:13px;color:rgba(255,255,255,0.4);padding-bottom:4px;">ORDER NUMBER</td>
      </tr>
      <tr>
        <td style="font-size:16px;color:#FF6B35;font-weight:600;padding-bottom:20px;">#${order.orderId}</td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;padding-bottom:12px;">Items</td>
        <td style="text-align:right;font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;padding-bottom:12px;">Price</td>
      </tr>
      ${orderItemsHtml(order.items)}
      <tr><td colspan="2" style="padding:12px 0 0;"></td></tr>
      <tr>
        <td style="color:rgba(255,255,255,0.5);font-size:14px;padding:4px 0;">Subtotal</td>
        <td style="text-align:right;color:#fff;font-size:14px;padding:4px 0;">${formatPrice(order.subtotal)}</td>
      </tr>
      <tr>
        <td style="color:rgba(255,255,255,0.5);font-size:14px;padding:4px 0;">Shipping</td>
        <td style="text-align:right;color:${order.shipping === 0 ? "#4ade80" : "#fff"};font-size:14px;padding:4px 0;">${order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</td>
      </tr>
      <tr>
        <td style="color:rgba(255,255,255,0.5);font-size:14px;padding:4px 0;">Tax</td>
        <td style="text-align:right;color:#fff;font-size:14px;padding:4px 0;">${formatPrice(order.tax)}</td>
      </tr>
      ${order.discount ? `<tr>
        <td style="color:#4ade80;font-size:14px;padding:4px 0;">Discount</td>
        <td style="text-align:right;color:#4ade80;font-size:14px;padding:4px 0;">-${formatPrice(order.discount)}</td>
      </tr>` : ""}
      <tr>
        <td style="font-size:18px;font-weight:700;color:#fff;padding:16px 0 0;border-top:1px solid rgba(255,255,255,0.1);">Total</td>
        <td style="text-align:right;font-size:18px;font-weight:700;color:#FF6B35;padding:16px 0 0;border-top:1px solid rgba(255,255,255,0.1);">${formatPrice(order.total)}</td>
      </tr>
    </table>
    ${order.shippingAddress ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;">Shipping To</td>
      </tr>
      <tr>
        <td style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;">
          ${order.shippingAddress.line1}<br>
          ${order.shippingAddress.line2 ? order.shippingAddress.line2 + "<br>" : ""}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
          ${order.shippingAddress.country}
        </td>
      </tr>
    </table>` : ""}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
      <tr>
        <td align="center">
          <a href="${SITE_URL}/dashboard/orders" style="display:inline-block;padding:14px 32px;background:#FF6B35;color:#fff;text-decoration:none;border-radius:60px;font-size:14px;font-weight:600;letter-spacing:1px;">VIEW ORDER</a>
        </td>
      </tr>
    </table>`;

  return baseTemplate("Order Confirmed", content);
}

function processingEmail(order: OrderData) {
  const content = `
    <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:15px;">
      Great news! Your order <strong style="color:#FF6B35;">#${order.orderId}</strong> is now being prepared for shipment. We'll send you another email with tracking information once it ships.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${orderItemsHtml(order.items)}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
      <tr>
        <td align="center">
          <a href="${SITE_URL}/dashboard/orders" style="display:inline-block;padding:14px 32px;background:#FF6B35;color:#fff;text-decoration:none;border-radius:60px;font-size:14px;font-weight:600;letter-spacing:1px;">TRACK ORDER</a>
        </td>
      </tr>
    </table>`;

  return baseTemplate("Your Order is Being Prepared", content);
}

function shippedEmail(order: OrderData) {
  const content = `
    <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:15px;">
      Your order <strong style="color:#FF6B35;">#${order.orderId}</strong> is on its way!
    </p>
    ${order.trackingNumber ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,107,53,0.08);border:1px solid rgba(255,107,53,0.2);border-radius:8px;padding:20px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;">Tracking Number</p>
          <p style="margin:0 0 12px;font-size:16px;color:#fff;font-weight:600;">${order.trackingNumber}</p>
          ${order.shippingCarrier ? `<p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.5);">Carrier: <strong style="color:#fff;text-transform:uppercase;">${order.shippingCarrier}</strong></p>` : ""}
          ${order.estimatedDelivery ? `<p style="margin:0 0 12px;font-size:13px;color:rgba(255,255,255,0.5);">Estimated Delivery: <strong style="color:#fff;">${formatDate(order.estimatedDelivery)}</strong></p>` : ""}
          ${order.trackingUrl ? `<a href="${order.trackingUrl}" style="display:inline-block;padding:10px 24px;background:#FF6B35;color:#fff;text-decoration:none;border-radius:60px;font-size:13px;font-weight:600;">TRACK PACKAGE</a>` : ""}
        </td>
      </tr>
    </table>` : ""}
    <table width="100%" cellpadding="0" cellspacing="0">
      ${orderItemsHtml(order.items)}
    </table>`;

  return baseTemplate("Your Order Has Shipped!", content);
}

function deliveredEmail(order: OrderData) {
  const content = `
    <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:15px;">
      Your order <strong style="color:#FF6B35;">#${order.orderId}</strong> has been delivered. We hope you love your new gear!
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${orderItemsHtml(order.items)}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
      <tr>
        <td align="center">
          <a href="${SITE_URL}/shop" style="display:inline-block;padding:14px 32px;background:#FF6B35;color:#fff;text-decoration:none;border-radius:60px;font-size:14px;font-weight:600;letter-spacing:1px;">SHOP AGAIN</a>
        </td>
      </tr>
    </table>`;

  return baseTemplate("Your Order Has Been Delivered", content);
}

function cancelledEmail(order: OrderData) {
  const content = `
    <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:15px;">
      Your order <strong style="color:#FF6B35;">#${order.orderId}</strong> has been cancelled. If you have any questions, please contact our support team.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${orderItemsHtml(order.items)}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td style="font-size:18px;font-weight:700;color:#fff;">Refund Amount</td>
        <td style="text-align:right;font-size:18px;font-weight:700;color:#4ade80;">${formatPrice(order.total)}</td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:13px;color:rgba(255,255,255,0.4);">
      If a payment was made, your refund will be processed within 5-10 business days.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
      <tr>
        <td align="center">
          <a href="${SITE_URL}/contact" style="display:inline-block;padding:14px 32px;border:1px solid rgba(255,255,255,0.2);color:#fff;text-decoration:none;border-radius:60px;font-size:14px;font-weight:600;letter-spacing:1px;">CONTACT SUPPORT</a>
        </td>
      </tr>
    </table>`;

  return baseTemplate("Order Cancelled", content);
}

interface OrderData {
  orderId: string;
  items: Array<{ title: string; color: string; price: number; quantity: number; size?: string }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discount?: number;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string;
  shippingCarrier?: string;
  trackingUrl?: string;
  estimatedDelivery?: number;
}

const emailGenerators: Record<string, (order: OrderData) => { subject: string; html: string }> = {
  paid: (order) => ({
    subject: `Order Confirmed #${order.orderId}`,
    html: paidEmail(order),
  }),
  processing: (order) => ({
    subject: `Your Order #${order.orderId} is Being Prepared`,
    html: processingEmail(order),
  }),
  shipped: (order) => ({
    subject: `Your Order #${order.orderId} Has Shipped!`,
    html: shippedEmail(order),
  }),
  delivered: (order) => ({
    subject: `Your Order #${order.orderId} Has Been Delivered`,
    html: deliveredEmail(order),
  }),
  cancelled: (order) => ({
    subject: `Order #${order.orderId} Cancelled`,
    html: cancelledEmail(order),
  }),
};

export const sendOrderEmail = internalAction({
  args: {
    userEmail: v.string(),
    userName: v.optional(v.string()),
    status: v.string(),
    orderId: v.string(),
    items: v.array(
      v.object({
        title: v.string(),
        color: v.string(),
        price: v.number(),
        quantity: v.number(),
        size: v.optional(v.string()),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    total: v.number(),
    discount: v.optional(v.number()),
    shippingAddress: v.optional(
      v.object({
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        country: v.string(),
      })
    ),
    trackingNumber: v.optional(v.string()),
    shippingCarrier: v.optional(v.string()),
    trackingUrl: v.optional(v.string()),
    estimatedDelivery: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("RESEND_API_KEY not set, skipping email");
      return;
    }

    const generator = emailGenerators[args.status];
    if (!generator) {
      console.log(`No email template for status: ${args.status}`);
      return;
    }

    const orderData: OrderData = {
      orderId: args.orderId,
      items: args.items,
      subtotal: args.subtotal,
      tax: args.tax,
      shipping: args.shipping,
      total: args.total,
      discount: args.discount,
      shippingAddress: args.shippingAddress,
      trackingNumber: args.trackingNumber,
      shippingCarrier: args.shippingCarrier,
      trackingUrl: args.trackingUrl,
      estimatedDelivery: args.estimatedDelivery,
    };

    const { subject, html } = generator(orderData);

    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: args.userEmail,
        subject,
        html,
      });
      console.log(`Email sent: ${subject} to ${args.userEmail}`);
    } catch (error) {
      console.error(`Failed to send email: ${subject}`, error);
    }
  },
});
