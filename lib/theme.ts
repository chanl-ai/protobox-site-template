// A theme is a complete, named token set: full shadcn custom-property values
// for light AND dark, a font pair, and a radius. site.json names the active
// theme; presets/<name>.json holds the data. Only a few tokens are required
// per palette — the rest derive from them so a theme author fills in only
// what they have an opinion about.

export interface ThemePalette {
  background: string
  foreground: string
  primary: string
  primaryForeground?: string
  card?: string
  cardForeground?: string
  secondary?: string
  secondaryForeground?: string
  muted?: string
  mutedForeground?: string
  accent?: string
  accentForeground?: string
  destructive?: string
  border?: string
  input?: string
  ring?: string
  /** Accent triple for gradient rules and chart-toned surfaces (chart-1..3). */
  charts?: [string, string, string]
  /** Lifted/brighter primary for links, deltas, glows. */
  primaryLift?: string
  /** Second accent (e.g. amber) + its soft surface. */
  accent2?: string
  accent2Soft?: string
  /** Footer surface set — footers may sit outside the page's light/dark. */
  footerBg?: string
  footerFg?: string
  footerHeading?: string
  footerAccent?: string
}

export type ThemeMode = "light" | "dark"

export interface SiteTheme {
  name: string
  label: string
  radius: string
  fonts: {
    display: string
    body: string
    mono?: string
  }
  light: ThemePalette
  dark: ThemePalette
}

// Generic fallback stacks so a slow/blocked Google Fonts request still
// renders a readable page instead of the browser's default serif.
const FONT_FALLBACK = {
  display: `Georgia, "Times New Roman", serif`,
  body: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`,
}

/** Completes a sparse palette into the full shadcn token map. */
export function paletteToCssVars(palette: ThemePalette): Record<string, string> {
  const c = palette
  const muted = c.muted ?? c.background
  const mutedForeground = c.mutedForeground ?? c.foreground
  const border = c.border ?? muted
  const card = c.card ?? c.background
  const cardForeground = c.cardForeground ?? c.foreground

  return {
    "--background": c.background,
    "--foreground": c.foreground,
    "--card": card,
    "--card-foreground": cardForeground,
    "--popover": card,
    "--popover-foreground": cardForeground,
    "--primary": c.primary,
    "--primary-foreground": c.primaryForeground ?? c.background,
    "--secondary": c.secondary ?? muted,
    "--secondary-foreground": c.secondaryForeground ?? c.foreground,
    "--muted": muted,
    "--muted-foreground": mutedForeground,
    "--accent": c.accent ?? muted,
    "--accent-foreground": c.accentForeground ?? c.foreground,
    "--destructive": c.destructive ?? "oklch(0.577 0.245 27.325)",
    "--border": border,
    "--input": c.input ?? border,
    "--ring": c.ring ?? c.primary,
    "--chart-1": c.charts?.[0] ?? c.primary,
    "--chart-2": c.charts?.[1] ?? c.accent ?? c.primary,
    "--chart-3": c.charts?.[2] ?? mutedForeground,
    "--primary-lift": c.primaryLift ?? c.primary,
    "--accent-2": c.accent2 ?? c.charts?.[1] ?? c.primary,
    "--accent-2-soft": c.accent2Soft ?? c.accent ?? muted,
    "--footer": c.footerBg ?? c.foreground,
    "--footer-foreground": c.footerFg ?? c.background,
    "--footer-heading": c.footerHeading ?? c.background,
    "--footer-accent": c.footerAccent ?? c.primaryLift ?? c.primary,
  }
}

function fontVars(theme: SiteTheme): Record<string, string> {
  return {
    "--radius": theme.radius,
    "--font-sans": `"${theme.fonts.body}", ${FONT_FALLBACK.body}`,
    "--font-display": `"${theme.fonts.display}", ${FONT_FALLBACK.display}`,
    "--font-site-mono": theme.fonts.mono
      ? `"${theme.fonts.mono}", ui-monospace, SFMono-Regular, Menlo, monospace`
      : `var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace`,
  }
}

/** Flat var map for one mode — used to scope a theme to a subtree (style prop). */
export function themeToCssVars(
  theme: SiteTheme,
  mode: ThemeMode
): Record<string, string> {
  return { ...paletteToCssVars(theme[mode]), ...fontVars(theme) }
}

function declarations(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n")
}

/**
 * Inline <style> body: light palette on :root, dark palette on .dark.
 * Toggling the `dark` class on <html> (or a wrapper) flips the whole site.
 */
export function themeStyleTag(theme: SiteTheme): string {
  const light = declarations({ ...paletteToCssVars(theme.light), ...fontVars(theme) })
  const dark = declarations(paletteToCssVars(theme.dark))
  return `:root {\n${light}\n}\n.dark {\n${dark}\n}`
}

/** Google Fonts stylesheet URL covering every named face across the given themes. */
export function themesGoogleFontsHref(themes: SiteTheme[]): string {
  const families = Array.from(
    new Set(
      themes.flatMap((theme) =>
        [theme.fonts.display, theme.fonts.body, theme.fonts.mono].filter(
          (f): f is string => Boolean(f)
        )
      )
    )
  )
    .map((family) => `family=${encodeURIComponent(family)}:wght@400;500;600;700`)
    .join("&")
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}
