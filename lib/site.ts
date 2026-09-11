// site.json is the whole site description: theme, chrome variants, and per
// page an ordered section stack. Static import so a malformed manifest fails
// the build, not a request.

import manifest from "@/site.json"
import { siteConfig } from "@/lib/site-config"
import type { ThemeMode } from "@/lib/theme"
import { brainEnabled, listBrainFolder, isManifestContent } from "@/lib/brain"

export type HeaderVariant = "minimal" | "center" | "pill"
export type FooterVariant = "slim" | "columns" | "big-brand"

/**
 * `content` is a file-mode ref ("home/hero", resolved against
 * content/sections/) in file mode, or the section's contract object
 * directly in brain mode — the site-spec doc inlines every section's
 * content, so there is nothing left to fetch per-ref.
 */
export interface ManifestSectionEntry {
  section: string
  variant: string
  content: string | Record<string, unknown>
}

export interface SiteBrand {
  name: string
  shortName: string
  email: string
  tagline?: string
}

export interface PageMeta {
  title: string
  description: string
  og?: Record<string, unknown>
}

export interface PageManifest {
  theme?: string
  mode?: ThemeMode
  header?: { variant: HeaderVariant }
  footer?: { variant: FooterVariant }
  brand?: SiteBrand
  meta?: PageMeta
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
 * The manifest that actually drives the request: the single site-spec
 * knowledge item filed in folder "site" (its content IS the full site.json
 * shape — theme, mode, chrome, brand, nav, and every page's section stack
 * with each section's content inlined) when the brain is enabled and has
 * one, else the file manifest. Folder "site" also holds the "about" prose
 * page, so every published item there is scanned for the one whose content
 * is the manifest JSON rather than assuming the first result. Falls back
 * loudly (console.warn naming what was missing) rather than silently when
 * the brain is enabled but the entry is missing or malformed, since a bad
 * seed here means every page on the site loses its content, not just one
 * section.
 */
export async function resolveSiteManifest(): Promise<SiteManifest> {
  if (brainEnabled()) {
    const items = await listBrainFolder("site", "published")
    const specItem = items.find((item) => isManifestContent(item.content))
    if (!specItem) {
      console.warn(
        '[brain] no published site-spec item (JSON with a "pages" key) found in folder "site"; falling back to file site.json'
      )
    } else {
      try {
        const parsed = JSON.parse(specItem.content) as SiteManifest
        if (parsed?.pages) return parsed
        console.warn('[brain] site-spec item content has no "pages"; falling back to file site.json')
      } catch {
        console.warn('[brain] site-spec item content is not valid JSON; falling back to file site.json')
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
