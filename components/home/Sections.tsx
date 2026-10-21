"use client";

import { SignalField } from "@/components/ui/Shader";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, CreditCard, KeyRound, MessageCircle, Plus, Video, type LucideIcon } from "lucide-react";
import { audiences, faqs, integrationSync, products, type ProductId } from "@/lib/products";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { Button, ButtonLink, UnderlineLink } from "@/components/ui/Button";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Backdrop, Ruler } from "@/components/ui/Backdrop";
import { Magnetic } from "@/components/ui/Magnetic";
import { Shot } from "@/components/ui/Shot";

/* ---------- integrations ---------- */
const catIcon: Record<(typeof integrationSync)[number]["cat"], LucideIcon> = {
  Payments: CreditCard,
  Messaging: MessageCircle,
  Accounts: KeyRound,
  "Live classes": Video,
};

/**
 * What the platform plugs into. A still row on desktop where hovering or
 * focusing a tool says what it syncs; a slow marquee only on small screens,
 * where the row cannot fit.
 */
export function IntegrationStrip() {
  const uid = useId();
  const [hot, setHot] = useState<number | null>(null);
  const it = hot === null ? null : integrationSync[hot];
  const cats = Array.from(new Set(integrationSync.map((x) => x.cat)));
  return (
    <section aria-label="Works with" className="overflow-x-clip border-y border-line">
      <div className="wrap py-5 md:py-0">
        {/* desktop: label, a still row, and a readout line that says what the pointed tool syncs */}
        <div className="hidden md:flex md:flex-col xl:flex-row xl:items-stretch">
          <div className="flex shrink-0 items-baseline gap-3 border-b border-line py-3 xl:flex-col xl:justify-center xl:gap-0 xl:border-b-0 xl:border-r xl:py-5 xl:pr-6">
            <h2 className="text-ui font-medium text-ink">Works with</h2>
            <p className="text-meta text-ink-3 num">{integrationSync.length} tools, {cats.length} kinds</p>
          </div>
          <div className="min-w-0 flex-1 xl:pl-4">
            <ul className="flex min-h-16 flex-wrap items-center gap-x-5 py-3 xl:justify-between xl:gap-x-2" onPointerLeave={() => setHot(null)}>
              {integrationSync.map((x, i) => {
                const Icon = catIcon[x.cat];
                return (
                  <li key={x.name}>
                    <button
                      type="button"
                      aria-describedby={`${uid}-sync-${i}`}
                      onPointerEnter={() => setHot(i)}
                      onFocus={() => setHot(i)}
                      onBlur={() => setHot(null)}
                      className={cn("group flex h-10 items-center gap-2 rounded-[10px] px-1.5 text-ui font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge", hot === i ? "text-ink" : hot === null ? "text-ink-2 hover:text-ink" : "text-ink-3")}
                    >
                      <Icon aria-hidden className={cn("size-[18px] transition-colors", hot === i ? "text-ink" : "text-ink-3")} strokeWidth={1.75} />
                      {x.name}
                    </button>
                    <span id={`${uid}-sync-${i}`} className="sr-only">{x.sync}</span>
                  </li>
                );
              })}
            </ul>
            <div aria-hidden className="flex h-11 items-center gap-3 border-t border-line text-meta">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={it ? it.name : "all"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18, ease: ease.out }} className="flex min-w-0 items-center gap-2.5 truncate">
                  {it ? (
                    <>
                      <span className="rounded-full border border-line-2 px-2 py-0.5 text-ink-2">{it.cat}</span>
                      <span className="font-medium text-ink">{it.name}</span>
                      <span className="truncate text-ink-2">{it.sync}</span>
                    </>
                  ) : (
                    <span className="text-ink-3">Point at a tool to see what it writes to the learner record.</span>
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <h2 className="text-meta font-medium text-ink-2 md:hidden">Works with</h2>

        {/* small screens: one quiet marquee */}
        <div className="relative mt-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:hidden">
          <ul className="flex w-max motion-safe:animate-[marquee_36s_linear_infinite]">
            {[...integrationSync, ...integrationSync].map((it, i) => {
              const Icon = catIcon[it.cat];
              const dup = i >= integrationSync.length;
              return (
                <li key={i} aria-hidden={dup || undefined} className="flex h-10 items-center gap-2 px-5 text-ui font-medium text-ink-2">
                  <Icon aria-hidden className="size-[18px] text-ink-3" strokeWidth={1.75} />
                  {it.name}
                  {!dup && <span className="sr-only">: {it.sync}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- build your setup: audience presets, products, students ---------- */
const stops = [100, 250, 500, 1000, 2000, 3000, 5000];
const fmt = (n: number) => n.toLocaleString("en-IN");

export function BuildSetup() {
  const [on, setOn] = useState<ProductId[]>(audiences[0].uses);
  const [stop, setStop] = useState(3);
  const students = stops[stop];
  const preset = audiences.find((a) => a.uses.length === on.length && a.uses.every((u) => on.includes(u)))?.id ?? null;
  const toggle = (id: ProductId) => setOn((v) => (v.includes(id) ? v.filter((x) => x !== id) : products.filter((p) => p.id === id || v.includes(p.id)).map((p) => p.id)));
  const chosen = products.filter((p) => on.includes(p.id));
  const modules = chosen.flatMap((p) => p.modules.map((m) => ({ p: p.id, m })));
  const href = `/demo?products=${encodeURIComponent(on.join(","))}&students=${students}`;

  return (
    <section aria-labelledby="setup-title" className="relative isolate border-b border-line">
      {/* a tinted work surface; the dots tighten under the pointer while you configure */}
      <Backdrop variant="dots" live fade="none" tint="var(--surface-2)" />
      <div className="wrap py-20 md:py-28">
      <Ruler index="04" label="Build your setup" aside="Carries over to your demo booking" />
      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-12 md:items-end md:gap-6">
        <h2 id="setup-title" className="text-d2 md:col-span-8">Switch on what you need. Add the rest later.</h2>
        <p className="max-w-[34ch] text-lead text-ink-2 md:col-span-4 md:pb-1">Every setup shares one learner record. Pick a preset, then adjust.</p>
      </div>

      <div className="frame mt-10 grid overflow-hidden bg-surface md:mt-12 lg:grid-cols-12">
        {/* controls */}
        <div className="min-w-0 p-4 sm:p-7 lg:col-span-7 lg:p-9">
          <p id="preset-l" className="label">Start from</p>
          <div role="group" aria-labelledby="preset-l" className="mt-3 flex gap-1 rounded-full bg-inset p-1 sm:inline-flex">
            {audiences.map((a) => {
              const sel = preset === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={sel}
                  onClick={() => setOn(a.uses)}
                  className={cn("relative h-10 flex-1 whitespace-nowrap rounded-full px-3 text-ui font-medium transition-colors sm:flex-none sm:px-4", sel ? "text-ink" : "text-ink-2 hover:text-ink")}
                >
                  {sel && <motion.span layoutId="preset-on" className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12 }} />}
                  <span className="relative sm:hidden" aria-hidden>{a.preset.split(" ")[0]}</span>
                  <span className="relative max-sm:sr-only">{a.preset}</span>
                </button>
              );
            })}
          </div>

          <fieldset className="mt-8">
            <legend className="label">Products</legend>
            <div className="mt-3 grid gap-2">
              {products.map((p) => {
                const checked = on.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={cn(
                      "group relative flex min-h-16 cursor-pointer items-center gap-4 overflow-hidden rounded-[10px] py-3 pl-5 pr-4 transition-[background-color,box-shadow] duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal",
                      checked ? "seg-on" : "shadow-[inset_0_0_0_1px_var(--line)] hover:bg-surface-2",
                    )}
                  >
                    <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(p.id)} />
                    <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[3px] origin-left transition-transform duration-300 ease-[var(--ease-out)]", checked ? "scale-x-100" : "scale-x-0")} style={{ background: productColor[p.id] }} />
                    <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-[6px] transition-colors", checked ? "text-white" : "shadow-[inset_0_0_0_1.5px_var(--line-2)]")} style={checked ? { background: productColor[p.id] } : undefined}>
                      {checked && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 text-body font-medium leading-tight">
                        {p.name}
                        {p.status && <span className="rounded-full bg-ai-soft px-2 py-0.5 text-meta font-medium text-ai">{p.status}</span>}
                      </span>
                      <span className="mt-0.5 block text-meta text-ink-3">{p.tag}</span>
                    </span>
                    <span className={cn("shrink-0 text-meta num transition-colors", checked ? "text-ink" : "text-ink-3")}>{p.modules.length} modules</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="students" className="label">Students</label>
              <output htmlFor="students" className="text-ui font-medium num">{fmt(students)}</output>
            </div>
            <input
              id="students"
              type="range"
              min={0}
              max={stops.length - 1}
              step={1}
              value={stop}
              onChange={(e) => setStop(Number(e.target.value))}
              data-cursor="Scrub"
              aria-valuetext={`${fmt(students)} students`}
              className="mt-3 h-10 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[1.5px] [&::-moz-range-thumb]:border-edge [&::-moz-range-thumb]:bg-surface [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-inset [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--ink)_var(--fill),var(--inset)_var(--fill))] [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-ink [&::-webkit-slider-thumb]:-mt-[9px] [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-edge [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-[2px_2px_0_0_var(--edge)] [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-110"
              style={{ ["--fill" as string]: `${(stop / (stops.length - 1)) * 100}%` }}
            />
            <div aria-hidden className="mt-1 flex justify-between text-meta text-ink-3 num">
              {stops.map((s, i) => (
                <button key={s} type="button" tabIndex={-1} onClick={() => setStop(i)} className={cn("min-w-8 text-center transition-colors hover:text-ink", i === stop && "font-medium text-ink")}>
                  {s >= 1000 ? `${s / 1000}k` : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* live summary */}
        <div className="relative flex min-w-0 flex-col border-t-[1.5px] border-edge bg-paper p-4 sm:p-7 lg:col-span-5 lg:border-l-[1.5px] lg:border-t-0 lg:p-9" aria-live="polite">
          <div className="flex items-end gap-8">
            <div>
              <p className="label">Modules on</p>
              <Roll value={modules.length} className="figure mt-2 text-[5.5rem] sm:text-[7rem]" />
            </div>
            <div className="pb-2">
              <p className="label">Students</p>
              <Roll value={students} format={fmt} className="figure mt-2 text-[2.25rem] text-ink-2" />
            </div>
          </div>

          <ul className="mt-6 flex min-h-24 flex-wrap content-start gap-1.5" aria-label="Modules switched on">
            <li className="inline-flex h-8 items-center gap-1.5 rounded-full bg-inverse px-3 text-meta font-medium text-on-inverse">Learner record</li>
            <AnimatePresence mode="popLayout" initial={false}>
              {modules.map(({ p, m }) => (
                <motion.li
                  key={`${p}-${m}`}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25, ease: ease.out }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-meta text-ink"
                  style={{ background: productSoft[p] }}
                >
                  <span aria-hidden className="size-2 rounded-[2px]" style={{ background: productColor[p] }} />
                  {m}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <Mix chosen={chosen} total={modules.length} />

          <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
            {on.length ? (
              <ButtonLink href={href} size="md" icon={<ArrowUpRight className="size-4" />}>Book this demo</ButtonLink>
            ) : (
              <Button size="md" disabled>Pick a product first</Button>
            )}
            <UnderlineLink href="/pricing" className="self-start text-ui text-ink-2 after:absolute after:-inset-y-2.5 after:inset-x-0 after:content-[''] hover:text-ink sm:self-auto">Your quote lists every line</UnderlineLink>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

/** How the switched-on modules split across products: one bar, a segment per product. */
function Mix({ chosen, total }: { chosen: (typeof products)[number][]; total: number }) {
  return (
    <div className="mt-6 border-t border-line pt-4" aria-hidden>
      <div className="flex items-baseline justify-between text-meta">
        <span className="text-ink-2">Module mix</span>
        <span className="text-ink-3 num">{chosen.length} of {products.length} products</span>
      </div>
      <div className="mt-2.5 flex h-3 gap-[3px] overflow-hidden rounded-[4px] bg-inset">
        {products.map((p) => {
          const on = chosen.some((c) => c.id === p.id);
          return (
            <motion.span
              key={p.id}
              className="h-full rounded-[3px]"
              style={{ background: productColor[p.id] }}
              initial={false}
              animate={{ flexGrow: on && total ? p.modules.length : 0.0001, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.4, ease: ease.out }}
            />
          );
        })}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-meta text-ink-2">
        {chosen.map((p) => (
          <li key={p.id} className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px]" style={{ background: productColor[p.id] }} />
            {p.name} <span className="text-ink-3 num">{p.modules.length}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A number that rolls to its new value. */
function Roll({ value, format = String, className }: { value: number; format?: (n: number) => string; className?: string }) {
  const [last, setLast] = useState({ v: value, dir: 1 });
  if (last.v !== value) setLast({ v: value, dir: value > last.v ? 1 : -1 });
  const dir = last.dir;
  return (
    <p className={cn("relative overflow-hidden pb-[0.06em]", className)}>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span
          key={value}
          custom={dir}
          initial={{ y: `${dir * 70}%`, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: `${dir * -70}%`, opacity: 0 }}
          transition={{ duration: 0.35, ease: ease.out }}
          className="block"
        >
          {format(value)}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}

/* ---------- FAQ ---------- */
const glance = [
  { k: "Moving from your current system", i: 1 },
  { k: "Buying every product", i: 0 },
  { k: "Where data sits", i: 4 },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="faq-title" className="wrap py-20 md:py-28">
      <Ruler index="05" label="Questions" aside={`${faqs.length} short answers`} />
      <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="faq-title" className="text-d2">Questions institutions ask first</h2>
            {/* the three answers people act on, readable without opening anything */}
            <ul className="mt-7 hidden border-t border-line lg:grid" aria-label="At a glance">
              {glance.map((g) => (
                <li key={g.i} className="border-b border-line">
                  <button type="button" onClick={() => setOpen(g.i)} className="group flex min-h-12 w-full items-baseline justify-between gap-4 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge">
                    <span className="text-meta text-ink-3 transition-colors group-hover:text-ink-2">{g.k}</span>
                    <span className="text-ui font-medium">{faqs[g.i].v.replace(/\.$/, "")}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
              <ButtonLink href="/demo#contact" variant="outline" size="sm">Talk to a person</ButtonLink>
              <span className="text-meta text-ink-3">Still unsure? A person picks up.</span>
            </div>
          </div>
        </div>
        <ul className="lg:col-span-8">
          {faqs.map((f, i) => {
            const id = `faq-${i}`;
            return (
              <li key={f.q} className="border-b border-line first:border-t">
                <h3>
                  <button id={`${id}-q`} aria-controls={`${id}-a`} className="group flex min-h-16 w-full items-center gap-5 py-5 text-left text-h4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                    <span aria-hidden className={cn("w-6 shrink-0 text-meta num transition-colors", open === i ? "text-ink" : "text-ink-3")}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{f.q}</span>
                    <span aria-hidden className={cn("grid size-9 shrink-0 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-300", open === i ? "bg-inverse text-on-inverse" : "text-ink-2 shadow-[inset_0_0_0_1px_var(--line-2)] group-hover:text-ink group-hover:shadow-[inset_0_0_0_1.5px_var(--edge)]")}>
                      <Plus className={cn("size-4 transition-transform duration-300 ease-[var(--ease-out)]", open === i && "rotate-45")} strokeWidth={2} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="overflow-hidden">
                      <p className="max-w-[60ch] pb-7 pl-11 text-body text-ink-2">
                        <span className="font-semibold text-ink">{f.v}</span> {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- final call ---------- */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="wrap pb-20 md:pb-28">
      <div className="frame relative isolate grid gap-10 overflow-hidden bg-signal px-6 pt-14 text-on-signal sm:px-12 md:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10">
        <SignalField />
        <div className="lg:col-span-7 lg:pb-20">
          <h2 id="cta-title" className="max-w-[14ch] text-d1">See Lireons with your own students.</h2>
          <p className="mt-6 max-w-[44ch] text-lead">A 30-minute walkthrough with your own batches, courses or a past test paper loaded in. No slides.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic><ButtonLink href="/demo" variant="ink" size="lg">Book a demo</ButtonLink></Magnetic>
            <ButtonLink href="/pricing" variant="outline" size="lg">See pricing</ButtonLink>
          </div>
        </div>
        <div className="relative -mb-14 self-end md:-mb-20 lg:col-span-5">
          <CtaPhone />
        </div>
      </div>
    </section>
  );
}

/** The learner's moment the whole page leads to: a course bought and open, on a phone rising out of the band. */
function CtaPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const show = seen || (mounted && !!reduce);
  return (
    <div ref={ref} className="relative mx-auto w-[min(76%,290px)] lg:ml-auto lg:mr-6">
      <motion.div initial={false} animate={show ? { y: 0, rotate: -3 } : { y: 90, rotate: 0 }} transition={{ duration: 0.9, ease: ease.out }}>
        <Shot id="phone-course-purchase" device sizes="290px" className="drop-shadow-[0_30px_40px_oklch(0.2_0.05_31/0.45)]" />
      </motion.div>
      <p className="absolute -left-6 top-[8%] hidden rounded-full border-[1.5px] border-edge bg-surface px-3 py-1.5 text-meta font-medium text-ink shadow-[3px_3px_0_0_var(--edge)] sm:block lg:-left-28">Sample screen. Your demo uses your data.</p>
    </div>
  );
}
