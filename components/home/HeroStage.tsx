"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { GraduationCap, MessageCircleQuestion, MonitorPlay, Pause, Play, Radio, ShieldCheck, ShoppingCart, Trophy } from "lucide-react";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { useLoop } from "@/lib/useLoop";
import { products, type ProductId } from "@/lib/products";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * One student's day, written to one record by three products. It plays on its
 * own, and every part of it is a control: product tabs jump to that product's
 * moments, play/pause stops the day, and the timeline scrubs like a video.
 */
type Ev = { time: string; minutes: number; p: ProductId; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; text: string; patch?: Record<string, string | number> };

const events: Ev[] = [
  { time: "07:30", minutes: 7 * 60 + 30, p: "academy", icon: MonitorPlay, text: "Watched Lesson 6, “Reflection”, before class", patch: { status: "Before class" } },
  { time: "11:20", minutes: 11 * 60 + 20, p: "academy", icon: ShoppingCart, text: "Physics crash course bought via UPI, ₹4,999", patch: { course: "Enrolled" } },
  { time: "16:10", minutes: 16 * 60 + 10, p: "academy", icon: MonitorPlay, text: "Finished “Friction on an incline”", patch: { status: "Studying", course: 62 } },
  { time: "18:00", minutes: 18 * 60, p: "academy", icon: Radio, text: "Joined live doubt hour with 214 others" },
  { time: "19:30", minutes: 19 * 60 + 30, p: "assess", icon: ShieldCheck, text: "Started Physics Mock 7, proctored", patch: { test: "In progress" } },
  { time: "20:17", minutes: 20 * 60 + 17, p: "assess", icon: GraduationCap, text: "Scored 78 / 100, no flags", patch: { test: "78 / 100" } },
  { time: "20:40", minutes: 20 * 60 + 40, p: "assess", icon: Trophy, text: "Batch rank 9 of 64 on Mock 7", patch: { rank: 9 } },
  { time: "22:48", minutes: 22 * 60 + 48, p: "ai", icon: MessageCircleQuestion, text: "Asked a doubt on quadratics, answered", patch: { status: "Done for the day", doubts: 3 } },
];

const DAY_START = 7 * 60;
const DAY_END = 23 * 60;
const pos = (m: number) => (m - DAY_START) / (DAY_END - DAY_START);
const short: Record<ProductId, string> = { academy: "Academy", assess: "Tests", ai: "AI" };
const INTERVAL = 2600;

export type DayEvent = Ev;

/**
 * The interactive layer under the hero render: the day's controls, the moment
 * just written to Aarav's record, and the scrubber. `onEvent` hands the current
 * moment up so the render can show it arriving on its live rail.
 */
