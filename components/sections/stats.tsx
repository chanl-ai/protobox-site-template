// Band variant: primary-filled surface with grid-pattern overlay, oversized
// tabular numerals, mono labels — the layered-surface treatment from
// protobox-site's quote-banner applied to a stat band. Inline variant keeps
// the same numeral scale in the page flow with hairline dividers.

import type { StatsContent } from "@/lib/sections/types"

export function StatsBand({ heading, stats }: StatsContent) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      <div className="container-site relative py-16 md:py-20">
        {heading ? (
          <p className="micro-label opacity-80">{heading}</p>
        ) : null}
        <dl className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dd className="font-display text-5xl font-bold tracking-tight tabular-nums md:text-6xl">
                {stat.value}
              </dd>
              <dt className="mt-3 font-semibold">{stat.label}</dt>
              {stat.detail ? (
                <p className="mt-1.5 text-sm leading-relaxed opacity-80">{stat.detail}</p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function StatsInline({ heading, stats }: StatsContent) {
  return (
    <section className="section-pad border-b border-border">
      <div className="container-site">
        {heading ? <p className="micro-label text-muted-foreground">{heading}</p> : null}
        <dl className="mt-8 grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="py-6 sm:px-10 sm:py-2 sm:first:pl-0 sm:last:pr-0">
              <dd className="font-display text-4xl font-bold tracking-tight tabular-nums text-primary md:text-5xl">
                {stat.value}
              </dd>
              <dt className="mt-2 font-semibold">{stat.label}</dt>
              {stat.detail ? (
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {stat.detail}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
