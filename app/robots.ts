// AI crawlers are explicitly allowed: answer engines citing the blog is the
// point of the AEO structure, not a side effect.

import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/blocks"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
