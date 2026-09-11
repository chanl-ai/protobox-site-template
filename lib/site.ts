// site.json is the whole site description: theme, chrome variants, and per
// page an ordered section stack. Static import so a malformed manifest fails
// the build, not a request.

import manifest from "@/site.json"
import { siteConfig } from "@/lib/site-config"
import type { ThemeMode } from "@/lib/theme"
import { brainEnabled, getBrainSingle } from "@/lib/brain"

export type HeaderVariant = "minimal" | "center" | "pill"
export type FooterVariant = "slim" | "columns" | "big-brand"

export interface ManifestSectionEntry {
  section: string
  variant: string
  content: string
}

export interface SiteBrand {
  name: string
  shortName: string
  email: string
  tagline?: string
}

export interface PageManifest {
  theme?: string
  mode?: ThemeMode
  header?: { variant: HeaderVariant }
  footer?: { variant: FooterVariant }
  brand?: SiteBrand
  sections: ManifestSectionEntry[]
}

/**
 * A landing manifest is a standalone page description: its own slug (the
 * filename under content/landings/), section stack, chrome, and optional
 * theme override. Served at /l/<slug>.
 */
export interface LandingManifest extends PageManifest {
  title: string
  description: string
  nav?: { label: string; href: string }[]
}

export interface SiteManifest {
  theme: string
  mode: ThemeMode
  header: { variant: HeaderVariant }
  footer: { variant: FooterVariant }
  brand?: SiteBrand
  nav?: { label: string; href: string }[]
  pages: Record<string, PageManifest>
}

/** The file-mode manifest — site.json, unconditionally. */
export function getSiteManifest(): SiteManifest {
  return manifest as SiteManifest
}

/**
 * The manifest that actually drives the request: the brain's single
 * published "site-config" item (its content IS the full site.json shape —
 * theme, mode, chrome, brand, nav, and every page's section stack) when the
 * brain is enabled and has one, else the file manifest. Falls back loudly
 * (console.warn) rather than silently when the brain is enabled but the
 * entry is missing or malformed, since a bad seed here means every page on
 * the site loses its content, not just one section.
 */
export async function resolveSiteManifest(): Promise<SiteManifest> {
  if (brainEnabled()) {
    const item = await getBrainSingle("site-config", "published")
    if (!item) {
      console.warn('[brain] no published "site-config" item found; falling back to file site.json')
    } else {
      try {
        const parsed = JSON.parse(item.content) as SiteManifest
        if (parsed?.pages) return parsed
        console.warn('[brain] "site-config" item content has no "pages"; falling back to file site.json')
      } catch {
        console.warn('[brain] "site-config" item content is not valid JSON; falling back to file site.json')
      }
    }
  }
  return getSiteManifest()
}

export function getPageManifest(siteManifest: SiteManifest, slug: string): PageManifest {
  const page = siteManifest.pages[slug]
  if (!page) {
    throw new Error(`site manifest has no page "${slug}"`)
  }
  return page
}

export function getDefaultBrand(): SiteBrand {
  return {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    email: siteConfig.email,
    tagline: siteConfig.description,
  }
}
