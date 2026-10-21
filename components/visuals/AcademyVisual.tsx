"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, Check, CodeXml, Lock, Play, Radio } from "lucide-react";
import { Frame, Initials, LiveDot } from "./Frame";
import { Spot } from "./Spot";
import { useLoop, useTick } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const lessons = [
  { t: "Newton's laws, recap", m: 12 },
  { t: "Free-body diagrams", m: 18 },
  { t: "Friction on an incline", m: 22 },
  { t: "Practice set 3", m: 15, quiz: true },
  { t: "Live doubt hour", m: 45, live: true },
];
const captions = [
  "Resolve the weight into two components,",
  "one along the incline, mg sin θ,",
  "and one into the surface, mg cos θ.",
  "Friction opposes motion along the slope.",
];
const chat = [
  { n: "Riya", hue: 330, m: "Why sin for the parallel part?" },
  { n: "Dev", hue: 160, m: "Got 4.9 m/s² for part b" },
  { n: "Anya", hue: 60, m: "Can we redo the 30° example?" },
  { n: "Sahil", hue: 230, m: "Thank you sir, clear now" },
];

/**
 * A branded course page with a live class. `focus` (a point index from
 * lib/products) rings the matching part: 0 brand and domain, 1 the player,
 * 2 graded practice, 3 the certificate.
 */
