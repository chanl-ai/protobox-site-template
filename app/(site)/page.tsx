import type { Metadata } from "next"
import { SectionStack } from "@/lib/sections/registry"
import { getPageManifest, resolveSiteManifest } from "@/lib/site"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const manifest = await resolveSiteManifest()
  const { meta } = getPageManifest(manifest, "home")
  if (!meta) return {}
  return { title: meta.title, description: meta.description }
}

// content/pages/home.md is not rendered as prose — the home page IS its
// section stack. Its frontmatter still seeds pages.home.meta on the
// site-spec doc (see scripts/reseed-demo-brain.py). In brain mode every
// section's content is already inlined on the manifest (see SectionStack),
// so this route never needs to know whether it's reading file or brain
// content.
export default async function HomePage() {
  const manifest = await resolveSiteManifest()
  const page = getPageManifest(manifest, "home")
  return <SectionStack entries={page.sections} />
}
