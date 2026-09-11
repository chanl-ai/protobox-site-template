import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Prose } from "@/components/blocks/Prose"
import type { Post } from "@/lib/content"

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso))
}

/**
 * AEO post template: answer-first lede (the description), TOC from question
 * H2s, author box, visible FAQ (mirrored into FAQPage JSON-LD by the page),
 * and related posts. Structure follows the house GEO rules.
 */
export function BlogPost({ post, related }: { post: Post; related: Post[] }) {
  const { frontmatter, toc } = post
  const h2s = toc.filter((entry) => entry.level === 2)

  return (
    <article>
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          &larr; Back to notes
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <time dateTime={frontmatter.date} className="tabular-nums">
              {formatDate(frontmatter.date)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readTimeMinutes} min read</span>
            {frontmatter.category ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-primary">{frontmatter.category}</span>
              </>
            ) : null}
          </div>
          <h1 className="mt-3 font-heading text-3xl leading-tight font-medium text-balance sm:text-4xl">
            {frontmatter.title}
          </h1>
          {/* Answer-first lede: the description directly answers the title. */}
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {frontmatter.description}
          </p>
          {frontmatter.author ? (
            <p className="mt-4 text-sm">
              <span className="font-medium">{frontmatter.author.name}</span>
              <span className="text-muted-foreground"> — {frontmatter.author.role}</span>
            </p>
          ) : null}
        </header>

        {h2s.length >= 3 ? (
          <nav
            aria-label="Table of contents"
            className="mt-8 rounded-xl border border-border bg-card p-6"
          >
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              In this note
            </p>
            <ol className="mt-3 space-y-2">
              {h2s.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="text-sm text-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="mt-10">
          <Prose html={post.contentHtml} />
        </div>

        {frontmatter.faqs?.length ? (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="font-heading text-2xl font-medium">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="mt-4 w-full">
              {frontmatter.faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-heading text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : null}

        {frontmatter.tags?.length ? (
          <ul className="mt-10 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {related.length ? (
          <aside className="mt-14 border-t border-border pt-10">
            <h2 className="font-heading text-xl font-medium">Keep reading</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/blog/${entry.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
                >
                  <time
                    dateTime={entry.frontmatter.date}
                    className="text-xs tabular-nums text-muted-foreground"
                  >
                    {formatDate(entry.frontmatter.date)}
                  </time>
                  <p className="mt-2 font-heading text-sm leading-snug font-medium group-hover:text-primary">
                    {entry.frontmatter.title}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  )
}
