// Review surface: every section type × variant with demo content, grouped by
// type, re-themeable via ?theme=<name>&mode=light|dark. Captions live OUTSIDE
// the rendered components so the blocks preview exactly as they ship.

import type { Metadata } from "next"
import Link from "next/link"
import { SectionStack } from "@/lib/sections/registry"
import { SiteHeader, type NavItem } from "@/components/site/headers"
import { SiteFooter } from "@/components/site/footers"
import { getTheme, listThemes } from "@/lib/themes"
import { themeToCssVars, type ThemeMode } from "@/lib/theme"
import type { HeaderVariant, FooterVariant, SiteBrand } from "@/lib/site"

export const metadata: Metadata = {
  title: "Block gallery",
  description: "Every section type and variant in the registry, per theme.",
}

interface GalleryRow {
  type: string
  contract: string
  variants: { variant: string; content: string; seed: string }[]
}

// One row per section type; both variants share the type's contract.
const ROWS: GalleryRow[] = [
  {
    type: "hero",
    contract: "eyebrow?, headline, subhead, primaryCta, secondaryCta?, bullets?, stats?",
    variants: [
      { variant: "split", content: "home/hero", seed: "protobox-site hero + preview-surface (static port)" },
      { variant: "centered", content: "demo-b/hero", seed: "protobox-site hero, centered" },
    ],
  },
  {
    type: "logo-cloud",
    contract: "heading?, logos[{name, src?}]",
    variants: [
      { variant: "row", content: "demo-b/logos", seed: "protobox-site platform-logos (port)" },
      { variant: "wall", content: "demo-b/logos", seed: "new build" },
    ],
  },
  {
    type: "feature-grid",
    contract: "eyebrow?, heading, intro?, items[{title, description, icon?}]",
    variants: [
      { variant: "cards", content: "home/features", seed: "protobox-site capabilities-grid (static port)" },
      { variant: "list", content: "demo-b/features", seed: "protobox-site how-it-works (port)" },
    ],
  },
  {
    type: "stats",
    contract: "heading?, stats[{value, label, detail?}]",
    variants: [
      { variant: "band", content: "demo-b/stats", seed: "protobox-site quote-banner surface" },
      { variant: "inline", content: "home/stats", seed: "protobox-site numerals, inline" },
    ],
  },
  {
    type: "testimonials",
    contract: "heading?, items[{quote, name, role}]",
    variants: [
      { variant: "single", content: "home/testimonial", seed: "protobox-site quote-banner (port)" },
      { variant: "grid", content: "demo-b/testimonials", seed: "quote-banner language, card grid" },
    ],
  },
  {
    type: "pricing",
    contract: "heading, intro?, offers[{name?, price, priceNote?, includes[], notFor?[], cta, featured?}]",
    variants: [
      { variant: "single-offer", content: "home/offer", seed: "final-cta surface + offer contract" },
      { variant: "tiers", content: "demo-b/pricing", seed: "protobox-site featured-card treatment" },
    ],
  },
  {
    type: "faq",
    contract: "heading, intro?, items[{question, answer}]",
    variants: [
      { variant: "accordion", content: "home/faq", seed: "protobox-site faq-section, rail split" },
      { variant: "two-column", content: "demo-b/faq", seed: "new build" },
    ],
  },
  {
    type: "cta-banner",
    contract: "heading, subhead?, cta, secondaryCta?, note?",
    variants: [
      { variant: "panel", content: "home/cta", seed: "protobox-site final-cta (port)" },
      { variant: "strip", content: "demo-b/cta", seed: "new build" },
    ],
  },
  {
    type: "about-founder",
    contract: "eyebrow?, name, role, headline, paragraphs[], facts?, signoff?",
    variants: [
      { variant: "portrait", content: "home/founder", seed: "new build" },
      { variant: "letter", content: "home/founder", seed: "new build" },
    ],
  },
  {
    type: "contact",
    contract: "heading, intro?, email, phone?, location?, hours?, cta?, ctaNote?",
    variants: [
      { variant: "split", content: "home/contact", seed: "new build" },
      { variant: "simple", content: "home/contact", seed: "new build" },
    ],
  },
  {
    type: "form-contact",
    contract: "heading, intro?, fields[{name, label, type?, required?, placeholder?}], submitLabel, consent?, successMessage? → POST /api/contact",
    variants: [
      { variant: "card", content: "shared/contact-form", seed: "new build (client component)" },
      { variant: "split", content: "shared/contact-form", seed: "new build (client component)" },
    ],
  },
]

