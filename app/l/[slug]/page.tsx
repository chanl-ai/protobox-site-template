// Landing pages: one manifest file per landing under content/landings/,
// rendered from the same section registry as everything else.

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SectionStack } from "@/lib/sections/registry"
import { SiteShell } from "@/components/site/SiteShell"
import { getLandingManifest, listLandingSlugs } from "@/lib/content"
import type { LandingManifest } from "@/lib/site"

export async function generateStaticParams() {
  const slugs = await listLandingSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/l/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const landing = await getLandingManifest<LandingManifest>(slug)
  if (!landing) return {}
  return { title: landing.title, description: landing.description }
}

export default async function LandingPage({ params }: PageProps<"/l/[slug]">) {
  const { slug } = await params
  const landing = await getLandingManifest<LandingManifest>(slug)
  if (!landing) {
    notFound()
  }

  // Header CTA points at the form — unless the landing's own nav already does.
  const navCoversForm = (landing.nav ?? []).some((item) =>
    item.href.includes("#contact-form")
  )
  const primaryCta =
    !navCoversForm && landing.sections.some((s) => s.section === "form-contact")
      ? { label: "Book it", href: "#contact-form" }
      : undefined

  return (
    <SiteShell page={landing} nav={landing.nav ?? []} cta={primaryCta}>
      <SectionStack entries={landing.sections} />
    </SiteShell>
  )
}
