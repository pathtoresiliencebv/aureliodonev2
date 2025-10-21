import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { updateTenantPlanWorkflow } from "../../../../workflows/update-tenant-plan"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const storeModuleService = req.scope.resolve(Modules.STORE)
    
    const store = await storeModuleService.retrieveStore(id)
    
    if (!store) {
      res.status(404).json({ error: "Tenant not found" })
      return
    }

    // Return tenant details
    res.json({
      id: store.id,
      name: store.name,
      subdomain: store.metadata.subdomain,
      plan: store.metadata.plan,
      limits: store.metadata.limits,
      usage: store.metadata.usage,
      status: store.metadata.status,
      ownerEmail: store.metadata.owner_email,
      createdAt: store.created_at,
      updatedAt: store.updated_at
    })

  } catch (error) {
    console.error("Error retrieving tenant:", error)
    res.status(500).json({
      error: "Failed to retrieve tenant",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const { plan, customDomain, branding } = req.body as {
      plan?: string
      customDomain?: string
      branding?: any
    }

    const storeModuleService = req.scope.resolve(Modules.STORE)
    const store = await storeModuleService.retrieveStore(id)

    if (!store) {
      res.status(404).json({ error: "Tenant not found" })
      return
    }

    // Handle plan updates
    if (plan && plan !== store.metadata.plan) {
      const { result } = await updateTenantPlanWorkflow(req.scope)
        .run({
          input: {
            storeId: id,
            newPlan: plan,
            currentPlan: store.metadata.plan
          }
        })

      res.json({
        success: true,
        tenant: {
          id: result.store.id,
          plan: result.store.metadata.plan,
          limits: result.limits
        }
      })
      return
    }

    // Handle other updates
    const updateData: any = {}
    
    if (customDomain) {
      updateData.metadata = {
        ...store.metadata,
        custom_domain: customDomain
      }
    }

    if (branding) {
      updateData.metadata = {
        ...store.metadata,
        branding: {
          ...store.metadata.branding,
          ...branding
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      const updatedStore = await storeModuleService.updateStores(id, updateData)
      
      res.json({
        success: true,
        tenant: {
          id: updatedStore.id,
          ...updateData.metadata
        }
      })
    } else {
      res.json({ success: true, message: "No changes to update" })
    }

  } catch (error) {
    console.error("Error updating tenant:", error)
    res.status(500).json({
      error: "Failed to update tenant",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const storeModuleService = req.scope.resolve(Modules.STORE)
    
    const store = await storeModuleService.retrieveStore(id)
    
    if (!store) {
      res.status(404).json({ error: "Tenant not found" })
      return
    }

    // Deactivate tenant instead of deleting
    await storeModuleService.updateStores(id, {
      metadata: {
        ...store.metadata,
        status: "suspended",
        deactivated_at: new Date().toISOString()
      }
    })

    res.json({
      success: true,
      message: "Tenant deactivated successfully"
    })

  } catch (error) {
    console.error("Error deactivating tenant:", error)
    res.status(500).json({
      error: "Failed to deactivate tenant",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
