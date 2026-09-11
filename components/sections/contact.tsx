// Split: mono-labeled detail rail + action card on the gradient surface.
// Simple: centered close with one address.

import Link from "next/link"
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/sections/shared"
import type { ContactContent } from "@/lib/sections/types"

export function ContactSplit({
  heading,
  intro,
  email,
  phone,
  location,
  hours,
  cta,
  ctaNote,
}: ContactContent) {
  const details: { icon: typeof Mail; body: React.ReactNode }[] = [
    {
      icon: Mail,
      body: (
        <a href={`mailto:${email}`} className="transition-colors hover:text-primary">
          {email}
        </a>
      ),
    },
  ]
  if (phone) details.push({ icon: Phone, body: phone })
  if (location) details.push({ icon: MapPin, body: location })
  if (hours?.length)
    details.push({
      icon: Clock,
      body: (
        <span>
          {hours.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      ),
    })

  return (
    <section id="contact" className="section-pad border-b border-border">
      <div className="container-site grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <SectionHeading heading={heading} intro={intro} />
          <ul className="mt-10 space-y-6">
            {details.map((detail, i) => {
              const Icon = detail.icon
              return (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40">
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                  </span>
                  <span className="pt-1.5 text-sm leading-relaxed">{detail.body}</span>
                </li>
              )
            })}
          </ul>
        </div>
        {cta ? (
          <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-10">
            <div
              className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3"
              aria-hidden="true"
            />
            <h3 className="font-heading text-xl font-bold tracking-tight">{cta.label}</h3>
            {ctaNote ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ctaNote}</p>
            ) : null}
            <Button asChild size="lg" className="mt-6 h-11 w-full px-6 sm:w-auto">
              <Link href={cta.href}>
                {cta.label}
                <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function ContactSimple({ heading, intro, email, cta }: ContactContent) {
  return (
    <section id="contact" className="section-pad border-b border-border">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading heading={heading} intro={intro} align="center" />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {cta ? (
              <Button asChild size="lg" className="h-11 px-6">
                <Link href={cta.href}>
                  {cta.label}
                  <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
            <a
              href={`mailto:${email}`}
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
