import type { Metadata } from "next"
import { SectionStack } from "@/lib/sections/registry"
import { getPageManifest, getSiteManifest } from "@/lib/site"

export const metadata: Metadata = {
  title: { absolute: "Countertop — margin alerts from your POS" },
  description:
    "Demo of a second manifest: a SaaS-shaped section stack on the foundry dark theme, assembled from the same block registry.",
}

export default async function DemoBPage() {
  const page = getPageManifest(getSiteManifest(), "demo-b")
  return <SectionStack entries={page.sections} />
}
