import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { BillingService } from "../../../modules/billing/service"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const signature = req.headers["stripe-signature"] as string
    const body = req.body

    if (!signature) {
      res.status(400).json({ error: "Missing stripe-signature header" })
      return
    }

    // Get billing service
    const billingService = req.scope.resolve("billingService")
    
    // Verify webhook signature
    const event = billingService.constructWebhookEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Emit event for subscriber to handle
    await req.scope.emit("stripe.webhook", {
      type: event.type,
      data: event.data
    })

    res.json({ received: true })

  } catch (error) {
    console.error("Stripe webhook error:", error)
    res.status(400).json({ 
      error: "Webhook signature verification failed",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  res.json({ 
    message: "Stripe webhook endpoint is active",
    timestamp: new Date().toISOString()
  })
}
