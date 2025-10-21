import { 
  createWorkflow, 
  WorkflowResponse, 
  createStep, 
  StepResponse 
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { createStoresWorkflow } from "@medusajs/medusa/core-flows"
import { createSalesChannelsWorkflow } from "@medusajs/medusa/core-flows"

interface ProvisionTenantInput {
  email: string
  password: string
  storeName: string
  subdomain: string
  plan: string
}

interface ProvisionTenantOutput {
  store: any
  salesChannel: any
  publishableKey: string
  adminUser: any
  stripeCustomerId: string
}

// Step 1: Create Medusa Store
const createStoreStep = createStep(
  "create-store",
  async (input: ProvisionTenantInput, { container }) => {
    const { result } = await createStoresWorkflow(container)
      .run({
        input: {
          stores: [{
            name: input.storeName,
            supported_currencies: [{
              currency_code: "usd",
              is_default: true,
            }],
            metadata: {
              plan: input.plan,
              subdomain: input.subdomain,
              owner_email: input.email,
              status: "trial",
              limits: getPlanLimits(input.plan),
              usage: {
                products: 0,
                orders: 0,
                storage_mb: 0
              }
            }
          }]
        }
      })

    return new StepResponse({ store: result }, "store-created")
  },
  async (storeId, { container }) => {
    if (!storeId) return
    
    const storeModuleService = container.resolve(Modules.STORE)
    await storeModuleService.deleteStores([storeId])
  }
)

// Step 2: Create Sales Channel for Tenant
const createSalesChannelStep = createStep(
  "create-sales-channel",
  async (input: ProvisionTenantInput, { container }) => {
    const { result } = await createSalesChannelsWorkflow(container)
      .run({
        input: {
          salesChannelsData: [{
            name: `${input.storeName} Store`,
            description: `Sales channel for ${input.storeName}`,
            // Note: metadata may not be supported in CreateSalesChannelDTO
            // We'll handle tenant association differently
          }]
        }
      })

    return new StepResponse({ salesChannel: result }, "sales-channel-created")
  },
  async (salesChannelId, { container }) => {
    if (!salesChannelId) return
    
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    await salesChannelModuleService.deleteSalesChannels([salesChannelId])
  }
)

// Step 3: Create Publishable API Key
const createPublishableKeyStep = createStep(
  "create-publishable-key",
  async (input: ProvisionTenantInput, { container }) => {
    const apiKeyModuleService = container.resolve(Modules.API_KEY)
    
    const publishableKey = await apiKeyModuleService.createApiKeys({
      title: `${input.storeName} Storefront Key`,
      type: "publishable",
      created_by: "system"
    })

    return new StepResponse({ publishableKey: publishableKey.token }, publishableKey.id)
  },
  async (keyId, { container }) => {
    if (!keyId) return
    
    const apiKeyModuleService = container.resolve(Modules.API_KEY)
    await apiKeyModuleService.deleteApiKeys([keyId])
  }
)

// Step 4: Create Admin User
const createAdminUserStep = createStep(
  "create-admin-user",
  async (input: ProvisionTenantInput, { container }) => {
    const userModuleService = container.resolve(Modules.USER)
    
    const adminUser = await userModuleService.createUsers({
      email: input.email,
      first_name: "Store",
      last_name: "Owner",
      metadata: {
        tenant_store_id: input.storeName,
        role: "owner",
        permissions: ["all"]
      }
    })

    return new StepResponse({ adminUser }, adminUser.id)
  },
  async (userId, { container }) => {
    if (!userId) return
    
    const userModuleService = container.resolve(Modules.USER)
    await userModuleService.deleteUsers([userId])
  }
)

// Step 5: Create Stripe Customer
const createStripeCustomerStep = createStep(
  "create-stripe-customer",
  async (input: ProvisionTenantInput, { container }) => {
    // This would integrate with Stripe to create a customer
    // For now, we'll simulate it
    const stripeCustomerId = `cus_${Math.random().toString(36).substr(2, 9)}`
    
    return new StepResponse({ stripeCustomerId }, stripeCustomerId)
  },
  async (customerId) => {
    // Rollback logic for Stripe customer deletion
    console.log(`Would delete Stripe customer: ${customerId}`)
  }
)

// Step 6: Send Welcome Email
const sendWelcomeEmailStep = createStep(
  "send-welcome-email",
  async (input: ProvisionTenantInput, { container }) => {
    const notificationModuleService = container.resolve(Modules.NOTIFICATION)
    
    await notificationModuleService.createNotifications({
      to: input.email,
      channel: "email",
      template: "welcome",
      data: {
        storeName: input.storeName,
        subdomain: input.subdomain,
        adminUrl: `https://${input.subdomain}.yourdomain.com/admin`
      }
    })

    return new StepResponse({ emailSent: true })
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

export const provisionTenantWorkflow = createWorkflow(
  "provision-tenant",
  (input: ProvisionTenantInput) => {
    // Execute steps in sequence
    const { store } = createStoreStep(input)
    const { salesChannel } = createSalesChannelStep(input)
    const { publishableKey } = createPublishableKeyStep(input)
    const { adminUser } = createAdminUserStep(input)
    const { stripeCustomerId } = createStripeCustomerStep(input)
    const { emailSent } = sendWelcomeEmailStep(input)

    return new WorkflowResponse({
      store,
      salesChannel,
      publishableKey,
      adminUser,
      stripeCustomerId,
      emailSent
    })
  }
)
