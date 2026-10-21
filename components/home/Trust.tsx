"use client";

import { DitherField } from "@/components/ui/Shader";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DatabaseBackup, EyeOff, ScrollText, Trash2 } from "lucide-react";
import type { ProductId } from "@/lib/products";
import { LiveDot, productColor } from "@/components/visuals/Frame";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Ruler } from "@/components/ui/Backdrop";
import { Shot } from "@/components/ui/Shot";

/**
 * Security with its evidence: the admin console render (audit log, backups,
 * sessions, typed delete) beside the one working part a render cannot show,
 * a role switch that redacts the record.
 */
export function Trust() {
  return (
    <section aria-labelledby="trust-title" className="relative isolate bg-slab text-on-slab dark:border-y dark:border-line">
      <DitherField />
      <div className="wrap py-20 md:py-28">
        <Ruler tone="slab" index="04" label="Security and control" aside="Roles, audit log, backups" />
        <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-12 md:items-end md:gap-6">
          <h2 id="trust-title" className="text-d2 md:col-span-8">Built for the people who answer for every mark and every rupee.</h2>
          <p className="max-w-[34ch] text-lead text-on-slab/75 md:col-span-4 md:pb-1">Every change lands in an audit log nobody can edit. Switch the role to see what each person gets.</p>
        </div>
        <div className="mt-10 grid gap-4 md:mt-12 lg:grid-cols-12">
          {/* the evidence: the admin console every one of these controls lives in */}
          <figure className="flex flex-col lg:col-span-7">
            <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-on-slab/20 bg-on-slab/[0.04] sm:min-h-[420px]">
              <div className="absolute left-[-20%] top-5 w-[128%] sm:top-7">
                <Shot id="security-admin" sizes="(min-width: 1024px) 1000px, 128vw" className="shadow-[0_30px_60px_-20px_oklch(0_0_0/0.6)]" />
              </div>
              <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slab to-transparent" />
            </div>
            <figcaption className="mt-3 flex items-center gap-2 text-meta text-on-slab/70"><LiveDot />Security console: append-only audit log, backups and active sessions. Illustrative data.</figcaption>
          </figure>
          <div className="grid gap-4 lg:col-span-5 lg:grid-rows-[1fr_auto]">
            <RolesTile />
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-on-slab/15 bg-on-slab/15" aria-label="Also in the console">
              {consoleFacts.map(({ icon: I, k, v }) => (
                <li key={k} className="flex items-center gap-3.5 bg-slab px-5 py-3.5">
                  <I aria-hidden className="size-[18px] shrink-0 text-on-slab/70" strokeWidth={1.75} />
                  <span className="text-ui font-medium">{k}</span>
                  <span className="ml-auto text-right text-meta text-on-slab/70">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const consoleFacts = [
  { icon: ScrollText, k: "Append-only audit log", v: "Who, what, when" },
  { icon: DatabaseBackup, k: "Nightly backups", v: "Health on one screen" },
  { icon: Trash2, k: "Typed deletes", v: "Name it to remove it" },
];

function Tile({ className, children, ...rest }: { className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn("flex flex-col rounded-2xl border border-on-slab/15 bg-on-slab/[0.04] p-5 sm:p-7", className)}>{children}</div>;
}

function TileHead({ title, line }: { title: string; line: string }) {
  return (
    <div>
      <h3 className="text-h4">{title}</h3>
      <p className="mt-1 text-ui text-on-slab/70">{line}</p>
    </div>
  );
}

/* ---------- roles + audit log ---------- */
type Role = "admin" | "teacher" | "parent";
const roleNames: Record<Role, string> = { admin: "Admin", teacher: "Teacher", parent: "Parent" };
const fields: { k: string; v: string; p: ProductId; see: Role[] }[] = [
  { k: "Batch", v: "JEE 2027 · A", p: "academy", see: ["admin", "teacher", "parent"] },
  { k: "Purchases", v: "₹4,999 · #4471", p: "academy", see: ["admin", "parent"] },
  { k: "Physics", v: "Unit 3 · 62%", p: "academy", see: ["teacher", "parent"] },
  { k: "Mock 7", v: "78 / 100", p: "assess", see: ["teacher", "parent"] },
  { k: "Test accommodation", v: "Extra 15 min", p: "assess", see: ["admin", "teacher"] },
  { k: "Doubts", v: "3 this week", p: "ai", see: ["teacher"] },
];


function RolesTile() {
  const [role, setRole] = useState<Role>("teacher");
  const visible = fields.filter((f) => f.see.includes(role)).length;

  const pick = (r: Role) => r !== role && setRole(r);

  return (
    <Tile>
      <TileHead title="Every role sees its slice" line="Permissions follow the role, across all three products." />

      <div role="group" aria-label="View the record as" data-cursor="Switch role" className="mt-6 inline-flex self-start rounded-full bg-on-slab/[0.08] p-1">
        {(Object.keys(roleNames) as Role[]).map((r) => (
          <button key={r} type="button" aria-pressed={role === r} onClick={() => pick(r)} className={cn("relative h-10 rounded-full px-4 text-ui font-medium transition-colors sm:px-5", role === r ? "text-ink" : "text-on-slab/75 hover:text-on-slab")}>
            {role === r && <motion.span layoutId="trust-role" className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12 }} />}
            <span className="relative">{roleNames[r]}</span>
          </button>
        ))}
      </div>

      {/* the record, redacted per role */}
      <div className="mt-4 rounded-xl bg-surface p-4 text-ink sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-ui font-medium">Aarav Mehta</p>
          <p className="text-meta text-ink-3 num" aria-live="polite">{visible} of {fields.length} fields visible</p>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-2">
          {fields.map((f) => {
            const ok = f.see.includes(role);
            return (
              <div key={f.k} className="relative min-h-[3.75rem] overflow-hidden rounded-[10px] bg-surface-2 px-3 py-2">
                <dt className="flex items-center gap-1.5 text-[12px] text-ink-3">
                  <span aria-hidden className="size-1.5 rounded-[2px]" style={{ background: productColor[f.p] }} />
                  {f.k}
                </dt>
                <dd className="mt-1 text-[14px] font-medium num">
                  <AnimatePresence mode="wait" initial={false}>
                    {ok ? (
                      <motion.span key="v" className="block truncate" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: ease.out }}>{f.v}</motion.span>
                    ) : (
                      <motion.span key="x" className="flex items-center gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <motion.span aria-hidden className="block h-3.5 flex-1 origin-left rounded-[3px] bg-ink" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.3, ease: ease.out }} />
                        <EyeOff aria-hidden className="size-3.5 shrink-0 text-ink-3" />
                        <span className="sr-only">Hidden</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

    </Tile>
  );
}
