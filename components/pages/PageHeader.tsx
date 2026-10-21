"use client";

import { motion } from "motion/react";
import { Ruler } from "@/components/ui/Backdrop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { MeshField } from "@/components/ui/Shader";

type Fact = { k: string; v: React.ReactNode };

/**
 * Page intro on the 12-col grid: label on top, headline in 8 columns and the
 * lead beside it in 4, bottom aligned, so the right side carries the lead
 * instead of air. `facts` adds a hairline strip of key figures under it.
 */
export function PageHeader({
  label,
  title,
  lead,
  children,
  facts,
  className,
  id = "page-title",
  backdrop = "grid",
}: {
  label: string;
  title: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  facts?: Fact[];
  className?: string;
  id?: string;
  backdrop?: "grid" | "dots" | "hatch" | "cross" | false;
}) {
  return (
    <header className={cn("relative isolate pt-28 md:pt-32", className)}>
      {backdrop && <MeshField palette="brand" className="h-[34rem] [mask-image:linear-gradient(#000_55%,transparent)]" />}
      <div className="wrap">
        <motion.p className="enter-fade marker">{label}</motion.p>
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 id={id} className="text-d1 lg:col-span-8">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span className="enter-rise block [animation-delay:0.05s]">{title}</motion.span>
            </span>
          </h1>
          {(lead || children) && (
            <motion.div className="enter-fade min-w-0 [animation-delay:0.25s] lg:col-span-4 lg:pb-2">
              {lead && <div className="max-w-[46ch] text-lead text-ink-2">{lead}</div>}
              {children}
            </motion.div>
          )}
        </div>
        {facts && <FactStrip facts={facts} className="enter-fade mt-10 [animation-delay:0.35s] md:mt-12" />}
      </div>
    </header>
  );
}

/** A hairline strip of label/value pairs: data that anchors a header or a section edge. */
export function FactStrip({ facts, className }: { facts: Fact[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 border-y border-line md:grid-cols-4", className)}>
      {facts.map((f, i) => (
        <div key={f.k} className={cn("min-w-0 px-0 py-4 md:px-5 md:first:pl-0", i % 2 === 1 && "border-l border-line pl-4 md:pl-5", i > 1 && "border-t border-line md:border-t-0", i >= 1 && "md:border-l")}>
          <dt className="text-meta text-ink-3">{f.k}</dt>
          <dd className="mt-1 truncate text-ui font-medium text-ink">{f.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Fades a block up the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, as = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" | "section" }) {
  const M = as === "li" ? motion.li : as === "section" ? motion.section : motion.div;
  return (
    <M initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.6, ease: ease.out, delay }} className={className}>
      {children}
    </M>
  );
}

/**
 * Section intro: a Ruler across the grid (index, name, column ticks), then
 * the heading in 7 columns with the lead beside it in 5. Without a lead the
 * heading takes 9. `aside` sits under the lead (a stat, a link).
 */
export function SectionIntro({
  label,
  index = "",
  title,
  id,
  size = "d2",
  children,
  aside,
  className,
}: {
  label: string;
  index?: string;
  title: string;
  id: string;
  size?: "d1" | "d2" | "d3";
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  const side = children || aside;
  return (
    <div className={className}>
      <Ruler index={index} label={label} />
      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-12 md:items-end md:gap-10">
        <h2 id={id} className={cn("scroll-mt-28", size === "d1" ? "text-d1" : size === "d3" ? "text-d3" : "text-d2", side ? "md:col-span-7" : "md:col-span-9")}>{title}</h2>
        {side && (
          <div className="min-w-0 md:col-span-5 md:pb-1.5">
            {children && <div className="max-w-[46ch] text-lead text-ink-2">{children}</div>}
            {aside}
          </div>
        )}
      </div>
    </div>
  );
}
