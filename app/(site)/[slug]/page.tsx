// Every non-home page in the resolved manifest renders here: a brain-authored
// spec can declare any set of pages, so routes come from the spec, not from a
// hardcoded directory per page. Fallback order: spec page (section stack) →
// file prose page (content/pages/<slug>.md) → 404. A spec page shadows the
// file page of the same slug, so brain content always wins over demo content.

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Prose } from "@/components/blocks/Prose"
import { SectionStack } from "@/lib/sections/registry"
import { getPage } from "@/lib/content"
import { resolveSiteManifest } from "@/lib/site"

export const revalidate = 60

const RESERVED = new Set(["home", "demo-b"])

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const manifest = await resolveSiteManifest()
  const specPage = RESERVED.has(slug) ? undefined : manifest.pages[slug]
  if (specPage?.meta) {
    return { title: specPage.meta.title, description: specPage.meta.description }
  }
  const page = await getPage(slug)
  if (!page) return {}
  return { title: page.frontmatter.title, description: page.frontmatter.description }
}

export default async function ManifestPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (RESERVED.has(slug)) {
    notFound()
  }

  const manifest = await resolveSiteManifest()
  const specPage = manifest.pages[slug]
  if (specPage) {
    if (specPage.meta?.status && specPage.meta.status !== "published") {
      notFound()
    }
    return <SectionStack entries={specPage.sections} />
  }
  if (manifest.source === "brain") {
    // The brain spec defines the whole site; a slug it doesn't declare must
    // 404, never serve the template's demo prose under the user's brand.
    notFound()
  }

  const page = await getPage(slug)
  if (!page) {
    notFound()
  }
  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-heading text-3xl font-medium">{page.frontmatter.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{page.frontmatter.description}</p>
        <div className="mt-10">
          <Prose html={page.contentHtml} />
        </div>
      </div>
    </section>
  )
}
