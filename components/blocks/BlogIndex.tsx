import Link from "next/link"
import type { Post } from "@/lib/content"

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso))
}

export function BlogIndex({ posts }: { posts: Post[] }) {
  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-heading text-3xl font-medium">Notes on running the numbers</h1>
        <p className="mt-3 text-muted-foreground">
          Short, specific writing on restaurant bookkeeping and margin — no filler.
        </p>

        <ul className="mt-12 space-y-10">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border pb-10 last:border-b-0">
              <time
                dateTime={post.frontmatter.date}
                className="text-sm tabular-nums text-muted-foreground"
              >
                {formatDate(post.frontmatter.date)}
              </time>
              <h2 className="mt-2 font-heading text-xl font-medium">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {post.frontmatter.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Read more &rarr;
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
