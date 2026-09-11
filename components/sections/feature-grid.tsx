// Cards variant descends from protobox-site capabilities-grid (static form):
// tall cards, bold titles, oversized ghost icon anchored bottom-right.
// List variant descends from protobox-site how-it-works: numbered mono cards.

import { SectionHeading, contentIcon } from "@/components/sections/shared"
import type { FeatureGridContent } from "@/lib/sections/types"

export function FeatureGridCards({ eyebrow, heading, intro, items }: FeatureGridContent) {
  return (
    <section id="features" className="section-pad border-b border-border">
      <div className="container-site">
        <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:mt-14">
          {items.map((item) => {
            const Icon = contentIcon(item.icon)
            return (
              <div
                key={item.title}
                className="flex min-h-[240px] flex-col rounded-xl border border-border/60 bg-card p-8 transition-colors hover:border-primary/40"
              >
                <h3 className="font-heading text-xl leading-snug font-bold tracking-tight sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-auto flex justify-end pt-6">
                  <Icon
                    className="size-14 text-muted-foreground/20"
                    strokeWidth={1.2}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FeatureGridList({ eyebrow, heading, intro, items }: FeatureGridContent) {
  return (
    <section id="features" className="section-pad border-b border-border">
      <div className="container-site">
        <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} align="center" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3 lg:mt-14">
          {items.map((item, index) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-lg leading-snug font-semibold tracking-tight">
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
