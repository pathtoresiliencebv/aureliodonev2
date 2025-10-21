import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDB } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, successUrl, cancelUrl } = await request.json();

    if (!orderId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get order from database
    const db = getDB();
    const order = await db.query.orderTable.findFirst({
      where: eq(orderTable.id, orderId),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Parse line items
    const lineItems = order.lineItems as Array<{
      id: string;
      productName: string;
      variantName?: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> || [];

    // Create Stripe checkout session
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems.map(item => ({
        price_data: {
          currency: order.currency.toLowerCase(),
          product_data: {
            name: item.productName,
            description: item.variantName,
          },
          unit_amount: item.unitPrice,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: order.customerEmail,
      metadata: {
        orderId: order.id,
        teamId: order.teamId,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI"],
      },
      billing_address_collection: "required",
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
