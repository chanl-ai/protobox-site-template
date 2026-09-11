// Protobox knowledge-base source ("the brain"). When PROTOBOX_API_URL and
// PROTOBOX_API_KEY are both set, content.ts, site.ts, and themes.ts read
// from the workspace's knowledge base instead of the filesystem. The API
// key alone scopes requests to one workspace (verified: X-API-Key without
// x-workspace-id still returns 200; no auth headers at all returns 401), so
// no workspace id needs to be configured here.
//
// Two-species content model: everything the site reads is kind=page,
// scoped by FOLDER (not the retired category string) plus tag=published.
// Folder "site" holds the one site-spec manifest doc and the "about" prose
// page; "site/blog" holds blog posts; "brand" holds the single brand-recipe
// preset. A folder lookup that comes back empty means "fall back to file
// content" — a partially-seeded workspace still renders every page.

const API_URL = process.env.PROTOBOX_API_URL
const API_KEY = process.env.PROTOBOX_API_KEY

export function brainEnabled(): boolean {
  return Boolean(API_URL && API_KEY)
}

export interface KnowledgeItem {
  id: string
  title: string
  content: string
  folderId?: string
  createdAt: string
  updatedAt: string
  metadata?: {
    tags?: string[]
    [key: string]: unknown
  }
}

interface KnowledgeListResponse {
  success: boolean
  items?: KnowledgeItem[]
  data?: KnowledgeItem[]
}

interface Folder {
  id?: string
  _id?: string
  name: string
}

interface FolderListResponse {
  success: boolean
  data?: { folders?: Folder[] }
  folders?: Folder[]
}

/**
 * Resolves a flat, path-style folder name ("site/blog") to its id via the
 * exact-match `?name=` query, so this never has to list every folder to
 * find one. `fetch`'s per-request memoization (same URL + options) means
 * concurrent lookups for the same folder within one render collapse to a
 * single request — "once per fetch cycle" without a hand-rolled cache.
 */
async function resolveFolderId(name: string): Promise<string | null> {
  if (!brainEnabled()) return null
  const params = new URLSearchParams({ name })
  try {
    const res = await fetch(`${API_URL}/api/v1/knowledge/folders?${params.toString()}`, {
      headers: { "X-API-Key": API_KEY as string },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const body = (await res.json()) as FolderListResponse
    const folders = body.data?.folders ?? body.folders ?? []
    const folder = folders.find((f) => f.name.toLowerCase() === name.toLowerCase())
    return folder ? (folder.id ?? folder._id ?? null) : null
  } catch {
    return null
  }
}

/**
 * Lists published knowledge items filed in one folder. Every list this site
 * makes is kind=page (authored content lives as brain PAGES; sources are
 * sync pipes, not this site's content) scoped by folderId, optionally
 * narrowed by tag. Returns [] on any failure (network error, non-2xx,
 * unresolved folder, brain disabled) so callers can treat an empty result
 * as "fall back to file content" without a try/catch of their own.
 */
export async function listBrainFolder(
  folderName: string,
  tag?: string
): Promise<KnowledgeItem[]> {
  if (!brainEnabled()) return []
  const folderId = await resolveFolderId(folderName)
  if (!folderId) return []
  const params = new URLSearchParams({ kind: "page", folderId, limit: "100" })
  if (tag) params.set("tag", tag)
  try {
    const res = await fetch(`${API_URL}/api/v1/knowledge?${params.toString()}`, {
      headers: { "X-API-Key": API_KEY as string },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const body = (await res.json()) as KnowledgeListResponse
    return body.items ?? body.data ?? []
  } catch {
    return []
  }
}

/** First matching item for a single-entry folder (the site-spec doc, the brand recipe). */
export async function getBrainSingleInFolder(
  folderName: string,
  tag?: string
): Promise<KnowledgeItem | null> {
  const items = await listBrainFolder(folderName, tag)
  return items[0] ?? null
}

/**
 * True when a knowledge item's raw content is the site-spec manifest (valid
 * JSON with a "pages" key) rather than a markdown prose page. Folder "site"
 * holds both kinds side by side — this is how listPages() (prose) and
 * resolveSiteManifest() (the spec) each pick their half without a separate
 * category field to discriminate on.
 */
export function isManifestContent(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw)
    return Boolean(parsed && typeof parsed === "object" && "pages" in parsed)
  } catch {
    return false
  }
}
