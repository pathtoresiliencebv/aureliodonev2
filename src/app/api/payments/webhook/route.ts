import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getCloudflareContext } from "@/utils/api";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const cloudflare = getCloudflareContext();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, cloudflare);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, cloudflare);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, cloudflare);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, cloudflare);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, cloudflare);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, cloudflare);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, cloudflare);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, cloudflare: any) {
  try {
    const { teamId, items } = session.metadata || {};

    if (!teamId) {
      console.error("No team ID in session metadata");
      return;
    }

    // Create order in database
    const orderData = {
      id: session.id,
      teamId: teamId,
      customerEmail: session.customer_email,
      customerName: session.customer_details?.name,
      status: "completed",
      total: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      paymentStatus: "paid",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      items: JSON.parse(items || "[]"),
      shippingAddress: session.shipping_details?.address,
      billingAddress: session.customer_details?.address,
      createdAt: new Date().toISOString(),
    };

    // Insert order into database
    await cloudflare.env.NEXT_TAG_CACHE_D1.prepare(`
      INSERT INTO orders (
        id, teamId, customerEmail, customerName, status, total, currency,
        paymentStatus, stripeSessionId, stripePaymentIntentId, items,
        shippingAddress, billingAddress, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderData.id,
      orderData.teamId,
      orderData.customerEmail,
      orderData.customerName,
      orderData.status,
      orderData.total,
      orderData.currency,
      orderData.paymentStatus,
      orderData.stripeSessionId,
      orderData.stripePaymentIntentId,
      JSON.stringify(orderData.items),
      JSON.stringify(orderData.shippingAddress),
      JSON.stringify(orderData.billingAddress),
      orderData.createdAt
    ).run();

    console.log(`Order created: ${session.id}`);

  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, cloudflare: any) {
  try {
    // Update order payment status
    await cloudflare.env.NEXT_TAG_CACHE_D1.prepare(`
      UPDATE orders
      SET paymentStatus = 'paid', stripePaymentIntentId = ?
      WHERE stripePaymentIntentId = ?
    `).bind(paymentIntent.id, paymentIntent.id).run();

    console.log(`Payment succeeded: ${paymentIntent.id}`);

  } catch (error) {
    console.error("Error handling payment intent succeeded:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent, cloudflare: any) {
  try {
    // Update order payment status
    await cloudflare.env.NEXT_TAG_CACHE_D1.prepare(`
      UPDATE orders
      SET paymentStatus = 'failed', stripePaymentIntentId = ?
      WHERE stripePaymentIntentId = ?
    `).bind(paymentIntent.id, paymentIntent.id).run();

    console.log(`Payment failed: ${paymentIntent.id}`);

  } catch (error) {
    console.error("Error handling payment intent failed:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, cloudflare: any) {
  try {
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    // Handle subscription payment success
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, cloudflare: any) {
  try {
    console.log(`Subscription created: ${subscription.id}`);
    // Handle subscription creation
  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, cloudflare: any) {
  try {
    console.log(`Subscription updated: ${subscription.id}`);
    // Handle subscription updates
  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, cloudflare: any) {
  try {
    console.log(`Subscription deleted: ${subscription.id}`);
    // Handle subscription cancellation
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}
