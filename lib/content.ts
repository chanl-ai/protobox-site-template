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

export async function listPages(): Promise<Page[]> {
  const files = await readFilesWithExt(PAGES_DIR, ".md")
  const pages = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(PAGES_DIR, file), "utf8")
      const { data, content } = matter(raw)
      const frontmatter = data as PageFrontmatter
      const contentHtml = await markdownToHtml(content)
      return { slug: frontmatter.slug, frontmatter, contentHtml }
    })
  )
  return pages
    .filter((page) => page.frontmatter.status === "published")
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
}

export async function getPage(slug: string): Promise<Page | null> {
  const pages = await listPages()
  return pages.find((page) => page.slug === slug) ?? null
}

export async function listPosts(): Promise<Post[]> {
  const files = await readFilesWithExt(BLOG_DIR, ".md")
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8")
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
    })
  )
  return posts
    .filter((post) => post.frontmatter.status === "published")
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
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
 * content/sections/home/hero.json). Throws on a missing file so a manifest
 * typo fails the build instead of rendering an empty section.
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
