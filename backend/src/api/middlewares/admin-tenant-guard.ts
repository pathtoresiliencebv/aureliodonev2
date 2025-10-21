import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export async function adminTenantGuardMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) {
  try {
    // Only apply to admin routes
    if (!req.path.startsWith('/admin')) {
      return next()
    }

    // Skip for super admin users
    if (req.user && req.user.metadata?.role === 'super_admin') {
      return next()
    }

    const tenantContext = req.tenant
    
    if (!tenantContext || !tenantContext.storeId) {
      res.status(403).json({
        error: "Tenant context required",
        message: "This action requires a valid tenant context."
      })
      return
    }

    // Ensure user belongs to this tenant
    if (req.user && req.user.metadata?.tenant_store_id !== tenantContext.storeId) {
      res.status(403).json({
        error: "Access denied",
        message: "You don't have permission to access this tenant's data."
      })
      return
    }

    // Add tenant filter to all database queries
    req.tenantFilter = {
      store_id: tenantContext.storeId,
      sales_channel_id: tenantContext.salesChannelId
    }

    next()
  } catch (error) {
    console.error("Error in admin tenant guard middleware:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Helper function to apply tenant filters to queries
export function applyTenantFilter(query: any, tenantFilter: any) {
  if (!tenantFilter) return query

  // Add store_id filter to all queries
  if (tenantFilter.store_id) {
    query.store_id = tenantFilter.store_id
  }

  // Add sales_channel_id filter for storefront queries
  if (tenantFilter.sales_channel_id) {
    query.sales_channel_id = tenantFilter.sales_channel_id
  }

  return query
}

// Helper function to validate tenant access for specific resources
export async function validateTenantAccess(
  req: MedusaRequest,
  resourceId: string,
  resourceType: 'product' | 'order' | 'customer' | 'collection'
): Promise<boolean> {
  try {
    const tenantContext = req.tenant
    
    if (!tenantContext || !tenantContext.storeId) {
      return false
    }

    // Super admin can access any resource
    if (req.user && req.user.metadata?.role === 'super_admin') {
      return true
    }

    // Check if resource belongs to tenant
    switch (resourceType) {
      case 'product':
        return await validateProductAccess(req, resourceId, tenantContext.storeId)
      case 'order':
        return await validateOrderAccess(req, resourceId, tenantContext.storeId)
      case 'customer':
        return await validateCustomerAccess(req, resourceId, tenantContext.storeId)
      case 'collection':
        return await validateCollectionAccess(req, resourceId, tenantContext.storeId)
      default:
        return false
    }
  } catch (error) {
    console.error("Error validating tenant access:", error)
    return false
  }
}

async function validateProductAccess(req: MedusaRequest, productId: string, storeId: string): Promise<boolean> {
  try {
    const productModuleService = req.scope.resolve(Modules.PRODUCT)
    const product = await productModuleService.retrieveProduct(productId)
    
    // Check if product belongs to tenant's store
    return product.store_id === storeId
  } catch (error) {
    return false
  }
}

async function validateOrderAccess(req: MedusaRequest, orderId: string, storeId: string): Promise<boolean> {
  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER)
    const order = await orderModuleService.retrieveOrder(orderId)
    
    // Check if order belongs to tenant's store
    return order.store_id === storeId
  } catch (error) {
    return false
  }
}

async function validateCustomerAccess(req: MedusaRequest, customerId: string, storeId: string): Promise<boolean> {
  try {
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
    const customer = await customerModuleService.retrieveCustomer(customerId)
    
    // Check if customer belongs to tenant's store
    return customer.store_id === storeId
  } catch (error) {
    return false
  }
}

async function validateCollectionAccess(req: MedusaRequest, collectionId: string, storeId: string): Promise<boolean> {
  try {
    const collectionModuleService = req.scope.resolve(Modules.PRODUCT)
    const collection = await collectionModuleService.retrieveCollection(collectionId)
    
    // Check if collection belongs to tenant's store
    return collection.store_id === storeId
  } catch (error) {
    return false
  }
}
