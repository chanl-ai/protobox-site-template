// Portrait: layered monogram plate (grid overlay + gradient) with a mono
// fact rail. Letter: the founder's voice on a final-cta-grade surface.

import { Eyebrow } from "@/components/sections/shared"
import type { AboutFounderContent } from "@/lib/sections/types"

function monogram(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function AboutFounderPortrait({
  eyebrow,
  name,
  role,
  headline,
  paragraphs,
  facts,
}: AboutFounderContent) {
  return (
    <section id="about" className="section-pad border-b border-border">
      <div className="container-site grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <div className="relative flex aspect-square w-44 items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent via-accent to-muted">
            <div className="grid-overlay pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true" />
            <span className="font-display text-6xl font-bold text-primary">
              {monogram(name)}
            </span>
          </div>
          <p className="mt-5 font-heading text-lg font-bold tracking-tight">{name}</p>
          <p className="micro-label mt-1 text-muted-foreground">{role}</p>
          {facts?.length ? (
            <dl className="mt-8 space-y-5 border-t border-border pt-6">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="micro-label text-muted-foreground">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <div>
          {eyebrow ? <Eyebrow label={eyebrow} /> : null}
          <h2 className="mt-4 font-heading text-3xl leading-[1.1] font-bold tracking-tight text-balance md:text-4xl">
            {headline}
          </h2>
          <div className="mt-6 max-w-prose space-y-4 text-[15px] leading-relaxed text-muted-foreground md:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutFounderLetter({
  eyebrow,
  name,
  role,
  headline,
  paragraphs,
  signoff,
}: AboutFounderContent) {
  return (
    <section id="about" className="section-pad border-b border-border">
      <div className="container-site">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-12">
          <div
            className="absolute top-12 left-0 h-[calc(100%-6rem)] w-[3px] bg-primary"
            aria-hidden="true"
          />
          {eyebrow ? <Eyebrow label={eyebrow} /> : null}
          <h2 className="mt-4 font-heading text-2xl leading-snug font-bold tracking-tight text-balance sm:text-3xl">
            {headline}
          </h2>
          <div className="mt-8 max-w-prose space-y-5 text-[15px] leading-relaxed md:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 border-t border-border pt-6">
            {signoff ? (
              <p className="text-sm text-muted-foreground">{signoff}</p>
            ) : null}
            <p className="mt-2 font-display text-2xl font-bold tracking-tight">{name}</p>
            <p className="micro-label mt-1 text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
