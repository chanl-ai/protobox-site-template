// Second example site from the same registry: the demo-b page manifest
// overrides theme, mode, chrome, and brand via the scoped SiteShell.

import type { ReactNode } from "react"
import { SiteShell } from "@/components/site/SiteShell"
import { getPageManifest } from "@/lib/site"

export default function DemoBLayout({ children }: { children: ReactNode }) {
  const page = getPageManifest("demo-b")
  const nav = [
    { label: "How it works", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ]

  return (
    <SiteShell page={page} nav={nav} cta={{ label: "Start free", href: "#pricing" }}>
      {children}
    </SiteShell>
  )
}
