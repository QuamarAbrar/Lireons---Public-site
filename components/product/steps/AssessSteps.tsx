"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, Gavel, Monitor, ScanFace, Volume2 } from "lucide-react";
import { Frame, Initials, LiveDot } from "@/components/visuals/Frame";
import { useLoop, useTick } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const swap = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35, ease: ease.out } };

/* 01 Any question type */
const types = ["MCQ", "Multi-select", "Written", "Coding"] as const;
export function QuestionTypes() {
  const { ref, step } = useLoop(types.length, 2400, 0);
  const ty = types[step];
  return (
    <div ref={ref}>
      <Frame product="assess" title="Physics Mock 7 · Question 14 of 60" meta={<span className="num">4 marks · −1</span>}>
        <div className="min-h-[380px] p-4 sm:p-5">
          <div className="flex gap-1 rounded-lg bg-inset p-1 text-[12px]" role="presentation">
            {types.map((x) => (
              <span key={x} className={cn("relative flex h-8 flex-1 items-center justify-center rounded-md transition-colors", x === ty ? "font-medium text-ink" : "text-ink-3")}>
                {x === ty && <motion.span layoutId="qt-tab" className="absolute inset-0 rounded-md bg-surface shadow-1" transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12 }} />}
                <span className="relative">{x}</span>
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={ty} {...swap} className="mt-5">
              {ty === "MCQ" && (
                <>
                  <p className="text-[14px] font-medium">A block slides down a frictionless incline of 30°. Its acceleration is</p>
                  <ul className="mt-4 grid gap-2">
                    {["g", "g/2", "g√3/2", "2g"].map((o, i) => (
                      <li key={o} className={cn("flex h-10 items-center gap-3 rounded-lg border px-3 text-[13px]", i === 1 ? "border-assess bg-assess-soft" : "border-line")}>
                        <span className={cn("size-4 rounded-full border-2", i === 1 ? "border-assess bg-assess" : "border-line-2")} />
                        <span className="font-mono">{o}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {ty === "Multi-select" && (
                <>
                  <p className="text-[14px] font-medium">Which quantities are conserved in a perfectly elastic collision? Select all that apply.</p>
                  <ul className="mt-4 grid gap-2">
                    {[["Momentum", true], ["Kinetic energy", true], ["Velocity of each body", false], ["Total energy", true]].map(([o, on]) => (
                      <li key={o as string} className={cn("flex h-10 items-center gap-3 rounded-lg border px-3 text-[13px]", on ? "border-assess bg-assess-soft" : "border-line")}>
                        <span className={cn("grid size-4 place-items-center rounded-[4px] border-2", on ? "border-assess bg-assess text-white dark:text-paper" : "border-line-2")}>{on && <Check className="size-2.5" strokeWidth={4} />}</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {ty === "Written" && (
                <>
                  <p className="text-[14px] font-medium">Explain why a cyclist leans inward while taking a turn. Use a free-body diagram.</p>
                  <div className="mt-4 grid gap-2.5 rounded-lg border border-line p-3">
                    {[100, 92, 96, 60].map((w, i) => <span key={i} className="h-2 rounded-full bg-inset" style={{ width: `${w}%` }} />)}
                  </div>
                  <p className="label mt-4">Rubric</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[12px]">
                    {["Forces named · 1", "Diagram · 1", "Friction as centripetal force · 2"].map((r) => <span key={r} className="rounded-md bg-surface-2 px-2 py-1">{r}</span>)}
                  </div>
                </>
              )}
              {ty === "Coding" && (
                <>
                  <p className="text-[14px] font-medium">Return the number of distinct paths in an m × n grid moving only right or down.</p>
                  <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line text-[12px]">
                    {[["Hidden tests", "8"], ["Languages", "Python, C++, Java"], ["Time limit", "2 s"], ["Memory", "256 MB"]].map(([k, v]) => (
                      <div key={k} className="bg-surface px-3 py-2.5"><dt className="text-ink-3">{k}</dt><dd className="mt-0.5 font-medium num">{v}</dd></div>
                    ))}
                  </dl>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Frame>
    </div>
  );
}

/* 02 AI proctor with evidence: signals land on the timeline */
const sigs = [
  { at: 0.14, time: "00:04:12", label: "Switched tab for 3 s", icon: Monitor, conf: "1.00" },
  { at: 0.4, time: "00:12:04", label: "Second face in frame", icon: ScanFace, conf: "0.86" },
  { at: 0.72, time: "00:21:40", label: "Voice in the room", icon: Volume2, conf: "0.64" },
];
export function ProctorTimeline() {
  const { ref, step, active } = useLoop(4, 2000, 3);
  const t = useTick(1000, active);
  const shown = step;
  const cur = sigs[Math.max(0, shown - 1)];
  return (
    <div ref={ref}>
      <Frame product="assess" title="Aisha Khan · session evidence" meta={<><LiveDot color="var(--p-assess)" /><span className="num">00:2{2 + (t % 8)}:1{t % 10}</span></>}>
        <div className="grid min-h-[380px] content-start gap-4 p-4 sm:p-5">
          <div className="grid grid-cols-[1fr_9rem] gap-3">
            <div className="relative grid h-[180px] place-items-center overflow-hidden rounded-lg bg-inset">
              <Initials name="Aisha Khan" hue={320} size={56} />
              <AnimatePresence>
                {shown >= 2 && cur.icon === ScanFace && (
                  <motion.span key="face" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute right-[16%] top-[18%] rounded-md ring-2 ring-assess">
                    <Initials name="X Y" hue={0} size={26} />
                  </motion.span>
                )}
              </AnimatePresence>
              <span aria-hidden className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent to-assess/15 motion-reduce:hidden motion-safe:animate-[scan_2.6s_linear_infinite]" />
            </div>
            <div className="grid content-start gap-1.5 text-[11px]">
              {["Face", "Tab", "Voice", "Device"].map((k, i) => {
                const hot = shown >= 1 && ((i === 0 && cur.icon === ScanFace) || (i === 1 && cur.icon === Monitor) || (i === 2 && cur.icon === Volume2));
                return (
                  <span key={k} className={cn("flex h-7 items-center justify-between rounded-md px-2 transition-colors duration-300", hot ? "bg-assess-soft font-medium" : "bg-surface-2")}>
                    {k}<span className={cn("size-1.5 rounded-full", hot ? "bg-assess" : "bg-ok")} />
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <div className="relative h-9 rounded-md bg-inset">
              {sigs.map((s, i) => (
                <motion.span key={s.time} className="absolute top-2 h-5 w-1 rounded-full" style={{ left: `${s.at * 100}%`, background: i < shown ? "var(--p-assess)" : "var(--line-2)" }} animate={{ scaleY: i === shown - 1 ? 1.25 : 1 }} />
              ))}
              <span aria-hidden className="absolute inset-y-0 left-0 w-full origin-left border-r-2 border-ink/70 motion-safe:animate-[grow_8s_linear_infinite]" style={{ transform: "scaleX(0.8)" }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-ink-3 num"><span>00:00</span><span>00:30:00</span></div>
          </div>
          <ol className="grid gap-1.5">
            {sigs.map((s, i) => {
              const Icon = s.icon;
              const on = i < shown;
              return (
                <li key={s.time} className={cn("flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[12px] transition-[opacity,border-color,background-color] duration-300", on ? "opacity-100" : "opacity-35", i === shown - 1 ? "border-assess bg-assess-soft/60" : "border-line")}>
                  <Icon className="size-3.5 text-assess" strokeWidth={1.75} />
                  <span className="text-ink-3 num">{s.time}</span>
                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                  <span className="text-ink-3 num">{s.conf}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </Frame>
    </div>
  );
}

/* 03 A human makes the call */
const flags = [
  { n: "Aisha Khan", hue: 320, sig: "Second face in frame", dec: "Cleared", note: "Sibling walked past" },
  { n: "Rohan Das", hue: 210, sig: "Phone visible on desk", dec: "Upheld", note: "Section B voided" },
  { n: "Vikram Nair", hue: 140, sig: "Switched tab for 3 s", dec: "Cleared", note: "System notification" },
];
export function ReviewQueue() {
  const { ref, step } = useLoop(flags.length + 2, 1700, flags.length + 1);
  const decided = Math.min(flags.length, step);
  return (
    <div ref={ref}>
      <Frame product="assess" title="Review queue · Physics Mock 7" meta={<span className="num">{flags.length - decided} open</span>}>
        <div className="grid min-h-[380px] content-start gap-3 p-4 sm:p-5">
          <ul className="divide-y divide-line rounded-xl border border-line">
            {flags.map((f, i) => {
              const done = i < decided;
              const focus = i === decided && step < flags.length;
              return (
                <li key={f.n} className={cn("flex items-center gap-3 px-3.5 py-3 transition-colors duration-300", focus && "bg-assess-soft/60")}>
                  <Initials name={f.n} hue={f.hue} size={30} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{f.n}</p>
                    <p className="truncate text-[12px] text-ink-3">{done ? `${f.dec} by M. Verma: ${f.note}` : `AI flag: ${f.sig}`}</p>
                  </div>
                  <span className="relative grid h-7 w-[92px] justify-items-end overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={done ? f.dec : "open"}
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -18, opacity: 0 }}
                        transition={{ duration: 0.35, ease: ease.out }}
                        className={cn("inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium", !done ? "bg-surface-2 text-ink-2" : f.dec === "Cleared" ? "bg-ok-soft text-ok" : "bg-signal-soft text-signal")}
                      >
                        {!done ? <><Eye className="size-3.5" />Review</> : f.dec === "Cleared" ? <><Check className="size-3.5" strokeWidth={2.5} />Cleared</> : <><Gavel className="size-3.5" />Upheld</>}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="rounded-xl bg-surface-2 p-3.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium">Results release</span>
              <span className="text-ink-3 num">{decided} of {flags.length} decisions</span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-inset">
              <motion.div className="h-full origin-left rounded-full bg-assess" initial={false} animate={{ scaleX: decided / flags.length }} transition={{ duration: 0.6, ease: ease.out }} />
            </div>
            <p className="mt-2.5 text-[12px] text-ink-3">{decided === flags.length ? "Every flag has a human decision. Results can be released." : "Held until a reviewer decides every flag."}</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* 04 Results the same day */
const bins = [2, 4, 7, 11, 14, 10, 8, 4, 2];
export function ResultsBoard() {
  const { ref, step } = useLoop(7, 1200, 6);
  const grown = Math.min(1, (step + 1) / 3);
  const left = Math.max(0, 14 - step * 3);
  return (
    <div ref={ref}>
      <Frame product="assess" title="Results · Physics Mock 7" meta={<span>62 candidates</span>}>
        <div className="grid min-h-[380px] content-start gap-5 p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {[["Average", "71.4"], ["Highest", "96"], ["Auto-graded", "48 of 60"]].map(([k, v]) => (
              <div key={k} className="bg-surface px-3 py-2.5"><p className="text-[11px] text-ink-3">{k}</p><p className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] num">{v}</p></div>
            ))}
          </div>
          <div>
            <p className="label">Score distribution</p>
            <div className="mt-3 flex h-28 items-end gap-1.5 border-b border-line">
              {bins.map((b, i) => (
                <motion.span key={i} className="flex-1 origin-bottom rounded-t-[3px]" style={{ height: `${(b / 14) * 100}%`, background: i === 6 ? "var(--p-assess)" : "var(--p-assess-soft)" }} initial={false} animate={{ scaleY: grown }} transition={{ duration: 0.6, ease: ease.out, delay: i * 0.03 }} />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-ink-3 num"><span>0</span><span>50</span><span>100</span></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3">
            <div className="flex -space-x-1.5">
              {["P K", "S M", "A R"].map((n, i) => <Initials key={n} name={n} hue={40 + i * 90} size={22} className="ring-2 ring-surface" />)}
            </div>
            <p className="min-w-0 flex-1 text-[12px]">Written answers to mark</p>
            <span className="text-[13px] font-medium num">{left === 0 ? <span className="text-ok">All marked</span> : `${left} left`}</span>
          </div>
        </div>
      </Frame>
    </div>
  );
}

export const assessSteps = [QuestionTypes, ProctorTimeline, ReviewQueue, ResultsBoard];
