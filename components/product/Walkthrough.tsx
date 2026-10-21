"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { products, type ProductId } from "@/lib/products";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { ShowcaseFrame } from "./ShowcaseFrame";
import { academySteps } from "./steps/AcademySteps";
import { assessSteps } from "./steps/AssessSteps";
import { aiSteps } from "./steps/AiSteps";
import { ease } from "@/lib/motion";
import { Ruler } from "@/components/ui/Backdrop";
import { cn } from "@/lib/cn";
import { ShotPair } from "./ShotPair";
import type { ShotId } from "@/components/shots/meta";
import type { Region } from "@/components/pages/ShotCrop";

type StepShot = { desk: ShotId; region?: Region; phones?: ShotId[] } | null;
/**
 * Each step's real screen: the office view at the back and the phone it reaches.
 * null keeps the live widget, where the moving demo explains more than a still
 * (graded practice, certificates, the review queue, the hand-off).
 */
const stepShots: Record<ProductId, StepShot[]> = {
  academy: [{ desk: "academy-player", region: [0, 0, 0.78, 0.7] }, { desk: "academy-builder" }, null, null],
  assess: [{ desk: "assess-builder" }, { desk: "assess-review", region: [0.5, 0.06, 0.5, 0.62] }, null, null],
  ai: [{ desk: "ai-student" }, null, null, { desk: "ai-teacher", region: [0.16, 0.06, 0.62, 0.56] }],
};

function StepView({ id, i, W }: { id: ProductId; i: number; W: React.ComponentType }) {
  const s = stepShots[id][i];
  if (!s) return <W />;
  return <ShotPair desk={s.desk} region={s.region} phones={s.phones} width={760} />;
}

export const stepVisuals: Record<ProductId, React.ComponentType[]> = {
  academy: academySteps,
  assess: assessSteps,
  ai: aiSteps,
};

/** Scrolls to step i of the walkthrough, whichever layout (pinned or stacked) is showing. */
export function jumpToStep(i: number) {
  const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-step-anchor="${i}"]`));
  const el = els.find((e) => e.offsetParent !== null) ?? els[0];
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = el.dataset.pinned ? 0 : 88;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: reduce ? "auto" : "smooth" });
}

const PER = 85; // vh of scroll per step

/**
 * The product's four points as one pinned chapter. Scrolling walks the list
 * on the left and swaps a focused live view on the right. Below lg it
 * unpins into a stack of point + view.
 */
export function Walkthrough({ id, title }: { id: ProductId; title: string }) {
  const p = products.find((x) => x.id === id)!;
  const views = stepVisuals[id];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = p.points.length;
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.999)))));
  const V = views[active];
  const color = productColor[id];

  return (
    <section id="how" aria-label={`How it works: ${title}`} className="relative scroll-mt-16">
      {/* below lg the intro sits above the stack; on lg+ it pins with the stage */}
      <div className="wrap pt-20 md:pt-28 lg:hidden">
        <Ruler index="01" label="How it works" />
        <h2 className="mt-8 text-d2">{title}</h2>
      </div>

      {/* lg+: pinned */}
      <div ref={ref} className="relative mt-8 hidden lg:block" style={{ height: `${n * PER + 20}vh` }}>
        {p.points.map((_, i) => (
          <span key={i} aria-hidden data-step-anchor={i} data-pinned="1" className="absolute left-0" style={{ top: `calc(${((i + 0.12) / n) * (n * PER - 80)}vh + ${((i + 0.12) / n) * 4}rem)` }} />
        ))}
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center">
          <div className="wrap grid grid-cols-12 items-center gap-10">
            <div className="col-span-5 xl:col-span-4">
            <Ruler index="01" label="How it works" />
            <h2 id="how-title" className="mb-8 mt-6 text-d2">{title}</h2>
            <ol className="grid border-l border-line" aria-label={`${p.name} in four steps`}>
              {p.points.map((pt, i) => {
                const on = i === active;
                return (
                  <li key={pt.title} className="relative">
                    <Bar progress={scrollYProgress} i={i} n={n} color={color} />
                    <button onClick={() => jumpToStep(i)} aria-current={on ? "step" : undefined} className="group grid w-full grid-cols-[2.25rem_1fr] py-4 pl-5 pr-2 text-left">
                      <span className={cn("pt-[3px] text-meta num transition-colors", on ? "text-ink" : "text-ink-3")}>{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className={cn("block text-h4 transition-colors duration-300", on ? "text-ink" : "font-normal text-ink-3 group-hover:text-ink-2")}>{pt.title}</span>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span key="b" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: ease.out }} className="block overflow-hidden">
                              <span className="block max-w-[40ch] pt-2 text-ui text-ink-2">{pt.body}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            </div>

            <div className="relative col-span-7 xl:col-span-8">
              <div className="mb-4 flex items-center justify-between text-meta text-ink-3">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-[2px]" style={{ background: color }} />
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={active} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="inline-block text-ink-2">
                      {p.points[active].title}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="num">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 28, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.99 }}
                  transition={{ duration: 0.5, ease: ease.out }}
                >
                  <ShowcaseFrame field={productSoft[id]} tight>
                    <StepView id={id} i={active} W={V} />
                  </ShowcaseFrame>
                </motion.div>
              </AnimatePresence>
              <p className="mt-4 text-meta text-ink-3">Names and figures are illustrative.</p>
            </div>
          </div>
        </div>
      </div>

      {/* below lg: stacked */}
      <div className="wrap grid gap-14 pt-10 lg:hidden">
        {p.points.map((pt, i) => {
          const W = views[i];
          return (
            <article key={pt.title} data-step-anchor={i} className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="flex items-center gap-2.5 text-meta text-ink-3 num"><span className="size-2 rounded-[2px]" style={{ background: color }} />{String(i + 1).padStart(2, "0")}</p>
              </div>
              <div className="min-w-0 md:col-span-9">
                <h3 className="text-d3">{pt.title}</h3>
                <p className="mt-3 max-w-[56ch] text-body text-ink-2">{pt.body}</p>
                <ShowcaseFrame field={productSoft[id]} tight className="mt-6"><StepView id={id} i={i} W={W} /></ShowcaseFrame>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Bar({ progress, i, n, color }: { progress: MotionValue<number>; i: number; n: number; color: string }) {
  const scaleY = useTransform(progress, [i / n, (i + 1) / n], [0, 1], { clamp: true });
  return <motion.span aria-hidden className="absolute -left-px top-0 h-full w-[2px] origin-top" style={{ scaleY, background: color }} />;
}
