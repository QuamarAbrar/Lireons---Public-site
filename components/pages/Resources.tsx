"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, FileSpreadsheet, Search, X } from "lucide-react";
import { type ProductId } from "@/lib/products";
import { guides, posts, type Audience, type GuideProduct } from "@/lib/resources";
import { GuideRow, guideProductColor, guideProductName } from "@/components/pages/GuideRow";
import { PostThumb } from "@/components/pages/PostThumb";
import { IntegrationsHub } from "@/components/platform/Platform";
import { productColor, productSoft, LiveDot } from "@/components/visuals/Frame";
import { SectionIntro } from "@/components/pages/PageHeader";
import { UnderlineLink } from "@/components/ui/Button";
import { useLoop } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Backdrop, Ruler } from "@/components/ui/Backdrop";
import { ShotCrop, type Region } from "@/components/pages/ShotCrop";
import type { ShotId } from "@/components/shots/meta";
import { guideShots } from "@/components/pages/guideShots";

const audiences: ("All" | Audience)[] = ["All", "Admins", "Teachers", "Parents", "Students"];
const pName = guideProductName;
const groupOrder = (["academy", "assess", "ai", "platform"] as GuideProduct[]).filter((p) => guides.some((g) => g.product === p));
const soft = (p: GuideProduct) => (p === "platform" ? "var(--surface-2)" : productSoft[p]);
const hue = (p: GuideProduct) => (p === "platform" ? "var(--ink)" : productColor[p]);

/* ---------- top tasks: four entry points, each with a glimpse of the screen ---------- */
const tasks = ([
  { slug: "import-students-from-a-spreadsheet", thumb: "import" },
  { slug: "publish-your-first-course", thumb: "course" },
  { slug: "build-a-test-from-your-question-bank", thumb: "test" },
  { slug: "create-roles-and-invite-staff", thumb: "roles" },
] as const).filter((t) => guides.some((g) => g.slug === t.slug));

