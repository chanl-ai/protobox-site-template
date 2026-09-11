import { SectionStack } from "@/lib/sections/registry"
import { getPageManifest, resolveSiteManifest } from "@/lib/site"

export const revalidate = 60

// content/pages/home.md is not rendered — the home page IS its section
// stack. In brain mode every section's content resolves independently
// through getSectionContent (called inside SectionStack), so this route
// never needs to know whether it's reading file or brain content.
export default async function HomePage() {
  const manifest = await resolveSiteManifest()
  const page = getPageManifest(manifest, "home")
  return <SectionStack entries={page.sections} />
}
