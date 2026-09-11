// Fallback rendering for section types the registry doesn't ship. A
// brain-authored spec can name any section type; dropping the entry loses the
// author's words, so this renders whatever recognizable fields the content
// carries as plain prose instead. Not pretty on purpose — it degrades, it
// never deletes.

interface GenericItem {
  title?: string
  label?: string
  body?: string
  description?: string
  text?: string
}

function itemsOf(value: unknown): GenericItem[] {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is GenericItem => typeof entry === "object" && entry !== null)
}

function textOf(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value
  return null
}

export function GenericSection({ content }: { content: Record<string, unknown> }) {
  const eyebrow = textOf(content.eyebrow)
  const headline = textOf(content.headline) ?? textOf(content.title) ?? textOf(content.heading)
  const body =
    textOf(content.subhead) ?? textOf(content.body) ?? textOf(content.text) ?? textOf(content.intro)
  const paragraphs = Array.isArray(content.paragraphs)
    ? content.paragraphs.filter((p): p is string => typeof p === "string")
    : []
  const items = itemsOf(content.items ?? content.features ?? content.points ?? content.blocks)

  if (!headline && !body && !paragraphs.length && !items.length) return null

  return (
    <section className="section-pad border-b border-border">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-medium tracking-wide text-primary uppercase">{eyebrow}</p>
          ) : null}
          {headline ? (
            <h2 className="mt-2 font-heading text-3xl font-medium text-balance">{headline}</h2>
          ) : null}
          {body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{body}</p> : null}
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
          {items.length ? (
            <dl className="mt-8 space-y-6">
              {items.map((item, i) => {
                const title = item.title ?? item.label
                const text = item.body ?? item.description ?? item.text
                if (!title && !text) return null
                return (
                  <div key={title ?? i}>
                    {title ? <dt className="font-medium">{title}</dt> : null}
                    {text ? (
                      <dd className="mt-1 leading-relaxed text-muted-foreground">{text}</dd>
                    ) : null}
                  </div>
                )
              })}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  )
}
