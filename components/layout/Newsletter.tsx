"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "@/components/ui/Icons";
import { whatsappUrl } from "@/lib/whatsapp";

type Status = "idle" | "sending" | "done" | "handoff" | "error";

// Set NEXT_PUBLIC_NEWSLETTER=1 together with SUBSCRIBE_WEBHOOK_URL to collect
// sign-ups server-side; otherwise the request is handed to WhatsApp.
const webhookEnabled = process.env.NEXT_PUBLIC_NEWSLETTER === "1";

/** Footer newsletter sign-up with inline success and error states. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    if (!webhookEnabled) {
      // Opened synchronously inside the submit gesture so popup blockers allow it.
      window.open(
        whatsappUrl(`Hi Neo Lash! Please add me to your newsletter for new drops, courses and events: ${email}`),
        "_blank",
        "noopener,noreferrer",
      );
      setStatus("handoff");
      setEmail("");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <p className="eyebrow mb-4 text-cream/50">The Neo Lash letter</p>
      <p className="mb-8 max-w-sm text-cream/75">
        New drops, course dates and Lash &amp; Brow Summit news — a few times a year, never spam.
      </p>
      <div className="group relative border-b border-white/25 focus-within:border-cream">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full bg-transparent py-4 pr-14 text-lg text-cream outline-none placeholder:text-cream/40"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={status === "sending"}
          className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-cream text-night transition-transform duration-500 ease-luxe hover:scale-110 disabled:opacity-50"
        >
          {status === "done" || status === "handoff" ? <Check size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-cream/70">
        {status === "done" && "Thank you — you're on the list."}
        {status === "handoff" && "Almost there — send the WhatsApp message and we'll add you to the list."}
        {status === "error" && "Please check your email address, or message us on WhatsApp."}
      </p>
    </form>
  );
}
