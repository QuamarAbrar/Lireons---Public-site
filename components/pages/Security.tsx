"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, Check, Info, Lock, Play, Trash2, X } from "lucide-react";
import { productColor, productSoft, LiveDot } from "@/components/visuals/Frame";
import { SectionIntro } from "@/components/pages/PageHeader";
import { Button, ButtonLink, UnderlineLink } from "@/components/ui/Button";
import { RiseHeadline } from "@/components/product/ProductHero";
import { ShowcaseFrame } from "@/components/product/ShowcaseFrame";
import { Scrubber } from "@/components/product/Scrubber";
import { permissions, roles, type RoleId } from "@/lib/platform";
import { useLoop } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Ruler } from "@/components/ui/Backdrop";
import { Magnetic } from "@/components/ui/Magnetic";
import { FactStrip } from "@/components/pages/PageHeader";
import { MeshField } from "@/components/ui/Shader";
import { Shot } from "@/components/ui/Shot";

/* Illustrative tenants used across the page. */
const tenants = [
  { short: "Sunrise", name: "Sunrise Public School", host: "sunrise.lireons.com", id: "sunrise", kind: "K-12 school", records: "1,284" },
  { short: "Kota Prep", name: "Kota Prep Classes", host: "kotaprep.lireons.com", id: "kotaprep", kind: "Coaching centre", records: "642" },
  { short: "CodeCraft", name: "CodeCraft", host: "learn.codecraft.in", id: "codecraft", kind: "Online academy", records: "3,910" },
];

const blockedText = "text-signal";

