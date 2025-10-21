import Stripe from "stripe"

export class BillingService {
  private stripe: Stripe

  constructor(container: any, options: any) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-09-30.clover",
    })
  }

  async createCustomer(email: string, name: string, metadata: any = {}) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          created_by: "medusa-saas"
        }
      })

      return customer
    } catch (error) {
      console.error("Error creating Stripe customer:", error)
      throw new Error("Failed to create Stripe customer")
    }
  }

  async createSubscription(customerId: string, priceId: string, metadata: any = {}) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: {
          ...metadata,
          created_by: "medusa-saas"
        },
        trial_period_days: 14, // 14-day free trial
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"]
      })

      return subscription
    } catch (error) {
      console.error("Error creating Stripe subscription:", error)
      throw new Error("Failed to create Stripe subscription")
    }
  }

  async updateSubscription(subscriptionId: string, newPriceId: string) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
      
      await this.stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: "create_prorations"
      })

      return subscription
    } catch (error) {
      console.error("Error updating Stripe subscription:", error)
      throw new Error("Failed to update Stripe subscription")
    }
  }

  async cancelSubscription(subscriptionId: string, immediately = false) {
    try {
      if (immediately) {
        await this.stripe.subscriptions.cancel(subscriptionId)
      } else {
        await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        })
      }

      return true
    } catch (error) {
      console.error("Error canceling Stripe subscription:", error)
      throw new Error("Failed to cancel Stripe subscription")
    }
  }

  async createBillingPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      })

      return session
    } catch (error) {
      console.error("Error creating billing portal session:", error)
      throw new Error("Failed to create billing portal session")
    }
  }

  async getSubscription(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
      return subscription
    } catch (error) {
      console.error("Error retrieving Stripe subscription:", error)
      throw new Error("Failed to retrieve subscription")
    }
  }

  async getCustomer(customerId: string) {
    try {
      const customer = await this.stripe.customers.retrieve(customerId)
      return customer
    } catch (error) {
      console.error("Error retrieving Stripe customer:", error)
      throw new Error("Failed to retrieve customer")
    }
  }

  // Helper method to get price ID based on plan
  getPriceIdForPlan(plan: string): string {
    const priceIds = {
      starter: process.env.STRIPE_STARTER_PRICE_ID!,
      pro: process.env.STRIPE_PRO_PRICE_ID!,
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!
    }

    return priceIds[plan as keyof typeof priceIds] || priceIds.starter
  }

  // Helper method to validate webhook signature
  constructWebhookEvent(payload: string | Buffer, signature: string, secret: string) {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, secret)
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      throw new Error("Invalid webhook signature")
    }
  }
}
