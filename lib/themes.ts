// Static registry of the shipped themes. Static imports (not fs reads) so a
// bad preset file fails the build at compile time, and so the client bundle
// never grows a filesystem dependency.

import type { SiteTheme } from "@/lib/theme"
import { getBrainSingleInFolder } from "@/lib/brain"
import heritage from "@/presets/heritage.json"
import foundry from "@/presets/foundry.json"
import meadow from "@/presets/meadow.json"
import atelier from "@/presets/atelier.json"

const THEMES: Record<string, SiteTheme> = {
  heritage: heritage as SiteTheme,
  foundry: foundry as SiteTheme,
  meadow: meadow as SiteTheme,
  atelier: atelier as SiteTheme,
}

export function getTheme(name: string): SiteTheme {
  const theme = THEMES[name]
  if (!theme) {
    throw new Error(
      `Unknown theme "${name}". Available: ${Object.keys(THEMES).join(", ")}`
    )
  }
  return theme
}

export function listThemes(): SiteTheme[] {
  return Object.values(THEMES)
}

/**
 * Brand preset from the single recipe entry in folder "brand" (same JSON
 * shape as presets/*.json). Returns null when the brain is disabled, empty,
 * or the content doesn't parse as a SiteTheme, so callers fall back to the
 * named preset in site.json.
 */
export async function getBrainTheme(): Promise<SiteTheme | null> {
  const item = await getBrainSingleInFolder("brand", "published")
  if (!item) return null
  try {
    const theme = JSON.parse(item.content) as SiteTheme
    if (!theme?.light || !theme?.dark || !theme?.fonts) return null
    return theme
  } catch {
    return null
  }
}
