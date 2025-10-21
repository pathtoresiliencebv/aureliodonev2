import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export async function usageLimitsMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) {
  try {
    const tenantContext = req.tenant
    
    if (!tenantContext || !tenantContext.storeId) {
      return next()
    }

    const storeModuleService = req.scope.resolve(Modules.STORE)
    const store = await storeModuleService.retrieveStore(tenantContext.storeId)
    
    if (!store || !store.metadata) {
      return next()
    }

    const limits = store.metadata.limits
    const usage = store.metadata.usage || { products: 0, orders: 0, storage_mb: 0 }
    const plan = store.metadata.plan

    // Check if tenant is active
    if (store.metadata.status !== 'active') {
      res.status(403).json({
        error: "Tenant is not active",
        message: "Your account has been suspended. Please contact support."
      })
      return
    }

    // Check product limits for product creation
    if (req.method === 'POST' && req.path.includes('/products')) {
      if (limits.products !== -1 && usage.products >= limits.products) {
        res.status(403).json({
          error: "Product limit exceeded",
          message: `You have reached your limit of ${limits.products} products. Please upgrade your plan.`,
          currentUsage: usage.products,
          limit: limits.products,
          plan: plan
        })
        return
      }
    }

    // Check order limits for order creation
    if (req.method === 'POST' && req.path.includes('/orders')) {
      if (limits.orders !== -1 && usage.orders >= limits.orders) {
        res.status(403).json({
          error: "Order limit exceeded",
          message: `You have reached your limit of ${limits.orders} orders per month. Please upgrade your plan.`,
          currentUsage: usage.orders,
          limit: limits.orders,
          plan: plan
        })
        return
      }
    }

    // Check storage limits for file uploads
    if (req.method === 'POST' && req.path.includes('/uploads')) {
      const fileSize = req.headers['content-length'] ? parseInt(req.headers['content-length']) : 0
      const fileSizeMB = fileSize / (1024 * 1024)
      
      if (limits.storage_mb !== -1 && (usage.storage_mb + fileSizeMB) > limits.storage_mb) {
        res.status(403).json({
          error: "Storage limit exceeded",
          message: `Uploading this file would exceed your storage limit of ${limits.storage_mb}MB. Please upgrade your plan.`,
          currentUsage: usage.storage_mb,
          limit: limits.storage_mb,
          plan: plan
        })
        return
      }
    }

    // Add usage tracking for successful operations
    req.usageTracking = {
      incrementProducts: req.method === 'POST' && req.path.includes('/products'),
      incrementOrders: req.method === 'POST' && req.path.includes('/orders'),
      incrementStorage: req.method === 'POST' && req.path.includes('/uploads')
    }

    next()
  } catch (error) {
    console.error("Error in usage limits middleware:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Middleware to track usage after successful operations
export async function trackUsageMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) {
  const originalSend = res.send
  
  res.send = function(data: any) {
    // Only track usage for successful responses
    if (res.statusCode >= 200 && res.statusCode < 300 && req.usageTracking) {
      trackUsage(req, req.usageTracking)
    }
    
    return originalSend.call(this, data)
  }
  
  next()
}

async function trackUsage(req: MedusaRequest, tracking: any) {
  try {
    const tenantContext = req.tenant
    
    if (!tenantContext || !tenantContext.storeId) {
      return
    }

    const storeModuleService = req.scope.resolve(Modules.STORE)
    const store = await storeModuleService.retrieveStore(tenantContext.storeId)
    
    if (!store || !store.metadata) {
      return
    }

    const usage = store.metadata.usage || { products: 0, orders: 0, storage_mb: 0 }
    let updatedUsage = { ...usage }

    // Increment usage based on operation
    if (tracking.incrementProducts) {
      updatedUsage.products = (updatedUsage.products || 0) + 1
    }
    
    if (tracking.incrementOrders) {
      updatedUsage.orders = (updatedUsage.orders || 0) + 1
    }
    
    if (tracking.incrementStorage) {
      const fileSize = req.headers['content-length'] ? parseInt(req.headers['content-length']) : 0
      const fileSizeMB = fileSize / (1024 * 1024)
      updatedUsage.storage_mb = (updatedUsage.storage_mb || 0) + fileSizeMB
    }

    // Update store with new usage
    await storeModuleService.updateStores(tenantContext.storeId, {
      metadata: {
        ...store.metadata,
        usage: updatedUsage,
        last_usage_update: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error tracking usage:", error)
  }
}
