import type { Metadata } from "next"
import { BlogIndex } from "@/components/blocks/BlogIndex"
import { listPosts } from "@/lib/content"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Notes",
  description: "Writing on restaurant bookkeeping and margin from Torres Books & Margins.",
}

export default async function BlogPage() {
  const posts = await listPosts()
  return <BlogIndex posts={posts} />
}
