// Ported from protobox-site hero.tsx + hero-preview-surface.tsx: badge pill,
// oversized headline with primary accent tail, CTA stack, and a full-width
// framed preview surface. Imagery is the generic token-built PreviewSurface.

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PreviewSurface } from "@/components/sections/shared"
import type { HeroContent } from "@/lib/sections/types"

function Badge({ label }: { label?: string }) {
  if (!label) return null
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
      {label}
    </span>
  )
}

function Headline({
  headline,
  accent,
  className,
}: {
  headline: string
  accent?: string
  className: string
}) {
  return (
    <h1 className={className}>
      {headline}
      {accent ? (
        <>
          {" "}
          <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
            {accent}
          </span>
        </>
      ) : null}
    </h1>
  )
}

function Ctas({ content, centered }: { content: HeroContent; centered?: boolean }) {
  return (
    <div className={centered ? "space-y-3" : "max-w-sm space-y-3"}>
      <div
        className={`flex flex-wrap items-center gap-3 ${centered ? "justify-center" : ""}`}
      >
        <Button asChild size="lg" className="h-11 px-6 text-base">
          <Link href={content.primaryCta.href}>
            {content.primaryCta.label}
            <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
          </Link>
        </Button>
        {content.secondaryCta ? (
          <Button asChild size="lg" variant="outline" className="h-11 px-6 text-base">
            <Link href={content.secondaryCta.href}>{content.secondaryCta.label}</Link>
          </Button>
        ) : null}
      </div>
      {content.ctaNote ? (
        <p
          className={`text-sm leading-relaxed text-muted-foreground ${centered ? "mx-auto max-w-md text-center" : ""}`}
        >
          {content.ctaNote}
        </p>
      ) : null}
    </div>
  )
}

/** Copy left, CTA stack right, full-width preview surface below. */
export function HeroSplit(content: HeroContent) {
  const { eyebrow, headline, headlineAccent, subhead, bullets, stats } = content

  return (
    <section className="section-pad relative border-b border-border">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <div className="flex max-w-3xl flex-1 flex-col items-start gap-5">
            <Badge label={eyebrow} />
            <Headline
              headline={headline}
              accent={headlineAccent}
              className="font-heading text-[2.75rem] leading-[1.05] font-bold tracking-tight text-balance md:text-6xl"
            />
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
              {subhead}
            </p>
          </div>

          <div className="shrink-0 space-y-4">
            <Ctas content={content} />
            {bullets?.length ? (
              <ul className="space-y-2">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* The dashboard mock is decoration for content that brings numbers —
            without stats it degrades to skeleton bars and a stray label. */}
        {stats?.length ? (
          <div className="mt-12 md:mt-16">
            <PreviewSurface title="dashboard" stats={stats} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

/** Centered banner: badge, oversized headline, CTA pair, preview surface. */
export function HeroCentered(content: HeroContent) {
  const { eyebrow, headline, headlineAccent, subhead, stats } = content

  return (
    <section className="section-pad relative border-b border-border">
      <div className="container-site">
        <div className="mx-auto max-w-4xl text-center">
          {eyebrow ? (
            <div className="flex justify-center">
              <Badge label={eyebrow} />
            </div>
          ) : null}
          <Headline
            headline={headline}
            accent={headlineAccent}
            className="mt-6 font-heading text-[2.75rem] leading-[1.05] font-bold tracking-tight text-balance md:text-6xl lg:text-7xl"
          />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
            {subhead}
          </p>
          <div className="mt-8">
            <Ctas content={content} centered />
          </div>
        </div>

        {stats?.length ? (
          <div className="mx-auto mt-12 max-w-5xl md:mt-16">
            <PreviewSurface stats={stats} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
