"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Info, Minus } from "lucide-react";
import { products, type ProductId } from "@/lib/products";
import { productColor, productSoft, LiveDot } from "@/components/visuals/Frame";
import { ButtonLink, UnderlineLink } from "@/components/ui/Button";
import { FaqSection } from "@/components/pages/Accordion";
import { SectionIntro } from "@/components/pages/PageHeader";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/ui/Magnetic";
import { MeshField } from "@/components/ui/Shader";
import { ShotCrop, type Region } from "@/components/pages/ShotCrop";
import type { ShotId } from "@/components/shots/meta";

/** A small crop of each product's main screen, so a column reads as a product, not a word. */
const glyph: Record<ProductId, { id: ShotId; region: Region }> = {
  academy: { id: "academy-storefront", region: [0, 0.04, 0.42, 0.42] },
  assess: { id: "assess-review", region: [0.5, 0.1, 0.42, 0.42] },
  ai: { id: "ai-student", region: [0.16, 0.04, 0.4, 0.4] },
};

/* ---------- 1. hero: the plan builder is the page's product ---------- */
const steps = [50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000];
const ticks = [
  { i: 0, l: "50" },
  { i: 4, l: "500" },
  { i: 6, l: "1k" },
  { i: 10, l: "5k" },
  { i: 12, l: "10k+" },
];
const shared = ["One student record", "Roles and audit log", "Student app on web and phone", "First import with our team"];

