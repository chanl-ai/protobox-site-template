import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPost } from "@/components/blocks/BlogPost"
import { getPost, listPosts, listRelatedPosts } from "@/lib/content"
import { resolveSiteManifest } from "@/lib/site"
import { siteConfig } from "@/lib/site-config"

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await listPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params
  const [post, related, manifest] = await Promise.all([
    getPost(slug),
    listRelatedPosts(slug, 3),
    resolveSiteManifest(),
  ])
  if (!post) {
    notFound()
  }

  // JSON-LD publisher identity follows the resolved brand — a brain-driven
  // site must never publish under the template demo's name.
  const siteName = manifest.brand?.name ?? siteConfig.name
  const url = `${siteConfig.url}/blog/${post.slug}`
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.frontmatter.title,
      description: post.frontmatter.description,
      datePublished: post.frontmatter.date,
      url,
      author: post.frontmatter.author
        ? {
            "@type": "Person",
            name: post.frontmatter.author.name,
            jobTitle: post.frontmatter.author.role,
          }
        : { "@type": "Organization", name: siteName },
      publisher: { "@type": "Organization", name: siteName, url: siteConfig.url },
      keywords: post.frontmatter.tags?.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteName, item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Notes", item: `${siteConfig.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.frontmatter.title, item: url },
      ],
    },
  ]
  if (post.frontmatter.faqs?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.frontmatter.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPost post={post} related={related} />
    </>
  )
}
