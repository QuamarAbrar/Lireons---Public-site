"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { ClipboardList, FileSpreadsheet, Link2, MessagesSquare, NotebookPen, Video } from "lucide-react";
import { products } from "@/lib/products";
import { Initials, productColor, productSoft } from "@/components/visuals/Frame";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Backdrop, Ruler, Ticks } from "@/components/ui/Backdrop";

/**
 * The problem as a picture: the same student copied into six tools, spelled
 * six ways. Scrolling folds the copies into one record. Pinned on desktop,
 * a plain before/after stack on smaller screens and with reduced motion.
 */
type Silo = { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; tool: string; name: string; meta: string; x: number; y: number; r: number; art: React.ReactNode };

const cell = "truncate border-r border-line px-1.5 py-1 last:border-r-0";

// offsets from the stage centre, in px, for an 800 x 560 stage: two rows of three, slightly askew
const silos: Silo[] = [
  {
    icon: FileSpreadsheet, tool: "Marks spreadsheet", name: "Aarav Mehta", meta: "Row 412 · Unit test 3", x: -272, y: -118, r: -2.5,
    art: (
      <div className="grid grid-cols-[2.4rem_1fr_4.5rem] overflow-hidden rounded-md border border-line text-[12px] num">
        {[["411", "Aanya Rao", "36 / 40"], ["412", "Aarav Mehta", "#REF!"], ["413", "Aditi Shah", "28 / 40"]].map((r, i) => (
          <div key={r[0]} className={cn("col-span-3 grid grid-cols-subgrid border-t border-line first:border-t-0", i === 1 && "bg-warn-soft")}>
            {r.map((c, j) => <span key={j} className={cn(cell, j === 0 && "text-ink-3")}>{c}</span>)}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: NotebookPen, tool: "Paper answer sheet", name: "Arav Mehta", meta: "Roll 14 · checked by hand", x: 0, y: -132, r: 2,
    art: (
      <div className="flex items-center gap-1 text-[12px] num">
        <span className="w-6 text-ink-3">Q</span>
        {["4", "3", "0", "5", "2", "?"].map((m, i) => <span key={i} className={cn("grid size-5 place-items-center rounded-[4px] border border-line", m === "0" && "text-signal", m === "?" && "border-dashed text-ink-3")}>{m}</span>)}
      </div>
    ),
  },
  {
    icon: ClipboardList, tool: "Form test", name: "AARAV M", meta: "Response 1,203", x: 272, y: -112, r: 2.5,
    art: (
      <div className="grid gap-1 text-[12px]">
        <p className="flex justify-between rounded-md bg-surface-2 px-2 py-1"><span className="text-ink-3">Class</span><span>10-B</span></p>
        <p className="flex justify-between rounded-md bg-surface-2 px-2 py-1"><span className="text-ink-3">Score</span><span className="num">31 / 40</span></p>
      </div>
    ),
  },
  {
    icon: Video, tool: "Class video link", name: "aarav.m2009", meta: "Guest, joined late", x: -268, y: 122, r: 2,
    art: (
      <div className="flex items-center gap-2 text-[12px]">
        <span className="grid size-6 place-items-center rounded-full bg-inset text-[10px] font-medium">A</span>
        <span className="flex-1 text-ink-2">Waiting room</span>
        <span className="rounded-full bg-warn-soft px-2 py-0.5 num">18:04</span>
      </div>
    ),
  },
  {
    icon: MessagesSquare, tool: "Doubts group chat", name: "Aarav 10B", meta: "11:48 pm, unanswered", x: 4, y: 136, r: -2,
    art: (
      <p className="rounded-[10px] rounded-tl-sm bg-ok-soft px-2.5 py-1.5 text-[12px] leading-snug">Sir Q7 ka answer kya hai? <span className="text-ink-3 num">11:48 pm</span></p>
    ),
  },
  {
    icon: Link2, tool: "Course payment link", name: "Mehta (Aarav)", meta: "₹4,999 paid · no access yet", x: 270, y: 118, r: -2.5,
    art: (
      <div className="flex items-center justify-between text-[12px] num">
        <span className="text-ink-3">UPI ref 61•• •• 4471</span>
        <span className="rounded-full bg-warn-soft px-2 py-0.5">Not enrolled</span>
      </div>
    ),
  },
];

const facts = [
  { p: "academy", k: "Physics", v: "62%" },
  { p: "academy", k: "Crash course", v: "Enrolled" },
  { p: "assess", k: "Mock 7", v: "78 / 100" },
  { p: "ai", k: "Doubts", v: "3 answered" },
] as const;

export function Consolidate() {
  return (
    <section aria-labelledby="silo-title" className="relative">
      <Pinned />
      <Stacked />
    </section>
  );
}

// product nodes the record links to once the copies have folded, in px from the stage centre
const spokes = [
  { x: -238, y: -196 },
  { x: 238, y: -196 },
  { x: 0, y: 196 },
];
// elbow from inside the card's side edge, out and up into the node; x = 0 drops straight down from the card
const spokePath = (x: number, y: number) => `M${Math.sign(x) * 120} ${Math.sign(y) * 56} H${x} V${y - Math.sign(y) * 26}`;

function Pinned() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const t = useTransform(scrollYProgress, [0.12, 0.7], [0, 1], { clamp: true });
  const [merged, setMerged] = useState(false);
  const [linked, setLinked] = useState(false);
  useMotionValueEvent(t, "change", (v) => {
    setMerged(v > 0.7);
    setLinked(v > 0.9);
  });

  const recScale = useTransform(t, [0.45, 0.8], [0.7, 1]);
  const ghost = useTransform(t, [0.55, 0.72, 0.82, 0.95], [0, 1, 1, 0]);
  const recOpacity = useTransform(t, [0.45, 0.75], [0, 1]);

  return (
    <div ref={ref} className="relative hidden h-[125vh] lg:motion-safe:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="wrap grid grid-cols-12 items-center gap-x-10 gap-y-6">
          <Ruler index="01" label="The problem" aside="Keep scrolling to fold the copies" className="col-span-12" />
          <div className="col-span-4">
            <div className="relative h-[11rem] overflow-hidden" aria-hidden>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={merged ? "1" : "6"} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.6, ease: ease.out }} className={cn("figure absolute text-[11rem]", merged ? "text-ink" : "text-ink-3")}>
                  {merged ? "1" : "6"}
                </motion.p>
              </AnimatePresence>
            </div>
            <h2 id="silo-title" className="sr-only">Six copies of every learner, folded into one record that every product shares</h2>
            <div className="relative mt-4 min-h-[8.5rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={merged ? "after" : "before"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: ease.out }}>
                  <p className="text-d3">{merged ? "One Aarav, one record." : "Six tools, and a different Aarav in each."}</p>
                  <p className="mt-3 max-w-[38ch] text-body text-ink-2">
                    {merged ? "All three products read and write the same learner, so the teacher, the student and the parent see the same facts." : "Every copy drifts. The spreadsheet says one score, the form another, and nobody is sure which is right."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <FoldStats merged={merged} t={t} />
          </div>

          <div className="relative isolate col-span-8 h-[560px]" aria-hidden>
            {/* the desk the copies are scattered on: dotted, edged with crop ticks */}
            <Backdrop variant="dots" fade="edges" className="-inset-3" />
            <Ticks inset={12} />
            <div className="absolute left-1/2 top-1/2 scale-[0.86] xl:scale-100">
              {silos.map((s) => (
                <motion.div key={`g-${s.tool}`} style={{ opacity: ghost, x: s.x, y: s.y, rotate: s.r }} className="absolute left-0 top-0 -ml-[8rem] -mt-[4.5rem] flex h-[9rem] w-[16rem] items-center justify-center rounded-xl border border-dashed border-line-2">
                  <span className="text-meta text-ink-3 line-through decoration-ink-3/60">{s.tool}</span>
                </motion.div>
              ))}
              {/* spokes: drawn once the record has formed, under the card */}
              <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
                {products.map((p, i) => {
                  const s = spokes[i];
                  return (
                    <motion.path
                      key={p.id}
                      d={spokePath(s.x, s.y)}
                      fill="none"
                      stroke={productColor[p.id]}
                      strokeWidth="2"
                      initial={false}
                      animate={{ pathLength: linked ? 1 : 0, opacity: linked ? 1 : 0 }}
                      transition={{ pathLength: { duration: 0.6, delay: linked ? i * 0.08 : 0, ease: ease.out }, opacity: { duration: 0.15, delay: linked ? i * 0.08 : 0 } }}
                    />
                  );
                })}
              </svg>
              {silos.map((s, i) => <SiloCard key={s.tool} s={s} i={i} t={t} />)}
              <motion.div style={{ scale: recScale, opacity: recOpacity }} className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                <Record />
              </motion.div>
              {products.map((p, i) => {
                const s = spokes[i];
                return (
                  <motion.div
                    key={p.id}
                    initial={false}
                    animate={{ opacity: linked ? 1 : 0, scale: linked ? 1 : 0.85 }}
                    transition={{ duration: 0.35, delay: linked ? 0.45 + i * 0.08 : 0, ease: ease.out }}
                    className="absolute left-0 top-0 w-[12.75rem]"
                    style={{ x: s.x, y: s.y, translateX: "-50%", translateY: "-50%" }}
                  >
                    <div className="flex h-[3.25rem] items-center gap-2.5 rounded-[10px] border-[1.5px] border-edge bg-surface px-3 shadow-[3px_3px_0_0_var(--edge)]">
                      <span className="size-3 shrink-0 rounded-[3px]" style={{ background: productColor[p.id] }} />
                      <span className="min-w-0">
                        <span className="block truncate text-ui font-medium leading-tight">{p.name}</span>
                        <span className="block truncate text-[12px] leading-tight text-ink-3">{p.tag}</span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const before = [
  { k: "Copies of Aarav", v: "6" },
  { k: "Spellings", v: "6" },
  { k: "Shared between tools", v: "0" },
];
const after = [
  { k: "Records", v: "1" },
  { k: "Products reading it", v: "3" },
  { k: "Fields typed twice", v: "0" },
];

/** Three figures that change as the copies fold, plus the scroll rail that drives them. */
function FoldStats({ merged, t }: { merged: boolean; t: MotionValue<number> }) {
  const rows = merged ? after : before;
  return (
    <div className="mt-6" aria-hidden>
      <dl className="grid grid-cols-3 border-y border-line">
        {rows.map((r, i) => (
          <div key={i} className={cn("py-3", i > 0 && "border-l border-line pl-4")}>
            <dt className="text-meta text-ink-3">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={r.k} className="block truncate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{r.k}</motion.span>
              </AnimatePresence>
            </dt>
            <dd className="relative mt-1 h-9 overflow-hidden text-[2rem] font-medium leading-9 tracking-[-0.02em] num">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={r.v + r.k} className={cn("block", merged ? "text-ink" : "text-ink-2")} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.4, delay: i * 0.05, ease: ease.out }}>{r.v}</motion.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center gap-3 text-meta text-ink-3">
        <span>Six copies</span>
        <span className="relative h-px flex-1 bg-line-2">
          <motion.span className="absolute inset-0 origin-left bg-ink" style={{ scaleX: t }} />
        </span>
        <span className={cn("transition-colors", merged && "text-ink")}>One record</span>
      </div>
    </div>
  );
}

function SiloCard({ s, i, t }: { s: Silo; i: number; t: MotionValue<number> }) {
  const x = useTransform(t, (v) => s.x * (1 - v));
  const y = useTransform(t, (v) => s.y * (1 - v));
  const rotate = useTransform(t, (v) => s.r * (1 - v));
  const scale = useTransform(t, [0, 1], [1, 0.5]);
  const opacity = useTransform(t, [0.55, 0.85], [1, 0]);
  return (
    <motion.div style={{ x, y, rotate, scale, opacity }} className="absolute left-0 top-0 -ml-[8rem] -mt-[4.5rem] w-[16rem]">
      <div className="motion-safe:animate-[bob_5s_ease-in-out_infinite]" style={{ animationDelay: `${i * -0.8}s` }}>
        <Artefact s={s} />
      </div>
    </motion.div>
  );
}

/** One tool's copy of the student, drawn as the artefact it lives in, at a size that can be read. */
function Artefact({ s, className }: { s: Silo; className?: string }) {
  const Icon = s.icon;
  return (
    <div className={cn("rounded-xl border-[1.5px] border-edge bg-surface p-3.5 text-ink shadow-[3px_3px_0_0_var(--edge)]", className)}>
      <div className="flex items-center gap-2 text-meta text-ink-3">
        <Icon className="size-4 shrink-0" strokeWidth={1.9} />
        <span className="truncate">{s.tool}</span>
      </div>
      <p className="mt-2 truncate text-body font-medium leading-tight underline decoration-warn decoration-wavy decoration-1 underline-offset-4">{s.name}</p>
      <p className="mt-0.5 truncate text-meta text-ink-2 num">{s.meta}</p>
      <div className="mt-3">{s.art}</div>
    </div>
  );
}

function Record({ className }: { className?: string }) {
  return (
    <div className={cn("w-[19rem] rounded-2xl bg-inverse p-4 text-on-inverse shadow-3", className)}>
      <div className="flex items-center gap-3">
        <Initials name="Aarav Mehta" hue={30} size={40} />
        <div>
          <p className="text-h4">Aarav Mehta</p>
          <p className="text-[12px] opacity-70">Class 10 B · Roll 14 · one id</p>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-1.5">
        {facts.map((f) => (
          <li key={f.k} className="rounded-lg px-2.5 py-2" style={{ background: "color-mix(in oklch, var(--on-inverse) 8%, transparent)" }}>
            <p className="flex items-center gap-1.5 text-[12px] opacity-75">
              <span className="size-2 rounded-[2px]" style={{ background: productSoft[f.p], boxShadow: `inset 0 0 0 1.5px ${productColor[f.p]}` }} />
              {f.k}
            </p>
            <p className="mt-0.5 text-[14px] font-medium num">{f.v}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex gap-1" aria-hidden>
        {products.map((p) => <span key={p.id} className="h-1 flex-1 rounded-full" style={{ background: productColor[p.id] }} />)}
      </p>
    </div>
  );
}

function Stacked() {
  return (
    <div className="relative isolate lg:motion-safe:hidden">
    <Backdrop variant="dots" fade="edges" />
    <div className="wrap py-16 md:py-20">
      <Ruler index="01" label="The problem" />
      <h2 className="mt-5 text-d2">Six tools, and a different Aarav in each.</h2>
      <ul tabIndex={0} className="scrollbar-none -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-2 focus-visible:outline-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3" aria-label="Where one student's details live today">
        {silos.map((s) => (
          <li key={s.tool} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <Artefact s={s} />
          </li>
        ))}
      </ul>
      <div className="my-6 flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-line-2" />
        <span className="figure text-[3.5rem] text-ink-3">6</span>
        <span className="text-ink-3">to</span>
        <span className="figure text-[3.5rem]">1</span>
        <span className="h-px flex-1 bg-line-2" />
      </div>
      <div className="mx-auto max-w-[19rem]">
        <Record />
      </div>
      <p className="mx-auto mt-6 max-w-[40ch] text-center text-body text-ink-2">All three products read and write the same learner, so the teacher, the student and the parent see the same facts.</p>
    </div>
    </div>
  );
}
