"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCheck, CodeXml, Eye, ListChecks, PenLine, ScanFace, ShieldCheck } from "lucide-react";
import { Frame, Initials, LiveDot } from "./Frame";
import { Spot } from "./Spot";
import { useLoop, useTick } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const candidates = [
  { n: "Tanvi Joshi", hue: 20 },
  { n: "Rohan Das", hue: 210 },
  { n: "Aisha Khan", hue: 320 },
  { n: "Vikram Nair", hue: 140 },
  { n: "Pooja Shah", hue: 60 },
  { n: "Arjun Reddy", hue: 260 },
  { n: "Sneha Pillai", hue: 180 },
  { n: "Karan Malhotra", hue: 100 },
];
const FLAGGED = 2;
// 0 calm, 1 signal spotted, 2 AI flag with evidence, 3 reviewer clears, 4 calm again
const STEPS = 5;
const confidence = [0.08, 0.54, 0.86, 0.86, 0.08];

const sections = [
  { icon: ListChecks, l: "30 MCQ" },
  { icon: PenLine, l: "4 written" },
  { icon: CodeXml, l: "2 coding" },
];

/** Signal lanes for one candidate: marks are moments, the fill is time elapsed. */
const lanes = [
  { k: "Face", marks: [0.41] },
  { k: "Tab", marks: [0.18] },
  { k: "Voice", marks: [0.63] },
  { k: "Device", marks: [] as number[] },
];

/**
 * A proctored exam under review. `focus` (a point index from lib/products)
 * rings the matching part: 0 the paper's question types, 1 the signal
 * timeline, 2 the flag a person decides on, 3 same-day results.
 */
