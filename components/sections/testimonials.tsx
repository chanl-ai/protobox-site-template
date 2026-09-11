// Single variant descends from protobox-site quote-banner: layered card with
// grid-pattern overlay, primary left rule, oversized serif quote mark, mono
// attribution. Grid variant carries the same surface language across cards.

import { SectionHeading } from "@/components/sections/shared"
import type { TestimonialsContent } from "@/lib/sections/types"

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function TestimonialsSingle({ items }: TestimonialsContent) {
  const item = items[0]
  if (!item) return null
  return (
    <section className="section-pad border-b border-border">
      <div className="container-site">
        <figure className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-card px-8 py-12 md:px-14 md:py-16">
          <div className="grid-overlay pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />
          <div
            className="absolute top-12 left-0 h-[calc(100%-6rem)] w-[3px] bg-primary"
            aria-hidden="true"
          />
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute -top-6 -left-1 font-display text-7xl leading-none text-primary opacity-30"
            >
              &ldquo;
            </span>
            <blockquote className="font-heading text-xl leading-snug font-medium text-balance md:text-2xl lg:text-3xl">
              {item.quote}
            </blockquote>
            <figcaption className="micro-label mt-6 text-muted-foreground">
              — {item.name} · {item.role}
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  )
}

export function TestimonialsGrid({ heading, items }: TestimonialsContent) {
  return (
    <section className="section-pad border-b border-border">
      <div className="container-site">
        {heading ? <SectionHeading heading={heading} /> : null}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:mt-12">
          {items.map((item) => (
            <figure
              key={item.name}
              className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-xl border border-border/60 bg-card p-8"
            >
              <span
                aria-hidden="true"
                className="absolute top-2 left-4 font-display text-6xl leading-none text-primary opacity-15"
              >
                &ldquo;
              </span>
              <blockquote className="relative pt-6 text-[15px] leading-relaxed">
                {item.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-border pt-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {initials(item.name)}
                </span>
                <span className="text-xs">
                  <span className="block font-semibold">{item.name}</span>
                  <span className="micro-label mt-0.5 block text-[10px] text-muted-foreground">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
