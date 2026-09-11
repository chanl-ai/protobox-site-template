// Generated OG card per post: theme-toned title card. Colors are hex
// equivalents of the heritage light palette (Satori has no oklch support).

import { ImageResponse } from "next/og"
import { getPost } from "@/lib/content"
import { siteConfig } from "@/lib/site-config"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Article title card"

const COLORS = {
  background: "#faf6ec",
  foreground: "#463228",
  primary: "#93402a",
  muted: "#8a7767",
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  const title = post?.frontmatter.title ?? siteConfig.name
  const category = post?.frontmatter.category

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: COLORS.background,
          color: COLORS.foreground,
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 600 }}>{siteConfig.shortName}</div>
          {category ? (
            <div
              style={{
                fontSize: 24,
                color: COLORS.primary,
                border: `2px solid ${COLORS.primary}`,
                borderRadius: 999,
                padding: "8px 24px",
              }}
            >
              {category}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", fontSize: 68, lineHeight: 1.15, fontWeight: 600, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: COLORS.muted }}>
          <div>{siteConfig.description}</div>
          <div style={{ color: COLORS.primary }}>{new URL(siteConfig.url).host}</div>
        </div>
      </div>
    ),
    size
  )
}
