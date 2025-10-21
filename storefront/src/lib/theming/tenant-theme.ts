import { cookies } from "next/headers"

export interface TenantTheme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  logo?: string
  customCSS?: string
}

export interface TenantBranding {
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  font_family?: string
  custom_css?: string
}

/**
 * Get tenant theme from cookies (set by middleware)
 */
export async function getTenantTheme(): Promise<TenantTheme | null> {
  try {
    const cookieStore = await cookies()
    const themeCookie = cookieStore.get("_tenant_theme")
    
    if (!themeCookie) {
      return null
    }

    const theme = JSON.parse(themeCookie.value) as TenantTheme
    return theme
  } catch (error) {
    console.error("Error parsing tenant theme:", error)
    return null
  }
}

/**
 * Get tenant ID from cookies
 */
export async function getTenantId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const tenantIdCookie = cookieStore.get("_tenant_id")
    
    return tenantIdCookie?.value || null
  } catch (error) {
    console.error("Error getting tenant ID:", error)
    return null
  }
}

/**
 * Get tenant store ID from cookies
 */
export async function getTenantStoreId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const storeIdCookie = cookieStore.get("_tenant_store_id")
    
    return storeIdCookie?.value || null
  } catch (error) {
    console.error("Error getting tenant store ID:", error)
    return null
  }
}

/**
 * Get tenant publishable API key from cookies
 */
export async function getTenantPublishableKey(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const keyCookie = cookieStore.get("_tenant_publishable_key")
    
    return keyCookie?.value || null
  } catch (error) {
    console.error("Error getting tenant publishable key:", error)
    return null
  }
}

/**
 * Generate CSS variables from tenant theme
 */
export function generateThemeCSS(theme: TenantTheme): string {
  return `
    :root {
      --tenant-primary: ${theme.primaryColor};
      --tenant-secondary: ${theme.secondaryColor};
      --tenant-font-family: ${theme.fontFamily};
    }
    
    .tenant-primary {
      color: ${theme.primaryColor};
    }
    
    .tenant-primary-bg {
      background-color: ${theme.primaryColor};
    }
    
    .tenant-secondary {
      color: ${theme.secondaryColor};
    }
    
    .tenant-secondary-bg {
      background-color: ${theme.secondaryColor};
    }
    
    .tenant-font {
      font-family: ${theme.fontFamily}, sans-serif;
    }
    
    ${theme.customCSS || ''}
  `
}

/**
 * Generate inline styles for tenant branding
 */
export function generateInlineStyles(theme: TenantTheme): React.CSSProperties {
  return {
    '--tenant-primary': theme.primaryColor,
    '--tenant-secondary': theme.secondaryColor,
    '--tenant-font-family': theme.fontFamily,
  } as React.CSSProperties
}

/**
 * Get default theme (fallback)
 */
export function getDefaultTheme(): TenantTheme {
  return {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af", 
    fontFamily: "Inter",
    logo: undefined,
    customCSS: undefined
  }
}
