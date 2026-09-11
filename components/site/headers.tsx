// Ported from protobox-site layout/navbar.tsx: sticky, backdrop-blur, mark +
// links + CTA, with a sheet-based mobile menu. Three placements share the
// same weight.

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/site/mobile-nav"
import type { HeaderVariant, SiteBrand } from "@/lib/site"
import type { Cta } from "@/lib/sections/types"

export interface NavItem {
  label: string
  href: string
}

export interface ChromeProps {
  brand: SiteBrand
  nav: NavItem[]
  cta?: Cta
}

function BrandMark({ brand, className = "" }: { brand: SiteBrand; className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span
        className="flex size-7 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground"
        aria-hidden="true"
      >
        {brand.shortName.charAt(0)}
      </span>
      <span className="font-heading text-lg font-bold tracking-tight">
        {brand.shortName}
      </span>
    </Link>
  )
}

function NavLinks({ nav, className = "" }: { nav: NavItem[]; className?: string }) {
  return (
    <nav className={`items-center gap-6 ${className}`}>
      {nav.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export function HeaderMinimal({ brand, nav, cta }: ChromeProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <BrandMark brand={brand} />
        <NavLinks nav={nav} className="hidden md:flex" />
        <div className="flex items-center gap-2">
          {cta ? (
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
          <MobileNav brandName={brand.shortName} nav={nav} cta={cta} />
        </div>
      </div>
    </header>
  )
}

export function HeaderCenter({ brand, nav, cta }: ChromeProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container-site">
        <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          <NavLinks nav={nav.slice(0, Math.ceil(nav.length / 2))} className="hidden md:flex" />
          <BrandMark brand={brand} className="md:justify-self-center" />
          <div className="flex items-center justify-end gap-4">
            <NavLinks nav={nav.slice(Math.ceil(nav.length / 2))} className="hidden md:flex" />
            {cta ? (
              <Link
                href={cta.href}
                className="hidden text-sm font-semibold text-primary underline-offset-4 hover:underline md:inline"
              >
                {cta.label}
              </Link>
            ) : null}
            <MobileNav brandName={brand.shortName} nav={nav} cta={cta} />
          </div>
        </div>
      </div>
    </header>
  )
}

export function HeaderPill({ brand, nav, cta }: ChromeProps) {
  return (
    <header className="sticky top-4 z-40 px-6">
      <div className="mx-auto flex h-13 max-w-3xl items-center justify-between gap-3 rounded-full border border-border bg-background/85 py-2 pr-2 pl-5 shadow-lg shadow-foreground/5 backdrop-blur">
        <BrandMark brand={brand} />
        <div className="flex items-center gap-4">
          <NavLinks nav={nav} className="hidden md:flex" />
          {cta ? (
            <Button asChild size="sm" className="hidden rounded-full md:inline-flex">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
          <MobileNav brandName={brand.shortName} nav={nav} cta={cta} />
        </div>
      </div>
    </header>
  )
}

export function SiteHeader({
  variant,
  ...props
}: ChromeProps & { variant: HeaderVariant }) {
  if (variant === "center") return <HeaderCenter {...props} />
  if (variant === "pill") return <HeaderPill {...props} />
  return <HeaderMinimal {...props} />
}
