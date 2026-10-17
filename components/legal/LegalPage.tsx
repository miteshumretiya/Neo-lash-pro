import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import type { LegalDocument } from "@/data/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

/** Shared layout for the returns, privacy and terms pages. */
export function LegalPage({ doc, path }: { doc: LegalDocument; path: string }) {
  return (
    <>
      <PageHero eyebrow={`(Legal) — Updated ${doc.updated}`} title={doc.title} intro={doc.intro} />
      <div className="grid gap-12 px-gutter pb-section lg:grid-cols-12">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <ol className="sticky top-[calc(var(--header-h)+2rem)] space-y-3 border-l border-line pl-5 text-sm">
            {doc.sections.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="group flex gap-3 text-muted transition-colors hover:text-ink">
                  <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  <span className="link-u">{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="max-w-3xl lg:col-span-8 lg:col-start-5">
          {doc.sections.map((section, i) => (
            <Reveal key={section.id} y={20}>
              <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-[calc(var(--header-h)+1.5rem)] border-t border-line py-10">
                <h2 id={`${section.id}-title`} className="flex gap-4 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] leading-tight">
                  <span className="pt-2 font-sans text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-muted md:pl-10">{section.body}</div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: doc.title, path },
        ])}
      />
    </>
  );
}
