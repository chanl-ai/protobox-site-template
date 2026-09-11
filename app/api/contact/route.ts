// Contact form sink. With CONTACT_WEBHOOK_URL set, submissions forward to
// that URL (an email service or Zapier/Make hook); without it they are
// acknowledged and logged so the form works end-to-end in the template.

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "site-contact-form", ...payload }),
    })
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Delivery failed" },
        { status: 502 }
      )
    }
  } else {
    console.log("[contact] submission (no CONTACT_WEBHOOK_URL configured):", payload)
  }

  return NextResponse.json({ ok: true })
}
