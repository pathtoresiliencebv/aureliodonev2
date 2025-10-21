import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDB } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Received Stripe webhook:", event.type);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("No order ID in session metadata");
      return;
    }

    const db = getDB();

    // Update order status
    await db.update(orderTable)
      .set({
        status: "confirmed",
        paymentStatus: "paid",
        updatedAt: new Date(),
      })
      .where(eq(orderTable.id, orderId));

    console.log(`Order ${orderId} confirmed and marked as paid`);

    // TODO: Send confirmation email
    // TODO: Update inventory
    // TODO: Create fulfillment record

  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      console.error("No order ID in payment intent metadata");
      return;
    }

    const db = getDB();

    // Update order payment status
    await db.update(orderTable)
      .set({
        paymentStatus: "paid",
        updatedAt: new Date(),
      })
      .where(eq(orderTable.id, orderId));

    console.log(`Payment succeeded for order ${orderId}`);

  } catch (error) {
    console.error("Error handling payment intent succeeded:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      console.error("No order ID in payment intent metadata");
      return;
    }

    const db = getDB();

    // Update order payment status
    await db.update(orderTable)
      .set({
        paymentStatus: "pending",
        updatedAt: new Date(),
      })
      .where(eq(orderTable.id, orderId));

    console.log(`Payment failed for order ${orderId}`);

    // TODO: Send payment failed email to customer
    // TODO: Notify admin

  } catch (error) {
    console.error("Error handling payment intent failed:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    // Handle subscription payments if needed
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log(`Invoice payment failed: ${invoice.id}`);
    // Handle failed subscription payments
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
  }
}
