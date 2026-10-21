"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { products, type ProductId } from "@/lib/products";
import { solutionPages } from "@/lib/solution-pages";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { visuals } from "@/components/product/ProductHero";
import { ShowcaseFrame } from "@/components/product/ShowcaseFrame";
import { Intro } from "@/components/product/Sections";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ShotPair } from "@/components/product/ShotPair";
import type { ShotId } from "@/components/shots/meta";
import type { Region } from "@/components/pages/ShotCrop";

type JobShot = { desk: ShotId; region?: Region; phones?: ShotId[] };
/** The real screen behind each job, keyed by the job's title. Jobs without one keep the live product demo. */
const jobShots: Record<string, JobShot> = {
  "Lessons and remedial classes": { desk: "academy-builder", phones: ["phone-live-class"] },
  "Unit tests and term exams online": { desk: "assess-builder", region: [0.16, 0.06, 0.84, 0.66], phones: ["phone-candidate-check"] },
  "Results the same day": { desk: "home-app", region: [0.16, 0.05, 0.84, 0.6], phones: ["phone-student-results"] },
  "Practice that counts": { desk: "academy-player", region: [0, 0, 0.78, 0.7], phones: ["phone-student-lesson"] },
  "Help after school hours": { desk: "ai-student", region: [0.16, 0.04, 0.6, 0.62], phones: ["phone-student-doubt"] },
  "Recorded and live lectures": { desk: "academy-builder" },
  "Crash courses and test series for sale": { desk: "academy-storefront", region: [0, 0.04, 0.84, 0.66], phones: ["phone-course-purchase"] },
  "Batch ranks and section scores": { desk: "assess-review", region: [0.16, 0.06, 0.62, 0.6], phones: ["phone-student-results"] },
  "Weekly proctored mock tests": { desk: "assess-review", phones: ["phone-candidate-check"] },
  "Doubt solving after hours": { desk: "ai-student", region: [0.16, 0.04, 0.6, 0.62], phones: ["phone-student-doubt"] },
  "A storefront on your own domain": { desk: "academy-storefront" },
  "Cohorts and live classes": { desk: "academy-player", phones: ["phone-student-lesson"] },
  "Coding practice and certificates": { desk: "assess-builder", region: [0.16, 0.06, 0.84, 0.66] },
  "Answers between live classes": { desk: "ai-student", region: [0.16, 0.04, 0.6, 0.62], phones: ["phone-student-doubt"] },
};

/**
 * The institution's job list. Each job names the product that covers it;
 * hovering, focusing or tapping a job swaps the stage on the right to that
 * product running live, so the list and the picture answer each other.
 */
export function Needs({ id }: { id: string }) {
  const s = solutionPages[id];
  const [i, setI] = useState(0);
  const need = s.needs[i];
  const pid: ProductId = need.p[0];
  const prod = products.find((p) => p.id === pid)!;
  const V = visuals[pid];
  const shot = jobShots[need.t];

  return (
    <section aria-labelledby="needs-title" className="wrap py-20 md:py-28">
      <Intro label="What you need" index="01" id="needs-title" title="Every job on the list, and what covers it.">
        {s.needs.length} jobs, {new Set(s.needs.flatMap((n) => n.p)).size} products, one record. Point at a job to see the product doing it.
      </Intro>

      <div className="mt-10 grid gap-8 md:mt-12 lg:grid-cols-12 lg:gap-10">
        <ol className="min-w-0 border-t border-line lg:col-span-6" data-cursor="Preview">
          {s.needs.map((n, k) => {
            const on = k === i;
            return (
              <li key={n.t} className="relative border-b border-line">
                {on && <motion.span layoutId={`need-bar-${id}`} aria-hidden className="absolute -top-px bottom-[-1px] left-0 w-[3px]" style={{ background: productColor[n.p[0]] }} transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls="needs-stage"
                  onPointerEnter={(e) => e.pointerType === "mouse" && setI(k)}
                  onFocus={() => setI(k)}
                  onClick={() => setI(k)}
                  className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 py-4 pl-4 pr-2 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]"
                >
                  <span className={cn("pt-1 text-meta num transition-colors", on ? "text-ink" : "text-ink-3")}>{String(k + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className={cn("block text-h4 transition-colors duration-200", on ? "text-ink" : "text-ink-2")}>{n.t}</span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span key="b" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="block overflow-hidden">
                          <span className="block max-w-[52ch] pt-1.5 text-ui text-ink-2">{n.b}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <span className="col-start-2 mt-2 flex flex-wrap gap-1.5 sm:col-start-3 sm:mt-0 sm:justify-end">
                    {n.p.map((x) => (
                      <span key={x} className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-meta text-ink" style={{ background: productSoft[x] }}>
                        <span aria-hidden className="size-2 rounded-[2px]" style={{ background: productColor[x] }} />
                        {products.find((p) => p.id === x)!.name}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div id="needs-stage" aria-live="polite" className="min-w-0 lg:col-span-6">
          <div className="lg:sticky lg:top-24">
            <div className="mb-3 flex items-center justify-between gap-3 text-meta">
              <span className="flex min-w-0 items-center gap-2 text-ink-2">
                <span aria-hidden className="size-2 shrink-0 rounded-[2px]" style={{ background: productColor[pid] }} />
                <span className="truncate">{prod.name}{prod.status ? `, ${prod.status.toLowerCase()}` : ""}</span>
              </span>
              <Link href={prod.href} className="inline-flex min-h-10 items-center gap-1 font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">
                Open {prod.name}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-[28px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={shot ? need.t : pid} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.99 }} transition={{ duration: 0.4, ease: ease.out }}>
                  <ShowcaseFrame field={productSoft[pid]} tight>
                    {shot ? (
                      <ShotPair desk={shot.desk} region={shot.region} phones={shot.phones} width={600} />
                    ) : (
                      <div aria-hidden inert className="max-h-[26rem] overflow-hidden"><V compact /></div>
                    )}
                  </ShowcaseFrame>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-3 text-meta text-ink-3">{shot ? `${prod.name}, product render` : `${prod.name}, live`}{prod.status ? `, ${prod.status.toLowerCase()}` : ""}. Names and figures are illustrative.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
