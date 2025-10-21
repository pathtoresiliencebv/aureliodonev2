import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/db";
import { orderTable, teamTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export async function POST(request: NextRequest) {
  try {
    const {
      items,
      billingAddress,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      teamSlug,
    } = await request.json();

    if (!items || !billingAddress || !shippingAddress || !shippingMethod || !paymentMethod || !teamSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getDB();

    // Get team
    const team = await db.query.teamTable.findFirst({
      where: eq(teamTable.slug, teamSlug),
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shippingCost = getShippingCost(shippingMethod);
    const tax = calculateTax(subtotal, billingAddress.country);
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await db.insert(orderTable).values({
      teamId: team.id,
      saleorOrderId: `saleor_${createId()}`, // Placeholder for Saleor integration
      orderNumber,
      customerEmail: billingAddress.email || "guest@example.com",
      customerName: `${billingAddress.firstName} ${billingAddress.lastName}`,
      status: "pending",
      totalAmount: Math.round(total * 100), // Convert to cents
      currency: "USD",
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      lineItems: items.map((item: any) => ({
        id: item.id,
        productName: item.name,
        variantName: item.attributes ? Object.values(item.attributes).join(", ") : undefined,
        quantity: item.quantity,
        unitPrice: Math.round(item.price * 100),
        totalPrice: Math.round(item.price * item.quantity * 100),
      })),
      fulfillmentStatus: "unfulfilled",
      paymentStatus: "pending",
    }).returning();

    return NextResponse.json({
      orderId: order[0].id,
      orderNumber: order[0].orderNumber,
    });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

function getShippingCost(method: string): number {
  const shippingRates: Record<string, number> = {
    "standard": 5.99,
    "express": 12.99,
    "overnight": 24.99,
    "free": 0,
  };

  return shippingRates[method] || 5.99;
}

function calculateTax(amount: number, country: string): number {
  // Simple tax calculation - in real app, use proper tax service
  const taxRates: Record<string, number> = {
    "US": 0.08,
    "CA": 0.13,
    "GB": 0.20,
    "DE": 0.19,
    "FR": 0.20,
    "IT": 0.22,
    "ES": 0.21,
    "NL": 0.21,
    "BE": 0.21,
    "AT": 0.20,
    "CH": 0.077,
    "SE": 0.25,
    "NO": 0.25,
    "DK": 0.25,
    "FI": 0.24,
  };

  const rate = taxRates[country] || 0.08;
  return amount * rate;
}