export function AcademyVisual({ className, compact, focus }: { className?: string; compact?: boolean; focus?: number }) {
  const g = useId();
  const { ref, step, active } = useLoop(captions.length * 2, 1700, 3);
  const t = useTick(2400, active);
  const viewers = 214 + ((t * 7) % 23);
  const done = 2 + (Math.floor(step / captions.length) % 2);
  const has = focus !== undefined;

  return (
    <div ref={ref} className={className}>
      <Frame product="academy" title="Physics · Class 11 · Unit 3" meta={<><LiveDot color="var(--p-academy)" /><span className="num">{viewers} online</span></>}>
        <div className={cn("grid grid-cols-[minmax(0,1fr)]", !compact && "md:grid-cols-[minmax(0,1fr)_15rem]")}>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3.5 p-4 sm:p-5">
            <Spot on={focus === 0} group={g} product="academy">
              <div className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2">
                <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-md bg-academy text-[12px] font-semibold text-white">B</span>
                <span className="truncate text-[13px] font-semibold tracking-[-0.01em]">BrightPath<span className={cn(compact && "hidden sm:inline")}> Academy</span></span>
                <span className="ml-auto inline-flex min-w-0 items-center gap-1 text-[12px] text-ink-3">
                  <Lock className="size-3 shrink-0" strokeWidth={2.25} />
                  <span className="truncate">academy.brightpath.in</span>
                </span>
              </div>
            </Spot>

            <Spot on={focus === 1} group={g} product="academy">
              <Player step={step} />
            </Spot>

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold tracking-[-0.01em]">Friction on an incline</p>
                <p className="flex items-center gap-1.5 text-[13px] text-ink-3"><Initials name="Neha Kulkarni" hue={258} size={18} />Neha Kulkarni</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-signal-soft px-2 py-1 text-[12px] font-medium text-signal">
                <LiveDot /> Live at 6 pm
              </span>
            </div>

            {!compact && (
              <Spot on={focus === 3} group={g} product="academy">
                <Certificate />
              </Spot>
            )}

            {compact && has && (
              <Spot on={focus! >= 2} group={g} product="academy">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={focus === 2 ? "p" : "c"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: ease.out }}>
                    {focus === 2 ? <Practice /> : <Certificate />}
                  </motion.div>
                </AnimatePresence>
              </Spot>
            )}
          </div>

          {!compact && (
            <div className="flex flex-col border-t border-line md:border-l md:border-t-0">
              <Spot on={focus === 2} group={g} product="academy" className="m-2">
                <ol>
                  {lessons.map((l, i) => {
                    const isDone = i < done;
                    const current = i === done;
                    return (
                      <li key={l.t} className={cn("relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]", current && "bg-academy-soft")}>
                        <span className="grid size-5 place-items-center">
                          {isDone ? (
                            <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="grid size-[18px] place-items-center rounded-full bg-academy text-white"><Check className="size-3" strokeWidth={3} /></motion.span>
                          ) : l.live ? (
                            <Radio className="size-4 text-signal" strokeWidth={1.75} />
                          ) : l.quiz ? (
                            <CodeXml className={cn("size-4", current ? "text-academy" : "text-ink-3")} strokeWidth={2} />
                          ) : (
                            <span className={cn("size-[18px] rounded-full border-[1.5px]", current ? "border-academy" : "border-line-2")} />
                          )}
                        </span>
                        <span className={cn("flex-1 truncate", current && "font-medium")}>{l.t}</span>
                        <span className="text-[12px] text-ink-3 num">{l.quiz && isDone ? "8/10" : `${l.m}m`}</span>
                      </li>
                    );
                  })}
                </ol>
              </Spot>
              <div className="flex flex-1 flex-col border-t border-line p-3">
                <p className="text-[12px] font-medium text-ink-2">Class chat</p>
                <div className="mt-2 min-h-[92px] flex-1 overflow-hidden">
                  <AnimatePresence initial={false}>
                    {[0, 1, 2, 3].map((k) => {
                      const c = chat[(t + k) % chat.length];
                      return (
                        <motion.div key={`${t + k}`} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="flex items-start gap-2 py-1">
                          <Initials name={c.n} hue={c.hue} size={18} className="mt-0.5" />
                          <p className="text-[12px] leading-snug"><span className="font-medium">{c.n}</span> <span className="text-ink-2">{c.m}</span></p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </Frame>
    </div>
  );
}

function Player({ step }: { step: number }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-[oklch(0.22_0.03_258)]">
      <svg viewBox="0 0 320 180" className="absolute inset-0 size-full" aria-hidden>
        <path d="M40 150 L280 150 L280 60 Z" fill="none" stroke="oklch(0.7 0.08 258)" strokeWidth="1.5" />
        <g className="motion-safe:animate-[slide_6s_var(--ease-in-out)_infinite_alternate]">
          <rect x="150" y="93" width="34" height="22" rx="3" fill="oklch(0.72 0.13 258)" transform="rotate(-20.6 167 104)" />
        </g>
        <path d="M167 104 l0 34" stroke="oklch(0.85 0.1 70)" strokeWidth="1.5" markerEnd="url(#ah)" />
        <path d="M167 104 l-28 11" stroke="oklch(0.85 0.06 160)" strokeWidth="1.5" markerEnd="url(#ah)" />
        <defs>
          <marker id="ah" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L6 3L0 6z" fill="oklch(0.9 0.02 258)" />
          </marker>
        </defs>
        <text x="52" y="116" fill="oklch(0.8 0.03 258)" fontSize="12" fontFamily="var(--font-jetbrains)">θ = 30°</text>
      </svg>
      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-[oklch(0_0_0/0.55)] px-2 py-1 text-[12px] font-medium text-white">
        <span className="size-1.5 rounded-full bg-signal" />Recording to course
      </span>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="mx-auto mb-3 w-fit max-w-[90%] rounded-md bg-[oklch(0_0_0/0.55)] px-2.5 py-1 text-center text-[12px] text-white sm:text-[13px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={step % captions.length} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="block">
              {captions[step % captions.length]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2.5 text-white">
          <Play className="size-3.5 fill-current" strokeWidth={0} />
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-full origin-left rounded-full bg-white motion-safe:animate-[grow_14s_linear_infinite]" style={{ transform: "scaleX(0.42)" }} />
          </div>
          <span className="text-[12px] tabular-nums text-white/80">09:24 / 22:10</span>
        </div>
      </div>
    </div>
  );
}

function Certificate() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-academy-soft text-academy"><BadgeCheck className="size-[18px]" strokeWidth={1.9} /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">Certificate · Mechanics I</p>
        <p className="truncate text-[12px] text-ink-3">brightpath.in/verify/7Q4K-29</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-ok-soft px-2 py-1 text-[12px] font-medium text-ok"><Check className="size-3.5" strokeWidth={2.5} /><span className="hidden min-[420px]:inline">Verified</span></span>
    </div>
  );
}

function Practice() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-academy-soft text-academy"><CodeXml className="size-[18px]" strokeWidth={1.9} /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">Practice set 3 · graded</p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-inset"><div className="h-full w-4/5 rounded-full bg-academy" /></div>
      </div>
      <span className="shrink-0 text-[13px] font-semibold num">8/10</span>
    </div>
  );
}