export function TopTasks() {
  const { ref, step } = useLoop<HTMLUListElement>(4, 1400, 3);
  return (
    <section aria-labelledby="tasks-title" className="wrap pt-14 md:pt-16">
      <Ruler index="01" label="Start here" />
      <h2 id="tasks-title" className="sr-only">Start here</h2>
      <ul ref={ref} className={cn("mt-6 grid gap-4 sm:grid-cols-2", tasks.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
        {tasks.map((t) => {
          const g = guides.find((x) => x.slug === t.slug)!;
          return (
            <li key={t.slug}>
              <Link href={`/resources/guides/${g.slug}`} data-cursor="Open" className="group/task flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[border-color,translate] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-line-2 active:translate-y-0 motion-reduce:hover:translate-y-0">
                <span aria-hidden className="relative isolate block h-44 overflow-hidden border-b border-line p-4" style={{ background: soft(g.product) }}>
                  <span className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
                  {guideShots[g.slug] ? (
                    <span className="absolute inset-x-4 top-4 block shadow-2 transition-transform duration-500 ease-[var(--ease-out)] group-hover/task:-translate-y-1 motion-reduce:transform-none">
                      <ShotCrop id={guideShots[g.slug].id} region={guideShots[g.slug].region} alt="" width={300} />
                    </span>
                  ) : (
                    <TaskThumb kind={t.thumb} step={step} product={g.product} />
                  )}
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="flex items-center gap-2 text-meta text-ink-3">
                    <span className="size-2 rounded-[2px]" style={{ background: guideProductColor(g.product) }} aria-hidden />
                    {pName(g.product)} · {g.audience}
                  </span>
                  <span className="mt-2 text-h4">{g.title}</span>
                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-ui font-medium text-ink-2 transition-colors group-hover/task:text-ink">
                    Read the guide
                    <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-out)] group-hover/task:translate-x-1 motion-reduce:transform-none" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function TaskThumb({ kind, step, product }: { kind: "import" | "course" | "test" | "roles"; step: number; product: GuideProduct }) {
  const c = hue(product);
  const card = "absolute inset-x-4 top-4 rounded-[12px] border border-line bg-surface p-3 shadow-1";
  if (kind === "import")
    return (
      <span className={card}>
        <span className="flex items-center gap-2 text-[11px] font-medium"><FileSpreadsheet className="size-3.5" style={{ color: c }} />students.xlsx</span>
        {["Aarav M.", "Diya K.", "Kabir S."].map((n, i) => (
          <span key={n} className="mt-1.5 flex items-center justify-between rounded-md bg-paper px-2 py-1 text-[11px]">
            {n}
            <span className={cn("rounded px-1.5 text-[10px] font-medium", i === 2 && step < 2 ? "bg-warn-soft text-ink" : "bg-ok-soft text-ink")}>{i === 2 && step < 2 ? "Fix" : "Ready"}</span>
          </span>
        ))}
      </span>
    );
  if (kind === "course")
    return (
      <span className={card}>
        <span className="text-[11px] font-medium">Physics · Unit 3</span>
        {["Newton's laws", "Free-body diagrams", "Friction"].map((l, i) => (
          <span key={l} className="mt-1.5 flex items-center gap-2 text-[11px]">
            <span className={cn("grid size-3.5 place-items-center rounded-full border", step > i ? "border-transparent text-white" : "border-line-2")} style={step > i ? { background: c } : undefined}>{step > i && <Check className="size-2" strokeWidth={4} />}</span>
            {l}
          </span>
        ))}
        <span className="mt-2 flex items-center justify-between text-[11px] text-ink-2">
          Published
          <span className="relative h-3.5 w-6 rounded-full transition-colors" style={{ background: step >= 3 ? c : "var(--inset)" }}><span className={cn("absolute top-0.5 size-2.5 rounded-full bg-white transition-[left]", step >= 3 ? "left-3" : "left-0.5")} /></span>
        </span>
      </span>
    );
  if (kind === "test")
    return (
      <span className={card}>
        <span className="flex items-center justify-between text-[11px] font-medium">Mock test 6<span className="text-ink-3 num">60 min</span></span>
        {["Kinematics", "Optics", "Thermo"].map((q, i) => (
          <span key={q} className="mt-1.5 flex items-center justify-between rounded-md px-2 py-1 text-[11px]" style={{ background: step === i ? soft(product) : "var(--paper)" }}>
            Q{i + 1} · {q}
            <span className="text-ink-3 num">+4</span>
          </span>
        ))}
      </span>
    );
  return (
    <span className={card}>
      <span className="text-[11px] font-medium">New role · Reviewer</span>
      {["Courses", "Tests", "Results"].map((m, i) => (
        <span key={m} className="mt-1.5 flex items-center justify-between text-[11px]">
          {m}
          <span className="flex rounded-full bg-inset p-0.5 text-[10px]">
            {["None", "View", "Edit"].map((lvl, k) => {
              const pick = (i === step % 3 ? 1 : [2, 1, 0][i]) === k;
              return <span key={lvl} className={cn("rounded-full px-1.5", pick ? "bg-surface font-medium shadow-[inset_0_0_0_1px_var(--edge)]" : "text-ink-3")}>{lvl}</span>;
            })}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ---------- search and the grouped index ---------- */
export function HelpSearch() {
  const [q, setQ] = useState("");
  const [aud, setAud] = useState<(typeof audiences)[number]>("All");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return guides.filter((g) => (aud === "All" || g.audience === aud) && terms.every((t) => `${g.title} ${pName(g.product)} ${g.audience} ${g.summary}`.toLowerCase().includes(t)));
  }, [q, aud]);
  const grouped = groupOrder.map((p) => ({ p, items: results.filter((g) => g.product === p) })).filter((x) => x.items.length);

  const mark = (text: string) => {
    const terms = q.trim().split(/\s+/).filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (!terms.length) return text;
    const parts = text.split(new RegExp(`(${terms.join("|")})`, "gi"));
    return parts.map((part, i) => (i % 2 ? <mark key={i} className="rounded-[3px] bg-signal-soft px-0.5 text-ink">{part}</mark> : part));
  };

  return (
    <section id="guides" aria-labelledby="guides-title" className="wrap scroll-mt-24 py-20 md:py-28">
      <SectionIntro label="All guides" index="02" id="guides-title" title="Every guide, by product.">
        For the office, teachers, parents and students. Press / to search.
      </SectionIntro>
      <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-12 md:gap-10">
        <nav aria-label="Guides by product" className="hidden md:col-span-3 md:block">
          <div className="sticky top-28">
            <p className="text-meta text-ink-3">By product</p>
            <ul className="mt-2 border-t border-line">
              {groupOrder.map((gp) => {
                const all = guides.filter((g) => g.product === gp).length;
                const now = results.filter((g) => g.product === gp).length;
                return (
                  <li key={gp} className="border-b border-line">
                    <a href={`#guides-${gp}`} className={cn("flex min-h-11 items-center gap-2.5 text-ui transition-colors hover:text-ink", now ? "text-ink-2" : "pointer-events-none text-ink-3")} aria-disabled={!now || undefined}>
                      <span aria-hidden className="h-4 w-1 rounded-full" style={{ background: guideProductColor(gp) }} />
                      {pName(gp)}
                      <span className="ml-auto text-meta text-ink-3 num">{now === all ? all : `${now} of ${all}`}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 grid grid-cols-2 border-y border-line">
              <p className="py-3 pr-3"><span className="block text-meta text-ink-3">Guides</span><span className="figure text-d3 num">{guides.length}</span></p>
              <p className="border-l border-line py-3 pl-3"><span className="block text-meta text-ink-3">Audiences</span><span className="figure text-d3 num">{audiences.length - 1}</span></p>
            </div>
          </div>
        </nav>
        <div className="min-w-0 md:col-span-9">
          <div className="group relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-3 transition-colors group-focus-within:text-ink" aria-hidden />
            <label htmlFor="guide-search" className="sr-only">Search guides</label>
            <input
              ref={input}
              id="guide-search"
              type="search"
              data-cursor="Type"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search guides, for example live class or proctor"
              autoComplete="off"
              className="block h-14 w-full rounded-[12px] border border-line bg-surface pl-12 pr-24 text-body transition-[border-color,box-shadow] placeholder:text-ink-3 hover:border-line-2 focus:border-ink focus:shadow-[0_0_0_4px_var(--inset)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {q ? (
                <button onClick={() => { setQ(""); input.current?.focus(); }} aria-label="Clear search" className="grid size-10 place-items-center rounded-[10px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink">
                  <X className="size-4" aria-hidden />
                </button>
              ) : (
                <kbd className="hidden rounded-md border border-line bg-paper px-2 py-0.5 font-mono text-meta text-ink-3 sm:block" aria-hidden>/</kbd>
              )}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1" role="radiogroup" aria-label="Filter by audience">
            {audiences.map((a) => (
              <button key={a} role="radio" aria-checked={aud === a} onClick={() => setAud(a)} className={cn("relative h-10 rounded-full px-4 text-ui transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal", aud === a ? "font-medium text-ink" : "text-ink-2 hover:text-ink")}>
                {aud === a && <motion.span layoutId="aud-pill" aria-hidden className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.12 }} />}
                <span className="relative">{a}</span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-meta text-ink-3" aria-live="polite">
            {results.length === guides.length ? `${guides.length} guides` : `${results.length} of ${guides.length} guides`}
          </p>
          {grouped.map(({ p, items }) => (
            <div key={p} id={`guides-${p}`} className="mt-6 scroll-mt-28">
              <h3 className="flex items-center gap-2 text-ui font-medium">
                <span aria-hidden className="h-4 w-1 rounded-full" style={{ background: guideProductColor(p) }} />
                {pName(p)}
                <span className="text-meta font-normal text-ink-3 num">{items.length}</span>
              </h3>
              <ul className="mt-2 border-t border-line">
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((g) => (
                    <motion.li key={g.slug} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: ease.out }} className="border-b border-line">
                      <GuideRow href={`/resources/guides/${g.slug}`} product={g.product} audience={g.audience} title={mark(g.title)} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          ))}
          {results.length === 0 && (
            <div className="mt-3 rounded-2xl border border-line bg-surface px-5 py-8">
              <p className="text-h4">No guides match “{q}”.</p>
              <p className="mt-1 text-ui text-ink-2">Try a shorter word, or write to <a href="mailto:hello@lireons.com" className="text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">hello@lireons.com</a> and we will answer directly.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- changelog: each entry carries a one-line glimpse in its product's hue ---------- */
type Change = { d: string; iso: string; p: ProductId | "platform"; t: string; b: string; v: "flags" | "results" | "record" | "export" | "reminder" };
/** The shipped screen for each entry, cropped to 16:9 around the change. */
const changeShot: Record<Change["v"], { id: ShotId; region: Region; alt: string }> = {
  flags: { id: "assess-review", region: [0.5, 0.06, 0.5, 0.45], alt: "A proctor flag with its evidence clip and the reviewer's Uphold or Clear decision" },
  results: { id: "phone-student-results", region: [0, 0.08, 1, 0.26], alt: "A mock test result on a phone with the score for each section and the rank in the batch" },
  record: { id: "academy-builder", region: [0.16, 0.05, 0.6, 0.54], alt: "The course builder with a recorded lesson and its chapter markers" },
  export: { id: "security-admin", region: [0.16, 0.12, 0.56, 0.5], alt: "The audit log with person, product and event filters and an Export audit log button" },
  reminder: { id: "phone-live-class", region: [0, 0.08, 1, 0.26], alt: "A live class reminder on a phone, ten minutes before the class, with a Join class button" },
};
const changes: Change[] = [
  { d: "14 October 2026", iso: "2026-10-14", p: "assess", t: "Clear several proctor flags at once", b: "Select flags across candidates and clear them together. Each decision is still logged.", v: "flags" },
  { d: "30 September 2026", iso: "2026-09-30", p: "assess", t: "Section scores on the result screen", b: "Candidates see their score for each section and their rank in the batch once results are released.", v: "results" },
  { d: "16 September 2026", iso: "2026-09-16", p: "academy", t: "Live classes record into the course", b: "When a live class ends, its recording lands in the right lesson, chat removed.", v: "record" },
  { d: "2 September 2026", iso: "2026-09-02", p: "platform", t: "Audit log export", b: "Filter the audit log by person, product and date, then export as CSV.", v: "export" },
  { d: "19 August 2026", iso: "2026-08-19", p: "academy", t: "Reminders before a live class", b: "Learners get a WhatsApp reminder ten minutes before a live class, with a link that opens the class.", v: "reminder" },
];

export function Changelog() {
  return (
    <section id="changelog" aria-labelledby="changelog-title" className="relative isolate scroll-mt-24 border-y border-line">
      <Backdrop variant="hatch" fade="none" tint="var(--surface-2)" className="opacity-60" />
      <div className="wrap py-20 md:py-28">
        <SectionIntro label="Changelog" index="03" id="changelog-title" title="What shipped recently." />
        <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <p className="text-meta text-ink-3">Since {changes[changes.length - 1].d.replace(/^\d+ /, "")}</p>
            <p className="figure mt-1 text-d2 num">{changes.length}<span className="ml-2 align-middle text-ui text-ink-3">releases</span></p>
            <ul className="mt-4 grid gap-2 border-t border-line pt-4">
              {(["academy", "assess", "platform"] as const).map((k) => {
                const n = changes.filter((c) => c.p === k).length;
                return (
                  <li key={k} className="grid grid-cols-[6.5rem_1fr_1.5rem] items-center gap-2 text-meta">
                    <span className="truncate text-ink-2">{pName(k)}</span>
                    <span className="h-1.5 rounded-full bg-inset"><span className="block h-full rounded-full" style={{ width: `${(n / changes.length) * 100}%`, background: hue(k) }} /></span>
                    <span className="text-right text-ink-3 num">{n}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <ol className="relative min-w-0 md:col-span-9">
          <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
          {changes.map((c, i) => (
            <motion.li key={c.t} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.5, ease: ease.out, delay: i * 0.04 }} className="relative grid gap-2 pb-12 pl-8 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-8 xl:grid-cols-[10rem_1fr_17rem]">
              <span aria-hidden className="absolute left-0 top-1.5 grid size-[11px] place-items-center rounded-full border border-line-2 bg-paper">
                {i === 0 && <LiveDot className="scale-75" />}
              </span>
              <time dateTime={c.iso} className="text-ui text-ink-3 num">{c.d}</time>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-meta font-medium text-ink" style={{ background: soft(c.p) }}>
                  <span aria-hidden className="size-2 rounded-[2px]" style={{ background: hue(c.p) }} />
                  {pName(c.p)}
                </span>
                <h3 className="mt-2 text-h4">{c.t}</h3>
                <p className="mt-1.5 max-w-[56ch] text-ui text-ink-2">{c.b}</p>
              </div>
              <figure className="sm:col-start-2 xl:col-start-3 xl:self-start">
                <ShotCrop id={changeShot[c.v].id} region={changeShot[c.v].region} alt={changeShot[c.v].alt} width={272} />
              </figure>
            </motion.li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- integrations: one compact grid by category; the full hub lives on /platform ---------- */

export function Integrations() {
  return (
    <section id="integrations" aria-labelledby="int-title" className="scroll-mt-24">
      <div className="wrap py-20 md:py-28">
        <SectionIntro label="Integrations" index="04" id="int-title" title="Works with what your office already uses.">
          Switched on per institution from settings. <UnderlineLink href="/platform#int-title" className="text-ink">How they feed the record</UnderlineLink>
        </SectionIntro>
        <IntegrationsHub compact className="mt-10 md:mt-12" />
      </div>
    </section>
  );
}

/* ---------- blog: featured post fills a frame on its product field; topics filter the list ---------- */
export function Blog() {
  const topics = ["All", ...Array.from(new Set(posts.map((p) => p.topic)))];
  const [topic, setTopic] = useState("All");
  const shown = topic === "All" ? posts : posts.filter((p) => p.topic === topic);
  const [lead, ...rest] = shown;
  return (
    <section id="blog" aria-labelledby="blog-title" className="scroll-mt-24">
      <div className="wrap pb-20 pt-4 md:pb-28">
        <SectionIntro label="Blog" index="05" id="blog-title" title="Notes on running institutions well.">
          Written from the office side: live teaching, exams and running a course business.
        </SectionIntro>
        <div className="mt-10 md:mt-12 grid gap-10 lg:grid-cols-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article key={lead.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="group/post relative lg:col-span-7">
              <PostThumb topic={lead.topic} size="lg" sizes="(min-width: 1024px) 720px, 100vw" className="aspect-[16/10] transition-transform duration-500 ease-[var(--ease-out)] group-hover/post:-translate-y-1 motion-reduce:transform-none" />
              <p className="mt-6 flex gap-3 text-meta text-ink-3"><span className="text-ink-2">{lead.topic}</span><time dateTime={lead.iso} className="num">{lead.date}</time></p>
              <h3 className="mt-2 text-d3">
                <Link href={`/resources/blog/${lead.slug}`} className="after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-signal">
                  <PostTitle>{lead.title}</PostTitle>
                </Link>
              </h3>
              <p className="mt-3 max-w-[52ch] text-body text-ink-2">{lead.summary}</p>
            </motion.article>
          </AnimatePresence>
          <div className="lg:col-span-5">
            <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Filter posts by topic">
              {topics.map((t) => (
                <button key={t} role="radio" aria-checked={topic === t} onClick={() => setTopic(t)} className={cn("relative h-10 rounded-full px-4 text-ui transition-colors", topic === t ? "font-medium text-ink" : "text-ink-2 hover:text-ink")}>
                  {topic === t && <motion.span layoutId="topic-pill" aria-hidden className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.12 }} />}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
            <ul className="mt-6 border-t border-line">
              {rest.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <article className="group/post relative -mx-2 flex gap-4 rounded-2xl px-2 py-5 transition-colors duration-200 hover:bg-surface">
                    <PostThumb topic={p.topic} size="sm" className="mt-1 w-24 shrink-0 sm:w-32" />
                    <span className="min-w-0">
                      <p className="flex gap-3 text-meta text-ink-3"><span className="text-ink-2">{p.topic}</span><time dateTime={p.iso} className="num">{p.date}</time></p>
                      <h3 className="mt-1.5 text-h4">
                        <Link href={`/resources/blog/${p.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-signal">
                          <PostTitle>{p.title}</PostTitle>
                        </Link>
                      </h3>
                      <p className="mt-1.5 line-clamp-2 max-w-[56ch] text-ui text-ink-2">{p.summary}</p>
                    </span>
                  </article>
                </li>
              ))}
            </ul>
            {rest.length === 0 && <p className="mt-6 text-ui text-ink-3">One post on {topic} so far. It is on the left.</p>}
            <p className="mt-8 text-ui text-ink-3">Subscribe in the footer for one email a month.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Post title with an arrow that slides in beside the last word on hover. */
function PostTitle({ children }: { children: string }) {
  return (
    <>
      {children}
      <ArrowUpRight aria-hidden className="ml-2 inline-block size-[0.8em] -translate-x-2 align-[-0.05em] text-ink-3 opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] group-hover/post:translate-x-0 group-hover/post:opacity-100 motion-reduce:transform-none" />
    </>
  );
}
