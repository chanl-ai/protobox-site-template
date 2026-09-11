import type { Metadata } from "next"
import { BlogIndex } from "@/components/blocks/BlogIndex"
import { listPosts } from "@/lib/content"
import { resolveSiteManifest } from "@/lib/site"
import { siteConfig } from "@/lib/site-config"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const manifest = await resolveSiteManifest()
  const name = manifest.brand?.name ?? siteConfig.name
  return {
    title: "Blog",
    description: `Writing from ${name}.`,
  }
}

export default async function BlogPage() {
  const [posts, manifest] = await Promise.all([listPosts(), resolveSiteManifest()])
  // The index copy below describes the template's demo business; on a
  // brain-driven site it would surface under the user's brand, so brain mode
  // gets neutral copy derived from the resolved brand instead.
  const copy =
    manifest.source === "brain"
      ? { heading: "Blog", intro: manifest.brand?.tagline }
      : {
          heading: "Notes on running the numbers",
          intro: "Short, specific writing on restaurant bookkeeping and margin — no filler.",
        }
  return <BlogIndex posts={posts} heading={copy.heading} intro={copy.intro} />
}
