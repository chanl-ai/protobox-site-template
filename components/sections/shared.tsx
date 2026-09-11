import type { LucideIcon } from "lucide-react"
import {
  AlarmClock,
  BarChart3,
  Bell,
  CalendarCheck,
  ChefHat,
  Gauge,
  Layers,
  LineChart,
  MessageSquare,
  Plug,
  Receipt,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react"

/** Dot + tracked uppercase label — the section eyebrow treatment. */
export function Eyebrow({ label, center }: { label: string; center?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${center ? "justify-center" : ""}`}>
      <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
      <span className="text-sm font-semibold tracking-wider text-primary uppercase">
        {label}
      </span>
    </div>
  )
}

/**
 * Eyebrow + bold heading + muted intro. The intro renders as a muted
 * continuation line under the heading, production-marketing weight.
 */
export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = "left",
}: {
  eyebrow?: string
  heading: string
  intro?: string
  align?: "left" | "center"
}) {
  const centered = align === "center"
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <Eyebrow label={eyebrow} center={centered} /> : null}
      <h2 className="mt-4 font-heading text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl md:text-[2.75rem]">
        {heading}
      </h2>
      {intro ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
          {intro}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Static product-preview surface: a framed app window built entirely from
 * theme tokens — sidebar, stat cards, bar chart, table skeleton. Stands in
 * for real product imagery so any brand's hero has a visual before a single
 * screenshot exists. Deterministic (no randomness) so SSR/CSR agree.
 */
export function PreviewSurface({
  title,
  stats,
}: {
  title?: string
  stats?: { value: string; label: string }[]
}) {
  const bars = [42, 68, 54, 82, 61, 90, 73, 58, 79, 66, 88, 71]
  const rows = [
    ["w-24", "w-40", "w-16", "w-12"],
    ["w-28", "w-32", "w-20", "w-12"],
    ["w-20", "w-44", "w-14", "w-12"],
    ["w-32", "w-36", "w-16", "w-12"],
  ]
  const statCards = (stats ?? []).slice(0, 3)

  const tabs = statCards
  return (
    <div className="relative overflow-hidden rounded-sm shadow-2xl ring-8 ring-foreground/5 md:ring-[12px]">
      {/* Tab strip — the preview surface's own navigation, driven by stats */}
      {tabs.length ? (
        <div className="relative grid grid-cols-1 divide-x divide-y divide-border border-b-[3px] border-border bg-muted/20 sm:grid-cols-3 sm:divide-y-0">
          {tabs.map((tab, i) => {
            const active = i === 0
            return (
              <div
                key={tab.label}
                className={`relative flex flex-col gap-1.5 px-5 py-4 text-left ${
                  active ? "bg-background" : "bg-transparent"
                }`}
              >
                <div className="flex w-full items-center gap-3">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-md border font-display text-[13px] font-bold ${
                      active
                        ? "border-border bg-muted text-primary"
                        : "border-transparent bg-muted/60 text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`truncate font-heading text-base font-semibold tracking-tight ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {tab.value}
                  </span>
                </div>
                <span className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {tab.label}
                </span>
                {active ? (
                  <span
                    className="absolute inset-x-0 -bottom-[3px] z-10 h-[3px] bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </span>
          {title ? (
            <span className="ml-2 hidden rounded-md border border-border bg-background px-3 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
              {title}
            </span>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-[0_1fr] bg-background sm:grid-cols-[170px_1fr]">
        {/* Sidebar skeleton */}
        <aside className="hidden border-r border-border bg-muted/20 p-3 sm:block" aria-hidden="true">
          <div className="mb-4 h-6 w-6 rounded-md bg-primary/80" />
          <div className="space-y-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                  i === 0 ? "bg-accent" : ""
                }`}
              >
                <span
                  className={`size-3.5 rounded-sm ${i === 0 ? "bg-primary" : "bg-border"}`}
                />
                <span
                  className={`h-2 rounded-full ${
                    i === 0 ? "w-16 bg-foreground/50" : "w-14 bg-border"
                  }`}
                />
              </div>
            ))}
          </div>
        </aside>

        {/* Main pane */}
        <div className="p-4 sm:p-5" aria-hidden="true">
          <div className="flex items-center justify-between gap-4">
            <span className="h-3 w-36 rounded-full bg-foreground/25" />
            <span className="h-6 w-20 rounded-md bg-primary" />
          </div>

          {/* Stat card skeletons — real values live in the tab strip above */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-3">
                <div className="h-4 w-14 rounded-full bg-foreground/30" />
                <div className="mt-2 h-2 w-20 rounded-full bg-border" />
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="mt-4 rounded-lg border border-border bg-card p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="h-2.5 w-24 rounded-full bg-foreground/25" />
              <span className="flex gap-2">
                <span className="h-2 w-10 rounded-full bg-chart-1/60" />
                <span className="h-2 w-10 rounded-full bg-chart-2/60" />
              </span>
            </div>
            <div className="flex h-20 items-end gap-1.5 sm:h-24">
              {bars.map((height, i) => (
                <span
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`flex-1 rounded-t-sm ${
                    i % 3 === 0 ? "bg-chart-1/70" : i % 3 === 1 ? "bg-chart-2/50" : "bg-chart-3/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Table skeleton */}
          <div className="mt-4 hidden overflow-hidden rounded-lg border border-border sm:block">
            {rows.map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-6 px-3 py-2 ${
                  i > 0 ? "border-t border-border" : "bg-muted/30"
                }`}
              >
                {row.map((width, j) => (
                  <span
                    key={j}
                    className={`h-2 rounded-full ${width} ${
                      i === 0 ? "bg-foreground/30" : "bg-border"
                    } ${j === 3 ? "ml-auto" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/90 to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}

// Content files name icons as strings; unknown names fall back to Sparkles
// rather than crashing a render over a typo in a JSON blob.
const ICONS: Record<string, LucideIcon> = {
  "alarm-clock": AlarmClock,
  "bar-chart": BarChart3,
  bell: Bell,
  "calendar-check": CalendarCheck,
  "chef-hat": ChefHat,
  gauge: Gauge,
  layers: Layers,
  "line-chart": LineChart,
  "message-square": MessageSquare,
  plug: Plug,
  receipt: Receipt,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  users: Users,
  wallet: Wallet,
  zap: Zap,
}

export function contentIcon(name?: string): LucideIcon {
  return (name && ICONS[name]) || Sparkles
}
