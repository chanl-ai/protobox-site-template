import type { MetadataRoute } from "next"
import { listLandingSlugs, listPages, listPosts } from "@/lib/content"
import { siteConfig } from "@/lib/site-config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts, landings] = await Promise.all([
    listPages(),
    listPosts(),
    listLandingSlugs(),
  ])

  return [
    { url: siteConfig.url, priority: 1 },
    ...pages
      .filter((page) => page.slug !== "home")
      .map((page) => ({ url: `${siteConfig.url}/${page.slug}`, priority: 0.8 })),
    { url: `${siteConfig.url}/blog`, priority: 0.7 },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.frontmatter.date,
      priority: 0.6,
    })),
    ...landings.map((slug) => ({ url: `${siteConfig.url}/l/${slug}`, priority: 0.5 })),
  ]
}