const HEADER_VARIANTS: HeaderVariant[] = ["minimal", "center", "pill"]
const FOOTER_VARIANTS: FooterVariant[] = ["slim", "columns", "big-brand"]

const DEMO_BRAND: SiteBrand = {
  name: "Torres Books & Margins",
  shortName: "Torres B&M",
  email: "hello@torresbooksandmargins.com",
  tagline: "Bookkeeping and margin coaching for independent restaurants.",
}

const DEMO_NAV: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Notes", href: "#notes" },
]

function Caption({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 pb-3">
      <p className="font-mono text-xs tracking-wide">
        <span className="font-semibold text-primary">{label}</span>
        <span className="text-muted-foreground"> · {detail}</span>
      </p>
    </div>
  )
}

export default async function BlocksGalleryPage({
  searchParams,
}: PageProps<"/blocks">) {
  const params = await searchParams
  const themeName = typeof params.theme === "string" ? params.theme : "heritage"
  const mode: ThemeMode = params.mode === "dark" ? "dark" : "light"
  const theme = getTheme(themeName)
  const vars = themeToCssVars(theme, mode)

  return (
    <div style={vars} className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <p className="font-heading text-sm font-semibold">
            Block gallery
            <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
              {ROWS.length} types · {ROWS.length * 2} section variants · 3 headers · 3 footers
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {listThemes().map((t) => (
              <Link
                key={t.name}
                href={`/blocks?theme=${t.name}&mode=${mode}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  t.name === theme.name
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            ))}
            <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
            {(["light", "dark"] as const).map((m) => (
              <Link
                key={m}
                href={`/blocks?theme=${theme.name}&mode=${m}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  m === mode
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {ROWS.map((row) => (
        <section key={row.type} className="border-b-4 border-border">
          <div className="mx-auto max-w-6xl px-6 pt-12">
            <h2 className="font-mono text-sm font-semibold tracking-wide uppercase">
              {row.type}
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              contract: {row.contract}
            </p>
          </div>
          {row.variants.map((variant) => (
            <div key={variant.variant}>
              <Caption
                label={`${row.type}/${variant.variant}`}
                detail={`content: ${variant.content} · seed: ${variant.seed}`}
              />
              <div className="border-y border-dashed border-border">
                <SectionStack
                  entries={[
                    {
                      section: row.type,
                      variant: variant.variant,
                      content: variant.content,
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </section>
      ))}

      <section className="border-b-4 border-border">
        <div className="mx-auto max-w-6xl px-6 pt-12">
          <h2 className="font-mono text-sm font-semibold tracking-wide uppercase">header</h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            contract: brand, nav[], cta?
          </p>
        </div>
        {HEADER_VARIANTS.map((variant) => (
          <div key={variant}>
            <Caption label={`header/${variant}`} detail="chrome · selected in site.json" />
            <div className="border-y border-dashed border-border pb-6">
              <SiteHeader
                variant={variant}
                brand={DEMO_BRAND}
                nav={DEMO_NAV}
                cta={{ label: "Get started", href: "#" }}
              />
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 pt-12">
          <h2 className="font-mono text-sm font-semibold tracking-wide uppercase">footer</h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            contract: brand, nav[]
          </p>
        </div>
        {FOOTER_VARIANTS.map((variant) => (
          <div key={variant}>
            <Caption label={`footer/${variant}`} detail="chrome · selected in site.json" />
            <div className="border-y border-dashed border-border">
              <SiteFooter variant={variant} brand={DEMO_BRAND} nav={DEMO_NAV} />
            </div>
          </div>
        ))}
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm text-muted-foreground">
            Pages assemble these from <span className="font-mono">site.json</span>:{" "}
            <Link className="text-primary underline-offset-4 hover:underline" href="/">
              home
            </Link>{" "}
            (heritage · local-service stack) ·{" "}
            <Link className="text-primary underline-offset-4 hover:underline" href="/demo-b">
              demo-b
            </Link>{" "}
            (foundry dark · SaaS stack) ·{" "}
            <Link
              className="text-primary underline-offset-4 hover:underline"
              href="/l/margin-review"
            >
              l/margin-review
            </Link>{" "}
            (atelier · landing manifest with form-contact).
          </p>
        </div>
      </section>
    </div>
  )
}
