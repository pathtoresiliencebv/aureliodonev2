import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@/utils/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const cloudflare = getCloudflareContext();

    // Fetch order from database
    const result = await cloudflare.env.NEXT_TAG_CACHE_D1.prepare(`
      SELECT * FROM orders
      WHERE stripeSessionId = ? OR id = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `).bind(sessionId, sessionId).first();

    if (!result) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const order = {
      ...result,
      items: JSON.parse(result.items || "[]"),
      shippingAddress: JSON.parse(result.shippingAddress || "{}"),
      billingAddress: JSON.parse(result.billingAddress || "{}"),
    };

    return NextResponse.json(order);

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
