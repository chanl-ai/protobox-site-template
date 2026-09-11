// Chrome for the primary site: header/footer variants come from site.json,
// nav from the published pages. demo-b and /blocks carry their own chrome.

import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site/headers"
import { SiteFooter } from "@/components/site/footers"
import { listPages } from "@/lib/content"
import { getBrainSiteConfig, getDefaultBrand, getSiteManifest } from "@/lib/site"
import { siteConfig } from "@/lib/site-config"
import { brainEnabled } from "@/lib/brain"

export const revalidate = 60

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const manifest = getSiteManifest()
  const brand = getDefaultBrand()
  const [pages, brainConfig] = await Promise.all([
    listPages(),
    brainEnabled() ? getBrainSiteConfig() : Promise.resolve(null),
  ])
  if (brainConfig?.name) {
    brand.name = brainConfig.name
  }
  const nav =
    brainConfig?.nav ?? [
      ...pages
        .filter((page) => page.slug !== "home")
        .map((page) => ({ label: page.frontmatter.title, href: `/${page.slug}` })),
      { label: "Notes", href: "/blog" },
    ]

  return (
    <>
      <SiteHeader
        variant={manifest.header.variant}
        brand={brand}
        nav={nav}
        cta={siteConfig.headerCta}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter variant={manifest.footer.variant} brand={brand} nav={nav} />
    </>
  )
}
