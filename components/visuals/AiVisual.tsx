"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BarChart3, BookOpen, Camera, CornerDownLeft, UserRound } from "lucide-react";
import { Frame, Initials } from "./Frame";
import { Spot } from "./Spot";
import { useLoop } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ThinkingOrb } from "@/components/ui/Shader";

const convos = [
  {
    q: "Solve 2x² − 5x + 3 = 0. I keep getting the signs wrong.",
    photo: "2x² − 5x + 3 = 0",
    steps: ["Here a = 2, b = −5, c = 3.", "Two numbers that multiply to ac = 6 and add to −5 are −2 and −3.", "2x² − 2x − 3x + 3 = (2x − 3)(x − 1)", "So x = 3/2 or x = 1."],
    cite: "Ch 4 Quadratics · Lesson 3, 06:12",
    conf: 0.94,
  },
  {
    q: "Why does ice float if it is solid water?",
    photo: null,
    steps: ["Water expands by about 9% when it freezes.", "Hydrogen bonds hold the molecules in an open hexagonal lattice.", "Same mass, larger volume, so ice is less dense than water and floats."],
    cite: "Ch 2 States of Matter · Notes p. 14",
    conf: 0.91,
  },
];
const topics = [
  { t: "Quadratics", n: 42 },
  { t: "Friction", n: 31 },
  { t: "States of matter", n: 18 },
  { t: "Light", n: 12 },
];

/** Types text in at reading pace; shows all of it immediately when motion is reduced. */
function Typed({ text, run }: { text: string; run: boolean }) {
  const [n, setN] = useState(run ? 0 : text.length);
  useEffect(() => {
    if (!run) { setN(text.length); return; }
    setN(0);
    const id = window.setInterval(() => setN((v) => {
      if (v >= text.length) { window.clearInterval(id); return v; }
      return v + 2;
    }), 22);
    return () => window.clearInterval(id);
  }, [text, run]);
  return <>{text.slice(0, n)}{run && n < text.length && <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] bg-ai motion-safe:animate-[blink_1s_steps(1)_infinite]" />}</>;
}

// per conversation: 0 reading, 1 source found, 2..n steps stream in, then rest
const PER = 7;

/**
 * A doubt answered from the institution's own notes. `focus` (a point index
 * from lib/products) rings the matching part: 0 the cited source, 1 the photo
 * question, 2 the confidence and teacher hand-off, 3 topic insights.
 */
