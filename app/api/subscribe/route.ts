import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter sign-up. Forwards { email } to SUBSCRIBE_WEBHOOK_URL (Klaviyo,
 * Mailchimp, Zapier, Make…). Enable it in the UI with NEXT_PUBLIC_NEWSLETTER=1.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  if (!email || !EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "Newsletter is not configured." }, { status: 503 });
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source: "neolashpro.com", subscribedAt: new Date().toISOString() }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Subscription service unavailable." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
