"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Ruler } from "@/components/ui/Backdrop";

type Item = { q: string; a: React.ReactNode };

/** Question list: the question leads at h4, the answer sits under it at ui size. One open at a time. */
export function Accordion({ items, initial = 0, className }: { items: Item[]; initial?: number | null; className?: string }) {
  const [open, setOpen] = useState<number | null>(initial);
  const uid = useId();
  return (
    <ul className={className}>
      {items.map((f, i) => (
        <li key={f.q} className="border-b border-line">
          <h3>
            <button
              id={`${uid}-b${i}`}
              className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-h4 transition-colors hover:text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              aria-expanded={open === i}
              aria-controls={`${uid}-p${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {f.q}
              <Plus className={cn("size-5 shrink-0 text-ink-3 transition-transform duration-300 ease-[var(--ease-out)] group-hover:text-ink", open === i && "rotate-45 text-ink")} strokeWidth={1.75} />
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-b${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="overflow-hidden">
                <div className="max-w-[60ch] pb-6 pr-10 text-ui leading-relaxed text-ink-2">{f.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}

/**
 * FAQ section: a Ruler across the top, then the heading, lead and a way to
 * ask something else in a sticky left column (4), questions on the right (8).
 */
export function FaqSection({ id, title, items, className, children, label = "Questions", index = "" }: { id: string; title: string; items: Item[]; className?: string; children?: React.ReactNode; label?: string; index?: string }) {
  return (
    <section aria-labelledby={id} className={cn("wrap", className ?? "py-20 md:py-28")}>
      <Ruler index={index} label={label} />
      <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id={id} className="scroll-mt-28 text-d2">{title}</h2>
            {children && <div className="mt-5 max-w-[40ch] text-lead text-ink-2">{children}</div>}
            <dl className="mt-8 hidden grid-cols-2 border-y border-line text-ui lg:grid">
              <div className="py-4 pr-4">
                <dt className="text-meta text-ink-3">Answered here</dt>
                <dd className="mt-1 figure text-d3 num">{items.length}</dd>
              </div>
              <div className="border-l border-line py-4 pl-4">
                <dt className="text-meta text-ink-3">Anything else</dt>
                <dd className="mt-1"><a href="mailto:hello@lireons.com" className="-my-2 inline-block py-2 font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">hello@lireons.com</a></dd>
              </div>
            </dl>
          </div>
        </div>
        <Accordion items={items} className="min-w-0 border-t border-line lg:col-span-8" />
      </div>
    </section>
  );
}
