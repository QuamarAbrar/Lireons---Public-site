"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { products, type ProductId } from "@/lib/products";
import { productColor } from "@/components/visuals/Frame";
import { UnderlineLink } from "@/components/ui/Button";
import { ModuleShell } from "./ModuleShell";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { FaqSection } from "@/components/pages/Accordion";
import { SectionIntro } from "@/components/pages/PageHeader";
import { Backdrop, Ticks } from "@/components/ui/Backdrop";

/* ---------- section intro: Ruler, heading left, lead right (see SectionIntro) ---------- */
export function Intro({ label, index, title, id, size = "d2", children, aside }: { label: string; index?: string; title: string; id: string; size?: "d1" | "d2"; children?: React.ReactNode; aside?: React.ReactNode }) {
  return <SectionIntro label={label} index={index} title={title} id={id} size={size} aside={aside}>{children}</SectionIntro>;
}

/* ---------- modules: one framed app shell, rail + live view ---------- */
export function ModulesList({ id, modules }: { id: ProductId; modules: Record<string, string> }) {
  const p = products.find((x) => x.id === id)!;
  return (
    <section id="modules" aria-labelledby="modules-title" className="relative isolate scroll-mt-16 border-y border-line">
      <Backdrop variant="dots" fade="none" tint="var(--surface-2)" />
      <div className="wrap py-20 md:py-28">
        <Intro label="Modules" index="02" id="modules-title" title={`Everything in ${p.name}, on one screen.`}>
          {Object.keys(modules).length} modules on one record. Pick one to see its view.
        </Intro>
        <div className="mt-10 md:mt-12">
          <ModuleShell id={id} descriptions={modules} />
          <p className="mt-4 text-meta text-ink-3">Names and figures are illustrative.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- works with the rest: this product in the centre, the others around ---------- */
const pairLabel: Record<string, string> = {
  "academy|assess": "Question bank",
  "academy|ai": "Lessons, notes",
  "ai|assess": "Weak topics",
};
const labelFor = (a: ProductId, b: ProductId) => pairLabel[[a, b].sort().join("|")];
// percent positions inside the diagram box: this product at the top, the other two below it
const spots: [number, number][] = [[22, 78], [78, 78]];
const centre: [number, number] = [50, 26];

export function WorksWith({ id, shares }: { id: ProductId; shares: Partial<Record<ProductId, string>> }) {
  const self = products.find((x) => x.id === id)!;
  const others = products.filter((x) => x.id !== id);
  const [hot, setHot] = useState<ProductId>(others[0].id);
  const cur = others.find((o) => o.id === hot)!;
  return (
    <section aria-labelledby="works-title" className="wrap py-20 md:py-28">
      <Intro label="Works with the rest" index="03" id="works-title" title="Same student record as the other two.">
        Switch on another product later and it already knows your students.
      </Intro>

      <div className="mt-10 grid gap-8 md:mt-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative isolate min-w-0 rounded-2xl border border-line p-3 sm:p-6 lg:col-span-7">
        <Backdrop variant="hatch" fade="none" className="rounded-2xl" />
        <Ticks inset={6} />
        <div className="relative aspect-square min-w-0 sm:aspect-[4/3]" data-cursor="Hover a product">
          <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            {others.map((o, i) => {
              const on = o.id === hot;
              const [x, y] = spots[i];
              return (
                <g key={o.id}>
                  <line x1={centre[0]} y1={centre[1]} x2={x} y2={y} stroke="var(--line-2)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                  <line x1={x} y1={y} x2={centre[0]} y2={centre[1]} stroke={productColor[o.id]} strokeWidth={on ? 2.5 : 1.5} strokeDasharray="4 8" vectorEffect="non-scaling-stroke" className="motion-safe:animate-[dash_1.2s_linear_infinite]" style={{ opacity: on ? 1 : 0.4, transition: "opacity 300ms" }} />
                </g>
              );
            })}
          </svg>

          {others.map((o, i) => {
            const [x, y] = spots[i];
            const on = o.id === hot;
            return (
              <span key={`l-${o.id}`} aria-hidden className={cn("absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border bg-paper px-2.5 py-1 text-meta transition-colors duration-300", on ? "border-edge text-ink" : "border-line text-ink-3")} style={{ left: `${(x + centre[0]) / 2}%`, top: `${(y + centre[1]) / 2}%` }}>
                {labelFor(id, o.id)}
              </span>
            );
          })}

          <div className="frame absolute grid w-[8.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center gap-1 bg-surface px-3 py-4 text-center sm:w-44 sm:py-5 dark:shadow-[6px_6px_0_0_oklch(0_0_0/0.6)]" style={{ left: `${centre[0]}%`, top: `${centre[1]}%`, borderRadius: 16 }}>
            <span aria-hidden className="size-3 rounded-[3px]" style={{ background: productColor[id] }} />
            <span className="text-ui font-medium sm:text-h4">{self.name}</span>
            <span className="text-meta text-ink-3">This page</span>
          </div>

          {others.map((o, i) => {
            const [x, y] = spots[i];
            const on = o.id === hot;
            return (
              <Link
                key={o.id}
                href={o.href}
                onPointerEnter={() => setHot(o.id)}
                onFocus={() => setHot(o.id)}
                aria-describedby="works-detail"
                data-cursor="Open"
                className={cn("group absolute flex min-h-11 w-[7.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border bg-surface px-2 py-3 text-center transition-[border-color,box-shadow] duration-300 sm:w-40", on ? "border-edge shadow-[3px_3px_0_0_var(--edge)]" : "border-line hover:border-line-2")}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: productColor[o.id] }} />
                <span className="text-meta font-medium sm:text-ui">{o.name}</span>
                {o.status && <span className="rounded bg-ai-soft px-1.5 text-[12px] font-medium text-ai">{o.status}</span>}
              </Link>
            );
          })}
        </div>
        </div>

        <div className="min-w-0 self-center lg:col-span-5" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={hot} id="works-detail" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: ease.out }} className="border-t-2 pt-4" style={{ borderColor: productColor[hot] }}>
              <p className="label">{self.name} and {cur.name}</p>
              <p className="mt-2 text-d3">{labelFor(id, hot)}</p>
              <p className="mt-3 max-w-[44ch] text-body text-ink-2">{shares[hot]}</p>
              <UnderlineLink href={cur.href} className="mt-3 inline-flex min-h-10 items-center text-ui text-ink">Open {cur.name}</UnderlineLink>
            </motion.div>
          </AnimatePresence>
          <ul className="mt-8 grid grid-cols-3 border-y border-line" aria-label="Shared by every product">
            {["Student ID", "Roles", "Audit log"].map((x, i) => (
              <li key={x} className={cn("py-3 text-ui", i > 0 && "border-l border-line pl-3")}>
                <span className="block text-meta text-ink-3">Shared</span>
                <span className="font-medium">{x}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-ui text-ink-3">
            How the record, roles and audit log work: <UnderlineLink href="/platform" className="text-ink">the platform</UnderlineLink>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ: same layout as the home FAQ ---------- */
export function FaqList({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return <FaqSection id="pfaq-title" title={title} items={items} index="04" className="pb-20 pt-2 md:pb-28" />;
}

/* ---------- closing band: owned by components/pages/CtaBand.tsx ---------- */
export { CtaBand } from "@/components/pages/CtaBand";
