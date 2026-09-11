// Shared long-form renderer: caps line length at prose measure and hands
// styling to @tailwindcss/typography, wired to theme tokens in globals.css.
export function Prose({ html }: { html: string }) {
  return (
    <div
      className="prose prose-neutral max-w-prose prose-headings:font-heading"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
