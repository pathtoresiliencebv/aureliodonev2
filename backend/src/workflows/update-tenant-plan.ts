import { 
  createWorkflow, 
  WorkflowResponse, 
  createStep, 
  StepResponse 
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

interface UpdateTenantPlanInput {
  storeId: string
  newPlan: string
  currentPlan: string
}

interface UpdateTenantPlanOutput {
  store: any
  limits: any
  stripeSubscriptionId?: string
}

// Step 1: Update Store Metadata
const updateStoreMetadataStep = createStep(
  "update-store-metadata",
  async (input: UpdateTenantPlanInput, { container }) => {
    const storeModuleService = container.resolve(Modules.STORE)
    
    const store = await storeModuleService.retrieveStore(input.storeId)
    
    const updatedStore = await storeModuleService.updateStores(input.storeId, {
      metadata: {
        ...store.metadata,
        plan: input.newPlan,
        limits: getPlanLimits(input.newPlan),
        updated_at: new Date().toISOString()
      }
    })

    return new StepResponse({ store: updatedStore }, input.storeId)
  },
  async (storeId, { container }) => {
    if (!storeId) return
    
    // Rollback to previous plan
    const storeModuleService = container.resolve(Modules.STORE)
    const store = await storeModuleService.retrieveStore(storeId)
    
    await storeModuleService.updateStores(storeId, {
      metadata: {
        ...store.metadata,
        plan: store.metadata.plan, // Revert to original plan
        updated_at: new Date().toISOString()
      }
    })
  }
)

// Step 2: Update Stripe Subscription
const updateStripeSubscriptionStep = createStep(
  "update-stripe-subscription",
  async (input: UpdateTenantPlanInput, { container }) => {
    // This would integrate with Stripe to update the subscription
    // For now, we'll simulate it
    const stripeSubscriptionId = `sub_${Math.random().toString(36).substr(2, 9)}`
    
    return new StepResponse({ stripeSubscriptionId }, stripeSubscriptionId)
  },
  async (subscriptionId) => {
    // Rollback logic for Stripe subscription
    console.log(`Would revert Stripe subscription: ${subscriptionId}`)
  }
)

// Step 3: Send Plan Change Notification
const sendPlanChangeNotificationStep = createStep(
  "send-plan-change-notification",
  async (input: UpdateTenantPlanInput, { container }) => {
    const storeModuleService = container.resolve(Modules.STORE)
    const notificationModuleService = container.resolve(Modules.NOTIFICATION)
    
    const store = await storeModuleService.retrieveStore(input.storeId)
    const ownerEmail = store.metadata.owner_email
    
    await notificationModuleService.createNotifications({
      to: ownerEmail,
      channel: "email",
      template: "plan-changed",
      data: {
        storeName: store.name,
        oldPlan: input.currentPlan,
        newPlan: input.newPlan,
        newLimits: getPlanLimits(input.newPlan)
      }
    })

    return new StepResponse({ notificationSent: true })
  }
)

// Helper function to get plan limits
function getPlanLimits(plan: string) {
  const limits = {
    starter: { products: 100, orders: 200, storage_mb: 1000 },
    pro: { products: 1000, orders: 2000, storage_mb: 5000 },
    enterprise: { products: -1, orders: -1, storage_mb: -1 } // -1 means unlimited
  }
  
  return limits[plan as keyof typeof limits] || limits.starter
}

export const updateTenantPlanWorkflow = createWorkflow(
  "update-tenant-plan",
  (input: UpdateTenantPlanInput) => {
    // Execute steps in sequence
    const { store } = updateStoreMetadataStep(input)
    const { stripeSubscriptionId } = updateStripeSubscriptionStep(input)
    const { notificationSent } = sendPlanChangeNotificationStep(input)

    return new WorkflowResponse({
      store,
      limits: getPlanLimits(input.newPlan),
      stripeSubscriptionId
    })
  }
)
