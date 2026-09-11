import { SectionStack } from "@/lib/sections/registry"
import { getPageManifest } from "@/lib/site"

export default async function HomePage() {
  const page = getPageManifest("home")
  return <SectionStack entries={page.sections} />
}
