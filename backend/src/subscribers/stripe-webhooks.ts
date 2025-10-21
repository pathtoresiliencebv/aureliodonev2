import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const config: SubscriberConfig = {
  event: "stripe.webhook",
}

export default async function stripeWebhookHandler({
  event,
  container,
}: SubscriberArgs) {
  const billingService = container.resolve("billingService")
  const storeModuleService = container.resolve(Modules.STORE)
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  try {
    const { type, data } = event.data

    switch (type) {
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(data, storeModuleService, notificationModuleService)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(data, storeModuleService, notificationModuleService)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(data, storeModuleService, billingService)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(data, storeModuleService, notificationModuleService)
        break

      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(data, storeModuleService, notificationModuleService)
        break

      default:
        console.log(`Unhandled Stripe webhook event: ${type}`)
    }
  } catch (error) {
    console.error("Error processing Stripe webhook:", error)
    throw error
  }
}

async function handlePaymentSucceeded(data: any, storeModuleService: any, notificationModuleService: any) {
  const subscription = data.object
  const customerId = subscription.customer

  // Find store by Stripe customer ID
  const stores = await storeModuleService.listStores({
    metadata: { stripe_customer_id: customerId }
  })

  if (stores.length === 0) {
    console.error(`No store found for Stripe customer: ${customerId}`)
    return
  }

  const store = stores[0]

  // Update store status to active
  await storeModuleService.updateStores([store.id], {
    metadata: {
      ...store.metadata,
      status: "active",
      last_payment_at: new Date().toISOString()
    }
  })

  // Send payment confirmation email
  await notificationModuleService.sendNotification({
    to: store.metadata.owner_email,
    channel: "email",
    template: "payment-confirmed",
    data: {
      storeName: store.name,
      amount: subscription.latest_invoice?.amount_paid,
      currency: subscription.latest_invoice?.currency
    }
  })

  console.log(`Payment succeeded for store: ${store.id}`)
}

async function handlePaymentFailed(data: any, storeModuleService: any, notificationModuleService: any) {
  const invoice = data.object
  const customerId = invoice.customer

  // Find store by Stripe customer ID
  const stores = await storeModuleService.listStores({
    metadata: { stripe_customer_id: customerId }
  })

  if (stores.length === 0) {
    console.error(`No store found for Stripe customer: ${customerId}`)
    return
  }

  const store = stores[0]

  // Update store status to suspended
  await storeModuleService.updateStores([store.id], {
    metadata: {
      ...store.metadata,
      status: "suspended",
      suspension_reason: "payment_failed",
      suspended_at: new Date().toISOString()
    }
  })

  // Send payment failed email
  await notificationModuleService.sendNotification({
    to: store.metadata.owner_email,
    channel: "email",
    template: "payment-failed",
    data: {
      storeName: store.name,
      amount: invoice.amount_due,
      currency: invoice.currency,
      retryUrl: `https://${store.metadata.subdomain}.yourdomain.com/admin/billing`
    }
  })

  console.log(`Payment failed for store: ${store.id}`)
}

async function handleSubscriptionUpdated(data: any, storeModuleService: any, billingService: any) {
  const subscription = data.object
  const customerId = subscription.customer

  // Find store by Stripe customer ID
  const stores = await storeModuleService.listStores({
    metadata: { stripe_customer_id: customerId }
  })

  if (stores.length === 0) {
    console.error(`No store found for Stripe customer: ${customerId}`)
    return
  }

  const store = stores[0]

  // Update subscription details
  await storeModuleService.updateStores([store.id], {
    metadata: {
      ...store.metadata,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    }
  })

  console.log(`Subscription updated for store: ${store.id}`)
}

async function handleSubscriptionDeleted(data: any, storeModuleService: any, notificationModuleService: any) {
  const subscription = data.object
  const customerId = subscription.customer

  // Find store by Stripe customer ID
  const stores = await storeModuleService.listStores({
    metadata: { stripe_customer_id: customerId }
  })

  if (stores.length === 0) {
    console.error(`No store found for Stripe customer: ${customerId}`)
    return
  }

  const store = stores[0]

  // Update store status to suspended
  await storeModuleService.updateStores([store.id], {
    metadata: {
      ...store.metadata,
      status: "suspended",
      suspension_reason: "subscription_canceled",
      suspended_at: new Date().toISOString()
    }
  })

  // Send subscription canceled email
  await notificationModuleService.sendNotification({
    to: store.metadata.owner_email,
    channel: "email",
    template: "subscription-canceled",
    data: {
      storeName: store.name,
      reactivationUrl: `https://${store.metadata.subdomain}.yourdomain.com/admin/billing`
    }
  })

  console.log(`Subscription deleted for store: ${store.id}`)
}

async function handleTrialWillEnd(data: any, storeModuleService: any, notificationModuleService: any) {
  const subscription = data.object
  const customerId = subscription.customer

  // Find store by Stripe customer ID
  const stores = await storeModuleService.listStores({
    metadata: { stripe_customer_id: customerId }
  })

  if (stores.length === 0) {
    console.error(`No store found for Stripe customer: ${customerId}`)
    return
  }

  const store = stores[0]

  // Send trial ending email
  await notificationModuleService.sendNotification({
    to: store.metadata.owner_email,
    channel: "email",
    template: "trial-ending",
    data: {
      storeName: store.name,
      trialEndDate: new Date(subscription.trial_end * 1000).toLocaleDateString(),
      billingUrl: `https://${store.metadata.subdomain}.yourdomain.com/admin/billing`
    }
  })

  console.log(`Trial ending notification sent for store: ${store.id}`)
}
