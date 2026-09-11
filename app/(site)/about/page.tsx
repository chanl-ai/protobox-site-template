import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Prose } from "@/components/blocks/Prose"
import { getPage } from "@/lib/content"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about")
  return {
    title: page?.frontmatter.title,
    description: page?.frontmatter.description,
  }
}

export default async function AboutPage() {
  const page = await getPage("about")
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
