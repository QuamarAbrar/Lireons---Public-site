"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, Check, Pause, Play } from "lucide-react";
import { integrations, products, type ProductId } from "@/lib/products";
import { auditLog, integrationDetails, permissions, roles, type Access, type RoleId } from "@/lib/platform";
import { LiveDot, productColor, productSoft } from "@/components/visuals/Frame";
import { Button, ButtonLink } from "@/components/ui/Button";
import { RiseHeadline } from "@/components/product/ProductHero";
import { ShowcaseFrame } from "@/components/product/ShowcaseFrame";
import { Intro } from "@/components/product/Sections";
import { useLoop, useTick } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Backdrop, Ruler, Ticks } from "@/components/ui/Backdrop";
import { Magnetic } from "@/components/ui/Magnetic";
import { MeshField } from "@/components/ui/Shader";
import { Shot } from "@/components/ui/Shot";
import { ShotCrop, type Region } from "@/components/pages/ShotCrop";
import type { ShotId } from "@/components/shots/meta";

/** What each role actually sees when it signs in: a crop of that view. */
const roleView: Record<RoleId, { id: ShotId; region: Region; what: string }> = {
  owner: { id: "security-admin", region: [0.16, 0.04, 0.84, 0.6], what: "Security console: audit log, backups and sessions" },
  admin: { id: "home-app", region: [0.16, 0.05, 0.84, 0.55], what: "Any student's full record across products" },
  teacher: { id: "academy-builder", region: [0.16, 0.06, 0.62, 0.6], what: "The courses they teach and their own live classes" },
  reviewer: { id: "assess-review", region: [0.5, 0.06, 0.5, 0.62], what: "Only the flags on tests assigned to them" },
  parent: { id: "phone-student-results", region: [0, 0.06, 1, 0.5], what: "Their own child's progress and test results" },
  student: { id: "phone-student-lesson", region: [0, 0.06, 1, 0.5], what: "Their own courses and lessons" },
};

const nameOf = (id: ProductId) => products.find((p) => p.id === id)!.name;

/* ---------- hero ---------- */
export function PlatformHero() {
  return (
    <section aria-labelledby="plat-title" className="relative pt-28 md:pt-32">
      <div className="wrap">
        <motion.p className="enter-fade flex flex-wrap items-center gap-x-3 gap-y-2 text-ui">
          <span className="marker">Platform</span>
          <span className="text-ink-3">· what every product shares</span>
        </motion.p>
        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
          <RiseHeadline id="plat-title" text="One student record under every product." className="text-d1 lg:col-span-8" />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ease.out, delay: 0.35 }} className="lg:col-span-4 lg:pb-2">
            <p className="max-w-[44ch] text-lead text-ink-2">Enrolments, courses, live classes, tests and doubts all write to the same record. Roles decide who sees which slice; the audit log tracks every change.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic><ButtonLink href="/demo" size="lg" media="/clips/academy.mp4">Book a demo</ButtonLink></Magnetic>
              <ButtonLink href="#roles" size="lg" variant="outline" icon={<ArrowDown className="size-4" />}>See roles</ButtonLink>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="relative isolate mt-10 pt-4 md:mt-12 md:pt-8">
        <MeshField palette="brand" follow className="[mask-image:radial-gradient(ellipse_at_center,#000_50%,transparent_85%)]" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.45 }} className="wrap">
          <ShowcaseFrame field="var(--surface-2)" block="var(--ink)">
            <Shot id="platform-record" priority tilt sizes="(min-width: 1312px) 1200px, 92vw" className="shadow-3" />
          </ShowcaseFrame>
          <p className="mt-4 text-meta text-ink-3">One student’s record: every product writes to its tabs, and the rail on the right shows who touched it. Product render; names and figures are illustrative.</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- roles x permissions ---------- */
function Cell({ a, on, label }: { a: Access; on: boolean; label: string }) {
  return (
    <span className={cn("inline-grid size-6 place-items-center rounded-md transition-opacity duration-300", !on && "opacity-40")} role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
      {a === "full" && <span className="grid size-6 place-items-center rounded-md bg-inverse text-on-inverse"><Check className="size-3.5" strokeWidth={2.75} /></span>}
      {a === "own" && <span className="grid size-6 place-items-center rounded-md shadow-[inset_0_0_0_1.5px_var(--ink)]"><span className="size-2 rounded-[2px] bg-ink" /></span>}
      {a === "none" && <span className="block h-[1.5px] w-3 bg-ink-3" />}
    </span>
  );
}
const accessLabel = (a: Access) => (a === "full" ? "Allowed" : a === "own" ? "Allowed for their own scope" : "Not allowed");
const ownScope: Record<RoleId, string> = {
  owner: "everything",
  admin: "their institution",
  teacher: "the batches and courses they teach",
  reviewer: "tests assigned to them",
  parent: "their own children",
  student: "their own record",
};

