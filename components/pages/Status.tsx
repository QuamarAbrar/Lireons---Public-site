"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { LiveDot } from "@/components/visuals/Frame";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const DAYS = 90;
const CHECK_EVERY = 15; // seconds

/** Illustrative history: index counts back from today (0 = today). */
type Incident = { t: string; m: number };
const components: { name: string; desc: string; degraded: Record<number, Incident> }[] = [
  { name: "Web app", desc: "Admin, teacher and student apps on every subdomain", degraded: {} },
  { name: "Payments", desc: "Razorpay and UPI checkout for courses and paid tests, invoices", degraded: { 61: { t: "Slower payment confirmations from a partner bank", m: 18 } } },
  { name: "WhatsApp notifications", desc: "Reminders, alerts and OTPs over WhatsApp", degraded: { 23: { t: "Messages delayed by up to 9 minutes during a provider incident", m: 9 } } },
  { name: "Live classes", desc: "Streaming, chat, polls and recordings", degraded: {} },
  { name: "Proctoring", desc: "Locked browser, AI proctor and review queue", degraded: {} },
  { name: "API", desc: "Public API and webhooks", degraded: {} },
];

const DAY_MIN = 24 * 60;
const uptimeOf = (c: (typeof components)[number]) => 100 - (Object.values(c.degraded).reduce((n, x) => n + x.m, 0) / (DAYS * DAY_MIN)) * 100;
const overallUptime = components.reduce((n, c) => n + uptimeOf(c), 0) / components.length;
const pct = (v: number) => (v >= 99.9995 ? "100" : v.toFixed(3));
const incidents = components
  .flatMap((c) => Object.entries(c.degraded).map(([back, x]) => ({ component: c.name, back: +back, ...x })))
  .sort((a, b) => a.back - b.back);

const istTime = (d: Date) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(d);
const istDate = (d: Date) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" }).format(d);

function useChecks() {
  const reduce = useReducedMotion();
  const [last, setLast] = useState<Date | null>(null);
  const [left, setLeft] = useState(CHECK_EVERY);
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    setLast(new Date());
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      if (n % CHECK_EVERY === 0) {
        setLast(new Date());
        setPulse((p) => p + 1);
      }
      setLeft(CHECK_EVERY - (n % CHECK_EVERY));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);
  return { last, left, pulse, reduce: !!reduce };
}

