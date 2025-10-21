import { MedusaRequest } from "@medusajs/framework"

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string | null
        storeId: string | null
        salesChannelId: string | null
        isAdmin: boolean
        isStorefront: boolean
      }
      tenantFilter?: {
        store_id: string
        sales_channel_id: string
      }
      usageTracking?: {
        incrementProducts: boolean
        incrementOrders: boolean
        incrementStorage: boolean
      }
    }
  }
}

// Extend MedusaRequest interface
declare module "@medusajs/framework" {
  interface MedusaRequest {
    tenant?: {
      id: string | null
      storeId: string | null
      salesChannelId: string | null
      isAdmin: boolean
      isStorefront: boolean
    }
    tenantFilter?: {
      store_id: string
      sales_channel_id: string
    }
    usageTracking?: {
      incrementProducts: boolean
      incrementOrders: boolean
      incrementStorage: boolean
    }
  }
}

// Extend user metadata interface
declare module "@medusajs/framework" {
  interface User {
    metadata?: {
      role?: string
      tenant_store_id?: string
      permissions?: string[]
    }
  }
}

// Also extend the MedusaRequest user property
declare module "@medusajs/framework" {
  interface MedusaRequest {
    user?: {
      customer_id?: string
      userId?: string
      metadata?: {
        role?: string
        tenant_store_id?: string
        permissions?: string[]
      }
    }
  }
}

export {}
