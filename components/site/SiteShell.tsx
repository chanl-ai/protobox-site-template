// Scoped site shell: applies a theme (as inherited CSS custom properties on
// the wrapper, not :root) plus header/footer chrome. Used by any page whose
// manifest overrides the site defaults — demo sites and landing pages.

import type { ReactNode } from "react"
import { SiteHeader, type NavItem } from "@/components/site/headers"
import { SiteFooter } from "@/components/site/footers"
import { getTheme } from "@/lib/themes"
import { themeToCssVars } from "@/lib/theme"
import {
  getDefaultBrand,
  getSiteManifest,
  type PageManifest,
  type SiteBrand,
} from "@/lib/site"
import type { Cta } from "@/lib/sections/types"

export function SiteShell({
  page,
  nav,
  cta,
  children,
}: {
  page: Pick<PageManifest, "theme" | "mode" | "header" | "footer" | "brand">
  nav: NavItem[]
  cta?: Cta
  children: ReactNode
}) {
  const site = getSiteManifest()
  const theme = getTheme(page.theme ?? site.theme)
  const mode = page.mode ?? site.mode
  const brand: SiteBrand = page.brand ?? getDefaultBrand()

  return (
    <div
      style={themeToCssVars(theme, mode)}
      className={`flex min-h-screen flex-col bg-background text-foreground ${
        mode === "dark" ? "dark" : ""
      }`}
    >
      <SiteHeader
        variant={page.header?.variant ?? site.header.variant}
        brand={brand}
        nav={nav}
        cta={cta}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        variant={page.footer?.variant ?? site.footer.variant}
        brand={brand}
        nav={nav}
      />
    </div>
  )
}
