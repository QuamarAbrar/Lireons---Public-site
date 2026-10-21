"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Award, CalendarCheck, CalendarClock, Code2, GraduationCap, MessageCircle, MessageCircleQuestion, MonitorPlay, Pause, Play, Radio, ShieldCheck, ShoppingCart, UsersRound } from "lucide-react";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { Scrubber } from "@/components/product/Scrubber";
import { useLoop } from "@/lib/useLoop";
import { products, type ProductId } from "@/lib/products";
import { minutes, solutionPages, type DayIcon } from "@/lib/solution-pages";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const icons: Record<DayIcon, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  check: CalendarCheck,
  message: MessageCircle,
  shield: ShieldCheck,
  grade: GraduationCap,
  doubt: MessageCircleQuestion,
  video: MonitorPlay,
  live: Radio,
  cart: ShoppingCart,
  code: Code2,
  award: Award,
  calendar: CalendarClock,
  users: UsersRound,
};

/** The three record fields worth a big figure on each stage. */
const statKeys: Record<string, string[]> = {
  schools: ["Lesson 6", "Unit test 3", "Doubts"],
  coaching: ["Lecture 14", "Mock 6 results", "Doubts"],
  academies: ["Enrolled", "Sales today", "Certificates"],
};

const INTERVAL = 2600;
const FEED = 4;

/**
 * An institution's day. Autoplays while on screen; drag the playhead, tap the
 * timeline or use the arrow keys to move through it (that pauses autoplay).
 * The feed lists what has happened so far, newest on top. The product legend
 * filters: pick a product and its events and the jobs it covers light up.
 */
