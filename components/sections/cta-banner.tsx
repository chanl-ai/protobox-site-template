// Panel variant descends from protobox-site final-cta: rounded-2xl bordered
// card on a card→muted gradient, centered close. Strip stays the quiet ask,
// raised to the same surface language.

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CtaBannerContent } from "@/lib/sections/types"

export function CtaBannerPanel({ heading, subhead, cta, secondaryCta, note }: CtaBannerContent) {
  return (
    <section className="section-pad border-b border-border">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 px-8 py-14 md:px-14 md:py-20">
          <div
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
              {heading}
            </h2>
            {subhead ? (
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
                {subhead}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-11 px-6">
                <Link href={cta.href}>
                  {cta.label}
                  <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                </Link>
              </Button>
              {secondaryCta ? (
                <Button asChild size="lg" variant="outline" className="h-11 px-6">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
            {note ? <p className="mt-6 text-sm text-muted-foreground">{note}</p> : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export function CtaBannerStrip({ heading, subhead, cta, secondaryCta, note }: CtaBannerContent) {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="container-site flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center md:py-16">
        <div>
          <h2 className="font-heading text-2xl leading-tight font-bold tracking-tight text-balance md:text-3xl">
            {heading}
          </h2>
          {subhead ? (
            <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">{subhead}</p>
          ) : null}
          {note ? (
            <p className="micro-label mt-3 text-muted-foreground">{note}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-11 px-6">
            <Link href={cta.href}>
              {cta.label}
              <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
            </Link>
          </Button>
          {secondaryCta ? (
            <Button asChild size="lg" variant="outline" className="h-11 px-6">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
