// Reads content/* as if it were CMS-backed collections. The exported
// functions are the whole contract the rest of the app depends on. Swapping
// the filesystem source for an HTTP CMS later means rewriting the bodies of
// this file only — every caller already awaits these and works with the same
// shapes. Three collections: pages (long-form markdown), blog (markdown
// posts), sections (per-section JSON blobs referenced from site.json).

import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkHtml from "remark-html"
import { brainEnabled, isManifestContent, listBrainFolder } from "@/lib/brain"

const PAGES_DIR = path.join(process.cwd(), "content", "pages")
const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const SECTIONS_DIR = path.join(process.cwd(), "content", "sections")
const LANDINGS_DIR = path.join(process.cwd(), "content", "landings")

export type ContentStatus = "published" | "draft"

export interface PageFrontmatter {
  title: string
  slug: string
  status: ContentStatus
  description: string
  date: string
}

export interface Page {
  slug: string
  frontmatter: PageFrontmatter
  contentHtml: string
}

export interface PostAuthor {
  name: string
  role: string
}

export interface PostFaq {
  question: string
  answer: string
}

export interface PostFrontmatter {
  title: string
  slug: string
  status: ContentStatus
  description: string
  date: string
  author?: PostAuthor
  category?: string
  tags?: string[]
  faqs?: PostFaq[]
}

export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  contentHtml: string
  toc: TocEntry[]
  readTimeMinutes: number
}

async function readFilesWithExt(dir: string, ext: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir)
    return entries.filter((entry) => entry.endsWith(ext))
  } catch {
    return []
  }
}

async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(remarkHtml).process(markdown)
  return processed.toString()
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

/**
 * Adds ids to h2/h3 headings (remark-html emits none) and collects them as a
 * table of contents, so anchors and the TOC always agree.
 */
function addHeadingIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = []
  const seen = new Set<string>()
  const withIds = html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_match, level: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim()
      let id = slugify(text) || "section"
      while (seen.has(id)) id = `${id}-x`
      seen.add(id)
      toc.push({ id, text, level: Number(level) as 2 | 3 })
      return `<h${level} id="${id}">${inner}</h${level}>`
    }
  )
  return { html: withIds, toc }
}

function readTimeMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return Math.max(2, Math.round(words / 220))
}

// Pages and posts are markdown WITH frontmatter in both modes — brain
// content preserves the same frontmatter block verbatim inside the knowledge
// item's `content` field, since POST /api/v1/knowledge drops everything
// except category/tags from a client-supplied `metadata` body (verified:
// a seeded item's metadata came back with just category, tags,
// requestedSource, _id). One parser, one path: file and brain content both
// go through matter() and come out as the same Page/Post shape.
async function pageFromRaw(raw: string): Promise<Page> {
  const { data, content } = matter(raw)
  const frontmatter = data as PageFrontmatter
  const contentHtml = await markdownToHtml(content)
  return { slug: frontmatter.slug, frontmatter, contentHtml }
}

async function listFilePages(): Promise<Page[]> {
  const files = await readFilesWithExt(PAGES_DIR, ".md")
  const pages = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(PAGES_DIR, file), "utf8")
      return pageFromRaw(raw)
    })
  )
  return pages.filter((page) => page.frontmatter.status === "published")
}

async function listBrainPages(): Promise<Page[]> {
  // Folder "site" holds the site-spec manifest doc alongside prose pages —
  // skip the manifest here the same way resolveSiteManifest() picks it out
  // of the reverse case, so a JSON blob never shows up as an empty-titled
  // "page" in the nav.
  const items = await listBrainFolder("site", "published")
  const pages = await Promise.all(
    items.filter((item) => !isManifestContent(item.content)).map((item) => pageFromRaw(item.content))
  )
  return pages.filter((page) => page.frontmatter.status === "published")
}

export async function listPages(): Promise<Page[]> {
  if (brainEnabled()) {
    const pages = await listBrainPages()
    if (pages.length) {
      return pages.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
    }
  }
  const pages = await listFilePages()
  return pages.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
}

