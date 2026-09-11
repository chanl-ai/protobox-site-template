// site.json is the whole site description: theme, chrome variants, and per
// page an ordered section stack. Static import so a malformed manifest fails
// the build, not a request.

import manifest from "@/site.json"
import { siteConfig } from "@/lib/site-config"
import type { ThemeMode } from "@/lib/theme"
import { getBrainSingle } from "@/lib/brain"

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
  pages: Record<string, PageManifest>
}

export function getSiteManifest(): SiteManifest {
  return manifest as SiteManifest
}

export function getPageManifest(slug: string): PageManifest {
  const page = getSiteManifest().pages[slug]
  if (!page) {
    throw new Error(`site.json has no page "${slug}"`)
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

export interface BrainSiteConfig {
  name?: string
  nav?: { label: string; href: string }[]
}

/**
 * Site identity + nav from the brain's "site-config" category (single JSON
 * entry). Returns null when the brain is disabled or has no entry, so
 * callers fall back to siteConfig + pages-derived nav.
 */
export async function getBrainSiteConfig(): Promise<BrainSiteConfig | null> {
  const item = await getBrainSingle("site-config")
  if (!item) return null
  try {
    return JSON.parse(item.content) as BrainSiteConfig
  } catch {
    return null
  }
}
