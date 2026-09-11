// Content contracts for every section type. Both variants of a type render
// the same contract, so swapping a variant in site.json never touches content.

export interface Cta {
  label: string
  href: string
}

export interface Stat {
  value: string
  label: string
  detail?: string
}

export interface HeroReportMetric {
  name: string
  value: string
  delta?: string
  /** Whether the delta reads as good ("up") or bad ("down") — colors follow. */
  dir?: "up" | "down"
}

/** The layered report-card preview: a document surface instead of an app mock. */
export interface HeroReport {
  title: string
  date?: string
  metrics: HeroReportMetric[]
  /** Floating amber chip note ("$2,400/mo leak found → fixed"). */
  chip?: string
}

export interface HeroContent {
  eyebrow?: string
  /** Supports **…** markers — marked spans render in the second accent. */
  headline: string
  /** Optional tail of the headline rendered in the primary color. */
  headlineAccent?: string
  subhead: string
  primaryCta: Cta
  secondaryCta?: Cta
  /** Fine print under the CTAs; supports **…** markers for emphasis. */
  ctaNote?: string
  bullets?: string[]
  stats?: Stat[]
  report?: HeroReport
}

export interface LogoCloudContent {
  heading?: string
  logos: { name: string; src?: string }[]
}

export interface FeatureGridContent {
  eyebrow?: string
  heading: string
  intro?: string
  items: { title: string; description: string; icon?: string }[]
}

export interface StatsContent {
  heading?: string
  stats: Stat[]
}

export interface TestimonialsContent {
  heading?: string
  items: { quote: string; name: string; role: string }[]
}

export interface PricingOffer {
  name?: string
  /** Mono eyebrow above the offer body ("The engagement"). */
  eyebrow?: string
  /** Small word above the price ("From"). */
  pricePrefix?: string
  price: string
  priceNote?: string
  includes: string[]
  notFor?: string[]
  cta: Cta
  featured?: boolean
}

export interface PricingContent {
  heading: string
  intro?: string
  offers: PricingOffer[]
}

export interface FaqContent {
  heading: string
  intro?: string
  items: { question: string; answer: string }[]
}

export interface CtaBannerContent {
  heading: string
  subhead?: string
  cta: Cta
  secondaryCta?: Cta
  note?: string
}

export interface AboutFounderContent {
  eyebrow?: string
  name: string
  role: string
  headline: string
  paragraphs: string[]
  facts?: { label: string; value: string }[]
  signoff?: string
}

export interface ContactContent {
  heading: string
  intro?: string
  email: string
  phone?: string
  location?: string
  hours?: string[]
  cta?: Cta
  ctaNote?: string
}

export interface FormField {
  name: string
  label: string
  type?: "text" | "email" | "tel" | "textarea"
  required?: boolean
  placeholder?: string
}

export interface FormContactContent {
  heading: string
  intro?: string
  fields: FormField[]
  submitLabel: string
  consent?: string
  successMessage?: string
}

export type SectionType =
  | "hero"
  | "logo-cloud"
  | "feature-grid"
  | "stats"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta-banner"
  | "about-founder"
  | "contact"
  | "form-contact"
