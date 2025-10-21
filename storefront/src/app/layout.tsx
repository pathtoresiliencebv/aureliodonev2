import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { getTenantTheme, generateThemeCSS, getDefaultTheme } from "@lib/theming/tenant-theme"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  // Get tenant theme from middleware cookies
  const tenantTheme = await getTenantTheme()
  const theme = tenantTheme || getDefaultTheme()
  
  // Generate CSS for tenant theming
  const themeCSS = generateThemeCSS(theme)

  return (
    <html lang="en" data-mode="light" style={{
      '--tenant-primary': theme.primaryColor,
      '--tenant-secondary': theme.secondaryColor,
      '--tenant-font-family': theme.fontFamily,
    } as React.CSSProperties}>
      <head>
        {theme.logo && (
          <link rel="icon" href={theme.logo} />
        )}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="tenant-font">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
