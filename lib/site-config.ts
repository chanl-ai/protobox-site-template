// Site-level identity that isn't a "page" — name, contact, footer copy.
// Kept separate from content/pages so a page can be renamed or removed
// without touching branding.

export const siteConfig = {
  name: "Torres Books & Margins",
  // BrandMark splits on the first space: "Torres" + accent "Books&Margins".
  shortName: "Torres Books&Margins",
  description: "Monthly bookkeeping for independent restaurants. Closed by the 10th, every month.",
  email: "maya@torresbooks.com",
  location: "Brooklyn, NY",
  url: "https://torresbooksandmargins.com",
  headerCta: { label: "Book a call", href: "/#pricing" },
  blog: {
    eyebrow: "Notes on running the numbers",
    heading: "The margin notes.",
    intro:
      "Short, specific pieces on restaurant money — written from real closes, with the numbers checked.",
  },
}
