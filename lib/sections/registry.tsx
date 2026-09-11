// Maps "type/variant" from site.json onto section components, with the
// content blob cast to that type's contract. An unknown key throws, so a
// manifest typo fails the build/render loudly instead of dropping a section.

import type { ReactElement } from "react"
import { getSectionContent, stripSectionRef } from "@/lib/content"
import type { ManifestSectionEntry } from "@/lib/site"
import type {
  AboutFounderContent,
  ContactContent,
  CtaBannerContent,
  FaqContent,
  FeatureGridContent,
  FormContactContent,
  HeroContent,
  LogoCloudContent,
  PricingContent,
  StatsContent,
  TestimonialsContent,
} from "@/lib/sections/types"
import { HeroCentered, HeroSplit } from "@/components/sections/hero"
import { LogoCloudRow, LogoCloudWall } from "@/components/sections/logo-cloud"
import { FeatureGridCards, FeatureGridList } from "@/components/sections/feature-grid"
import { StatsBand, StatsInline } from "@/components/sections/stats"
import { TestimonialsGrid, TestimonialsSingle } from "@/components/sections/testimonials"
import { PricingSingleOffer, PricingTiers } from "@/components/sections/pricing"
import { FaqAccordion, FaqTwoColumn } from "@/components/sections/faq"
import { CtaBannerPanel, CtaBannerStrip } from "@/components/sections/cta-banner"
import { AboutFounderLetter, AboutFounderPortrait } from "@/components/sections/about-founder"
import { ContactSimple, ContactSplit } from "@/components/sections/contact"
import { FormContactCard, FormContactSplit } from "@/components/sections/form-contact"
import { GenericSection } from "@/components/sections/generic"

interface ArrayGuard {
  field: string
  /** Entry fields the component dereferences (cta.href, name.split); entries missing one are skipped. */
  entryRequires?: string[]
  /** Entry-level arrays the component maps unconditionally; missing ones default to []. */
  entryArrays?: string[]
}

interface ContentGuard {
  /** Top-level fields the component dereferences unconditionally (primaryCta.href);
   *  content missing one degrades to GenericSection instead of crashing the page. */
  requires?: string[]
  /** Array fields the component maps unconditionally; missing/non-array defaults to []. */
  arrays?: ArrayGuard[]
}

// Brain-authored content can omit any field a component dereferences without a
// guard. Keyed by section type — both variants of a type share one contract.
const CONTENT_GUARDS: Record<string, ContentGuard> = {
  hero: { requires: ["primaryCta"] },
  "logo-cloud": { arrays: [{ field: "logos", entryRequires: ["name"] }] },
  "feature-grid": { arrays: [{ field: "items" }] },
  stats: { arrays: [{ field: "stats" }] },
  testimonials: { arrays: [{ field: "items", entryRequires: ["name"] }] },
  pricing: { arrays: [{ field: "offers", entryRequires: ["cta"], entryArrays: ["includes"] }] },
  faq: { arrays: [{ field: "items", entryRequires: ["question"] }] },
  "cta-banner": { requires: ["cta"] },
  "about-founder": { requires: ["name"], arrays: [{ field: "paragraphs" }] },
  "form-contact": { arrays: [{ field: "fields", entryRequires: ["name"] }] },
}

/**
 * Enforces the crash-relevant part of a section type's contract before the
 * content blob is cast onto a component: required fields degrade the whole
 * section to GenericSection (null return), missing arrays default to [], and
 * broken array entries are skipped — content never bricks the page, and every
 * degradation warns with the field it hit.
 */
