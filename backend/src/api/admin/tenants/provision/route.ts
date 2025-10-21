import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { provisionTenantWorkflow } from "../../../workflows/provision-tenant"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { email, password, storeName, subdomain, plan } = req.body

    // Validate required fields
    if (!email || !password || !storeName || !subdomain || !plan) {
      res.status(400).json({
        error: "Missing required fields: email, password, storeName, subdomain, plan"
      })
      return
    }

    // Validate plan
    const validPlans = ['starter', 'pro', 'enterprise']
    if (!validPlans.includes(plan)) {
      res.status(400).json({
        error: "Invalid plan. Must be one of: starter, pro, enterprise"
      })
      return
    }

    // Check if subdomain is available
    const isSubdomainAvailable = await checkSubdomainAvailability(subdomain)
    if (!isSubdomainAvailable) {
      res.status(400).json({
        error: "Subdomain is already taken"
      })
      return
    }

    // Execute tenant provisioning workflow
    const { result } = await provisionTenantWorkflow(req.scope)
      .run({
        input: {
          email,
          password,
          storeName,
          subdomain,
          plan
        }
      })

    // Return success response
    res.json({
      success: true,
      tenant: {
        id: result.store.id,
        name: result.store.name,
        subdomain: result.store.metadata.subdomain,
        plan: result.store.metadata.plan,
        adminUrl: `https://${subdomain}.yourdomain.com/admin`,
        storefrontUrl: `https://${subdomain}.yourdomain.com`,
        publishableKey: result.publishableKey,
        status: "active"
      }
    })

  } catch (error) {
    console.error("Tenant provisioning error:", error)
    res.status(500).json({
      error: "Failed to provision tenant",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

async function checkSubdomainAvailability(subdomain: string): Promise<boolean> {
  // This would check against existing stores in the database
  // For now, we'll simulate the check
  const reservedSubdomains = ['www', 'admin', 'api', 'app', 'mail', 'ftp']
  
  if (reservedSubdomains.includes(subdomain.toLowerCase())) {
    return false
  }

  // In a real implementation, you would query the database:
  // const existingStore = await storeModuleService.listStores({
  //   metadata: { subdomain }
  // })
  // return existingStore.length === 0

  return true
}
