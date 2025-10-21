import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

// Tenant cache for performance
const tenantCache = {
  tenants: new Map<string, any>(),
  lastUpdated: Date.now(),
}

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: ["regions"],
      },
    }).then((res) => res.json())

    if (!regions?.length) {
      notFound()
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Resolve tenant from hostname
 */
async function resolveTenant(hostname: string) {
  // Check cache first
  if (tenantCache.tenants.has(hostname)) {
    return tenantCache.tenants.get(hostname)
  }

  try {
    const response = await fetch(`${BACKEND_URL}/store/tenant?domain=${hostname}`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: ["tenant"],
      },
    })

    if (!response.ok) {
      return null
    }

    const tenant = await response.json()
    
    // Cache the tenant
    tenantCache.tenants.set(hostname, tenant)
    tenantCache.lastUpdated = Date.now()
    
    return tenant
  } catch (error) {
    console.error("Error resolving tenant:", error)
    return null
  }
}

/**
 * Middleware to handle tenant resolution, region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding") === "true"
  const cartId = searchParams.get("cart_id")
  const checkoutStep = searchParams.get("step")
  const onboardingCookie = request.cookies.get("_medusa_onboarding")
  const cartIdCookie = request.cookies.get("_medusa_cart_id")

  // Resolve tenant from hostname
  const tenant = await resolveTenant(hostname)
  
  // If no tenant found, this might be the main SaaS site
  if (!tenant) {
    // Redirect to main SaaS site or show 404
    if (hostname.includes('yourdomain.com') && !hostname.startsWith('www.')) {
      return NextResponse.redirect(`https://www.yourdomain.com${request.nextUrl.pathname}`)
    }
    return NextResponse.next()
  }

  // Check if tenant is active
  if (tenant.status !== 'active') {
    return new NextResponse("Store is not available", { status: 403 })
  }

  const regionMap = await getRegionMap()
  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

  // check if one of the country codes is in the url
  if (
    urlHasCountryCode &&
    (!isOnboarding || onboardingCookie) &&
    (!cartId || cartIdCookie)
  ) {
    // Set tenant cookies and continue
    const response = NextResponse.next()
    response.cookies.set("_tenant_id", tenant.id, { maxAge: 60 * 60 * 24 })
    response.cookies.set("_tenant_store_id", tenant.id, { maxAge: 60 * 60 * 24 })
    response.cookies.set("_tenant_publishable_key", tenant.publishableKey, { maxAge: 60 * 60 * 24 })
    return response
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  // If a cart_id is in the params, we set it as a cookie and redirect to the address step.
  if (cartId && !checkoutStep) {
    redirectUrl = `${redirectUrl}&step=address`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
    response.cookies.set("_medusa_cart_id", cartId, { maxAge: 60 * 60 * 24 })
  }

  // Set a cookie to indicate that we're onboarding. This is used to show the onboarding flow.
  if (isOnboarding) {
    response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })
  }

  // Set tenant cookies
  response.cookies.set("_tenant_id", tenant.id, { maxAge: 60 * 60 * 24 })
  response.cookies.set("_tenant_store_id", tenant.id, { maxAge: 60 * 60 * 24 })
  response.cookies.set("_tenant_publishable_key", tenant.publishableKey, { maxAge: 60 * 60 * 24 })
  response.cookies.set("_tenant_theme", JSON.stringify(tenant.theme), { maxAge: 60 * 60 * 24 })

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|.*\\.png|.*\\.jpg|.*\\.gif|.*\\.svg).*)"], // prevents redirecting on static files
}
