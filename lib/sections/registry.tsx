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

function renderSection(
  key: string,
  data: unknown,
  reactKey: string
): ReactElement {
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
      throw new Error(`Unknown section "${key}" in site.json`)
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
