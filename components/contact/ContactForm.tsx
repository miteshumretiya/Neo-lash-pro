"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ArrowRight, Check, WhatsApp } from "@/components/ui/Icons";
import { whatsappUrl } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

gsap.registerPlugin(DrawSVGPlugin);

const topics = ["A salon treatment", "Products & orders", "Academy & courses", "Lash & Brow Summit", "Something else"];

type Fields = { name: string; contact: string; topic: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-5 origin-left text-muted transition-[transform,color] duration-500 ease-luxe peer-focus:-translate-y-5 peer-focus:scale-[0.78] peer-focus:text-ink peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-[0.78]"
      >
        {label}
      </label>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-700 ease-luxe peer-focus:scale-x-100" />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#b45d4c]">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Contact form with floating labels. There is no server inbox: on submit the
 * message is composed into WhatsApp, where the studio replies.
 */
export function ContactForm() {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<Fields>({ name: "", contact: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const set = (key: keyof Fields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  useGSAP(
    () => {
      if (!sentUrl) return;
      gsap.from("[data-success] > *", { autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.9, ease: "luxe" });
      gsap.from("[data-check]", { drawSVG: "0%", duration: 0.9, delay: 0.2, ease: "luxe" });
    },
    { dependencies: [sentUrl], scope: root },
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    if (!fields.name.trim()) next.name = "Please tell us your name.";
    if (fields.message.trim().length < 5) next.message = "Please write a short message.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    const text = [
      `Hi Neo Lash! My name is ${fields.name.trim()}.`,
      `Topic: ${fields.topic}`,
      "",
      fields.message.trim(),
      fields.contact.trim() ? `\nYou can also reach me at: ${fields.contact.trim()}` : "",
    ].join("\n");
    const url = whatsappUrl(text);
    // Opened synchronously inside the submit gesture so it isn't blocked as a popup.
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  const inputClass =
    "peer block w-full rounded-none border-0 border-b border-line bg-transparent pb-3 pt-6 text-[1.1rem] outline-none placeholder:text-transparent focus-visible:outline-none";

  return (
    <div ref={root}>
      {sentUrl ? (
        <div data-success role="status" className="rounded-frame bg-surface p-[clamp(1.75rem,4vw,3rem)]">
          <span className="grid size-16 place-items-center rounded-full bg-sage text-night">
            <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden="true">
              <path data-check d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="mt-8 font-display text-title">Your message is ready</p>
          <p className="mt-3 max-w-md text-muted">
            We&apos;ve opened WhatsApp with your message written for you — just press send and we&apos;ll reply as soon as we can.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn bg-whatsapp text-white hover:bg-[#17703c]">
              <span className="inline-flex items-center gap-2">
                <WhatsApp size={17} /> Open WhatsApp again
              </span>
            </a>
            <button type="button" onClick={() => setSentUrl(null)} className="btn btn-ghost">
              <span>Write another message</span>
            </button>
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={submit} className="space-y-9" aria-describedby={`${id}-note`}>
          <div className="grid gap-9 sm:grid-cols-2">
            <Field id={`${id}-name`} label="Your name" error={errors.name}>
              <input
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={fields.name}
                onChange={(e) => set("name")(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${id}-name-error` : undefined}
                required
                className={inputClass}
              />
            </Field>
            <Field id={`${id}-contact`} label="Email or phone (optional)">
              <input
                id={`${id}-contact`}
                name="contact"
                autoComplete="email"
                placeholder="Email or phone"
                value={fields.contact}
                onChange={(e) => set("contact")(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-4 text-sm text-muted">I&apos;m writing about</legend>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <label
                  key={topic}
                  className={cn(
                    "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sage-ink",
                    fields.topic === topic ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink",
                  )}
                >
                  <input
                    type="radio"
                    name="topic"
                    value={topic}
                    checked={fields.topic === topic}
                    onChange={() => set("topic")(topic)}
                    className="sr-only"
                  />
                  {topic}
                </label>
              ))}
            </div>
          </fieldset>

          <Field id={`${id}-message`} label="Your message" error={errors.message}>
            <textarea
              id={`${id}-message`}
              name="message"
              rows={4}
              placeholder="Your message"
              value={fields.message}
              onChange={(e) => set("message")(e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${id}-message-error` : undefined}
              required
              className={cn(inputClass, "resize-none")}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-5">
            <button type="submit" className="btn btn-solid" data-cursor="Send">
              <span className="inline-flex items-center gap-2">
                Send via WhatsApp <ArrowRight size={15} />
              </span>
            </button>
            <p id={`${id}-note`} className="flex max-w-xs items-start gap-2 text-sm text-muted">
              <Check size={15} className="mt-0.5 shrink-0 text-sage-ink" />
              Opens WhatsApp to {site.whatsapp.display} — nothing is stored on this website.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