export function AiVisual({ className, compact, focus }: { className?: string; compact?: boolean; focus?: number }) {
  const g = useId();
  const { ref, step, reduce } = useLoop(convos.length * PER, 1600, PER - 1);
  // the photo point needs the photo conversation on screen
  const ci = focus === 1 ? 0 : Math.floor(step / PER) % convos.length;
  const local = reduce ? PER - 1 : step % PER;
  const c = convos[ci];
  const shown = Math.max(0, Math.min(c.steps.length, local - 1));
  const sourced = local >= 1;

  return (
    <div ref={ref} className={className}>
      <Frame product="ai" title="Doubt solver" meta={<span className="rounded-md bg-ai-soft px-1.5 py-0.5 text-[12px] font-medium text-ai">Coming soon</span>}>
        <div className={cn("grid grid-cols-[minmax(0,1fr)]", !compact && "md:grid-cols-[minmax(0,1fr)_13.5rem]")}>
          <div className="flex min-h-[360px] min-w-0 flex-col gap-3 p-4 sm:p-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={ci} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="flex flex-col gap-3">
                <div className="ml-auto flex max-w-[88%] items-end gap-2">
                  <Spot on={focus === 1} group={g} product="ai">
                    <div className="rounded-2xl rounded-br-md bg-inverse px-3.5 py-2.5 text-[13px] text-on-inverse">
                      {c.photo && <Photo text={c.photo} />}
                      {c.q}
                    </div>
                  </Spot>
                  <Initials name="Ananya P" hue={20} size={24} />
                </div>

                <div className="flex max-w-[94%] items-start gap-2">
                  {compact ? (
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ai-soft text-ai">
                      <span className="size-2 rounded-[2px] bg-current" />
                    </span>
                  ) : (
                    // the thinking orb turns fast while the answer is being found and written, then settles
                    <ThinkingOrb className="-m-1.5 size-9" busy={shown < c.steps.length} />
                  )}
                  <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-line bg-surface-2/60 px-3.5 py-2.5 text-[13px]">
                    <Spot on={focus === 0} group={g} product="ai" className="w-fit max-w-full">
                      <span className={cn("inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium transition-colors duration-300", sourced ? "bg-ai-soft text-ai" : "bg-inset text-ink-3")}>
                        <BookOpen className="size-3.5 shrink-0" />
                        <span className="truncate">{sourced ? c.cite : "Searching your notes"}</span>
                      </span>
                    </Spot>
                    <div className="mt-2.5">
                      {shown === 0 ? (
                        <div className="grid gap-2 py-1" role="status" aria-label="Writing the answer">
                          {[0.92, 0.7, 0.5].map((w, i) => (
                            <span key={i} className="skeleton h-2.5 rounded-full" style={{ width: `${w * 100}%` }} />
                          ))}
                        </div>
                      ) : (
                        <ol className="grid gap-1.5">
                          {c.steps.slice(0, shown).map((s, i) => (
                            <motion.li key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="flex gap-2">
                              <span className="mt-[1px] w-3 shrink-0 text-[12px] font-medium text-ai num">{i + 1}</span>
                              <span className="leading-snug"><Typed text={s} run={!reduce && i === shown - 1} /></span>
                            </motion.li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-auto grid gap-3">
              {compact && focus === 3 ? (
                <Spot on group={g} product="ai"><Insights /></Spot>
              ) : (
                <Spot on={focus === 2} group={g} product="ai">
                  <Handoff conf={c.conf} done={shown >= c.steps.length} />
                </Spot>
              )}
              <div className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-[13px] text-ink-3">
                <Camera className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="flex-1 truncate">Ask a doubt or snap a problem</span>
                <CornerDownLeft className="size-4 shrink-0" strokeWidth={1.75} />
              </div>
            </div>
          </div>

          {!compact && (
            <div className="border-t border-line p-3 md:border-l md:border-t-0">
              <Spot on={focus === 3} group={g} product="ai"><Insights /></Spot>
            </div>
          )}
        </div>
      </Frame>
    </div>
  );
}

/** The photographed problem, drawn as a notebook snippet. */
function Photo({ text }: { text: string }) {
  return (
    <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-white/10 p-1.5 pr-2.5">
      <span className="relative grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-md bg-[oklch(0.96_0.01_90)] text-[oklch(0.3_0.04_260)]" aria-hidden>
        <span className="absolute inset-x-0 top-[30%] h-px bg-[oklch(0.8_0.04_240)]" />
        <span className="absolute inset-x-0 top-[62%] h-px bg-[oklch(0.8_0.04_240)]" />
        <span className="relative -rotate-3 text-[12px] font-medium italic leading-none">{text.split(" = ")[0]}</span>
      </span>
      <span className="text-[12px] text-on-inverse/80">
        <Camera className="mr-1 inline size-3.5 -translate-y-px" />Photo read
      </span>
    </div>
  );
}

function Handoff({ conf, done }: { conf: number; done: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="flex items-center justify-between text-[12px]">
          <span className="text-ink-3">Confidence</span>
          <span className="font-medium num">{done ? conf.toFixed(2) : "checking"}</span>
        </p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-inset">
          <motion.div className="h-full origin-left rounded-full bg-ai" initial={false} animate={{ scaleX: done ? conf : 0.35 }} transition={{ duration: 0.6, ease: ease.out }} />
        </div>
      </div>
      <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-line-2 px-2.5 text-[12px] font-medium text-ink-2">
        <UserRound className="size-3.5" />Ask Mr. Kulkarni
      </span>
    </div>
  );
}

function Insights() {
  const max = topics[0].n;
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="flex items-center gap-1.5 text-[12px] font-medium"><BarChart3 className="size-3.5 text-ai" strokeWidth={2} />Doubts this week</p>
      <ul className="mt-3 grid gap-2.5">
        {topics.map((x, i) => (
          <li key={x.t}>
            <p className="flex items-center justify-between text-[12px]">
              <span className={cn("truncate", i === 0 ? "font-medium" : "text-ink-2")}>{x.t}</span>
              <span className="text-ink-3 num">{x.n}</span>
            </p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-inset">
              <div className={cn("h-full rounded-full", i === 0 ? "bg-ai" : "bg-ai/45")} style={{ width: `${(x.n / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] text-ink-3">Class 10 · all subjects</p>
    </div>
  );
}
