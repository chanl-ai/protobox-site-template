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
  /** Brain-authored pages: anything but "published" never renders publicly. */
  status?: "draft" | "published"
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

export interface SiteCta {
  label: string
  href: string
}

export interface SiteManifest {
  theme: string
  mode: ThemeMode
  header: { variant: HeaderVariant }
  footer: { variant: FooterVariant }
  brand?: SiteBrand
  nav?: { label: string; href: string }[]
  cta?: SiteCta
  /** Where the resolved manifest came from. Brain-driven sites must never
   *  fall back to file-mode demo pages or the demo CTA. */
  source?: "brain" | "file"
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
        if (parsed?.pages) {
          // A brain-authored spec states only what its author decided. Omitted
          // STRUCTURAL fields (theme, mode, header, footer) inherit the
          // template default so partial specs render instead of crashing —
          // but IDENTITY fields (brand, nav, cta) never do: the file manifest
          // describes the template's demo business, and its name, links, or
          // call-to-action surfacing on a user's site is contamination, not a
          // fallback. A spec with no brand gets one derived from its own home
          // page title.
          const { brand: _demoBrand, nav: _demoNav, cta: _demoCta, ...structural } = getSiteManifest()
          const resolved: SiteManifest = { ...structural, ...parsed, pages: parsed.pages, source: "brain" }
          if (!resolved.brand) {
            const homeTitle = parsed.pages.home?.meta?.title ?? ""
            const name = homeTitle.split(/\s+[—·|–]\s+/)[0]?.trim() || "Untitled site"
            console.warn(
              `[brain] site-spec has no "brand" block — deriving brand name "${name}" from the home page title. Add a brand block ({ name, shortName, email }) to the site-spec for a real identity.`
            )
            resolved.brand = { name, shortName: name, email: "" }
          } else {
            // Authors write partial brand blocks ({ name } alone is common);
            // BrandMark and the footer read shortName/email unconditionally.
            resolved.brand = {
              ...resolved.brand,
              shortName: resolved.brand.shortName ?? resolved.brand.name,
              email: resolved.brand.email ?? "",
            }
          }
          if (!resolved.nav) {
            // Nav derives from the spec's own pages — never from the file
            // manifest's demo pages.
            resolved.nav = Object.keys(parsed.pages)
              .filter((slug) => slug !== "home")
              .map((slug) => ({
                label: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
                href: `/${slug}`,
              }))
            resolved.nav.push({ label: "Blog", href: "/blog" })
          }
          return resolved
        }
        console.warn('[brain] site-spec item content has no "pages"; falling back to file site.json')
      } catch {
        console.warn('[brain] site-spec item content is not valid JSON; falling back to file site.json')
      }
    }
  }
  return { ...getSiteManifest(), source: "file" }
}

export function getPageManifest(siteManifest: SiteManifest, slug: string): PageManifest {
  const page = siteManifest.pages[slug]
  if (!page) {
    throw new Error(`site manifest has no page "${slug}"`)
  }
  // A brain-authored page carries meta.status; anything not "published" must never
  // render publicly. File-mode manifests predate the field and stay unaffected.
  if (page.meta?.status && page.meta.status !== "published") {
    throw new Error(`site manifest page "${slug}" is not published (status: ${page.meta.status})`)
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
