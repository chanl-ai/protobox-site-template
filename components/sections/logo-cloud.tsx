// Row variant descends from protobox-site platform-logos: right-aligned mono
// micro-label rail beside the mark row. Wall variant keeps the bordered grid,
// raised with card surfaces and hover states.

import type { LogoCloudContent } from "@/lib/sections/types"

// Logos render as styled wordmarks when no image asset is provided, so the
// section holds up before a client has uploaded a single SVG.
function Wordmark({ name, src }: { name: string; src?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- external logo assets have unknown dimensions
    return (
      <img
        src={src}
        alt={name}
        className="h-6 w-auto object-contain opacity-60 transition-opacity hover:opacity-100 md:h-7"
      />
    )
  }
  return (
    <span className="font-heading text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-muted-foreground">
      {name}
    </span>
  )
}

export function LogoCloudRow({ heading, logos }: LogoCloudContent) {
  return (
    <section className="border-b border-border">
      <div className="container-site py-10 md:py-12">
        <div className="mx-auto grid max-w-5xl items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
          {heading ? (
            <p className="micro-label max-w-[16ch] text-muted-foreground/80 md:text-right">
              {heading}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14">
            {logos.map((logo) => (
              <Wordmark key={logo.name} {...logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function LogoCloudWall({ heading, logos }: LogoCloudContent) {
  return (
    <section className="section-pad border-b border-border">
      <div className="container-site">
        {heading ? (
          <p className="micro-label text-muted-foreground">{heading}</p>
        ) : null}
        <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl border border-border sm:grid-cols-3">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center border-r border-b border-border bg-card p-10 transition-colors last:border-r-0 hover:bg-muted/40 sm:[&:nth-child(3n)]:border-r-0 sm:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <Wordmark {...logo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
