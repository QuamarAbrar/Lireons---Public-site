"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { products, type ProductId } from "@/lib/products";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { ShowcaseFrame } from "./ShowcaseFrame";
import { useLoop } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ShotCrop, type Region } from "@/components/pages/ShotCrop";
import type { ShotId } from "@/components/shots/meta";

/** Modules with a real screen show a crop of that render; the rest keep the compact live view. */
const shots: Record<string, { id: ShotId; region: Region }> = {
  Courses: { id: "academy-storefront", region: [0, 0.55, 1, 0.45] },
  "Live classes": { id: "academy-live", region: [0.16, 0.06, 0.84, 0.62] },
  Payments: { id: "phone-course-purchase", region: [0, 0.03, 1, 0.6] },
  Results: { id: "phone-student-results", region: [0, 0.03, 1, 0.6] },
  "Test builder": { id: "assess-builder", region: [0.16, 0.06, 0.62, 0.6] },
  "AI proctor": { id: "assess-review", region: [0.5, 0.06, 0.5, 0.62] },
  "Review queue": { id: "assess-review", region: [0.5, 0.56, 0.5, 0.44] },
  "Candidate portal": { id: "phone-candidate-check", region: [0, 0.03, 1, 0.6] },
  "Text and photo doubts": { id: "phone-student-doubt", region: [0, 0.03, 1, 0.6] },
  "Cited answers": { id: "ai-student", region: [0.16, 0.04, 0.5, 0.6] },
  "Teacher hand-off": { id: "ai-teacher", region: [0.7, 0.05, 0.3, 0.55] },
  "Topic insights": { id: "ai-teacher", region: [0.16, 0.06, 0.62, 0.56] },
};

type Tone = "ok" | "warn" | "muted" | "hue";
type Preview =
  | { kind: "rows"; head: string; rows: [string, string, Tone][] }
  | { kind: "bars"; head: string; bars: [string, number][]; unit: string }
  | { kind: "grid"; head: string; total: number; off: number[]; foot: string }
  | { kind: "steps"; head: string; steps: string[] }
  | { kind: "chat"; head: string; q: string; a: string; src: string };

/** Three-word rail label and a compact mock view per module. Illustrative data. */
const modules: Record<string, { tag: string; view: Preview }> = {
  Courses: { tag: "Units and lessons", view: { kind: "bars", head: "JEE Physics · progress", bars: [["Unit 1", 100], ["Unit 2", 88], ["Unit 3", 62], ["Unit 4", 15]], unit: "%" } },
  "Live classes": { tag: "Browser or OBS", view: { kind: "rows", head: "Lecture 14 · live", rows: [["Viewers", "118", "hue"], ["Poll", "72% chose B", "muted"], ["Chat", "34 messages", "muted"], ["Recording", "Saving", "ok"]] } },
  "Coding problems": { tag: "Graded in browser", view: { kind: "rows", head: "Two Sum · Python", rows: [["Sample 1", "Passed", "ok"], ["Sample 2", "Passed", "ok"], ["Hidden tests", "Graded", "muted"], ["Runtime", "41 ms", "muted"]] } },
  Quizzes: { tag: "Timed, instant score", view: { kind: "bars", head: "Quiz 6 · Kinematics", bars: [["Q1", 92], ["Q2", 74], ["Q3", 48], ["Q4", 81]], unit: "% right" } },
  Certificates: { tag: "Verifiable links", view: { kind: "steps", head: "Full-stack web · Cohort 4", steps: ["Lessons done", "Final passed", "Issued", "Verified"] } },
  Community: { tag: "Threads per course", view: { kind: "rows", head: "JEE Physics · threads", rows: [["Doubt on torque", "4 replies", "muted"], ["Unit 3 notes", "Pinned", "hue"], ["Mock 7 paper", "12 replies", "muted"], ["Off-topic post", "Hidden by teacher", "warn"]] } },
  Payments: { tag: "Checkout on your domain", view: { kind: "rows", head: "Sales today", rows: [["Full-stack web", "₹24,999 UPI", "ok"], ["DSA in Python", "₹6,499 card", "ok"], ["Raag basics", "₹2,999 UPI", "ok"], ["Refund request", "Pending", "warn"]] } },

  "Test builder": { tag: "Sections and timers", view: { kind: "rows", head: "Mock 7 · 180 min", rows: [["Physics", "30 Q · 60 min", "muted"], ["Chemistry", "30 Q · 60 min", "muted"], ["Maths", "30 Q · 60 min", "muted"], ["Negative marking", "-1 per wrong", "warn"]] } },
  "Question bank": { tag: "Tagged, reusable", view: { kind: "bars", head: "Physics · by difficulty", bars: [["Easy", 64], ["Medium", 100], ["Hard", 38], ["Coding", 22]], unit: " Qs" } },
  "AI proctor": { tag: "Signals with evidence", view: { kind: "rows", head: "Aisha Khan · Mock 7", rows: [["18:42 Second face", "Clip saved", "warn"], ["18:57 Tab switch", "Logged", "muted"], ["19:10 Voice", "Clip saved", "warn"], ["Status", "Awaiting reviewer", "hue"]] } },
  "Review queue": { tag: "A person decides", view: { kind: "rows", head: "Flags to review", rows: [["Aisha Khan · face", "Upheld by M. Verma", "warn"], ["Rohan Das · tab", "Cleared with note", "ok"], ["Neha Jain · voice", "Waiting", "muted"], ["Arjun Rao · device", "Waiting", "muted"]] } },
  Results: { tag: "Same-day scores", view: { kind: "bars", head: "Mock 7 · score bands", bars: [["0-40", 12], ["41-60", 38], ["61-80", 100], ["81-100", 44]], unit: "" } },
  "Candidate portal": { tag: "Check, sit, result", view: { kind: "steps", head: "Candidate · Aisha Khan", steps: ["System check", "Instructions", "Test", "Result"] } },

  "Text and photo doubts": { tag: "Type or snap", view: { kind: "chat", head: "Doubt · Class 10 B", q: "Why is the discriminant negative here?", a: "Because b² is smaller than 4ac, so there are no real roots. Here is the working.", src: "Maths, Lesson 4.2" } },
  "Cited answers": { tag: "Source on every answer", view: { kind: "chat", head: "Doubt · JEE Batch A", q: "What is torque about a point?", a: "Torque is the turning effect of a force about a point: force times perpendicular distance.", src: "Lecture 14, 12:40" } },
  "Teacher hand-off": { tag: "Unsure goes to teacher", view: { kind: "rows", head: "Handed to teachers", rows: [["Integration by parts", "N. Kulkarni", "hue"], ["Organic naming", "P. Kaur", "hue"], ["Lens formula", "Answered", "ok"], ["Confidence", "Below threshold", "warn"]] } },
  "Topic insights": { tag: "What to reteach", view: { kind: "bars", head: "Doubts this week", bars: [["Quadratics", 100], ["Torque", 72], ["Lens formula", 41], ["Organic", 33]], unit: "" } },
};

