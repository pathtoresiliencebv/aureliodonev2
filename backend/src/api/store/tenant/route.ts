import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { domain } = req.query
    
    if (!domain || typeof domain !== 'string') {
      res.status(400).json({ error: "Domain parameter is required" })
      return
    }

    const storeModuleService = req.scope.resolve(Modules.STORE)
    
    // Extract subdomain or check for custom domain
    let tenantStore = null
    
    // Check if it's a subdomain (e.g., tenant1.yourdomain.com)
    if (domain.includes('.')) {
      const subdomain = domain.split('.')[0]
      
      // Find store by subdomain
    const stores = await storeModuleService.listStores({
      // Note: metadata filtering may need to be done via RemoteQuery
      // For now, we'll get all stores and filter manually
    })
    
    // Filter stores by subdomain in metadata
    const matchingStores = stores.filter(store => 
      store.metadata?.subdomain === subdomain
    )
      
      if (matchingStores.length > 0) {
        tenantStore = matchingStores[0]
      }
    } else {
      // Check for custom domain
      const stores = await storeModuleService.listStores({
        // Note: metadata filtering may need to be done via RemoteQuery
        // For now, we'll get all stores and filter manually
      })
      
      // Filter stores by custom_domain in metadata
      const matchingStores = stores.filter(store => 
        store.metadata?.custom_domain === domain
      )
      
      if (matchingStores.length > 0) {
        tenantStore = matchingStores[0]
      }
    }

    if (!tenantStore) {
      res.status(404).json({ error: "Tenant not found" })
      return
    }

    // Check if tenant is active
    if (tenantStore.metadata.status !== 'active') {
      res.status(403).json({ error: "Tenant is not active" })
      return
    }

    // Return tenant configuration for storefront
    res.json({
      id: tenantStore.id,
      name: tenantStore.name,
      subdomain: tenantStore.metadata.subdomain,
      customDomain: tenantStore.metadata.custom_domain,
      branding: tenantStore.metadata.branding || {
        logo_url: null,
        primary_color: "#3b82f6",
        secondary_color: "#1e40af",
        font_family: "Inter",
        custom_css: null
      },
      theme: {
        primaryColor: tenantStore.metadata.branding?.primary_color || "#3b82f6",
        secondaryColor: tenantStore.metadata.branding?.secondary_color || "#1e40af",
        fontFamily: tenantStore.metadata.branding?.font_family || "Inter",
        logo: tenantStore.metadata.branding?.logo_url,
        customCSS: tenantStore.metadata.branding?.custom_css
      },
      limits: tenantStore.metadata.limits,
      usage: tenantStore.metadata.usage,
      plan: tenantStore.metadata.plan,
      status: tenantStore.metadata.status
    })

  } catch (error) {
    console.error("Error retrieving tenant config:", error)
    res.status(500).json({
      error: "Failed to retrieve tenant configuration",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
