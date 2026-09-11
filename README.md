# protobox-site-template

Themeable founder-site template: a typed section registry, manifest-driven pages, complete named themes, and an AEO-structured blog. Next.js App Router + shadcn primitives + Tailwind v4.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000 (workspace dev server runs on 3939)
pnpm build      # must stay green
```

No env vars required. Optional: `CONTACT_WEBHOOK_URL` — where `/api/contact` forwards form submissions; unset, submissions are logged and acknowledged.

## The three most common things

**1. Change the site's look** — pick a theme:

```bash
pnpm preset foundry     # heritage | foundry | meadow | atelier
```

Themes are complete token sets (light + dark, fonts, radius) in `presets/*.json`. Preview every block in every theme at `/blocks?theme=<name>&mode=<light|dark>`.

**2. Rearrange or re-skin a page** — edit `site.json`. A page is an ordered list of `{section, variant, content}`; both variants of a type share one content contract, so swapping `"variant": "cards"` for `"list"` never touches copy. Section copy lives in `content/sections/<ref>.json`.

**3. Add a landing page** — drop `content/landings/<slug>.json` (own title, theme, chrome, section stack; see `margin-review.json`) and it serves at `/l/<slug>`.

## Map

| Piece | Where |
| --- | --- |
| Section components (11 types × 2 variants) | `components/sections/` |
| Type ↔ component registry + renderer | `lib/sections/registry.tsx` |
| Content contracts | `lib/sections/types.ts` |
| Site manifest | `site.json` (`lib/site.ts`) |
| Landing manifests | `content/landings/*.json` → `/l/<slug>` |
| Themes | `presets/*.json` (`lib/theme.ts`, `lib/themes.ts`) |
| Headers (3) / footers (3) | `components/site/headers.tsx`, `footers.tsx` |
| Content seam (CMS-swappable) | `lib/content.ts` — pages, blog, section blobs, landings |
| Block gallery (review surface) | `/blocks` |
| Demo sites | `/` (heritage, local-service stack) · `/demo-b` (foundry dark, SaaS stack) |

Blog posts (`content/blog/*.md`) follow AEO structure: answer-first description, question H2s, `faqs` frontmatter → visible accordion + FAQPage JSON-LD, Article + Breadcrumb JSON-LD, related posts by tag overlap, generated OG images.
