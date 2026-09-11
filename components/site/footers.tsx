// Columns variant ported from protobox-site layout/footer.tsx: brand mark +
// tagline, labeled link columns, legal row. Slim and big-brand carry the
// same weight in smaller and louder registers.

import Link from "next/link"
import type { FooterVariant, SiteBrand } from "@/lib/site"
import type { ChromeProps, NavItem } from "@/components/site/headers"

function FooterBrand({ brand }: { brand: SiteBrand }) {
  return (
    <div className="max-w-sm">
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-7 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground"
          aria-hidden="true"
        >
          {brand.shortName.charAt(0)}
        </span>
        <span className="font-heading text-lg font-bold tracking-tight">
          {brand.shortName}
        </span>
      </div>
      {brand.tagline ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {brand.tagline}
        </p>
      ) : null}
    </div>
  )
}

function FooterLinks({ nav }: { nav: NavItem[] }) {
  return (
    <>
      {nav.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}

function LegalRow({ name }: { name: string }) {
  return (
    <div className="border-t border-border">
      <div className="container-site flex flex-wrap items-center justify-between gap-2 py-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <p className="micro-label text-[10px] text-muted-foreground/70">
          Built on the block system
        </p>
      </div>
    </div>
  )
}

export function FooterSlim({ brand, nav }: ChromeProps) {
  return (
    <footer className="mt-auto border-t border-border bg-muted/20">
      <div className="container-site flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {brand.name}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <FooterLinks nav={nav} />
          <a
            href={`mailto:${brand.email}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {brand.email}
          </a>
        </div>
      </div>
    </footer>
  )
}

export function FooterColumns({ brand, nav }: ChromeProps) {
  const half = Math.ceil(nav.length / 2)
  const columns: { title: string; items: NavItem[] }[] = [
    { title: "Explore", items: nav.slice(0, half) },
    { title: "Company", items: nav.slice(half) },
  ].filter((column) => column.items.length > 0)

  return (
    <footer className="mt-auto border-t border-border bg-muted/20">
      <div className="container-site py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <FooterBrand brand={brand} />
          <nav className="grid grid-cols-2 gap-x-14 gap-y-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <div className="micro-label text-muted-foreground">{column.title}</div>
                <FooterLinks nav={column.items} />
              </div>
            ))}
            <div className="flex flex-col gap-3">
              <div className="micro-label text-muted-foreground">Contact</div>
              <a
                href={`mailto:${brand.email}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {brand.email}
              </a>
            </div>
          </nav>
        </div>
      </div>
      <LegalRow name={brand.name} />
    </footer>
  )
}

export function FooterBigBrand({ brand, nav }: ChromeProps) {
  return (
    <footer className="mt-auto overflow-hidden border-t border-border bg-muted/20">
      <div className="container-site pt-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <FooterBrand brand={brand} />
          <div className="flex flex-wrap items-center gap-6">
            <FooterLinks nav={nav} />
            <a
              href={`mailto:${brand.email}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {brand.email}
            </a>
          </div>
        </div>
        <p
          aria-hidden="true"
          className="mt-12 -mb-5 text-center font-display text-[clamp(3.5rem,14vw,10rem)] leading-none font-bold tracking-tight text-foreground/[0.06] select-none"
        >
          {brand.shortName}
        </p>
      </div>
      <LegalRow name={brand.name} />
    </footer>
  )
}

export function SiteFooter({
  variant,
  ...props
}: ChromeProps & { variant: FooterVariant }) {
  if (variant === "columns") return <FooterColumns {...props} />
  if (variant === "big-brand") return <FooterBigBrand {...props} />
  return <FooterSlim {...props} />
}