function guardSectionContent(key: string, data: unknown): Record<string, unknown> | null {
  const content =
    typeof data === "object" && data !== null ? { ...(data as Record<string, unknown>) } : {}
  const guard = CONTENT_GUARDS[key.split("/")[0]]
  if (!guard) return content
  for (const field of guard.requires ?? []) {
    if (!content[field]) {
      console.warn(`[sections] ${key}: content.${field} is missing — rendering generically`)
      return null
    }
  }
  for (const spec of guard.arrays ?? []) {
    const raw = content[spec.field]
    if (!Array.isArray(raw)) {
      console.warn(`[sections] ${key}: content.${spec.field} is not an array — defaulting to []`)
      content[spec.field] = []
      continue
    }
    let entries = raw.filter(
      (entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null
    )
    if (spec.entryRequires?.length) {
      const kept = entries.filter((entry) => spec.entryRequires!.every((field) => entry[field]))
      if (kept.length !== entries.length) {
        console.warn(
          `[sections] ${key}: skipped ${entries.length - kept.length} ${spec.field} entries missing ${spec.entryRequires.join("/")}`
        )
      }
      entries = kept
    }
    if (spec.entryArrays?.length) {
      entries = entries.map((entry) => {
        const copy = { ...entry }
        for (const field of spec.entryArrays!) {
          if (!Array.isArray(copy[field])) {
            console.warn(
              `[sections] ${key}: ${spec.field} entry missing ${field} — defaulting to []`
            )
            copy[field] = []
          }
        }
        return copy
      })
    }
    content[spec.field] = entries
  }
  return content
}

function renderSection(
  key: string,
  rawData: unknown,
  reactKey: string
): ReactElement | null {
  const guarded = guardSectionContent(key, rawData)
  if (guarded === null) {
    return (
      <GenericSection key={reactKey} content={(rawData ?? {}) as Record<string, unknown>} />
    )
  }
  const data: unknown = guarded
  switch (key) {
    case "hero/split":
      return <HeroSplit key={reactKey} {...(data as HeroContent)} />
    case "hero/centered":
      return <HeroCentered key={reactKey} {...(data as HeroContent)} />
    case "logo-cloud/row":
      return <LogoCloudRow key={reactKey} {...(data as LogoCloudContent)} />
    case "logo-cloud/wall":
      return <LogoCloudWall key={reactKey} {...(data as LogoCloudContent)} />
    case "feature-grid/cards":
      return <FeatureGridCards key={reactKey} {...(data as FeatureGridContent)} />
    case "feature-grid/list":
      return <FeatureGridList key={reactKey} {...(data as FeatureGridContent)} />
    case "stats/band":
      return <StatsBand key={reactKey} {...(data as StatsContent)} />
    case "stats/inline":
      return <StatsInline key={reactKey} {...(data as StatsContent)} />
    case "testimonials/single":
      return <TestimonialsSingle key={reactKey} {...(data as TestimonialsContent)} />
    case "testimonials/grid":
      return <TestimonialsGrid key={reactKey} {...(data as TestimonialsContent)} />
    case "pricing/single-offer":
      return <PricingSingleOffer key={reactKey} {...(data as PricingContent)} />
    case "pricing/tiers":
      return <PricingTiers key={reactKey} {...(data as PricingContent)} />
    case "faq/accordion":
      return <FaqAccordion key={reactKey} {...(data as FaqContent)} />
    case "faq/two-column":
      return <FaqTwoColumn key={reactKey} {...(data as FaqContent)} />
    case "cta-banner/panel":
      return <CtaBannerPanel key={reactKey} {...(data as CtaBannerContent)} />
    case "cta-banner/strip":
      return <CtaBannerStrip key={reactKey} {...(data as CtaBannerContent)} />
    case "about-founder/portrait":
      return <AboutFounderPortrait key={reactKey} {...(data as AboutFounderContent)} />
    case "about-founder/letter":
      return <AboutFounderLetter key={reactKey} {...(data as AboutFounderContent)} />
    case "contact/split":
      return <ContactSplit key={reactKey} {...(data as ContactContent)} />
    case "contact/simple":
      return <ContactSimple key={reactKey} {...(data as ContactContent)} />
    case "form-contact/card":
      return <FormContactCard key={reactKey} {...(data as FormContactContent)} />
    case "form-contact/split":
      return <FormContactSplit key={reactKey} {...(data as FormContactContent)} />
    default:
      // Brain-authored specs can carry section types the registry doesn't ship.
      // Content never bricks the build AND never disappears: warn, then render
      // the entry's recognizable fields as plain prose (GenericSection).
      console.warn(`[sections] unknown section "${key}" — rendering generically (not in the registry)`)
      return <GenericSection key={reactKey} content={(data ?? {}) as Record<string, unknown>} />
  }
}

/**
 * Renders one page's ordered section stack; content loads in parallel.
 * `entry.content` is a file-mode ref (string) needing a lookup, or a
 * brain-mode section object already inlined on the manifest — no fetch
 * needed, just the ref-strip guard.
 */
export async function SectionStack({
  entries,
}: {
  entries: ManifestSectionEntry[]
}) {
  // A brain-authored page can omit or mistype its sections array; an empty
  // page beats a crashed one.
  if (!Array.isArray(entries)) {
    console.warn("[sections] page has no sections array — rendering nothing")
    return null
  }
  const loaded = await Promise.all(
    entries.map(async (entry, index) => ({
      entry,
      data:
        typeof entry.content === "string"
          ? await getSectionContent<unknown>(entry.content)
          : stripSectionRef<unknown>(entry.content),
      key: typeof entry.content === "string" ? entry.content : `${entry.section}-${entry.variant}-${index}`,
    }))
  )
  return (
    <>
      {loaded.map(({ entry, data, key }) =>
        renderSection(`${entry.section}/${entry.variant}`, data, key)
      )}
    </>
  )
}