export function HeroStage({ onEvent, className }: { onEvent?: (e: Ev, step: number) => void; className?: string }) {
  const { ref, step, hold, paused, setPaused, active } = useLoop(events.length, INTERVAL, events.length - 1, 2);
  const cur = events[step];
  const first = (id: ProductId) => events.findIndex((e) => e.p === id);
  // any control the visitor uses ends the scrubber's first-view demo
  const [touched, setTouched] = useState(false);
  useEffect(() => onEvent?.(cur, step), [cur, step, onEvent]);
  const Icon = cur.icon;

  return (
    <div ref={ref} className={cn("glass relative overflow-hidden rounded-[22px] border-[1.5px] border-edge", className)}>
      {/* control bar */}
      <div className="flex items-center gap-2 border-b border-line/70 p-2 sm:gap-3 sm:p-2.5">
        <button
          type="button"
          onClick={() => {
            setTouched(true);
            setPaused(!paused);
          }}
          aria-label={paused ? "Play the day" : "Pause the day"}
          className="relative grid size-11 shrink-0 place-items-center rounded-full border-[1.5px] sm:size-10 border-edge bg-surface text-ink shadow-[2px_2px_0_0_var(--edge)] transition-[translate,box-shadow] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--edge)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          {paused ? <Play className="ml-0.5 size-4 fill-current" /> : <Pause className="size-4 fill-current" />}
          {active && (
            <svg aria-hidden viewBox="0 0 40 40" className="pointer-events-none absolute -inset-[1.5px] -rotate-90">
              <circle key={step} cx="20" cy="20" r="19" fill="none" stroke="var(--signal)" strokeWidth="2" pathLength={1} strokeDasharray="1" className="motion-safe:animate-[ring_2.6s_linear_both]" />
            </svg>
          )}
        </button>
        <div role="tablist" aria-label="Jump to a product" className="scrollbar-none flex min-w-0 flex-1 gap-1 overflow-x-auto p-0.5">
          {products.map((p) => {
            const on = p.id === cur.p;
            return (
              <button
                key={p.id}
                role="tab"
                data-cursor="Switch"
                type="button"
                aria-selected={on}
                onClick={() => {
                  setTouched(true);
                  hold(first(p.id));
                }}
                className={cn("relative flex h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[14px] sm:h-10 transition-colors sm:gap-2 sm:px-3.5", on ? "text-ink" : "text-ink-2 hover:bg-ink/[0.05] hover:text-ink")}
              >
                {on && <motion.span layoutId="hero-tab" className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.4, bounce: 0.18 }} />}
                <span className="relative size-2.5 rounded-[3px]" style={{ background: productColor[p.id] }} />
                <span className="relative font-medium sm:hidden">{short[p.id]}</span>
                <span className="relative hidden font-medium sm:inline">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-x-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        {/* the moment just written to the record */}
        <div className="flex min-w-0 items-center gap-3 px-4 pt-3.5 sm:px-6 lg:py-3.5 lg:pr-0" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={cur.time} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.3, ease: ease.out }} className="grid size-10 shrink-0 place-items-center rounded-[10px]" style={{ background: productSoft[cur.p], color: productColor[cur.p] }}>
              <Icon className="size-[18px]" strokeWidth={1.9} />
            </motion.span>
          </AnimatePresence>
          <div className="min-w-0 flex-1">
            <p className="text-meta text-ink-3"><span className="num font-medium text-ink">{cur.time}</span> · written to Aarav&rsquo;s record</p>
            <div className="relative h-6 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={cur.time} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.35, ease: ease.out }} className="truncate text-ui font-medium">
                  {cur.text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <Scrubber cur={step} onPick={hold} touched={touched} />
      </div>
    </div>
  );
}

/** The day as a draggable track: press anywhere, drag, or use arrow keys. */
function Scrubber({ cur, onPick, touched: used }: { cur: number; onPick: (i: number) => void; touched: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);

  // First time the stage is seen: a ghost cursor drags the day forward once,
  // then the thumb says what it does. Any real interaction cancels it.
  const inView = useInView(track, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const touched = useRef(false);
  const curRef = useRef(cur);
  curRef.current = cur;
  const [ghost, setGhost] = useState<{ from: number; to: number } | null>(null);
  const [tip, setTip] = useState(false);
  useEffect(() => {
    if (!inView || reduce) return;
    const timers: number[] = [];
    const at = (ms: number, f: () => void) => timers.push(window.setTimeout(() => !touched.current && f(), ms));
    at(1600, () => {
      const from = curRef.current;
      const to = Math.min(events.length - 1, from + 3);
      setGhost({ from, to });
      for (let k = 1; k <= to - from; k++) at(1600 + 300 + k * 380, () => onPick(from + k));
    });
    at(3500, () => {
      setGhost(null);
      setTip(true);
    });
    at(6500, () => setTip(false));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);
  const stopDemo = () => {
    touched.current = true;
    setGhost(null);
    setTip(false);
  };
  useEffect(() => {
    if (used) stopDemo();
  }, [used]);
  const pick = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    const m = DAY_START + Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * (DAY_END - DAY_START);
    let best = 0;
    events.forEach((e, i) => {
      if (Math.abs(e.minutes - m) < Math.abs(events[best].minutes - m)) best = i;
    });
    if (best !== cur) onPick(best);
  };
  const e = events[cur];
  return (
    <div className="px-4 pb-2.5 pt-2 sm:px-6 lg:py-2.5">
      <div
        ref={track}
        role="slider"
        data-cursor="Drag"
        tabIndex={0}
        aria-label="Time of day"
        aria-valuemin={0}
        aria-valuemax={events.length - 1}
        aria-valuenow={cur}
        aria-valuetext={`${e.time}, ${e.text}`}
        onPointerDown={(ev) => {
          stopDemo();
          ev.currentTarget.setPointerCapture(ev.pointerId);
          setDrag(true);
          pick(ev.clientX);
        }}
        onPointerMove={(ev) => drag && pick(ev.clientX)}
        onPointerUp={() => setDrag(false)}
        onPointerCancel={() => setDrag(false)}
        onKeyDown={(ev) => {
          stopDemo();
          if (ev.key === "ArrowRight" || ev.key === "ArrowUp") {
            ev.preventDefault();
            onPick(Math.min(events.length - 1, cur + 1));
          }
          if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") {
            ev.preventDefault();
            onPick(Math.max(0, cur - 1));
          }
        }}
        className={cn("group relative h-10 touch-none select-none rounded-lg", drag ? "cursor-grabbing" : "cursor-grab")}
      >
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink/10" />
        <motion.div aria-hidden className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink" initial={false} animate={{ width: `${pos(e.minutes) * 100}%` }} transition={{ duration: drag ? 0.12 : 0.6, ease: ease.out }} />
        {events.map((x) => (
          <span key={x.time} aria-hidden className="absolute top-1/2 h-3.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300" style={{ left: `${pos(x.minutes) * 100}%`, background: productColor[x.p], opacity: x.minutes <= e.minutes ? 1 : 0.35 }} />
        ))}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[1.5px] border-edge bg-surface shadow-[2px_2px_0_0_var(--edge)] transition-[scale] duration-200 group-hover:scale-110"
          initial={false}
          animate={{ left: `${pos(e.minutes) * 100}%` }}
          transition={{ duration: drag ? 0.12 : 0.6, ease: ease.out }}
        >
          <span className="size-2 rounded-[2px]" style={{ background: productColor[e.p] }} />
          <AnimatePresence>
            {tip && (
              <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-full mb-2 whitespace-nowrap rounded-full bg-inverse px-2.5 py-1 text-[12px] font-medium text-on-inverse">
                Drag the day
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
        <AnimatePresence>
          {ghost && (
            <motion.svg
              aria-hidden
              viewBox="0 0 24 24"
              className="pointer-events-none absolute top-1/2 z-10 size-6 drop-shadow-[1px_1px_0_var(--surface)]"
              initial={{ left: `${pos(events[ghost.from].minutes) * 100}%`, opacity: 0, scale: 1.2 }}
              animate={{ left: `${pos(events[ghost.to].minutes) * 100}%`, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ left: { delay: 0.3, duration: 1.3, ease: ease.inOut }, opacity: { duration: 0.2 }, scale: { duration: 0.2 } }}
            >
              <path d="M4 2l15 9-6.5 1.6L16 20l-3 1.4-3.5-7.4L4 18z" fill="var(--ink)" stroke="var(--surface)" strokeWidth="1.5" strokeLinejoin="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-0.5 flex justify-between text-[12px] text-ink-3 num" aria-hidden>
        {["07:00", "11:00", "15:00", "19:00", "23:00"].map((t) => <span key={t}>{t}</span>)}
      </div>
    </div>
  );
}
