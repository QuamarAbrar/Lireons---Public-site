"use client";

import { useState } from "react";
import { useScroll, useSpring } from "motion/react";
import { DesktopToc, MobileToc, useScrollSpy } from "@/components/pages/Contents";
import { cn } from "@/lib/cn";
import { prose } from "@/components/pages/prose";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export function LegalDoc({ sections, updated, note, tocLabel = "On this page", layoutKey }: { sections: LegalSection[]; updated: string; note?: React.ReactNode; tocLabel?: string; layoutKey: string }) {
  const [ids] = useState(() => sections.map((s) => s.id));
  const active = useScrollSpy(ids);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <div className="wrap pb-20 pt-10 md:pb-28 md:pt-12">
      {/* mobile: collapsible contents */}
      <MobileToc items={sections} active={active} layoutKey={layoutKey} label={tocLabel} progress={progress} />
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="hidden min-w-0 lg:col-span-3 lg:block">
          {/* desktop: sticky contents with scrollspy */}
          <DesktopToc items={sections} active={active} layoutKey={layoutKey} label={tocLabel} progress={progress} />
        </div>

        <article className="min-w-0 lg:col-span-8 lg:col-start-5">
          <p className="sr-only">Last updated <time dateTime="2026-10-20">{updated}</time></p>
          {note && (
            <div role="note" className="rounded-2xl border border-warn/40 bg-warn-soft px-5 py-4 text-ui text-ink">
              {note}
            </div>
          )}
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-b border-line py-10 last:border-0">
              <div className="grid gap-3 md:grid-cols-[3.5rem_1fr]">
                <span className="pt-1.5 text-meta text-ink-3 num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h2 id={`${s.id}-h`} className="text-h3 leading-tight tracking-[-0.022em] text-ink">{s.title}</h2>
                  <div className={cn("mt-5", prose)}>{s.body}</div>
                </div>
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
