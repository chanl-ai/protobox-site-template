"use client"

// Client block: posts to /api/contact (a logged no-op until an email/webhook
// destination is configured via CONTACT_WEBHOOK_URL). Both variants share the
// FormContactContent contract.

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SectionHeading } from "@/components/sections/shared"
import type { FormContactContent, FormField } from "@/lib/sections/types"

type FormState = "idle" | "sending" | "sent" | "error"

function Field({ field }: { field: FormField }) {
  const id = `contact-${field.name}`
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {field.label}
        {field.required ? <span className="text-primary"> *</span> : null}
      </Label>
      {field.type === "textarea" ? (
        <Textarea
          id={id}
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          rows={4}
        />
      ) : (
        <Input
          id={id}
          name={field.name}
          type={field.type ?? "text"}
          required={field.required}
          placeholder={field.placeholder}
        />
      )}
    </div>
  )
}

function ContactForm({ content }: { content: FormContactContent }) {
  const [state, setState] = useState<FormState>("idle")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setState("sending")
    try {
      const data = Object.fromEntries(new FormData(form).entries())
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`contact endpoint returned ${res.status}`)
      form.reset()
      setState("sent")
    } catch {
      setState("error")
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-heading text-lg font-medium">
          {content.successMessage ?? "Sent. You'll hear back within one business day."}
        </p>
        <Button variant="link" className="mt-2" onClick={() => setState("idle")}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {content.fields.map((field) => (
        <Field key={field.name} field={field} />
      ))}
      <div className="grid gap-3">
        <Button type="submit" size="lg" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : content.submitLabel}
        </Button>
        {state === "error" ? (
          <p className="text-sm text-destructive" role="alert">
            That didn&apos;t go through. Try again, or email us directly.
          </p>
        ) : null}
        {content.consent ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{content.consent}</p>
        ) : null}
      </div>
    </form>
  )
}

/** Centered card form. */
export function FormContactCard(content: FormContactContent) {
  return (
    <section id="contact-form" className="section-pad border-b border-border">
      <div className="container-site max-w-2xl">
        <SectionHeading heading={content.heading} intro={content.intro} align="center" />
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3" aria-hidden="true" />
          <ContactForm content={content} />
        </div>
      </div>
    </section>
  )
}

/** Heading rail left, form right. */
export function FormContactSplit(content: FormContactContent) {
  return (
    <section id="contact-form" className="section-pad border-b border-border">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading heading={content.heading} intro={content.intro} />
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3" aria-hidden="true" />
          <ContactForm content={content} />
        </div>
      </div>
    </section>
  )
}