export function DayStage({ id, uses }: { id: string; uses: ProductId[] }) {
  const s = solutionPages[id];
  const n = s.events.length;
  const { ref, step, active, hold, paused, setPaused } = useLoop(n, INTERVAL, n - 1, Math.min(3, n - 1));
  const reduce = useReducedMotion();
  const [only, setOnly] = useState<ProductId | null>(null);

  const seen = s.events.slice(0, step + 1);
  const rec = seen.reduce<Record<string, string>>((r, e) => ({ ...r, ...e.patch }), Object.fromEntries(s.fields.map((f) => [f.k, f.v])));
  const cur = s.events[step];
  const next = s.events[step + 1];
  const changed = new Set(Object.keys(cur.patch ?? {}));
  const pos = (t: string) => (minutes(t) - s.day.start) / (s.day.end - s.day.start);
  const positions = s.events.map((e) => pos(e.time));
  const glide = active && !reduce && !!next;
  // what has happened so far, newest first, in time order
  const feed = seen.slice(-FEED).reverse();
  const stats = statKeys[id] ?? s.fields.slice(1, 4).map((f) => f.k);
  const covered = only ? s.needs.filter((x) => x.p.includes(only)) : [];

  const scrub = (i: number) => {
    setPaused(true);
    hold(i);
  };

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border border-line bg-surface">
      {/* subject + clock */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-inverse font-mono text-[12px] font-medium text-on-inverse">{s.subject.mono}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold tracking-[-0.01em]">{s.subject.name}</p>
          <p className="truncate text-[12px] text-ink-3">{rec["Right now"]}</p>
        </div>
        <p className="text-[22px] font-semibold tracking-[-0.02em] num" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={cur.time} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="inline-block">
              {cur.time}
            </motion.span>
          </AnimatePresence>
        </p>
      </div>

      {/* three figures from the record */}
      <dl className="grid grid-cols-3 divide-x divide-line border-b border-line">
        {stats.map((k) => (
          <div key={k} className="relative min-w-0 px-3 py-3 sm:px-5">
            <dt className="truncate text-[12px] text-ink-3">{k}</dt>
            <dd className="relative mt-1 h-7 overflow-hidden text-[17px] font-semibold tracking-[-0.02em] sm:text-[20px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={rec[k]} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }} className="block truncate num">
                  {rec[k]}
                </motion.span>
              </AnimatePresence>
            </dd>
            <motion.span aria-hidden className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-signal sm:inset-x-5" initial={false} animate={{ opacity: changed.has(k) ? 1 : 0 }} transition={{ duration: 0.3 }} />
          </div>
        ))}
      </dl>

      {/* feed, newest on top */}
      <ol className="grid min-h-[17rem] content-start gap-1.5 p-3 sm:p-4" aria-label="Events so far, newest first">
        <AnimatePresence initial={false} mode="popLayout">
          {feed.map((e, i) => {
            const Icon = icons[e.icon];
            const dim = only !== null && e.p !== only;
            return (
              <motion.li
                key={e.time}
                layout={!reduce}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: dim ? 0.35 : 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, ease: ease.out }}
                className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5", i === 0 ? "border-line-2 bg-surface" : "border-transparent")}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ background: productSoft[e.p], color: productColor[e.p] }}>
                  <Icon className="size-4" strokeWidth={1.9} />
                </span>
                <span className="line-clamp-2 min-w-0 flex-1 text-[14px] leading-snug">{e.text}</span>
                <span className="shrink-0 text-[12px] text-ink-3 num">{e.time}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      {/* timeline: draggable playhead */}
      <div className="border-t border-line px-4 pb-3 pt-2 sm:px-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Play the day" : "Pause the day"}
            className="grid size-10 shrink-0 place-items-center rounded-[10px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink active:scale-[0.97]"
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
          <Scrubber
            value={step}
            positions={positions}
            onChange={scrub}
            label="Time of day"
            valueText={`${cur.time}, ${cur.text}`}
            className="flex-1"
          >
            <div className="absolute inset-x-0 top-1/2 h-px bg-line-2" />
            {s.events.map((e, i) => (
              <span
                key={e.time}
                className="absolute top-1/2 h-3.5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300"
                style={{ left: `${positions[i] * 100}%`, background: productColor[e.p], opacity: (only && e.p !== only) ? 0.15 : i <= step ? 1 : 0.35 }}
              />
            ))}
            <motion.span
              key={`${step}-${glide ? 1 : 0}`}
              aria-hidden
              className="pointer-events-none absolute inset-y-1 w-0"
              initial={{ left: `${positions[step] * 100}%` }}
              animate={{ left: `${(glide ? positions[step + 1] : positions[step]) * 100}%` }}
              transition={{ duration: glide ? INTERVAL / 1000 : 0, ease: "linear" }}
            >
              <span className="absolute inset-y-0 -left-px w-[2px] rounded-full bg-ink" />
              <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-edge bg-surface shadow-[2px_2px_0_0_var(--edge)]" />
            </motion.span>
          </Scrubber>
        </div>
        <div className="ml-12 flex justify-between text-[11px] text-ink-3 num" aria-hidden>
          {s.day.ticks.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>

      {/* product legend: filters the feed and the timeline */}
      <div className="border-t border-line p-3 sm:px-5">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Highlight one product's events" data-cursor="Filter">
          {products.map((p) => {
            const used = uses.includes(p.id);
            const on = only === p.id;
            const writing = cur.p === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => setOnly(on ? null : p.id)}
                className={cn(
                  "relative inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] transition-colors active:scale-[0.98]",
                  on ? "font-medium text-ink" : used ? "text-ink-2 shadow-[inset_0_0_0_1px_var(--line-2)] hover:text-ink" : "border border-dashed border-line-2 text-ink-3 hover:text-ink-2",
                )}
              >
                {on && <motion.span layoutId={`day-only-${id}`} className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
                <span aria-hidden className={cn("relative size-2.5 rounded-[3px] transition-transform duration-300", writing && "scale-125")} style={{ background: productColor[p.id], opacity: used ? 1 : 0.5 }} />
                <span className="relative">{p.name}</span>
                {!used && <span className="relative text-[12px]">optional</span>}
              </button>
            );
          })}
        </div>
        <AnimatePresence initial={false}>
          {only && (
            <motion.div key={only} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="overflow-hidden">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-3 text-[13px] text-ink-2">
                {covered.length ? covered.map((c) => (
                  <li key={c.t} className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full" style={{ background: productColor[only] }} />{c.t}</li>
                )) : <li className="text-ink-3">Optional for this setup. Add it any time on the same record.</li>}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
