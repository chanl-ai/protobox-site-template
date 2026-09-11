// Tier cards carry protobox-site's featured treatment: primary border +
// card→muted gradient + badge. Single-offer keeps the honest "not for"
// column on a final-cta-grade surface.

import Link from "next/link"
import { ArrowRight, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SectionHeading } from "@/components/sections/shared"
import type { PricingContent } from "@/lib/sections/types"

export function PricingSingleOffer({ heading, intro, offers }: PricingContent) {
  const offer = offers[0]
  if (!offer) return null
  return (
    <section id="pricing" className="section-pad border-b border-border">
      <div className="container-site">
        <SectionHeading heading={heading} intro={intro} />
        <div className="relative mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-10">
          <div
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-8">
            <h3 className="font-heading text-2xl font-bold tracking-tight">
              {offer.name ?? "The engagement"}
            </h3>
            <p className="text-right">
              <span className="font-display text-4xl font-bold tracking-tight tabular-nums">
                {offer.price}
              </span>
              {offer.priceNote ? (
                <span className="block text-sm text-muted-foreground">
                  {offer.priceNote}
                </span>
              ) : null}
            </p>
          </div>

          <div className="mt-8">
            <h4 className="micro-label text-muted-foreground">What you get</h4>
            <ul className="mt-4 space-y-3">
              {offer.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {offer.notFor?.length ? (
            <>
              <Separator className="my-8" />
              <div>
                <h4 className="micro-label text-muted-foreground">Who it&apos;s not for</h4>
                <ul className="mt-4 space-y-3">
                  {offer.notFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          <Button asChild size="lg" className="mt-8 h-11 w-full px-6 sm:w-auto">
            <Link href={offer.cta.href}>
              {offer.cta.label}
              <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export function PricingTiers({ heading, intro, offers }: PricingContent) {
  return (
    <section id="pricing" className="section-pad border-b border-border">
      <div className="container-site">
        <SectionHeading heading={heading} intro={intro} align="center" />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:mt-14">
          {offers.map((offer) => (
            <div
              key={offer.name ?? offer.price}
              className={`relative flex flex-col overflow-hidden rounded-xl border p-8 ${
                offer.featured
                  ? "border-primary bg-gradient-to-br from-card via-card to-muted/40 shadow-lg"
                  : "border-border/60 bg-card"
              }`}
            >
              {offer.featured ? (
                <div
                  className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3"
                  aria-hidden="true"
                />
              ) : null}
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading text-lg font-bold tracking-tight">{offer.name}</h3>
                {offer.featured ? <Badge>Most popular</Badge> : null}
              </div>
              <p className="mt-5">
                <span className="font-display text-4xl font-bold tracking-tight tabular-nums">
                  {offer.price}
                </span>
                {offer.priceNote ? (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {offer.priceNote}
                  </span>
                ) : null}
              </p>
              <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6">
                {offer.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                variant={offer.featured ? "default" : "outline"}
                className="mt-8 h-11"
              >
                <Link href={offer.cta.href}>{offer.cta.label}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
