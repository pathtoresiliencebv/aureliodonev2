import { BillingService } from "./service"

// Note: Module export may not be available in @medusajs/framework
// This might need to be handled differently in Medusa v2
export const BillingModule = {
  service: BillingService,
}

export * from "./service"
