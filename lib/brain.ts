// Protobox knowledge-base source ("the brain"). When PROTOBOX_API_URL and
// PROTOBOX_API_KEY are both set, content.ts and layout read from the
// workspace's knowledge base instead of the filesystem. The API key alone
// scopes requests to one workspace (verified: X-API-Key without
// x-workspace-id still returns 200; no auth headers at all returns 401), so
// no workspace id needs to be configured here.
//
// Each collection is looked up independently and the caller falls back to
// file content when a category comes back empty — a partially-seeded brain
// still renders every page.

const API_URL = process.env.PROTOBOX_API_URL
const API_KEY = process.env.PROTOBOX_API_KEY

export function brainEnabled(): boolean {
  return Boolean(API_URL && API_KEY)
}

export interface KnowledgeItem {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  metadata?: {
    category?: string
    tags?: string[]
    slug?: string
    description?: string
    [key: string]: unknown
  }
}

interface KnowledgeListResponse {
  success: boolean
  items?: KnowledgeItem[]
  data?: KnowledgeItem[]
}

/**
 * Lists published knowledge items for one category. Returns [] on any
 * failure (network error, non-2xx, brain disabled) so callers can treat an
 * empty result as "fall back to file content" without a try/catch of their
 * own.
 */
export async function listBrainCollection(
  category: string,
  tag?: string
): Promise<KnowledgeItem[]> {
  if (!brainEnabled()) return []
  const params = new URLSearchParams({ category, limit: "100" })
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

/** First matching item for a single-entry collection (site-config, brand-visuals). */
export async function getBrainSingle(category: string): Promise<KnowledgeItem | null> {
  const items = await listBrainCollection(category)
  return items[0] ?? null
}