export function PricingHero() {
  const [sel, setSel] = useState<ProductId[]>(["academy", "assess"]);
  const [idx, setIdx] = useState(6);
  const students = steps[idx];
  const toggle = (id: ProductId) => setSel((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  const chosen = products.filter((p) => sel.includes(p.id));
  const pct = (idx / (steps.length - 1)) * 100;
  const label = idx === steps.length - 1 ? "10,000+" : students.toLocaleString("en-IN");
  const href = `/demo?products=${encodeURIComponent(sel.join(","))}&students=${students}`;

  return (
    <section aria-labelledby="page-title" className="relative isolate">
      <MeshField palette="brand" follow className="[mask-image:linear-gradient(#000_55%,transparent)]" />
      <div className="wrap grid gap-12 pb-20 pt-28 md:pb-28 md:pt-32 lg:grid-cols-12 lg:gap-10">
        {/* left: headline, then the two controls */}
        <div className="min-w-0 lg:col-span-5">
          <p className="enter-fade marker">Pricing</p>
          <h1 id="page-title" className="mt-6 text-d2">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="enter-rise block [animation-delay:0.05s]">Pay per active student, only for what you switch on.</span>
            </span>
          </h1>
          <p className="enter-fade mt-5 max-w-[42ch] text-lead text-ink-2 [animation-delay:0.2s]">Pick products and size. The quote sheet fills in as you go.</p>

          <fieldset id="builder" className="enter-fade mt-8 min-w-0 scroll-mt-28 [animation-delay:0.3s]">
            <legend className="text-h4">Products</legend>
            <div className="mt-4 grid gap-2 sm:grid-cols-2" data-cursor="Toggle">
              {products.map((p) => {
                const on = sel.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={cn(
                      "group relative flex min-h-[64px] cursor-pointer items-start gap-3 rounded-2xl sm:last:odd:col-span-2 border bg-surface px-4 py-3 transition-[border-color] duration-200 hover:border-line-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal",
                      on ? "border-transparent" : "border-line",
                    )}
                  >
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(p.id)} />
                    {on && <motion.span layoutId={`chip-${p.id}`} aria-hidden className="absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 0 1.5px ${productColor[p.id]}` }} />}
                    <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] border transition-colors", on ? "border-transparent" : "border-line-2")} style={on ? { background: productColor[p.id] } : undefined}>
                      <AnimatePresence>{on && <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}><Check className="size-3.5 text-white" strokeWidth={3} aria-hidden /></motion.span>}</AnimatePresence>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-ui font-medium">
                        {p.name}
                        {p.status && <span className="rounded-full bg-ai-soft px-2 text-meta font-medium text-ai">{p.status}</span>}
                      </span>
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {p.modules.slice(0, 2).map((m) => (
                          <span key={m} className="rounded-full px-2 py-0.5 text-meta" style={on ? { background: productSoft[p.id], color: "var(--ink)" } : { background: "var(--inset)", color: "var(--ink-2)" }}>{m}</span>
                        ))}
                        {p.modules.length > 2 && <span className="px-1 py-0.5 text-meta text-ink-3">+{p.modules.length - 2}</span>}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="enter-fade mt-8 [animation-delay:0.35s]">
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="students" className="text-h4">Active students</label>
              <span className="figure text-d2 leading-none" aria-hidden>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={label} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25, ease: ease.out }} className="inline-block">{label}</motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div className="relative mt-3 h-10" data-cursor="Drag">
              <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-inset" />
              <motion.div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink" animate={{ width: `${pct}%` }} transition={{ duration: 0.25, ease: ease.out }} />
              <motion.div aria-hidden className="pointer-events-none absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-edge bg-surface shadow-[2px_2px_0_0_var(--edge)]" animate={{ left: `${pct}%` }} transition={{ duration: 0.25, ease: ease.out }} />
              <input
                id="students"
                type="range"
                min={0}
                max={steps.length - 1}
                step={1}
                value={idx}
                onChange={(e) => setIdx(+e.target.value)}
                aria-valuetext={`${label} students`}
                aria-describedby="students-hint"
                className="peer absolute inset-0 w-full cursor-pointer opacity-0"
              />
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 rounded-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-signal" />
            </div>
            <div className="relative mt-1 h-5 text-meta text-ink-3 num" aria-hidden>
              {ticks.map((t) => (
                <button
                  key={t.l}
                  type="button"
                  tabIndex={-1}
                  onClick={() => setIdx(t.i)}
                  className={cn("absolute top-0 -translate-x-1/2 transition-colors hover:text-ink first:translate-x-0 last:-translate-x-full", idx === t.i && "font-medium text-ink")}
                  style={{ left: `${(t.i / (steps.length - 1)) * 100}%` }}
                >
                  {t.l}
                </button>
              ))}
            </div>
            <p id="students-hint" className="mt-3 text-meta text-ink-3">Enrolled during the year. Alumni, staff and parents are not counted.</p>
          </div>
        </div>

        {/* right: the quote sheet, in a showcase frame */}
        <div className="min-w-0 lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <div className="frame relative isolate overflow-hidden bg-surface-2 p-3 pb-6 sm:p-8 xl:p-10">
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
              <QuoteSheet chosen={chosen} label={label} />
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Magnetic><ButtonLink href={href} size="lg" media={chosen[0]?.clip} disabled={chosen.length === 0}>Get a quote for this plan</ButtonLink></Magnetic>
              <p className="flex max-w-[40ch] items-start gap-2 text-meta text-ink-3">
                <Info className="mt-px size-4 shrink-0" aria-hidden />
                Rupee figures come in your quote: they depend on products, students and migration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The closing band's picture: the quote sheet filled in for an example plan. Decorative copy of the live sheet above. */
export function QuoteSheetPreview() {
  const chosen = products.filter((p) => p.id === "academy" || p.id === "assess");
  return (
    <div aria-hidden inert className="pointer-events-none select-none text-ink">
      <QuoteSheet chosen={chosen} label="1,000" />
    </div>
  );
}

/** The quote as a document: one line per product, a perforated tear-off foot. */
function QuoteSheet({ chosen, label }: { chosen: typeof products; label: string }) {
  return (
    <div className="relative" aria-live="polite">
      <div className="rounded-t-2xl border border-b-0 border-line bg-surface px-4 pb-6 pt-5 sm:px-7 sm:pt-7">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b-[1.5px] border-ink pb-4">
          <div>
            <p className="label">Quote request</p>
            <h2 className="mt-1 text-h3">Your plan</h2>
          </div>
          <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-inset px-2.5 py-1 text-meta text-ink-2"><LiveDot color="var(--ok)" />Draft, updates as you choose</span>
        </div>

        <dl className="grid grid-cols-3 gap-3 border-b border-line py-4 text-ui">
          <div><dt className="label">For</dt><dd className="mt-1">Your institution</dd></div>
          <div><dt className="label">Students</dt><dd className="mt-1 num">{label}</dd></div>
          <div><dt className="label">Billing</dt><dd className="mt-1">Per year</dd></div>
        </dl>

        <table className="w-full border-collapse text-left text-ui">
          <caption className="sr-only">Products in this plan</caption>
          <thead>
            <tr className="border-b border-line text-meta text-ink-3">
              <th scope="col" className="py-2.5 pr-2 font-normal">Product</th>
              <th scope="col" className="hidden py-2.5 pr-2 font-normal sm:table-cell">Modules</th>
              <th scope="col" className="py-2.5 pr-2 font-normal">Students</th>
              <th scope="col" className="py-2.5 text-right font-normal">Rate</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {chosen.map((p) => (
                <motion.tr key={p.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3, ease: ease.out }} className="border-b border-dashed border-line-2">
                  <th scope="row" className="py-3.5 pr-2 font-medium">
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden className="h-6 w-1 shrink-0 rounded-full" style={{ background: productColor[p.id] }} />
                      <span className="min-w-0">{p.name}</span>
                    </span>
                  </th>
                  <td className="hidden py-3.5 pr-2 text-ink-2 num sm:table-cell">{p.modules.length}</td>
                  <td className="py-3.5 pr-2 text-ink-2 num">{label}</td>
                  <td className="py-3.5 text-right text-ink-2">{p.status ? "Terms at launch" : "In your quote"}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {chosen.length === 0 && (
              <tr className="border-b border-dashed border-line-2">
                <td colSpan={4} className="py-5 text-ink-3">Pick at least one product on the left.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="py-4">
          <p className="label">Included with every product</p>
          <ul className="mt-2.5 grid gap-x-4 gap-y-1.5 text-ui text-ink-2 sm:grid-cols-2">
            {shared.map((x) => (
              <li key={x} className="flex items-center gap-2"><Check className="size-4 shrink-0 text-ok" strokeWidth={2.25} aria-hidden />{x}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t-[1.5px] border-ink pt-4">
          <span className="text-h4">Total per year</span>
          <span className="text-h4 text-ink-2">In your quote</span>
        </div>
      </div>
      {/* tear-off edge */}
      <div aria-hidden className="relative h-2 border-x border-line bg-surface">
        <span className="absolute inset-x-3 top-1/2 border-t border-dashed border-line-2" />
      </div>
      <div aria-hidden className="h-2 bg-[radial-gradient(circle_at_6px_0,var(--surface)_5.5px,transparent_6px)] bg-[length:12px_8px] bg-repeat-x" />
    </div>
  );
}

/* ---------- 3. comparison ---------- */
type Cell = boolean | string;
const groups: { name: string; rows: { f: string; v: Record<ProductId, Cell> }[] }[] = [
  {
    name: "With every product",
    rows: [
      { f: "One student record", v: { academy: true, assess: true, ai: true } },
      { f: "Roles and permissions", v: { academy: true, assess: true, ai: true } },
      { f: "Audit log", v: { academy: true, assess: true, ai: true } },
      { f: "WhatsApp notifications", v: { academy: true, assess: true, ai: "Teacher hand-off" } },
      { f: "Razorpay and UPI payments", v: { academy: "Course sales", assess: "Paid tests", ai: false } },
    ],
  },
  {
    name: "Teaching",
    rows: [
      { f: "Branded storefront on your domain", v: { academy: true, assess: false, ai: false } },
      { f: "Recorded and live classes", v: { academy: true, assess: false, ai: false } },
      { f: "Coding problems with hidden tests", v: { academy: true, assess: true, ai: false } },
      { f: "Verifiable certificates", v: { academy: true, assess: false, ai: false } },
      { f: "Discussion threads per course", v: { academy: true, assess: false, ai: false } },
    ],
  },
  {
    name: "Exams and doubts",
    rows: [
      { f: "Test builder and question bank", v: { academy: "Quizzes", assess: true, ai: false } },
      { f: "AI proctor with evidence", v: { academy: false, assess: true, ai: false } },
      { f: "Human review of AI decisions", v: { academy: false, assess: true, ai: true } },
      { f: "Answers cited from your material", v: { academy: false, assess: false, ai: true } },
      { f: "Topic insights for teachers", v: { academy: false, assess: "By question", ai: true } },
    ],
  },
];
const shortName: Record<ProductId, string> = { academy: "Academy", assess: "Assess", ai: "AI" };

export function Comparison() {
  const [col, setCol] = useState<ProductId | null>(null);
  const flat = useMemo(() => groups.flatMap((g) => g.rows).length, []);
  return (
    <section aria-labelledby="compare-title">
      <div className="wrap pb-20 pt-2 md:pb-28">
        <SectionIntro label="Compare" index="01" id="compare-title" title="What each product includes.">
          {flat} capabilities, three products.<span className="hidden md:inline"> Hover a column to follow one product down.</span>
        </SectionIntro>

        <CompareMobile />

        <div className="mt-10 hidden md:mt-12 md:block">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left text-ui" onPointerLeave={() => setCol(null)}>
            <caption className="sr-only">Capabilities included in each Lireons product</caption>
            <colgroup>
              <col className="w-[34%]" />
              {products.map((p) => <col key={p.id} />)}
            </colgroup>
            <thead>
              <tr aria-hidden>
                <td />
                {products.map((p) => (
                  <td key={p.id} className="px-3 pb-1 align-bottom">
                    <Link href={p.href} tabIndex={-1} className="block max-w-[8.5rem] transition-transform duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5">
                      <ShotCrop id={glyph[p.id].id} region={glyph[p.id].region} alt="" width={136} className="rounded-[10px]!" />
                    </Link>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="col" className="sticky top-16 z-10 border-b border-line bg-paper/90 py-4 pr-3 align-bottom font-normal text-ink-3 backdrop-blur-md">Capability</th>
                {products.map((p) => (
                  <th key={p.id} scope="col" onPointerEnter={() => setCol(p.id)} className="sticky top-16 z-10 border-b border-line bg-paper/90 px-3 py-4 align-bottom backdrop-blur-md">
                    <Link href={p.href} className="group flex min-h-10 flex-col justify-end gap-1.5 rounded-lg">
                      <span className="h-1 w-6 rounded-full transition-[width] duration-300 ease-[var(--ease-out)] group-hover:w-10" style={{ background: productColor[p.id], width: col === p.id ? 40 : undefined }} aria-hidden />
                      <span className="block text-ui font-medium leading-tight">{p.name}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((g) => (
              <tbody key={g.name}>
                <tr>
                  <th colSpan={products.length + 1} scope="colgroup" className="pb-2 pt-9 text-meta font-medium text-ink-3">{g.name}</th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.f} className="group/row">
                    <th scope="row" className="border-b border-line py-3.5 pl-2 pr-3 font-normal text-ink transition-colors group-hover/row:bg-surface">{r.f}</th>
                    {products.map((p) => (
                      <td key={p.id} onPointerEnter={() => setCol(p.id)} className={cn("border-b border-line px-3 py-3.5 transition-colors group-hover/row:bg-surface", col === p.id && "bg-surface")}>
                        <CellMark v={r.v[p.id]} id={p.id} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
}

function CellMark({ v, id }: { v: Cell; id: ProductId }) {
  if (v === true)
    return (
      <span className="grid size-6 place-items-center rounded-md" style={{ background: productSoft[id], color: productColor[id] }}>
        <Check className="size-3.5" strokeWidth={2.75} aria-label="Included" />
      </span>
    );
  if (v === false) return <Minus className="size-4 text-line-2" aria-label="Not included" />;
  return <span className="block text-meta leading-snug text-ink-2">{v}</span>;
}

/** Phones: one product at a time, picked from a segmented control; rows it lacks fold away. */
function CompareMobile() {
  const uid = useId();
  const [pid, setPid] = useState<ProductId>("academy");
  const [all, setAll] = useState(false);
  const total = groups.reduce((n, g) => n + g.rows.length, 0);
  const has = groups.reduce((n, g) => n + g.rows.filter((r) => r.v[pid] !== false).length, 0);
  const p = products.find((x) => x.id === pid)!;
  return (
    <div className="mt-10 md:hidden">
      <div role="radiogroup" aria-label="Product to compare" className="grid grid-cols-3 gap-1 rounded-full border border-line bg-surface-2 p-1">
        {products.map((x) => {
          const on = x.id === pid;
          return (
            <label key={x.id} className={cn("relative flex h-10 cursor-pointer items-center justify-center rounded-full text-ui transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal", on ? "font-medium text-ink" : "text-ink-2")}>
              <input type="radio" name={`${uid}-p`} value={x.id} checked={on} onChange={() => setPid(x.id)} className="sr-only" aria-label={x.name} />
              {on && <motion.span layoutId={`${uid}-seg`} aria-hidden className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.12 }} />}
              <span aria-hidden className="relative">{shortName[x.id]}</span>
            </label>
          );
        })}
      </div>
      <p className="mt-5 flex items-center gap-2 text-ui text-ink-2" aria-live="polite">
        <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: productColor[pid] }} />
        <span><span className="font-medium text-ink">{p.name}</span> includes <span className="num">{has}</span> of <span className="num">{total}</span></span>
      </p>
      {groups.map((g) => {
        const rows = all ? g.rows : g.rows.filter((r) => r.v[pid] !== false);
        if (!rows.length) return null;
        return (
          <div key={g.name} className="mt-6">
            <h3 className="text-meta font-medium text-ink-3">{g.name}</h3>
            <ul className="mt-2 border-t border-line">
              {rows.map((r) => (
                <li key={r.f} className="flex min-h-12 items-center justify-between gap-4 border-b border-line py-3 text-ui">
                  <span className={cn(r.v[pid] === false ? "text-ink-3" : "text-ink")}>{r.f}</span>
                  <span className="shrink-0 text-right"><CellMark v={r.v[pid]} id={pid} /></span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <button type="button" onClick={() => setAll((v) => !v)} aria-expanded={all} className="mt-6 inline-flex h-11 items-center gap-2 rounded-[10px] px-1 text-ui font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">
        {all ? "Hide what is not included" : `Show all ${total} capabilities`}
        <ChevronDown className={cn("size-4 transition-transform duration-300", all && "rotate-180")} aria-hidden />
      </button>
    </div>
  );
}

/* ---------- 4. FAQ ---------- */
const pricingFaqs = [
  { q: "Why is there no price on this page?", a: "Because two institutions with the same number of students rarely need the same setup. Your quote states the price per active student for each product you choose, the total for the year, and anything one-off, such as migrating several years of course content or past test results." },
  { q: "What counts as an active student?", a: "A student enrolled with access during the academic year. Alumni, withdrawn students and enquiries that never enrolled are not counted. Staff, teachers and parents do not add to the count." },
  { q: "Do you help with onboarding?", a: "Yes. Our team does the first import of students, batches, courses and question banks with you, sets up roles, and trains your admins and teachers. If your migration needs extra work, the quote says so up front." },
  { q: "Do we have to sign a long contract?", a: "Plans run for one year, which most institutions align with their academic session. We can discuss longer terms if that suits you, but you are never required to sign one to get started." },
  { q: "How can we pay?", a: "By bank transfer over NEFT or RTGS, by UPI, or by card and netbanking through Razorpay. Every invoice carries GST details for your accounts team." },
  { q: "Can we add products later?", a: "Yes, at any time. A product added mid-year is billed for the rest of your current term, and it reads the same student records, so nothing is typed twice." },
  { q: "What if we stop using Lireons?", a: <>You can export your data at any time in standard formats. Refunds are covered in our <UnderlineLink href="/terms#refunds" className="text-ink">refund policy</UnderlineLink>.</> },
  { q: "How is the AI Doubt Solver priced?", a: "It is not generally available yet. Join the waitlist from the demo form and we will share terms when it opens." },
];

export function PricingFaq() {
  return (
    <FaqSection id="pricing-faq-title" title="Pricing questions" items={pricingFaqs} index="02" className="pb-20 pt-4 md:pb-28">
      Not answered here? Ask us during the demo.
    </FaqSection>
  );
}
