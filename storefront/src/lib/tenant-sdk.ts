import { getTenantPublishableKey, getTenantStoreId } from "@lib/theming/tenant-theme"
import { Medusa } from "@medusajs/js-sdk"

let tenantSDK: Medusa | null = null

export async function getTenantSDK(): Promise<Medusa> {
  if (tenantSDK) {
    return tenantSDK
  }

  const publishableKey = await getTenantPublishableKey()
  const storeId = await getTenantStoreId()

  if (!publishableKey) {
    throw new Error("No tenant publishable key found")
  }

  tenantSDK = new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
    publishableKey,
    storeId,
  })

  return tenantSDK
}

export function clearTenantSDK() {
  tenantSDK = null
}