const toneClass: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-[oklch(0.45_0.1_60)] dark:text-warn",
  muted: "bg-surface-2 text-ink-2",
  hue: "",
};

/** A framed app shell: module rail on the left, a compact live view on the right. */
export function ModuleShell({ id, descriptions }: { id: ProductId; descriptions: Record<string, string> }) {
  const p = products.find((x) => x.id === id)!;
  const names = Object.keys(descriptions);
  const [sel, setSel] = useState(0);
  const name = names[sel];
  const m = modules[name];
  const color = productColor[id];

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? names.length - 1 : (sel + d + names.length) % names.length;
    setSel(next);
    document.getElementById(`mod-tab-${id}-${next}`)?.focus();
  };

  return (
    <ShowcaseFrame field={productSoft[id]} tight>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex h-11 items-center gap-2.5 border-b border-line px-4">
          <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: color }} />
          <span className="truncate text-[13px] font-medium">{p.name}</span>
          <span className="ml-auto text-[12px] text-ink-3 num">{names.length} modules</span>
        </div>
        <div className="grid md:grid-cols-[17rem_1fr]">
          <div role="tablist" aria-label={`${p.name} modules`} aria-orientation="vertical" onKeyDown={onKey} data-cursor="Pick a module" className="grid grid-cols-2 gap-1 border-b border-line p-2 md:grid-cols-1 md:content-start md:border-b-0 md:border-r">
            {names.map((k, i) => {
              const on = i === sel;
              return (
                <button
                  key={k}
                  id={`mod-tab-${id}-${i}`}
                  role="tab"
                  aria-selected={on}
                  aria-controls={`mod-panel-${id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setSel(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setSel(i)}
                  className="relative flex min-h-11 items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
                >
                  {on && <motion.span layoutId={`mod-on-${id}`} className="absolute inset-0 rounded-[10px]" style={{ background: productSoft[id] }} transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
                  <span aria-hidden className="relative size-2 shrink-0 rounded-[2px] transition-opacity" style={{ background: color, opacity: on ? 1 : 0.35 }} />
                  <span className="relative min-w-0">
                    <span className={cn("block truncate text-[14px]", on ? "font-medium text-ink" : "text-ink-2")}>{k}</span>
                    <span className="hidden truncate text-[12px] text-ink-3 md:block">{modules[k]?.tag}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div id={`mod-panel-${id}`} role="tabpanel" aria-labelledby={`mod-tab-${id}-${sel}`} className="min-h-[22rem] min-w-0 p-4 sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: ease.out }}>
                <p className="text-h4">{name}</p>
                <p className="mt-1 max-w-[52ch] text-ui text-ink-2">{descriptions[name]}</p>
                {shots[name] ? (
                  <ShotCrop
                    id={shots[name].id}
                    region={shots[name].region}
                    width={shots[name].id.startsWith("phone") ? 288 : 620}
                    className={cn("mt-5", shots[name].id.startsWith("phone") ? "max-w-[18rem]" : "", shots[name].region[2] < 0.35 ? "max-w-[22rem]" : "")}
                  />
                ) : (
                  m && <View v={m.view} color={color} soft={productSoft[id]} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ShowcaseFrame>
  );
}

function View({ v, color, soft }: { v: Preview; color: string; soft: string }) {
  const len = v.kind === "rows" ? v.rows.length : v.kind === "bars" ? v.bars.length : v.kind === "steps" ? v.steps.length : v.kind === "grid" ? 3 : 2;
  const { ref, step } = useLoop(len, 1400, len - 1);
  return (
    <div ref={ref} className="mt-5 rounded-xl border border-line bg-surface p-3.5 sm:p-4">
      <p className="label">{v.head}</p>
      {v.kind === "rows" && (
        <ul className="mt-3 divide-y divide-line">
          {v.rows.map(([a, b, t], i) => (
            <li key={a} className={cn("flex items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-300", i === step && "bg-surface-2")}>
              <span className="min-w-0 flex-1 truncate text-[13px]">{a}</span>
              <span className={cn("inline-flex h-7 shrink-0 items-center rounded-md px-2 text-[12px] font-medium", toneClass[t])} style={t === "hue" ? { background: soft, color } : undefined}>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {v.kind === "bars" && (
        <ul className="mt-4 grid gap-4">
          {v.bars.map(([a, n], i) => {
            const max = Math.max(...v.bars.map((b) => b[1]));
            return (
              <li key={a} className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span className="truncate text-ink-2">{a}</span>
                <span className="h-3 overflow-hidden rounded-full bg-inset">
                  <motion.span className="block h-full origin-left rounded-full" style={{ background: color }} initial={{ scaleX: 0 }} animate={{ scaleX: n / max, opacity: i === step ? 1 : 0.55 }} transition={{ duration: 0.6, ease: ease.out, delay: i * 0.05 }} />
                </span>
                <span className="text-right text-ink-3 num">{n}{v.unit}</span>
              </li>
            );
          })}
        </ul>
      )}
      {v.kind === "grid" && (
        <>
          <ol className="mt-3 grid grid-cols-10 gap-1.5" aria-label={`${v.total - v.off.length} of ${v.total} present`}>
            {Array.from({ length: v.total }, (_, i) => {
              const abs = step >= 1 && v.off.includes(i);
              return <li key={i} className={cn("h-6 rounded-[4px] transition-colors duration-300", abs ? "bg-warn" : "")} style={abs ? undefined : { background: color, opacity: 0.75 }} />;
            })}
          </ol>
          <p className={cn("mt-3 text-[12px] text-ink-3 transition-opacity duration-300", step >= 2 ? "opacity-100" : "opacity-0")}>{v.foot}</p>
        </>
      )}
      {v.kind === "steps" && (
        <ol className="relative mt-4 grid gap-1">
          <span aria-hidden className="absolute bottom-4 left-[11px] top-4 w-px bg-line" />
          {v.steps.map((s, i) => (
            <li key={s} className={cn("relative flex items-center gap-3 rounded-lg px-1 py-2 transition-colors duration-300", i === step && "bg-surface-2")}>
              <span aria-hidden className="relative grid size-[22px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-300" style={{ borderColor: i <= step ? color : "var(--line-2)", background: i <= step ? color : "var(--surface)" }} />
              <span className={cn("flex-1 text-[13px]", i <= step ? "font-medium text-ink" : "text-ink-3")}>{s}</span>
              <span className="text-[12px] text-ink-3">{i < step ? "Done" : i === step ? "Now" : "Next"}</span>
            </li>
          ))}
        </ol>
      )}
      {v.kind === "chat" && (
        <div className="mt-3 grid gap-2 text-[13px]">
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md px-3 py-2" style={{ background: soft }}>{v.q}</p>
          <p className={cn("max-w-[90%] rounded-2xl rounded-tl-md border border-line px-3 py-2 transition-opacity duration-300", step >= 1 ? "opacity-100" : "opacity-40")}>
            {v.a}
            <span className="mt-1.5 block text-[12px] text-ink-3">Source: {v.src}</span>
          </p>
        </div>
      )}
    </div>
  );
}