export function AssessVisual({ className, compact, focus }: { className?: string; compact?: boolean; focus?: number }) {
  const g = useId();
  const { ref, step, active } = useLoop(STEPS, 1900, 3);
  const t = useTick(1000, active);
  const secs = 47 * 60 + 12 - t;
  const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const flag = step >= 1 && step <= 3;
  const has = focus !== undefined;

  return (
    <div ref={ref} className={className}>
      <Frame product="assess" title="Physics Mock 7 · Proctor review" meta={<><LiveDot color="var(--p-assess)" /><span className="num">{clock} left</span></>}>
        <div className={cn("grid grid-cols-[minmax(0,1fr)]", !compact && "lg:grid-cols-[minmax(0,1fr)_17rem]")}>
          <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-3.5 p-4 sm:p-5">
            <Spot on={focus === 0} group={g} product="assess">
              <div className="flex flex-wrap items-center gap-1.5">
                {sections.map(({ icon: I, l }) => (
                  <span key={l} className="inline-flex h-7 items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2 text-[12px] font-medium">
                    <I className="size-3.5 text-assess" strokeWidth={2} />{l}
                  </span>
                ))}
                <span className="ml-auto text-[12px] text-ink-3">{flag ? <><span className="num">1</span> flag to review</> : "No flags to review"}</span>
              </div>
            </Spot>

            <div>
              <p className="text-[13px] font-medium">62 candidates</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {candidates.slice(0, compact ? 4 : 8).map((c, i) => {
                  const isFlag = i === FLAGGED && flag;
                  const cleared = i === FLAGGED && step === 3;
                  return (
                    <div key={c.n} className={cn("relative overflow-hidden rounded-lg border bg-surface-2 transition-colors duration-300", isFlag && !cleared ? "border-assess" : "border-line")}>
                      <div className="relative grid aspect-[4/3] place-items-center bg-inset">
                        <Initials name={c.n} hue={c.hue} size={30} />
                        {isFlag && step === 2 && (
                          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-[18%] top-[22%]">
                            <Initials name="X Y" hue={0} size={18} />
                          </motion.span>
                        )}
                        {i === 0 && <span aria-hidden className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent to-assess/15 motion-reduce:hidden motion-safe:animate-[scan_2.6s_linear_infinite]" />}
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5">
                        <span className={cn("size-1.5 shrink-0 rounded-full", isFlag && !cleared ? "bg-assess" : "bg-ok")} />
                        <span className="truncate text-[12px]">{c.n.split(" ")[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {!compact && (
              <Spot on={focus === 1} group={g} product="assess">
                <Signals flag={flag} />
              </Spot>
            )}
          </div>

          <div className={cn("grid grid-cols-[minmax(0,1fr)] content-start gap-3.5 border-t border-line p-4 sm:p-5", !compact && "lg:border-l lg:border-t-0")}>
            <Spot on={focus === 2} group={g} product="assess">
              <FlagCard step={step} compact={compact} />
            </Spot>
            {(!compact || has) && (
              <Spot on={compact ? focus === 1 || focus === 3 : focus === 3} group={g} product="assess">
                {compact && focus === 1 ? <Signals flag={flag} /> : <Results />}
              </Spot>
            )}
          </div>
        </div>
      </Frame>
    </div>
  );
}

function Signals({ flag }: { flag: boolean }) {
  return (
    <div className="rounded-xl border border-line p-3">
      <p className="flex items-center justify-between text-[12px]">
        <span className="font-medium">Aisha Khan · session signals</span>
        <span className="text-ink-3 num">00:12:04</span>
      </p>
      <div className="relative mt-2.5 grid gap-1.5">
        {lanes.map((l) => (
          <div key={l.k} className="grid grid-cols-[3.25rem_1fr] items-center gap-2">
            <span className="text-[12px] text-ink-3">{l.k}</span>
            <div className="relative h-3 overflow-hidden rounded-[3px] bg-inset">
              <span className="absolute inset-y-0 left-0 w-[72%] bg-ok/20" />
              {l.marks.map((m) => {
                const hot = l.k === "Face" && flag;
                return <span key={m} className={cn("absolute inset-y-0 w-[5px] rounded-[2px] transition-colors duration-300", hot ? "bg-assess" : "bg-ink-3/60")} style={{ left: `${m * 100}%` }} />;
              })}
            </div>
          </div>
        ))}
        <span aria-hidden className="pointer-events-none absolute inset-y-[-4px] left-[calc(3.25rem+0.5rem)] right-0">
          <span className="absolute inset-y-0 left-0 w-full origin-left border-r-2 border-ink/70 motion-safe:animate-[grow_9s_linear_infinite]" style={{ transform: "scaleX(0.72)" }} />
        </span>
      </div>
    </div>
  );
}

/** Webcam still of the flagged candidate, drawn: a second face appears at step 2. */
function Webcam({ second, className }: { second: boolean; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-[oklch(0.26_0.02_300)]", className)}>
      <svg viewBox="0 0 160 120" className="absolute inset-0 size-full" aria-hidden>
        <rect x="0" y="0" width="160" height="70" fill="oklch(0.32 0.02 300)" />
        <rect x="112" y="14" width="34" height="44" rx="2" fill="oklch(0.38 0.03 260)" />
        <path d="M44 120 C46 92 62 84 80 84 C98 84 114 92 116 120 Z" fill="oklch(0.55 0.06 320)" />
        <circle cx="80" cy="58" r="20" fill="oklch(0.78 0.05 50)" />
        <path d="M60 54 C60 36 100 36 100 54 C96 44 64 44 60 54 Z" fill="oklch(0.3 0.03 40)" />
        <rect x="56" y="34" width="48" height="50" rx="4" fill="none" stroke="oklch(0.8 0.08 150)" strokeWidth="1.5" />
        {second && (
          <g>
            <circle cx="132" cy="44" r="10" fill="oklch(0.72 0.05 40)" />
            <path d="M116 70 C118 58 146 58 148 70 Z" fill="oklch(0.5 0.05 220)" />
            <rect x="118" y="30" width="28" height="30" rx="3" fill="none" stroke="var(--p-assess)" strokeWidth="2" />
          </g>
        )}
      </svg>
      <span className="absolute bottom-1.5 left-1.5 rounded bg-[oklch(0_0_0/0.55)] px-1.5 text-[12px] text-white num">Cam · 00:12:04</span>
    </div>
  );
}

const heads = [
  { icon: ShieldCheck, tone: "text-ok", t: "No open flags", d: "Watching face, tab, voice and device" },
  { icon: ScanFace, tone: "text-assess", t: "Checking a face signal", d: "Gathering the clip and timestamps" },
  { icon: ScanFace, tone: "text-assess", t: "Second face in frame", d: "Aisha Khan · waiting for a reviewer" },
  { icon: ScanFace, tone: "text-assess", t: "Second face in frame", d: "Aisha Khan · reviewed" },
  { icon: ShieldCheck, tone: "text-ok", t: "No open flags", d: "Last flag cleared 1 min ago" },
];

function FlagCard({ step, compact }: { step: number; compact?: boolean }) {
  const h = heads[step];
  const c = confidence[step];
  const H = h.icon;
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <div className={cn("grid gap-3", compact ? "grid-cols-[7rem_minmax(0,1fr)] items-start" : "grid-cols-[minmax(0,1fr)]")}>
        <Webcam second={step === 2 || step === 3} className="aspect-[4/3]" />
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2.5">
          <div className="relative min-h-[38px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={h.t + h.d} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: ease.out }}>
                <p className="flex items-center gap-1.5 text-[14px] font-medium"><H className={cn("size-4 shrink-0", h.tone)} strokeWidth={1.9} /><span className="truncate">{h.t}</span></p>
                <p className="truncate text-[12px] text-ink-3">{h.d}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <p className="flex items-center justify-between text-[12px]">
              <span className="text-ink-3">AI confidence</span>
              <span className="font-medium num">{c.toFixed(2)}</span>
            </p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-inset">
              <motion.div className={cn("h-full origin-left rounded-full transition-colors duration-300", c > 0.5 ? "bg-assess" : "bg-ok")} initial={false} animate={{ scaleX: c }} transition={{ duration: 0.6, ease: ease.out }} />
            </div>
          </div>
          <div className="h-8">
            <AnimatePresence mode="wait" initial={false}>
              {step === 2 ? (
                <motion.div key="act" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex h-8 gap-2">
                  <span className="inline-flex flex-1 items-center justify-center rounded-md bg-inverse text-[12px] font-medium text-on-inverse">Clear</span>
                  <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line-2 text-[12px] font-medium"><Eye className="size-3.5" />Watch clip</span>
                </motion.div>
              ) : step === 3 ? (
                <motion.p key="ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex h-8 items-center gap-1.5 truncate rounded-md bg-ok-soft px-2.5 text-[12px] font-medium text-ok">
                  <Check className="size-3.5 shrink-0" strokeWidth={2.5} /><span className="truncate">Cleared by M. Verma: sibling walked past</span>
                </motion.p>
              ) : (
                <motion.p key={`idle-${step === 1}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex h-8 items-center gap-1.5 rounded-md bg-surface-2 px-2.5 text-[12px] text-ink-2">
                  {step === 1 ? "Clip and timestamps attached" : "A person signs off every flag"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Results() {
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="flex items-center justify-between text-[12px]">
        <span className="font-medium">Results · Section A</span>
        <span className="inline-flex items-center gap-1 text-ok"><CheckCheck className="size-3.5" strokeWidth={2.25} />Auto-graded</span>
      </p>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-[22px] font-semibold leading-none tracking-[-0.02em] num">71<span className="text-[14px] font-medium text-ink-3">% avg</span></p>
        <div className="flex h-7 flex-1 items-end gap-[3px]" aria-hidden>
          {[3, 5, 8, 12, 15, 11, 6, 2].map((v, i) => (
            <span key={i} className="flex-1 rounded-t-[2px] bg-assess/70" style={{ height: `${(v / 15) * 100}%` }} />
          ))}
        </div>
      </div>
      <p className="mt-2 text-[12px] text-ink-3">4 written answers with markers</p>
    </div>
  );
}
