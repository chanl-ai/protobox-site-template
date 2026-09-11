import { SectionStack } from "@/lib/sections/registry"
import { getPageManifest } from "@/lib/site"
import { getBrainHomePage } from "@/lib/content"
import { brainEnabled } from "@/lib/brain"

export const revalidate = 60

export default async function HomePage() {
  const page = getPageManifest("home")
  // content/pages/home.md is not rendered in file mode — site.json's section
  // stack is the home page. A brain-sourced "home" site-page IS rendered as
  // a headline above the sections, since that's the surface a brain-fed
  // workspace uses to control what the home page says.
  const brainPage = brainEnabled() ? await getBrainHomePage() : null

  return (
    <>
      {brainPage && (
        <div className="mx-auto max-w-3xl px-6 pt-16 text-center">
          <h1 className="font-heading text-3xl font-medium">
            {brainPage.frontmatter.title}
          </h1>
          {brainPage.frontmatter.description && (
            <p className="mt-3 text-lg text-muted-foreground">
              {brainPage.frontmatter.description}
            </p>
          )}
        </div>
      )}
      <SectionStack entries={page.sections} />
    </>
  )
}
