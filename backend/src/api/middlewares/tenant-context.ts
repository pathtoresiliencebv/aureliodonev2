import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export async function tenantContextMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) {
  try {
    let tenantId: string | null = null
    let storeId: string | null = null
    let salesChannelId: string | null = null

    // Method 1: Extract from publishable API key header
    const publishableKey = req.headers["x-publishable-api-key"] as string
    if (publishableKey) {
      const apiKeyModuleService = req.scope.resolve(Modules.API_KEY)
      
      try {
        const apiKeys = await apiKeyModuleService.listApiKeys({
          token: publishableKey
        })
        if (apiKeys.length > 0) {
          // Note: metadata may not exist on ApiKeyDTO in Medusa v2
          // This might need to be handled differently
          tenantId = apiKeys[0].id // Placeholder - needs proper implementation
          storeId = apiKeys[0].id // Placeholder - needs proper implementation
        }
      } catch (error) {
        console.error("Error retrieving API key:", error)
      }
    }

    // Method 2: Extract from JWT token (for admin users)
    if (!tenantId && req.user) {
      const userMetadata = req.user.metadata || {}
      if (userMetadata.tenant_store_id) {
        tenantId = userMetadata.tenant_store_id
        storeId = userMetadata.tenant_store_id
      }
    }

    // Method 3: Extract from custom header
    if (!tenantId) {
      tenantId = req.headers["x-tenant-id"] as string
      storeId = tenantId
    }

    // Method 4: Extract from domain/subdomain (for storefront)
    if (!tenantId && req.headers.host) {
      const host = req.headers.host as string
      const subdomain = extractSubdomainFromHost(host)
      
      if (subdomain) {
        const storeModuleService = req.scope.resolve(Modules.STORE)
        
        try {
          const stores = await storeModuleService.listStores({
            // Note: metadata filtering may need to be done via RemoteQuery
            // For now, we'll get all stores and filter manually
          })
          
          // Filter stores by subdomain in metadata
          const matchingStores = stores.filter(store => 
            store.metadata?.subdomain === subdomain
          )
          
          if (matchingStores.length > 0) {
            const store = matchingStores[0]
            tenantId = store.id
            storeId = store.id
            salesChannelId = store.metadata.sales_channel_id
          }
        } catch (error) {
          console.error("Error finding store by subdomain:", error)
        }
      }
    }

    // If we found a tenant, get the sales channel
    if (tenantId && !salesChannelId) {
      const salesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL)
      
      try {
        const salesChannels = await salesChannelModuleService.listSalesChannels({
          // Note: metadata filtering may need to be done via RemoteQuery
          // For now, we'll get all sales channels and filter manually
        })
        
        // Filter sales channels by tenant_store_id in metadata
        const matchingSalesChannels = salesChannels.filter(channel => 
          channel.metadata?.tenant_store_id === tenantId
        )
        
        if (matchingSalesChannels.length > 0) {
          salesChannelId = matchingSalesChannels[0].id
        }
      } catch (error) {
        console.error("Error finding sales channel:", error)
      }
    }

    // Inject tenant context into request
    req.tenant = {
      id: tenantId,
      storeId,
      salesChannelId,
      isAdmin: !!req.user,
      isStorefront: !req.user && !!tenantId
    }

    // Add tenant context to scope for easy access in services
    // Note: scope.register may not be the correct method for Medusa v2
    // This might need to be handled differently

    next()
  } catch (error) {
    console.error("Error in tenant context middleware:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

function extractSubdomainFromHost(host: string): string | null {
  // Remove port if present
  const hostname = host.split(':')[0]
  
  // Check if it's a subdomain (has more than one dot)
  const parts = hostname.split('.')
  
  if (parts.length > 2) {
    // Extract subdomain (first part)
    return parts[0]
  }
  
  return null
}

// Helper function to get tenant context from request
export function getTenantContext(req: MedusaRequest) {
  return req.tenant || null
}

// Helper function to check if user has access to tenant
export function hasTenantAccess(req: MedusaRequest, tenantId: string): boolean {
  const tenantContext = getTenantContext(req)
  
  if (!tenantContext) return false
  
  // Admin users can access any tenant (for SaaS management)
  if (req.user && req.user.metadata?.role === 'super_admin') {
    return true
  }
  
  // Regular users can only access their own tenant
  return tenantContext.id === tenantId
}
