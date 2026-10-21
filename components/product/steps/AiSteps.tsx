"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Camera, PlayCircle, Send, UserRound } from "lucide-react";
import { Frame, Initials } from "@/components/visuals/Frame";
import { useLoop, useTick } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const swap = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35, ease: ease.out } };
const pilot = <span className="rounded-md bg-ai-soft px-1.5 py-0.5 text-[12px] font-medium text-ai">Preview</span>;

/* 01 Grounded in your material: each claim points at its source */
const sources = [
  { kind: "notes", label: "Notes · States of Matter · p. 14", text: ["Most solids are denser than their liquids.", "Water is an exception: on freezing it expands by about 9%,", "because hydrogen bonds hold molecules in an open hexagonal lattice."], hl: 1 },
  { kind: "video", label: "Lesson 2.3 · video · 06:12", text: ["So if the mass stays the same and the volume goes up,", "density, which is mass over volume, has to go down.", "That is why ice floats on water."], hl: 1 },
];
export function CitedAnswer() {
  const { ref, step } = useLoop(4, 2200, 1);
  const si = step % 2;
  const s = sources[si];
  return (
    <div ref={ref}>
      <Frame product="ai" title="Doubt · Chemistry · Class 9" meta={pilot}>
        <div className="grid min-h-[380px] md:grid-cols-2">
          <div className="p-4 sm:p-5">
            <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-inverse px-3.5 py-2.5 text-[13px] text-on-inverse">Why does ice float if it is solid water?</div>
            <div className="mt-3 rounded-2xl rounded-tl-md border border-line bg-surface-2/60 px-3.5 py-3 text-[13px] leading-relaxed">
              Water expands by about 9% when it freezes
              <Cite n={1} on={si === 0} />. Same mass in a larger volume means lower density, so ice floats
              <Cite n={2} on={si === 1} />.
            </div>
            <p className="mt-3 text-[11px] text-ink-3">No source found means no answer. The doubt goes to a teacher instead.</p>
          </div>
          <div className="border-t border-line bg-paper/60 p-4 sm:p-5 md:border-l md:border-t-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={si} {...swap}>
                <p className="inline-flex items-center gap-1.5 rounded-md bg-ai-soft px-2 py-1 text-[11px] font-medium text-ai">
                  {s.kind === "notes" ? <BookOpen className="size-3" /> : <PlayCircle className="size-3" />}{s.label}
                </p>
                <div className="mt-3 grid gap-2 text-[13px] leading-relaxed">
                  {s.text.map((l, i) => (
                    <p key={i} className={cn("rounded-md px-2 py-1 transition-colors duration-500", i === s.hl ? "bg-ai-soft text-ink" : "text-ink-3")}>{l}</p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Frame>
    </div>
  );
}
function Cite({ n, on }: { n: number; on: boolean }) {
  return <sup className={cn("ml-0.5 inline-grid size-4 place-items-center rounded text-[10px] font-medium transition-colors duration-300", on ? "bg-ai text-white dark:text-paper" : "bg-ai-soft text-ai")}>{n}</sup>;
}

/* 02 Photo to solution */
const working = ["From the second equation, x = y + 1.", "Substitute: 3(y + 1) + 2y = 12, so 5y = 9.", "y = 9/5 = 1.8, and x = 2.8.", "Check: 3(2.8) + 2(1.8) = 8.4 + 3.6 = 12."];
export function PhotoSolve() {
  const { ref, step } = useLoop(7, 1300, 6);
  const read = step >= 2;
  const shown = Math.max(0, step - 2);
  return (
    <div ref={ref}>
      <Frame product="ai" title="Doubt · photo · Maths Class 10" meta={pilot}>
        <div className="grid min-h-[380px] md:grid-cols-[13rem_1fr]">
          <div className="p-4 sm:p-5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[12rem] overflow-hidden rounded-lg border border-line md:max-w-none bg-[oklch(0.97_0.01_90)] dark:bg-[oklch(0.3_0.01_90)]">
              <svg viewBox="0 0 160 210" className="absolute inset-0 size-full" aria-label="Photo of a handwritten problem: 3x + 2y = 12 and x minus y = 1">
                {Array.from({ length: 9 }, (_, i) => <line key={i} x1="0" x2="160" y1={30 + i * 20} y2={30 + i * 20} stroke="oklch(0.8 0.04 240)" strokeWidth="0.6" />)}
                <text x="16" y="66" fontSize="17" fontStyle="italic" fill="var(--ink)" fontFamily="Georgia, serif" transform="rotate(-2 16 66)">3x + 2y = 12</text>
                <text x="18" y="106" fontSize="17" fontStyle="italic" fill="var(--ink)" fontFamily="Georgia, serif" transform="rotate(-1.5 18 106)">x − y = 1</text>
                <text x="18" y="146" fontSize="13" fontStyle="italic" fill="var(--ink-3)" fontFamily="Georgia, serif">find x, y ?</text>
              </svg>
              {!read && <span aria-hidden className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent to-ai/20 motion-reduce:hidden motion-safe:animate-[scan_1.6s_linear_infinite]" />}
              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-[oklch(0_0_0/0.55)] px-1.5 py-0.5 text-[10px] text-white"><Camera className="size-3" />photo_0412.jpg</span>
            </div>
          </div>
          <div className="border-t border-line p-4 sm:p-5 md:border-l md:border-t-0">
            <p className="label">Read as</p>
            <div className="mt-2 h-10">
              <AnimatePresence mode="wait" initial={false}>
                {read ? (
                  <motion.p key="r" {...swap} className="font-mono text-[13px]">3x + 2y = 12 and x − y = 1</motion.p>
                ) : (
                  <motion.span key="s" {...swap} className="skeleton block h-4 w-48 rounded" />
                )}
              </AnimatePresence>
            </div>
            <p className="label mt-3">Working</p>
            <ol className="mt-2 grid gap-2">
              {working.map((w, i) => (
                <li key={i} className={cn("flex gap-2.5 text-[13px] leading-snug transition-opacity duration-300", i < shown ? "opacity-100" : "opacity-0")}>
                  <span className="mt-[1px] text-[11px] font-medium text-ai num">{i + 1}</span>{w}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* 03 Knows when to stop */
export function Handoff() {
  const { ref, step } = useLoop(5, 1700, 4);
  const conf = step >= 1 ? 0.41 : 0.05;
  return (
    <div ref={ref}>
      <Frame product="ai" title="Doubt · Physics · Class 12" meta={pilot}>
        <div className="grid min-h-[380px] content-start gap-3 p-4 sm:p-5">
          <div className="ml-auto flex max-w-[88%] items-end gap-2">
            <div className="rounded-2xl rounded-br-md bg-inverse px-3.5 py-2.5 text-[13px] text-on-inverse">My answer for Q7 on the RC circuit is 2.4 ms but the key says 4.8 ms. Where did I go wrong?</div>
            <Initials name="Kabir S" hue={140} size={24} />
          </div>
          <div className="rounded-xl border border-line p-3.5">
            <div className="flex items-center justify-between text-[12px]"><span className="font-medium">Answer confidence</span><span className="num">{conf.toFixed(2)}</span></div>
            <div className="relative mt-2.5 h-2 rounded-full bg-inset">
              <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-ai" initial={false} animate={{ scaleX: conf }} transition={{ duration: 0.8, ease: ease.out }} />
              <span className="absolute -top-1 h-4 w-px bg-ink" style={{ left: "70%" }} />
            </div>
            <p className="mt-2 text-[11px] text-ink-3">Hand-off threshold set by the school: 0.70</p>
          </div>
          <AnimatePresence initial={false}>
            {step >= 2 && (
              <motion.div key="h" {...swap} className="flex items-center gap-3 rounded-xl bg-ai-soft px-3.5 py-3 text-[13px]">
                <UserRound className="size-4 shrink-0 text-ai" />
                <span className="min-w-0 flex-1"><span className="font-medium">Sent to S. Menon</span> <span className="text-ink-2">with Kabir’s working attached</span></span>
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div key="r" {...swap} className="flex max-w-[88%] items-start gap-2">
                <Initials name="S Menon" hue={200} size={24} />
                <div className="rounded-2xl rounded-tl-md border border-line bg-surface-2/60 px-3.5 py-2.5 text-[13px]">
                  The two resistors are in series, so R is 4 kΩ, not 2 kΩ. That doubles the time constant. Redo step 3.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-auto flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-[12px] text-ink-3">
            <span className="flex-1">Reply to Kabir</span><Send className="size-3.5" />
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* 04 Shows what is confusing */
const chapters = [
  { t: "Quadratic equations", n: 48, sub: ["Nature of roots", "Factorisation", "Word problems"] },
  { t: "Trigonometry", n: 41, sub: [] },
  { t: "Arithmetic progressions", n: 27, sub: [] },
  { t: "Coordinate geometry", n: 19, sub: [] },
  { t: "Statistics", n: 12, sub: [] },
];
export function TopicHeat() {
  const { ref, active } = useLoop(2, 3000);
  const t = useTick(2200, active);
  const rows = chapters.map((c, i) => ({ ...c, n: c.n + ((t * (i + 3)) % 5) }));
  const max = 56;
  return (
    <div ref={ref}>
      <Frame product="ai" title="Doubt insights · Class 10 · Maths" meta={<span>This week</span>}>
        <div className="grid min-h-[380px] content-start gap-4 p-4 sm:p-5">
          <ul className="grid gap-2.5">
            {rows.map((c, i) => (
              <li key={c.t} className="grid grid-cols-[minmax(0,10rem)_1fr_2.5rem] items-center gap-3 text-[12px]">
                <span className={cn("truncate", i === 0 ? "font-medium" : "text-ink-2")}>{c.t}</span>
                <span className="h-5 overflow-hidden rounded bg-inset">
                  <motion.span className="block h-full w-full origin-left rounded" style={{ background: "var(--p-ai)", opacity: i === 0 ? 1 : 0.35 }} initial={false} animate={{ scaleX: c.n / max }} transition={{ duration: 0.8, ease: ease.out }} />
                </span>
                <span className="text-right num">{c.n}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-line p-3.5">
            <p className="text-[12px] font-medium">Quadratic equations · where doubts cluster</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {chapters[0].sub.map((s, i) => (
                <span key={s} className={cn("rounded-md px-2 py-1 text-[12px]", i === 0 ? "bg-ai-soft text-ai" : "bg-surface-2 text-ink-2")}>{s}</span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-ink-3">Mock 7 average on the same topic: 58%. Worth a revision class.</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}

export const aiSteps = [CitedAnswer, PhotoSolve, Handoff, TopicHeat];
