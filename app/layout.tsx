import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import { getBrainTheme, getTheme, listThemes } from "@/lib/themes"
import { themeStyleTag, themesGoogleFontsHref } from "@/lib/theme"
import { resolveSiteManifest } from "@/lib/site"
import { siteConfig } from "@/lib/site-config"
import { brainEnabled } from "@/lib/brain"

export const revalidate = 60

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const manifest = await resolveSiteManifest()
  const theme = brainEnabled()
    ? ((await getBrainTheme()) ?? getTheme(manifest.theme))
    : getTheme(manifest.theme)
  const themeCss = themeStyleTag(theme)
  // All theme fonts load up front so per-page theme overrides (demo-b) and
  // the /blocks gallery switcher render correctly without a layout change.
  const fontsHref = themesGoogleFontsHref(listThemes())

  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased ${manifest.mode === "dark" ? "dark" : ""}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={fontsHref} />
        {/* Theme from site.json: overrides the default shadcn tokens declared
            in globals.css. Swap with `pnpm preset <name>`. */}
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
