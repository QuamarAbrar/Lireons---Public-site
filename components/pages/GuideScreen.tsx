"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, MousePointer2 } from "lucide-react";
import type { Block, GuideProduct } from "@/lib/resources";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { useLoop } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const rail: Record<GuideProduct, string[]> = {
  academy: ["Courses", "Live classes", "Storefront", "Students", "Settings"],
  assess: ["Tests", "Question bank", "Review", "Results", "Settings"],
  ai: ["Doubts", "Sources", "Insights", "Settings"],
  platform: ["People", "Roles", "Audit log", "Settings"],
};
const levels = ["None", "View", "Edit", "Approve"];

/** Bold terms in a section, in order: paths ("A > B") and screen or button names. */
function terms(blocks: Block[]) {
  const text = blocks.map((b) => (b.type === "steps" ? b.items.join(" ") : "text" in b ? b.text : "")).join(" ");
  const all = Array.from(text.matchAll(/\*\*(.+?)\*\*/g), (m) => m[1]);
  const path = all.find((t) => t.includes(">"))?.split(">").map((x) => x.trim()) ?? [];
  const controls = Array.from(new Set(all.filter((t) => !t.includes(">") && t.length <= 28)));
  return { path, controls };
}

/**
 * The screen a guide step happens on, drawn from the guide itself: the menu
 * path becomes the rail and breadcrumb, the bold names become the controls,
 * and the one being talked about is pointed at in turn.
 */
export function GuideScreen({ product, section, index, total, blocks }: { product: GuideProduct; section: string; index: number; total: number; blocks: Block[] }) {
  const { path, controls } = terms(blocks);
  const isLevels = controls.filter((c) => levels.includes(c)).length >= 2;
  const buttons = isLevels ? controls.filter((c) => !levels.includes(c)) : controls;
  const { ref, step } = useLoop(Math.max(buttons.length, isLevels ? 3 : 1), 1600, 0);
  const hue = product === "platform" ? "var(--ink)" : productColor[product];
  const field = product === "platform" ? "var(--surface-2)" : productSoft[product];
  const items = rail[product];
  const here = path[0] ?? items[0];
  const railItems = items.some((r) => r.toLowerCase() === here.toLowerCase()) ? items : [here, ...items].slice(0, 6);
  const crumbs = path.length ? path : [here, section];

  return (
    <figure ref={ref} aria-label={`Screen for: ${section}`} className="frame relative isolate overflow-hidden p-4 xl:p-6" style={{ background: field }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      <div aria-hidden className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2">
        <div className="flex h-10 items-center gap-2 border-b border-line px-3.5">
          <span className="size-2.5 rounded-[3px]" style={{ background: hue }} />
          <span className="truncate text-[12px] text-ink-3">yourschool.lireons.com</span>
          <span className="ml-auto text-[12px] text-ink-3 num">Step {index + 1} of {total}</span>
        </div>
        <div className="grid min-h-[19rem] grid-cols-[6.5rem_1fr]">
          <ul className="border-r border-line bg-paper/60 p-2">
            {railItems.map((r) => {
              const on = r.toLowerCase() === here.toLowerCase();
              return (
                <li key={r} className="relative truncate rounded-[8px] px-2 py-1.5 text-[12px]">
                  {on && <motion.span layoutId="guide-rail" className="absolute inset-0 rounded-[8px]" style={{ background: field }} transition={{ type: "spring", visualDuration: 0.35, bounce: 0.1 }} />}
                  <span className={cn("relative", on ? "font-medium text-ink" : "text-ink-3")}>{r}</span>
                </li>
              );
            })}
          </ul>
          <div className="min-w-0 p-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: ease.out }}>
                <p className="flex flex-wrap items-center gap-1 text-[11px] text-ink-3">
                  {crumbs.map((c, i) => (
                    <span key={c + i} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="size-3" />}
                      <span className={i === crumbs.length - 1 ? "font-medium text-ink" : ""}>{c}</span>
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-[15px] font-medium leading-snug">{section}</p>

                {isLevels ? (
                  <div className="mt-4 grid gap-2">
                    {["Courses", "Students", "Results"].map((m, i) => {
                      const pick = i === step % 3 ? Math.min(2, (step % 3) + 1) : [2, 1, 0][i];
                      return (
                        <div key={m} className="flex items-center justify-between gap-2 text-[12px]">
                          {m}
                          <span className="flex rounded-full bg-inset p-0.5 text-[11px]">
                            {levels.slice(0, 3).map((l, k) => (
                              <span key={l} className="relative rounded-full px-2 py-0.5">
                                {pick === k && <motion.span layoutId={`lvl-${m}`} className="absolute inset-0 rounded-full bg-surface shadow-[inset_0_0_0_1.5px_var(--edge)]" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.12 }} />}
                                <span className={cn("relative", pick === k ? "font-medium text-ink" : "text-ink-3")}>{l}</span>
                              </span>
                            ))}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 grid gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="flex items-center gap-2 rounded-[8px] bg-paper px-2.5 py-2">
                        <span className="h-1.5 rounded-full bg-inset" style={{ width: `${[58, 74, 44][i]}%` }} />
                      </span>
                    ))}
                  </div>
                )}

                {buttons.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {buttons.slice(0, 6).map((b, i) => {
                      const on = i === step % buttons.length;
                      return (
                        <span key={b} className={cn("relative inline-flex h-7 items-center rounded-[8px] border px-2.5 text-[12px] transition-colors duration-300", on ? "font-medium text-ink" : "border-line bg-surface text-ink-2")} style={on ? { background: field, borderColor: hue } : undefined}>
                          {b}
                          {on && (
                            <motion.span layoutId="guide-cursor" className="absolute -bottom-3 -right-2 text-ink" transition={{ type: "spring", visualDuration: 0.4, bounce: 0.15 }}>
                              <MousePointer2 className="size-4 fill-surface" strokeWidth={1.75} />
                            </motion.span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-meta text-ink-2">The screen for this step. Layout simplified.</figcaption>
    </figure>
  );
}
