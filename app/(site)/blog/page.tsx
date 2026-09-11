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
  const posts = await listPosts()
  return <BlogIndex posts={posts} />
}