export function RoleMatrix() {
  const [hot, setHot] = useState<RoleId | null>(null);
  const [sel, setSel] = useState<RoleId>("teacher");
  const focus = hot ?? sel;
  const role = roles.find((r) => r.id === focus)!;
  const allowed = permissions.filter((p) => p.access[focus] !== "none");

  return (
    <section id="roles" aria-labelledby="roles-title" className="wrap scroll-mt-20 py-20 md:py-28">
      <Intro label="Roles and permissions" index="01" id="roles-title" title="Every role sees its slice, across every product.">
        Set per role, not per product. A teacher sees the same batches in Academy, Assessments and the AI Doubt Solver.
      </Intro>

      <div className="mt-10 md:mt-12 grid gap-6 xl:grid-cols-12 xl:gap-8">
        <div className="min-w-0 xl:col-span-9">
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-meta text-ink-2">
            <span className="flex items-center gap-2"><Cell a="full" on label="" />Allowed</span>
            <span className="flex items-center gap-2"><Cell a="own" on label="" />Own scope only</span>
            <span className="flex items-center gap-2"><Cell a="none" on label="" />Not allowed</span>
            <span className="text-ink-3 md:ml-auto">Selected role in full ink, the rest faded</span>
          </div>

          {/* md+: full matrix. overflow-clip (not hidden) keeps the sticky header working */}
          <div className="hidden overflow-clip rounded-2xl border border-line bg-surface md:block" onPointerLeave={() => setHot(null)}>
            <table className="w-full table-fixed text-left text-ui">
              <caption className="sr-only">Permissions for each role</caption>
              <colgroup>
                <col className="w-[30%]" />
                {roles.map((r) => <col key={r.id} />)}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="sticky top-16 z-10 bg-surface px-5 py-3 text-meta font-normal text-ink-3 shadow-[inset_0_-1px_0_var(--line)]">Permission</th>
                  {roles.map((r) => {
                    const on = r.id === focus;
                    return (
                      <th key={r.id} scope="col" data-cursor="Pick a role" className="sticky top-16 z-10 bg-surface px-1 py-2 shadow-[inset_0_-1px_0_var(--line)]">
                        <button
                          onPointerEnter={() => setHot(r.id)}
                          onFocus={() => setHot(r.id)}
                          onBlur={() => setHot(null)}
                          onClick={() => setSel(r.id)}
                          aria-pressed={sel === r.id}
                          className={cn("relative h-10 w-full rounded-full px-1 text-center text-meta font-medium transition-colors", on ? "text-ink" : "text-ink-3 hover:text-ink-2")}
                        >
                          {sel === r.id && <motion.span layoutId="role-col" className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
                          <span className="relative">{r.name}</span>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {permissions.map((p) => (
                  <tr key={p.t} className="border-b border-line last:border-0">
                    <th scope="row" className="px-5 py-3 font-normal">
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden className="size-2 shrink-0 rounded-[2px]" style={{ background: productColor[p.p] }} />
                        <span className="truncate">{p.t}</span>
                      </span>
                    </th>
                    {roles.map((r) => {
                      const on = r.id === focus;
                      return (
                        <td key={r.id} className={cn("px-1 py-3 text-center transition-colors duration-300", on && "bg-surface-2")} onPointerEnter={() => setHot(r.id)}>
                          <Cell a={p.access[r.id]} on={on} label={`${r.name}: ${accessLabel(p.access[r.id])}`} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* below md: pick a role, read its list */}
          <div className="md:hidden">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose a role">
              {roles.map((r) => (
                <button key={r.id} onClick={() => setSel(r.id)} aria-pressed={sel === r.id} className={cn("relative h-10 rounded-full px-4 text-ui transition-colors", sel === r.id ? "font-medium text-ink" : "text-ink-2 shadow-[inset_0_0_0_1px_var(--line)] hover:text-ink")}>
                  {sel === r.id && <motion.span layoutId="role-chip" className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
                  <span className="relative">{r.name}</span>
                </button>
              ))}
            </div>
            <ul className="mt-5 rounded-2xl border border-line bg-surface">
              {permissions.map((p) => (
                <li key={p.t} className="flex items-center gap-3 border-b border-line px-4 py-3 text-ui last:border-0">
                  <span aria-hidden className="size-2 shrink-0 rounded-[2px]" style={{ background: productColor[p.p] }} />
                  <span className={cn("flex-1", p.access[sel] === "none" && "text-ink-3")}>{p.t}</span>
                  <Cell a={p.access[sel]} on label={accessLabel(p.access[sel])} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* summary docked next to the table on xl, above it below xl */}
        <div aria-live="polite" className="order-first self-start xl:order-none xl:sticky xl:top-24 xl:col-span-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={focus} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: ease.out }} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-h4">{role.name}</p>
                  <p className="text-ui text-ink-3">{role.scope}</p>
                </div>
                <p className="shrink-0 text-right"><span className="figure block text-[3rem]">{allowed.length}</span><span className="text-meta text-ink-3">of {permissions.length} actions</span></p>
              </div>
              <figure className="mt-5">
                <ShotCrop
                  id={roleView[focus].id}
                  region={roleView[focus].region}
                  width={300}
                  alt={`What the ${role.name.toLowerCase()} sees: ${roleView[focus].what}`}
                  className={cn(roleView[focus].id.startsWith("phone") && "mx-auto max-w-[15rem] xl:max-w-none")}
                />
                <figcaption className="mt-2 text-meta text-ink-3">{role.name} view: {roleView[focus].what.charAt(0).toLowerCase() + roleView[focus].what.slice(1)}.</figcaption>
              </figure>
              <ul className="mt-5 grid gap-2 border-t border-line pt-4 sm:grid-cols-2 xl:grid-cols-1">
                {allowed.length === 0 && <li className="text-ui text-ink-3">Nothing in this list.</li>}
                {allowed.map((p) => (
                  <li key={p.t} className="flex items-center gap-2.5 text-ui">
                    <Cell a={p.access[focus]} on label="" />
                    <span className="min-w-0">{p.t}</span>
                  </li>
                ))}
              </ul>
              {allowed.some((p) => p.access[focus] === "own") && <p className="mt-4 text-meta text-ink-3">Own scope means {ownScope[focus]}.</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------- audit log: the one full version on the site ---------- */
type Filter = "all" | ProductId;
const START = 9 * 60 + 10;
const entries = auditLog.map((e, i) => {
  const m = START + i * 17;
  return { ...e, time: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}` };
});
const people = Array.from(new Set(auditLog.map((e) => e.who)));
const FIRST = 6;

export function AuditLog() {
  const [filter, setFilter] = useState<Filter>("all");
  const [person, setPerson] = useState("all");
  const [paused, setPaused] = useState(false);
  const { ref, active } = useLoop(2, 10000);
  const t = useTick(3000, active && !paused);
  // entries arrive one at a time; after the last, the sample day starts again
  const arrived = FIRST + (t % (entries.length - FIRST + 1));
  const shown = entries.slice(0, arrived).reverse();
  const list = shown.filter((e) => (filter === "all" || e.p === filter) && (person === "all" || e.who === person));
  const filters: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...products.map((p) => ({ id: p.id as Filter, label: p.name }))];

  const exportCsv = () => {
    const rows = [["time", "person", "role", "product", "action"], ...list.map((e) => [e.time, e.who, e.role, nameOf(e.p), e.what])];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "lireons-audit-log-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="audit-title" className="border-y border-line bg-surface">
      <div className="wrap py-20 md:py-28">
        <Ruler index="02" label="Audit log" />
        <div className="mt-8 grid gap-12 md:mt-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="audit-title" className="text-d2">Who changed what, and when.</h2>
          <p className="mt-5 max-w-[40ch] text-lead text-ink-2">One log across every product. AI hand-offs and proctor calls are logged like a person&apos;s.</p>

          <div className="mt-10 grid gap-5">
            <div>
              <p className="label" id="audit-product">Product</p>
              <div className="mt-2 flex flex-wrap gap-1" role="group" aria-labelledby="audit-product" data-cursor="Filter">
                {filters.map((f) => (
                  <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} className={cn("relative inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-meta transition-colors", filter === f.id ? "font-medium text-ink" : "text-ink-2 shadow-[inset_0_0_0_1px_var(--line)] hover:text-ink")}>
                    {filter === f.id && <motion.span layoutId="audit-filter" className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
                    {f.id !== "all" && <span aria-hidden className="relative size-2 rounded-[2px]" style={{ background: productColor[f.id] }} />}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="audit-person" className="label">Person</label>
              <select id="audit-person" value={person} onChange={(e) => setPerson(e.target.value)} className="mt-2 block h-11 w-full max-w-[18rem] rounded-[10px] border border-line-2 bg-paper px-3 text-ui text-ink hover:border-ink-3 focus-visible:border-ink">
                <option value="all">Everyone</option>
                {people.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <Button type="button" variant="outline" size="sm" onClick={exportCsv} disabled={list.length === 0}>Export CSV</Button>
            </div>
          </div>
        </div>

        <div ref={ref} className="min-w-0 lg:col-span-7">
          <div className="rounded-2xl border border-line bg-paper p-2">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="flex items-center gap-2 text-meta text-ink-2">{paused ? <span className="size-2 rounded-full bg-ink-3" /> : <LiveDot />}{paused ? "Paused" : "Live"} · <span className="num">{list.length}</span> of <span className="num">{shown.length}</span> entries</span>
              <button onClick={() => setPaused((v) => !v)} aria-pressed={paused} aria-label={paused ? "Resume the live log" : "Pause the live log"} className="ml-auto grid size-10 place-items-center rounded-[10px] text-ink-2 transition-colors hover:bg-surface hover:text-ink">
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            </div>
            <ol className="grid min-h-[30rem] content-start gap-1" aria-label="Audit log entries, newest first">
              <AnimatePresence initial={false} mode="popLayout">
                {list.slice(0, 8).map((e, i) => (
                  <motion.li
                    key={e.time}
                    layout
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.4, ease: ease.out }}
                    className={cn("grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-3 py-3", i === 0 && "bg-surface shadow-1")}
                  >
                    <span aria-hidden className="size-2 rounded-[2px]" style={{ background: productColor[e.p] }} />
                    <span className="min-w-0">
                      <span className="block truncate text-[14px]">{e.what}</span>
                      <span className="block truncate text-[12px] text-ink-3">{e.who} · {e.role} · {nameOf(e.p)}</span>
                    </span>
                    <span className="text-[12px] text-ink-3 num">{e.time}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
              {list.length === 0 && (
                <li className="grid place-items-center gap-3 px-4 py-16 text-center">
                  <p className="text-ui text-ink-2">No entries match these filters yet.</p>
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setFilter("all"); setPerson("all"); }}>Clear filters</Button>
                </li>
              )}
            </ol>
          </div>
          <p className="mt-3 text-meta text-ink-3">Sample entries. Names are illustrative. Export downloads the filtered sample.</p>
        </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- integrations hub: one picture instead of two lists ---------- */
const cats = ["Payments", "Messaging", "Sign-in", "Live classes"] as const;
const mono: Record<string, string> = {
  Razorpay: "Rp", UPI: "UPI", "WhatsApp Business": "WA", "Google Workspace": "GW", "Microsoft 365": "MS",
  Zoom: "Zm", "YouTube Live": "YT", "OBS Studio": "OBS", "SMS gateways": "SMS",
};
const hubOrder = cats.flatMap((c) => integrations.filter((n) => integrationDetails[n]?.cat === c));
// lg+ radial positions (percent of the hub box): around the core
const catSpot: Record<(typeof cats)[number], [number, number]> = {
  Payments: [16, 22], Messaging: [84, 22], "Sign-in": [16, 76], "Live classes": [84, 76],
};
const CORE: [number, number] = [50, 49];

/**
 * Lireons core in the middle, integrations grouped by category around it.
 * Hover, focus or tap an integration to light the products it feeds; left
 * alone it walks through them. `compact` is a shorter version for reuse on
 * other pages (resources).
 */
export function IntegrationsHub({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { ref, step, hold } = useLoop<HTMLDivElement>(hubOrder.length, 2600, 0);
  const name = hubOrder[step];
  const d = integrationDetails[name];
  const pick = (n: string) => hold(hubOrder.indexOf(n));

  const tile = (n: string) => {
    const on = n === name;
    return (
      <li key={n}>
        <button
          type="button"
          onPointerEnter={(e) => e.pointerType === "mouse" && pick(n)}
          onFocus={() => pick(n)}
          onClick={() => pick(n)}
          aria-pressed={on}
          className={cn("relative flex h-10 w-full items-center gap-2.5 rounded-[10px] pl-1.5 pr-3 text-left text-meta transition-colors", on ? "font-medium text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink")}
        >
          {on && <motion.span layoutId={`hub-on-${compact ? "c" : "f"}`} className="seg-on absolute inset-0 rounded-[10px]" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
          <span aria-hidden className="relative grid h-7 min-w-7 place-items-center rounded-md border border-line bg-paper px-1 font-mono text-[11px] font-medium text-ink">{mono[n] ?? n.slice(0, 2)}</span>
          <span className="relative truncate">{n}</span>
        </button>
      </li>
    );
  };

  const group = (c: (typeof cats)[number], extra?: string) => {
    const on = d?.cat === c;
    return (
      <div key={c} className={cn("rounded-2xl border bg-surface p-2 transition-colors duration-300", on ? "border-edge" : "border-line", extra)}>
        <p className="px-1.5 pb-1.5 pt-1 text-meta font-medium text-ink-2">{c}</p>
        <ul className="grid gap-0.5">{hubOrder.filter((n) => integrationDetails[n].cat === c).map(tile)}</ul>
      </div>
    );
  };

  const core = (
    <div className="frame grid gap-3 bg-surface p-4 dark:shadow-[6px_6px_0_0_oklch(0_0_0/0.6)]" style={{ borderRadius: 16 }}>
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="grid size-8 place-items-center rounded-[8px] bg-inverse font-mono text-[12px] font-semibold text-on-inverse">L</span>
        <div className="min-w-0">
          <p className="text-ui font-medium">Lireons</p>
          <p className="text-[12px] text-ink-3">One student record</p>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-1" aria-label={d ? `${name} feeds` : undefined}>
        {products.map((p) => {
          const lit = d?.p.includes(p.id);
          return (
            <li key={p.id} className={cn("flex h-8 items-center gap-2 rounded-lg px-2 text-[12px] last:odd:col-span-2 transition-[background-color,color] duration-300", lit ? "font-medium text-ink" : "text-ink-3")} style={lit ? { background: productSoft[p.id] } : undefined}>
              <span aria-hidden className="size-2 shrink-0 rounded-[2px] transition-opacity" style={{ background: productColor[p.id], opacity: lit ? 1 : 0.3 }} />
              <span className="truncate">{p.name}</span>
              <span className="sr-only">{lit ? "(fed)" : "(not used)"}</span>
            </li>
          );
        })}
      </ul>
      <div className="min-h-[3.75rem] border-t border-line pt-3" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={name} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: ease.out }} className="text-[13px] leading-snug text-ink-2">
            <span className="font-medium text-ink">{name}.</span> {d?.use}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div ref={ref} className={className} data-cursor="Pick a tool">
      {/* lg+: radial hub */}
      <div className={cn("relative hidden lg:block", compact ? "h-[34rem]" : "h-[38rem]")}>
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          {cats.map((c) => {
            const [x, y] = catSpot[c];
            const on = d?.cat === c;
            return (
              <g key={c}>
                <line x1={CORE[0]} y1={CORE[1]} x2={x} y2={y} stroke="var(--line-2)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                {on && <line x1={x} y1={y} x2={CORE[0]} y2={CORE[1]} stroke="var(--ink)" strokeWidth="2" strokeDasharray="4 8" vectorEffect="non-scaling-stroke" className="motion-safe:animate-[dash_1.2s_linear_infinite]" />}
              </g>
            );
          })}
        </svg>
        <div className="absolute w-[19rem] -translate-x-1/2 -translate-y-1/2" style={{ left: `${CORE[0]}%`, top: `${CORE[1]}%` }}>{core}</div>
        {cats.map((c) => {
          const [x, y] = catSpot[c];
          return (
            <div key={c} className="absolute w-[14.5rem] -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              {group(c)}
            </div>
          );
        })}
      </div>

      {/* below lg: the core, then the groups */}
      <div className="grid gap-3 lg:hidden">
        {core}
        <div className="grid gap-3 sm:grid-cols-2">{cats.map((c) => group(c))}</div>
      </div>
    </div>
  );
}

export function Integrations() {
  return (
    <section aria-labelledby="int-title" className="wrap py-20 md:py-28">
      <Intro label="Integrations" index="03" id="int-title" title="Works with the tools you already use.">
        Pick a tool to see which products it feeds.
      </Intro>
      <div className="relative isolate mt-10 rounded-2xl border border-line p-3 sm:p-6 md:mt-12">
        <Backdrop variant="dots" fade="none" className="rounded-2xl" />
        <Ticks inset={6} />
        <IntegrationsHub />
      </div>
      <p className="mt-4 text-meta text-ink-3">Names are the services we connect to. No partnership or endorsement is implied.</p>
    </section>
  );
}