export async function getPage(slug: string): Promise<Page | null> {
  const pages = await listPages()
  return pages.find((page) => page.slug === slug) ?? null
}

async function postFromRaw(raw: string): Promise<Post> {
  const { data, content } = matter(raw)
  const frontmatter = data as PostFrontmatter
  const { html, toc } = addHeadingIds(await markdownToHtml(content))
  return {
    slug: frontmatter.slug,
    frontmatter,
    contentHtml: html,
    toc,
    readTimeMinutes: readTimeMinutes(content),
  }
}

async function listFilePosts(): Promise<Post[]> {
  const files = await readFilesWithExt(BLOG_DIR, ".md")
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8")
      return postFromRaw(raw)
    })
  )
  return posts.filter((post) => post.frontmatter.status === "published")
}

async function listBrainPosts(): Promise<Post[]> {
  const items = await listBrainFolder("site/blog", "published")
  const posts = await Promise.all(items.map((item) => postFromRaw(item.content)))
  return posts.filter((post) => post.frontmatter.status === "published")
}

export async function listPosts(): Promise<Post[]> {
  if (brainEnabled()) {
    const posts = await listBrainPosts()
    if (posts.length) {
      return posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
    }
  }
  const posts = await listFilePosts()
  return posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await listPosts()
  return posts.find((post) => post.slug === slug) ?? null
}

/** Tag-overlap scored related posts; same category breaks ties; recency fills. */
export async function listRelatedPosts(slug: string, limit = 3): Promise<Post[]> {
  const posts = await listPosts()
  const current = posts.find((post) => post.slug === slug)
  if (!current) return posts.slice(0, limit)

  const currentTags = new Set(current.frontmatter.tags ?? [])
  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const shared = (post.frontmatter.tags ?? []).filter((tag) =>
        currentTags.has(tag)
      ).length
      const sameCategory =
        post.frontmatter.category &&
        post.frontmatter.category === current.frontmatter.category
          ? 1
          : 0
      return { post, score: shared * 2 + sameCategory }
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.post.frontmatter.date < b.post.frontmatter.date ? 1 : -1)
    )
    .slice(0, limit)
    .map((entry) => entry.post)
}

/** Slugs of every landing manifest under content/landings/. */
export async function listLandingSlugs(): Promise<string[]> {
  const files = await readFilesWithExt(LANDINGS_DIR, ".json")
  return files.map((file) => file.replace(/\.json$/, ""))
}

/** One landing manifest by slug, or null (page 404s). Shape: LandingManifest. */
export async function getLandingManifest<T>(slug: string): Promise<T | null> {
  // Slug comes from the URL: refuse anything that isn't a bare filename.
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  try {
    const raw = await fs.readFile(path.join(LANDINGS_DIR, `${slug}.json`), "utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Loads one section's content blob by manifest ref ("home/hero" →
 * content/sections/home/hero.json) — file mode only. Brain mode never calls
 * this: the site-spec doc inlines every section's content directly on its
 * manifest entry (see ManifestSectionEntry / stripSectionRef), so there is
 * no separate per-section lookup left to do. Throws when the ref resolves
 * nowhere, so a manifest typo fails the build instead of rendering an empty
 * section.
 */
export async function getSectionContent<T>(ref: string): Promise<T> {
  const file = path.join(SECTIONS_DIR, `${ref}.json`)
  let raw: string
  try {
    raw = await fs.readFile(file, "utf8")
  } catch {
    throw new Error(`Missing section content: content/sections/${ref}.json`)
  }
  return JSON.parse(raw) as T
}

/**
 * Strips a stray "ref" key from an inline section content object before it
 * gets spread as props onto a section component ({...data} in
 * lib/sections/registry.tsx) — a leftover "ref" key there collides with
 * React's reserved ref prop and throws "Refs cannot be used in Server
 * Components" instead of rendering. Carried over from the old per-ref
 * brain-section lookup as a defensive guard against a manifest that still
 * has one.
 */
export function stripSectionRef<T>(content: Record<string, unknown>): T {
  if (!("ref" in content)) return content as T
  const rest = { ...content }
  delete rest.ref
  return rest as T
}
