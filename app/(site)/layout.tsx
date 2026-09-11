// Chrome for the primary site: header/footer variants, brand, and nav all
// come from the resolved manifest (brain "site-config" item or file
// site.json). demo-b and /blocks carry their own chrome.

import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site/headers"
import { SiteFooter } from "@/components/site/footers"
import { listPages } from "@/lib/content"
import { getDefaultBrand, resolveSiteManifest } from "@/lib/site"
import { siteConfig } from "@/lib/site-config"

export const revalidate = 60

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [manifest, pages] = await Promise.all([resolveSiteManifest(), listPages()])
  const brand = manifest.brand ?? getDefaultBrand()
  const nav =
    manifest.nav ?? [
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
        cta={manifest.cta ?? (manifest.source === "brain" ? undefined : siteConfig.headerCta)}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter variant={manifest.footer.variant} brand={brand} nav={nav} />
    </>
  )
}