/* ---------- hero: a live request inspector ---------- */
export function SecurityHero() {
  return (
    <section aria-labelledby="sec-title" className="relative isolate pb-4 pt-28 md:pt-32">
      <MeshField palette="academy" follow className="[mask-image:linear-gradient(#000_55%,transparent)]" />
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:pt-4">
          <p className="enter-fade marker">Security</p>
          <RiseHeadline id="sec-title" text="Built for the office that answers for every rupee and every mark." className="mt-7 text-d2" />
          <div className="enter-fade [animation-delay:0.3s]">
            <p className="mt-6 max-w-[40ch] text-lead text-ink-2">Learner records, course payments and exam results. How Lireons protects them today, in plain terms.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic><ButtonLink href="/demo" size="lg">Book a demo</ButtonLink></Magnetic>
              <ButtonLink href="#isolation" size="lg" variant="outline" icon={<ArrowDown className="size-4" />}>How isolation works</ButtonLink>
            </div>
            <p className="mt-8 flex max-w-[48ch] gap-2.5 text-meta text-ink-3">
              <Info aria-hidden className="mt-px size-4 shrink-0" />
              <span>No certifications claimed yet. Lireons has not completed an external audit such as ISO 27001 or SOC 2. We share our security overview during a demo.</span>
            </p>
          </div>
        </div>
        <div className="enter-opacity [animation-delay:0.45s] min-w-0 lg:col-span-7">
          <ShowcaseFrame tight>
            <TenantInspector />
          </ShowcaseFrame>
          <p className="mt-4 text-meta text-ink-3">Live example. Tenants, names and IDs are illustrative.</p>
        </div>
      </div>
      <div className="wrap">
        <FactStrip
          className="mt-12 md:mt-16"
          facts={[
            { k: "Isolation", v: "Per institution, on the server" },
            { k: "Encryption", v: "In transit and at rest" },
            { k: "Backups", v: "Daily, stored apart" },
            { k: "Certifications", v: "None claimed yet" },
          ]}
        />
        {/* the admin console as the owner sees it: every control below, on one screen */}
        <figure className="mt-12 md:mt-16">
          <ShowcaseFrame field="var(--surface-2)">
            <Shot id="security-admin" sizes="(min-width: 1312px) 1200px, 92vw" className="shadow-3" />
          </ShowcaseFrame>
          <figcaption className="mt-4 grid gap-1 text-meta text-ink-3 sm:flex sm:justify-between">
            <span>The security console: append-only audit log, backup health, active sessions and a typed confirmation to delete a student&apos;s data.</span>
            <span className="shrink-0">Product render. Names and figures are illustrative.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

type CheckRow = { k: string; v: string; bad?: boolean };
const requests: { who: string; host: string; path: string; note?: string; checks: CheckRow[] }[] = [
  {
    who: "N. Rao · Teacher",
    host: "sunrise.lireons.com",
    path: "GET /students/STU-0314",
    checks: [
      { k: "Tenant", v: "sunrise, from the signed-in session" },
      { k: "Query", v: "scoped to tenant = sunrise" },
      { k: "Result", v: "200 · 1 record · Aarav Mehta" },
    ],
  },
  {
    who: "A. Singh · Admin",
    host: "kotaprep.lireons.com",
    path: "GET /students/STU-0314",
    note: "Student ID copied from another school",
    checks: [
      { k: "Tenant", v: "kotaprep, from the signed-in session" },
      { k: "Query", v: "scoped to tenant = kotaprep · 0 rows" },
      { k: "Result", v: "404 · not in this tenant · logged", bad: true },
    ],
  },
];

function TenantInspector() {
  // 0..3 first request (arrives, then three checks), 4..7 second request
  const { ref, step } = useLoop(8, 1300, 7);
  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex h-11 items-center gap-2.5 border-b border-line px-4">
        <span aria-hidden className="size-2.5 rounded-[3px] bg-ink" />
        <span className="truncate text-[13px] font-medium">Request inspector</span>
        <span className="ml-auto flex items-center gap-2 text-[12px] text-ink-3"><LiveDot /> Live</span>
      </div>
      <ol className="grid gap-3 p-3 sm:p-4" aria-label="Two example requests">
        {requests.map((r, ri) => {
          const base = ri * 4;
          const shown = step >= base;
          return (
            <li key={ri} className={cn("rounded-xl border p-3 transition-[border-color] duration-300 sm:p-4", shown ? "border-line-2" : "border-dashed border-line-2 text-ink-3")}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[12px] font-medium">{r.path}</span>
                <span className="font-mono text-[12px] text-ink-3">{r.host}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-2">{r.who}{r.note && <span className="text-ink-3"> · {r.note}</span>}</p>
              <ul className="mt-3 grid gap-1.5">
                {r.checks.map((c, ci) => {
                  const on = step >= base + 1 + ci;
                  return (
                    <li key={c.k} className="grid grid-cols-[1.5rem_3.5rem_minmax(0,1fr)] items-center gap-2 text-[13px]">
                      <span className={cn("grid size-6 place-items-center rounded-md transition-colors duration-300", !on ? "bg-inset text-transparent" : c.bad ? "bg-signal text-on-signal" : "bg-ok-soft text-ok")}>
                        {on && (c.bad ? <X className="size-3.5" strokeWidth={2.75} aria-hidden /> : <Check className="size-3.5" strokeWidth={2.75} aria-hidden />)}
                      </span>
                      <span className="text-ink-3">{c.k}</span>
                      <AnimatePresence initial={false}>
                        {on ? (
                          <motion.span key="v" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: ease.out }} className={cn("break-words font-mono text-[12px]", c.bad ? cn("font-medium", blockedText) : "text-ink")}>
                            {c.v}
                          </motion.span>
                        ) : (
                          <span className="h-2 w-24 rounded-full bg-inset" />
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- tenant isolation: own reads pass, a cross-tenant read stops at the wall ---------- */
export function Isolation() {
  // 0..2: tenant i reads its own records; 3: kotaprep reaches for sunrise and is stopped
  const { ref, step } = useLoop(4, 1700, 3);
  const cross = step === 3;
  return (
    <section id="isolation" aria-labelledby="iso-title" className="wrap scroll-mt-20 py-20 md:py-28">
      <SectionIntro label="Tenant isolation" index="01" id="iso-title" title="Every institution is its own tenant.">
        Every query is scoped to the tenant of the person asking, on the server. Changing a URL does not change the tenant.
      </SectionIntro>

      <div ref={ref} className="mt-10 grid gap-10 md:mt-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <ShowcaseFrame tight>
            <div className="rounded-2xl border border-line bg-surface p-3 sm:p-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-6">
                {tenants.map((t, i) => {
                  const live = step === i || (cross && i === 1);
                  return (
                    <div key={t.id} className={cn("min-w-0 rounded-xl border px-2.5 py-2.5 transition-colors duration-300 sm:px-3", live ? "border-edge bg-surface" : "border-line-2")}>
                      <p className="truncate text-[13px] font-medium sm:text-ui"><span className="sm:hidden">{t.short}</span><span className="hidden sm:inline">{t.name}</span></p>
                      <p className="truncate text-[12px] text-ink-3 sm:hidden">{t.kind}</p>
                      <p className="hidden truncate font-mono text-[12px] text-ink-3 sm:block">{t.host}</p>
                    </div>
                  );
                })}
              </div>

              {/* connectors */}
              <div className="grid h-16 grid-cols-3 gap-2 sm:gap-6">
                {tenants.map((t, i) => {
                  const live = step === i || (cross && i === 1);
                  return (
                    <div key={t.id} className="relative">
                      <span aria-hidden className={cn("absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 transition-colors duration-300", live ? "bg-ink" : "bg-line-2")} />
                      <AnimatePresence>
                        {step === i && (
                          <motion.span key={`p${step}`} initial={{ y: 0, opacity: 0 }} animate={{ y: 52, opacity: [0, 1, 1, 0] }} transition={{ duration: 1.1, ease: ease.inOut }} className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-full bg-ink" />
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* stores with walls between them */}
              <div className="relative grid grid-cols-3 gap-2 sm:gap-6">
                {tenants.map((t, i) => {
                  const live = step === i;
                  return (
                    <div key={t.id} className={cn("min-w-0 rounded-xl border-[1.5px] px-2 py-4 text-center transition-colors duration-300", live ? "border-ok bg-ok-soft" : "border-line-2 bg-surface-2")}>
                      <Lock className={cn("mx-auto size-4", live ? "text-ok" : "text-ink-2")} aria-hidden />
                      <p className="mt-2 text-[13px] font-medium num">{t.records}</p>
                      <p className="text-[12px] text-ink-3">records</p>
                    </div>
                  );
                })}
                {[1, 2].map((w) => (
                  <span key={w} aria-hidden className={cn("absolute inset-y-[-6px] w-[3px] -translate-x-1/2 rounded-full transition-colors duration-300", cross && w === 1 ? "bg-signal" : "bg-ink")} style={{ left: `${(w * 100) / 3}%` }} />
                ))}
                <AnimatePresence>
                  {cross && (
                    <>
                      <motion.span key="pkt" initial={{ left: "50%", opacity: 0 }} animate={{ left: "36%", opacity: 1 }} transition={{ duration: 0.7, ease: ease.out }} className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
                      <motion.span key="x" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 0.25, ease: ease.out }} className="absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[1.5px] border-edge bg-signal text-on-signal" style={{ left: "33.333%" }}>
                        <X className="size-4" strokeWidth={2.75} aria-hidden />
                      </motion.span>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 flex min-h-12 items-center gap-3 rounded-xl bg-paper px-3 py-3 text-[13px] sm:px-4 sm:text-ui">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p key={cross ? "x" : step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: ease.out }} className="flex min-w-0 items-center gap-2.5">
                    {cross ? (
                      <><span className="size-2 shrink-0 rounded-full bg-signal" /><span className="min-w-0">Kota Prep asked for a Sunrise student. <span className="font-medium">Stopped at the wall, logged.</span></span></>
                    ) : (
                      <><LiveDot color="var(--ok)" className="shrink-0" /><span className="min-w-0">{tenants[step]?.name} read its own records.</span></>
                    )}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </ShowcaseFrame>
          <p className="mt-4 text-meta text-ink-3">Illustrative tenants.</p>
        </div>
        <ul className="grid content-start gap-6 lg:col-span-4">
          {[
            { t: "Scoped at the data layer", b: "Applied to every query on the server, not just the interface." },
            { t: "Separate addresses", b: "Each institution signs in on its own subdomain or domain." },
            { t: "Encrypted in transit and at rest", b: "TLS for traffic. Databases, files and backups encrypted." },
          ].map((x) => (
            <li key={x.t} className="border-t border-line pt-5">
              <p className="flex items-center gap-2.5 text-h4"><Check aria-hidden className="size-4 shrink-0 text-ok" strokeWidth={2.75} />{x.t}</p>
              <p className="mt-1 pl-[26px] text-ui text-ink-2">{x.b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- roles: try a request; the full matrix lives on /platform ---------- */
const tries: { role: RoleId; t: string }[] = [
  { role: "teacher", t: "Delete records" },
  { role: "parent", t: "Set course prices" },
  { role: "reviewer", t: "Clear or uphold proctor flags" },
  { role: "student", t: "See test results" },
];

export function RoleCheck() {
  const [role, setRole] = useState<RoleId>("teacher");
  const [action, setAction] = useState("Enter marks");
  const r = roles.find((x) => x.id === role)!;
  const p = permissions.find((x) => x.t === action)!;
  const a = p.access[role];
  const field = "mt-2 block h-12 w-full rounded-[10px] border border-line-2 bg-paper px-3 text-ui text-ink hover:border-ink-3 focus-visible:border-ink";

  return (
    <section aria-labelledby="roles-title" className="border-y border-line bg-surface">
      <div className="wrap py-20 md:py-28">
        <SectionIntro label="Roles and permissions" index="02" id="roles-title" title="People see and change only what their job needs.">
          Pick a role and an action. The same rules apply in every product.
        </SectionIntro>
        <div className="mt-10 grid gap-8 md:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="grid content-start gap-5 lg:col-span-5">
            <div>
              <label htmlFor="try-role" className="label">Role</label>
              <select id="try-role" value={role} onChange={(e) => setRole(e.target.value as RoleId)} className={field}>
                {roles.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="try-action" className="label">Tries to</label>
              <select id="try-action" value={action} onChange={(e) => setAction(e.target.value)} className={field}>
                {permissions.map((x) => <option key={x.t} value={x.t}>{x.t}</option>)}
              </select>
            </div>
            <div>
              <p className="label">Or try</p>
              <div className="mt-2 flex flex-wrap gap-1.5" data-cursor="Try it">
                {tries.map((x) => (
                  <button key={x.role + x.t} type="button" onClick={() => { setRole(x.role); setAction(x.t); }} className="inline-flex min-h-10 items-center rounded-full px-3.5 text-meta text-ink-2 shadow-[inset_0_0_0_1px_var(--line-2)] transition-colors hover:text-ink active:scale-[0.98]">
                    {roles.find((y) => y.id === x.role)!.name}: {x.t.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7" aria-live="polite">
            <div className="frame bg-paper p-5 dark:shadow-[6px_6px_0_0_oklch(0_0_0/0.6)] sm:p-6" style={{ borderRadius: 16 }}>
              <p className="label">Request</p>
              <p className="mt-2 text-body"><span className="font-medium">{r.name}</span> <span className="text-ink-3">tries to</span> {action.toLowerCase()}</p>
              <div className="mt-2 flex items-center gap-2 text-meta text-ink-3">
                <span aria-hidden className="size-2 rounded-[2px]" style={{ background: productColor[p.p] }} />
                {r.scope}
              </div>
              <div className="mt-5 border-t border-line pt-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={role + action} initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: ease.out }}>
                    <span className={cn("inline-flex h-9 items-center gap-2 rounded-[10px] px-3 text-ui font-medium", a === "none" ? "bg-signal-soft text-signal" : "bg-ok-soft text-ok")}>
                      {a === "none" ? <X className="size-4" strokeWidth={2.75} aria-hidden /> : <Check className="size-4" strokeWidth={2.75} aria-hidden />}
                      {a === "full" ? "Allowed" : a === "own" ? "Allowed, own scope" : "Blocked"}
                    </span>
                    <p className="mt-3 text-ui text-ink-2">
                      {a === "full" && "Done, and written to the audit log with their name."}
                      {a === "own" && `${p.own ?? "Limited to their own scope"}. Anything outside it is blocked.`}
                      {a === "none" && "The button is not shown to this role. A direct request is refused and logged."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <UnderlineLink href="/platform#roles" className="mt-5 inline-flex min-h-10 items-center text-ui text-ink">See every role and action in the matrix</UnderlineLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- accountability: one proctor flag, start to finish ---------- */
const stages = ["Signal", "Evidence", "Reviewer", "Result"];

export function Accountability() {
  const { ref, step, hold } = useLoop(4, 2300, 3);
  return (
    <section aria-labelledby="audit-title" className="wrap py-20 md:py-28">
      <SectionIntro label="Accountability" index="03" id="audit-title" title="The AI flags. A person decides. The log keeps both.">
        One proctor flag from Mock 7, from the moment the AI noticed it to the result.
      </SectionIntro>

      <div ref={ref} className="mt-10 md:mt-12">
        <ShowcaseFrame field={productSoft.assess} tight>
          <div className="rounded-2xl border border-line bg-surface p-3 sm:p-5">
            {/* stage rail */}
            <div className="relative" role="group" aria-label="Flag lifecycle stages" data-cursor="Pick a stage">
              <span aria-hidden className="absolute inset-x-[12.5%] top-5 hidden h-[2px] bg-line md:block" />
              <motion.span aria-hidden className="absolute left-[12.5%] top-5 hidden h-[2px] origin-left bg-assess md:block" style={{ width: "75%" }} initial={false} animate={{ scaleX: step / 3 }} transition={{ duration: 0.5, ease: ease.out }} />
              <ol className="grid grid-cols-4 gap-1">
                {stages.map((s, i) => (
                  <li key={s} className="relative">
                    <button type="button" onClick={() => hold(i)} aria-pressed={i === step} className="group flex w-full flex-col items-center gap-1.5 rounded-[10px] py-1 focus-visible:outline-2 focus-visible:outline-signal">
                      <span className={cn("relative grid size-10 place-items-center rounded-full border-[1.5px] text-[13px] font-medium transition-colors duration-300 num", i < step ? "border-assess bg-assess text-surface" : i === step ? "border-edge bg-surface text-ink shadow-[2px_2px_0_0_var(--edge)]" : "border-line-2 bg-surface text-ink-3")}>
                        {i < step ? <Check className="size-4" strokeWidth={2.75} aria-hidden /> : i + 1}
                      </span>
                      <span className={cn("text-[13px]", i === step ? "font-medium text-ink" : "text-ink-2")}>{s}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            {/* the four moments */}
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <Moment on={step === 0} done={step > 0} title="Second face at 18:42">
                <div className="relative h-10 rounded-lg bg-inset">
                  {[18, 46, 71].map((x) => <span key={x} className="absolute top-1/2 h-3 w-[2px] -translate-y-1/2 rounded-full bg-line-2" style={{ left: `${x}%` }} />)}
                  <span className="absolute top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-assess" style={{ left: "24%" }} />
                </div>
                <p className="mt-2 flex justify-between text-[11px] text-ink-3 num"><span>18:30</span><span>19:30</span></p>
                <p className="mt-1 text-[12px] text-ink-2">AI confidence 0.82. Not a decision.</p>
              </Moment>
              <Moment on={step === 1} done={step > 1} title="Clip and timeline attached">
                <div className="relative grid h-[4.5rem] place-items-center overflow-hidden rounded-lg bg-slab">
                  <span aria-hidden className="absolute left-[30%] top-3 size-7 rounded-full border-2 border-on-slab/70" />
                  <span aria-hidden className="absolute left-[56%] top-4 size-5 rounded-full border-2 border-assess" />
                  <span className="relative grid size-7 place-items-center rounded-full bg-on-slab/90 text-slab"><Play className="size-3.5" aria-hidden /></span>
                </div>
                <p className="mt-2 text-[12px] text-ink-2 num">6 s clip from 18:42:03</p>
              </Moment>
              <Moment on={step === 2} done={step > 2} title="M. Verma reviews">
                <div className="grid grid-cols-2 gap-1.5">
                  <span className="grid h-9 place-items-center rounded-lg border border-line text-[12px] text-ink-3">Clear</span>
                  <span className={cn("grid h-9 place-items-center rounded-lg border text-[12px] font-medium transition-colors duration-300", step >= 2 ? "border-edge bg-assess-soft text-ink" : "border-line text-ink-3")}>Uphold</span>
                </div>
                <p className="mt-2 text-[12px] text-ink-2">Note: second person visible, confirmed on the clip.</p>
              </Moment>
              <Moment on={step === 3} done={false} title="Final after sign-off">
                <p className="flex items-center justify-between rounded-lg bg-inset px-2.5 py-2 text-[12px]"><span>Mock 7 result</span><span className="font-medium">Released</span></p>
                <p className="mt-2 flex items-center gap-2 text-[12px] text-ink-2"><span aria-hidden className="size-2 rounded-[2px]" style={{ background: productColor.assess }} />Logged: M. Verma upheld flag 1, 19:58</p>
              </Moment>
            </div>
          </div>
        </ShowcaseFrame>
        <p className="mt-4 text-meta text-ink-3">
          Illustrative example. Every waiver, mark change, export and role change lands in the same log: <UnderlineLink href="/platform" className="text-ink">see the audit log</UnderlineLink>
        </p>
      </div>
    </section>
  );
}

function Moment({ on, done, title, children }: { on: boolean; done: boolean; title: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border p-3 transition-[border-color,box-shadow] duration-300", on ? "border-edge shadow-[3px_3px_0_0_var(--edge)]" : done ? "border-line-2" : "border-dashed border-line-2")}>
      <p className="mb-2.5 text-[13px] font-medium">{title}</p>
      {children}
    </div>
  );
}

/* ---------- typed confirmation ---------- */
export function TypedConfirm() {
  const target = "Batch 2023-B";
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);
  const ok = val.trim() === target;
  return (
    <section aria-labelledby="confirm-title" className="bg-slab text-on-slab">
      <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 border-t border-on-slab/25 pt-3 text-meta"><span className="num opacity-60">04</span><span aria-hidden className="size-1.5 bg-on-slab" /><span className="font-medium">Destructive actions</span></div>
          <h2 id="confirm-title" className="mt-8 text-d2">Hard to delete by accident.</h2>
          <p className="mt-5 max-w-[44ch] text-lead opacity-75">Removing a course, batch or test asks you to type its name first, then logs it with your name. Try it.</p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-2xl border border-line-2 bg-surface p-6 text-ink">
            <AnimatePresence mode="wait" initial={false}>
              {!done ? (
                <motion.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-[10px] bg-signal-soft text-signal"><Trash2 className="size-4" aria-hidden /></span>
                    <p className="text-h4">Delete {target}?</p>
                  </div>
                  <p className="mt-3 text-ui text-ink-2">This removes the batch and its live class schedule. 42 learner records move to Unassigned. Illustrative example.</p>
                  <label htmlFor="confirm-input" className="mt-5 block text-ui">Type <span className="rounded bg-inset px-1.5 py-0.5 font-mono text-meta">{target}</span> to confirm</label>
                  <input id="confirm-input" data-cursor="Type" value={val} onChange={(e) => setVal(e.target.value)} autoComplete="off" spellCheck={false} className="mt-2 block h-12 w-full rounded-[10px] border border-line-2 bg-paper px-3.5 text-body hover:border-ink-3 focus:border-ink focus:shadow-[0_0_0_4px_var(--inset)] focus-visible:outline-none" />
                  <div className="mt-5 flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setVal("")}>Cancel</Button>
                    <Button type="button" variant="signal" size="sm" disabled={!ok} onClick={() => setDone(true)}>Delete batch</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} role="status">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-[10px] bg-ok-soft text-ok"><Check className="size-4" strokeWidth={2.5} aria-hidden /></span>
                    <p className="text-h4">Deleted, and logged</p>
                  </div>
                  <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-3 rounded-xl bg-surface-2 px-3 py-3">
                    <span className="size-2 rounded-[2px]" style={{ background: productColor.academy }} aria-hidden />
                    <span className="min-w-0 text-ui">You typed “{target}” to remove a batch <span className="block text-[12px] text-ink-3">Owner · just now</span></span>
                  </div>
                  <p className="mt-4 text-meta text-ink-3">Nothing was deleted. This is a demo.</p>
                  <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => { setDone(false); setVal(""); }}>Try again</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- backups: drag the restore point ---------- */
const DAYS = 30;
const DELETED = 22; // index of 23 Sep: deleted at 14:10, after that day's 02:00 backup
const dayLabel = (i: number) => `${i + 1} Sep`;

export function Backups() {
  const [sel, setSel] = useState(20);
  const keeps = sel <= DELETED;
  const positions = Array.from({ length: DAYS }, (_, i) => (i + 0.5) / DAYS);
  return (
    <section aria-labelledby="backup-title" className="wrap py-20 md:py-28">
      <SectionIntro label="Backups and recovery" index="05" id="backup-title" title="Your records survive a bad day.">
        Drag the restore point. Someone deleted a batch on 23 September; see which backups still have it.
      </SectionIntro>

      <div className="mt-10 grid gap-10 md:mt-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
        <ShowcaseFrame tight>
          <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[13px] font-medium">Daily backups · September</p>
              <p className="flex items-center gap-2 text-[12px] text-ink-3"><span aria-hidden className="size-2 rounded-full bg-signal" />Batch 2023-B deleted 23 Sep, 14:10</p>
            </div>

            <Scrubber value={sel} positions={positions} onChange={setSel} label="Restore point" valueText={`${dayLabel(sel)}, 02:00 backup. ${keeps ? "Includes" : "Does not include"} batch 2023-B`} className="mt-4 h-16">
              <div className="absolute inset-0 flex items-end gap-[3px] pb-2">
                {Array.from({ length: DAYS }, (_, i) => (
                  <span key={i} className={cn("flex-1 rounded-[2px] transition-[background-color,height] duration-200", i === sel ? "h-10 bg-ink" : i <= DELETED ? "h-6 bg-ok/60" : "h-6 bg-line-2")} />
                ))}
              </div>
              <span aria-hidden className="absolute top-0 h-12 w-[2px] -translate-x-1/2 rounded-full bg-signal" style={{ left: `${((DELETED + 0.6) / DAYS) * 100}%` }} />
            </Scrubber>
            <div className="mt-1 flex justify-between text-[11px] text-ink-3 num" aria-hidden><span>1 Sep</span><span>15 Sep</span><span>30 Sep</span></div>

            <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" aria-live="polite">
              <div>
                <p className="label">Restore point</p>
                <p className="mt-1 text-h4 num">{dayLabel(sel)}, 02:00</p>
              </div>
              <div>
                <p className="label">Batch 2023-B</p>
                <p className={cn("mt-1 inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-ui font-medium", keeps ? "bg-ok-soft text-ok" : "bg-signal-soft text-signal")}>
                  {keeps ? <Check className="size-4" strokeWidth={2.75} aria-hidden /> : <X className="size-4" strokeWidth={2.75} aria-hidden />}
                  {keeps ? "In this backup, 48 students" : "Already deleted here"}
                </p>
              </div>
              <p className="text-meta text-ink-3 sm:col-span-2">
                {keeps ? `Work done after ${dayLabel(sel)} is listed for you to re-check before anything is replaced.` : "Pick a day on or before 23 Sep."} Restores run with our team, after the owner types the institution&apos;s name to confirm.
              </p>
            </div>
          </div>
        </ShowcaseFrame>
        <p className="mt-4 text-meta text-ink-3">Illustrative timeline. Use the arrow keys on the strip to step one day.</p>
        </div>

        <ul className="grid content-start gap-6 lg:col-span-4">
          {[
            { t: "Daily, encrypted", b: "Stored apart from the live system." },
            { t: "A bin before deletion", b: "Deleted students, batches and courses wait there first." },
            { t: "Export any time", b: "Records, ledgers and results as CSV." },
            { t: "Restores rehearsed", b: "On a schedule, not only when something breaks." },
          ].map((x) => (
            <li key={x.t} className="border-t border-line pt-5">
              <p className="flex items-center gap-2.5 text-h4"><Check aria-hidden className="size-4 shrink-0 text-ok" strokeWidth={2.75} />{x.t}</p>
              <p className="mt-1 pl-[26px] text-ui text-ink-2">{x.b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- responsible disclosure: two checklists ---------- */
export function Disclosure() {
  const you = [
    "Test only your own account, or a trial tenant we set up for you",
    "Stop and report when you see data that is not yours, and do not keep it",
    "No load tests, spam or anything that slows schools down",
    "Give us reasonable time to fix it before you publish",
  ];
  const we = [
    "Confirm receipt and keep you updated until it is fixed",
    "No legal action for good-faith research under these rules",
    "Credit you when we publish the fix, if you would like that",
  ];
  const list = (items: string[]) => (
    <ul className="mt-4 grid gap-3">
      {items.map((x) => (
        <li key={x} className="flex gap-3 border-t border-line pt-3 text-ui text-ink-2">
          <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-[1.5px] border-edge"><Check className="size-3" strokeWidth={3} /></span>
          {x}
        </li>
      ))}
    </ul>
  );
  return (
    <section id="disclosure" aria-labelledby="disclosure-title" className="scroll-mt-24">
      <div className="wrap py-20 md:py-28">
        <Ruler index="06" label="Responsible disclosure" />
        <div className="mt-8 grid gap-12 md:mt-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="disclosure-title" className="text-d2">Found a vulnerability? Tell us first.</h2>
          <p className="mt-5 max-w-[36ch] text-lead text-ink-2">Write to <a href="mailto:security@lireons.com" className="-my-2 inline-block py-2 font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">security@lireons.com</a> with steps to reproduce. We reply within three working days.</p>
          <div className="mt-8">
            <ButtonLink href="mailto:security@lireons.com" variant="outline">Email the security team</ButtonLink>
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          <div>
            <h3 className="text-h4">You</h3>
            {list(you)}
          </div>
          <div>
            <h3 className="text-h4">We</h3>
            {list(we)}
            <p className="mt-5 text-meta text-ink-3">We do not run a paid bug bounty at the moment.</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