export function StatusBoard() {
  const { last, left, pulse, reduce } = useChecks();
  const degradedDays = components.reduce((n, c) => n + Object.keys(c.degraded).length, 0);

  return (
    <div className="wrap pb-20 pt-10 md:pb-28 md:pt-12">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <div className="grid gap-6 lg:sticky lg:top-24">
          {/* overall */}
          <section aria-labelledby="overall" className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex flex-wrap items-center gap-4 p-6">
              <span className="grid size-11 place-items-center rounded-full bg-ok text-white">
                <Check className="size-5" strokeWidth={2.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="overall" className="text-d3">All systems operational</h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-ui text-ink-3">
                  <span>Last checked</span>
                  {last ? (
                    <span className="relative inline-grid overflow-hidden align-bottom text-ink-2">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.time key={last.getTime()} dateTime={last.toISOString()} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.35, ease: ease.out }} className="col-start-1 row-start-1 num">
                          {istTime(last)} IST
                        </motion.time>
                      </AnimatePresence>
                    </span>
                  ) : (
                    <span className="skeleton inline-block h-4 w-24 rounded" aria-hidden />
                  )}
                </p>
              </div>
              <div className="w-full">
                <p className="text-meta text-ink-3 num" aria-hidden>Next check in {last ? `${left}s` : "…"}</p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-inset" aria-hidden>
                  {last && !reduce && (
                    <motion.div key={pulse} className="h-full origin-left rounded-full bg-ok" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: CHECK_EVERY, ease: "linear" }} />
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-4 border-t border-line p-6">
              <div>
                <p className="label">Uptime, past 90 days</p>
                <p className="figure mt-3 text-[clamp(3.25rem,2rem+3vw,4.75rem)] text-ink">{pct(overallUptime)}<span className="text-ink-3">%</span></p>
              </div>
              <p className="max-w-[36ch] text-meta text-ink-3">Average across six components. Illustrative until the public status feed is connected.</p>
            </div>
            <dl className="grid grid-cols-3 border-t border-line text-ui">
              {[
                ["Components", String(components.length)],
                ["Degraded days", String(degradedDays)],
                ["Incidents", String(incidents.length)],
              ].map(([k, v], i) => (
                <div key={k} className={cn("px-4 py-4", i > 0 && "border-l border-line", i === 0 && "pl-6")}>
                  <dt className="text-meta text-ink-3">{k}</dt>
                  <dd className="mt-1 text-h4 num">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="about-status" className="border-t border-line pt-5">
            <h2 id="about-status" className="text-h4">About this page</h2>
            <p className="mt-2 max-w-[60ch] text-ui text-ink-2">We check each component from outside our own network. Maintenance is announced here and to administrators by email in advance. The 90-day history is illustrative until the public status feed is connected.</p>
          </section>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-8">

          {/* components */}
          <section aria-labelledby="components-title">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="components-title" className="text-h4">Components</h2>
              <p className="text-meta text-ink-3">Past 90 days</p>
            </div>
            <ul className="mt-4 border-t border-line">
              {components.map((c) => (
                <ComponentRow key={c.name} c={c} pulse={pulse} />
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-meta text-ink-3">
              <span className="flex items-center gap-2"><span className="h-3 w-1 rounded-[1px] bg-ok/35" aria-hidden />Operational</span>
              <span className="flex items-center gap-2"><span className="h-3 w-1 rounded-[1px] bg-warn" aria-hidden />Degraded performance</span>
              <span>{degradedDays} days with degraded performance across all components</span>
            </div>
          </section>

          <section aria-labelledby="incidents-title" className="mt-16">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="incidents-title" className="text-h4">Past incidents</h2>
              <p className="text-meta text-ink-3">Illustrative</p>
            </div>
            <ol className="mt-4 border-t border-line">
              {incidents.map((x) => (
                <IncidentRow key={x.component + x.back} x={x} />
              ))}
            </ol>
          </section>

        </div>
      </div>
    </div>
  );
}

function ComponentRow({ c, pulse }: { c: (typeof components)[number]; pulse: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const [today, setToday] = useState<Date | null>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  useEffect(() => setToday(new Date()), []);
  const days = Array.from({ length: DAYS }, (_, k) => DAYS - 1 - k); // oldest first
  const info = hover !== null ? c.degraded[hover]?.t : undefined;
  const dateOf = (back: number) => (today ? istDate(new Date(today.getTime() - back * 86400000)) : "");
  const leftPct = hover !== null ? ((DAYS - 1 - hover) / (DAYS - 1)) * 100 : 0;

  return (
    <li className="border-b border-line py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-h4">{c.name}</p>
          <p className="mt-0.5 text-ui text-ink-2">{c.desc}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="figure text-d3 num">{pct(uptimeOf(c))}<span className="text-ink-3">%</span></p>
          <p className="mt-1 flex items-center justify-end gap-2 text-meta text-ink-2">
            <motion.span key={pulse} initial={{ scale: 1.6 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: ease.out }} className="inline-flex"><LiveDot color="var(--ok)" /></motion.span>
            Operational
          </p>
        </div>
      </div>
      <div className="relative mt-4" onPointerLeave={() => setHover(null)}>
        <div ref={barsRef} data-cursor="Scrub" className="flex h-9 items-stretch gap-[2px]" role="img" aria-label={`${c.name}: ${Object.keys(c.degraded).length === 0 ? "no incidents" : `${Object.keys(c.degraded).length} day with degraded performance`} in the past 90 days`}>
          {days.map((back) => {
            const bad = c.degraded[back];
            return (
              <motion.span
                key={back}
                animate={back === 0 ? { opacity: [1, 0.4, 1] } : undefined}
                transition={back === 0 ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
                onPointerEnter={() => setHover(back)}
                className={cn(
                  "min-w-0 flex-1 rounded-[2px] transition-[opacity,transform] duration-150 hover:scale-y-110",
                  bad ? "bg-warn" : "bg-ok/35",
                  hover !== null && hover !== back && "opacity-50",
                )}
              />
            );
          })}
        </div>
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: ease.out }}
              className="pointer-events-none absolute bottom-full z-10 mb-2 w-56 rounded-xl border border-line bg-surface p-3 text-meta shadow-2"
              style={{ left: `clamp(0px, calc(${leftPct}% - 7rem), calc(100% - 14rem))` }}
            >
              <p className="font-medium num">{hover === 0 ? "Today" : dateOf(hover)}</p>
              <p className={cn("mt-1", info ? "text-ink-2" : "text-ink-3")}>{info ?? "No incidents recorded"}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-2 flex justify-between text-meta text-ink-3" aria-hidden>
          <span>90 days ago</span>
          <span>{Object.keys(c.degraded).length === 0 ? "No incidents" : `${Object.keys(c.degraded).length} degraded day`}</span>
          <span>Today</span>
        </div>
      </div>
    </li>
  );
}

function IncidentRow({ x }: { x: (typeof incidents)[number] }) {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  return (
    <li className="grid gap-x-6 gap-y-1 border-b border-line py-5 sm:grid-cols-[9rem_1fr_auto]">
      <span className="text-ui text-ink-3 num">{today ? istDate(new Date(today.getTime() - x.back * 86400000)) : <span className="skeleton inline-block h-4 w-24 rounded" aria-hidden />}</span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-ui font-medium"><span aria-hidden className="h-3.5 w-1 rounded-[1px] bg-warn" />{x.component}: degraded performance</span>
        <span className="mt-1 block text-ui text-ink-2">{x.t}.</span>
      </span>
      <span className="text-meta text-ink-2 sm:text-right"><span className="num">{x.m}</span> min · Resolved</span>
    </li>
  );
}
