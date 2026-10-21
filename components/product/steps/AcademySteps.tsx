"use client";

import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, Check, Lock, Play, Radio, X } from "lucide-react";
import { Frame, Initials, LiveDot } from "@/components/visuals/Frame";
import { useLoop, useTick } from "@/lib/useLoop";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const swap = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35, ease: ease.out } };

/* 01 Your brand, your domain */
const brands = [
  { name: "Brightpath Academy", domain: "academy.brightpath.in", hue: 258, line: "Physics and Maths for Classes 11 and 12", courses: ["JEE Physics, full year", "Class 12 Calculus"] },
  { name: "CodeCraft", domain: "learn.codecraft.in", hue: 160, line: "Become a full-stack developer in 24 weeks", courses: ["Full-stack web, Cohort 4", "DSA in Python"] },
  { name: "Sur Sangam", domain: "sursangam.in/learn", hue: 28, line: "Hindustani vocals from your living room", courses: ["Raag basics, Level 1", "Harmonium for singers"] },
];
export function BrandSwitch() {
  const { ref, step } = useLoop(brands.length, 2600, 0);
  const b = brands[step];
  const c = `oklch(0.55 0.14 ${b.hue})`;
  const soft = `oklch(0.94 0.03 ${b.hue})`;
  return (
    <div ref={ref}>
      <Frame product="academy" title="Storefront preview" meta={<Lock className="size-3" />}>
        <div className="min-h-[380px] p-4 sm:p-5">
          <div className="flex h-9 items-center gap-2 rounded-lg bg-inset px-3 text-[12px] text-ink-2">
            <Lock className="size-3 text-ink-3" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={b.domain} {...swap} className="truncate num">{b.domain}</motion.span>
            </AnimatePresence>
          </div>
          <div className="mt-3 overflow-hidden rounded-xl border border-line">
            <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
              <span className="size-6 rounded-md transition-colors duration-500" style={{ background: c }} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={b.name} {...swap} className="text-[14px] font-semibold tracking-[-0.01em]">{b.name}</motion.span>
              </AnimatePresence>
              <span className="ml-auto hidden gap-4 text-[12px] text-ink-3 sm:flex"><span>Courses</span><span>Live</span><span>Sign in</span></span>
            </div>
            <div className="px-4 py-5 transition-colors duration-500" style={{ background: soft }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={b.line} {...swap} className="max-w-[24ch] text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[oklch(0.25_0.02_262)]">{b.line}</motion.p>
              </AnimatePresence>
              <span className="mt-4 inline-flex h-8 items-center rounded-lg px-3 text-[12px] font-medium text-white transition-colors duration-500" style={{ background: c }}>Browse courses</span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {b.courses.map((t, i) => (
                <div key={i} className="rounded-lg border border-line p-2.5">
                  <div className="aspect-[16/7] rounded-md transition-colors duration-500" style={{ background: i ? soft : c, opacity: i ? 1 : 0.85 }} />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p key={t} {...swap} className="mt-2 truncate text-[12px] font-medium">{t}</motion.p>
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <p className="border-t border-line px-4 py-2 text-[10px] text-ink-3">Powered by Lireons</p>
          </div>
          <p className="mt-3 text-[11px] text-ink-3">Example storefronts. Names are illustrative.</p>
        </div>
      </Frame>
    </div>
  );
}

/* 02 Live and recorded */
const poll = [["Up the slope", 64], ["Down the slope", 24], ["No friction", 12]] as const;
export function LiveClass() {
  const { ref, step, active } = useLoop(5, 1800, 2);
  const t = useTick(1500, active);
  const viewers = 186 + ((t * 5) % 31);
  const ended = step === 4;
  return (
    <div ref={ref}>
      <Frame product="academy" title="Live · Rotational motion" meta={ended ? <span>Ended</span> : <><LiveDot /><span className="num">{viewers} watching</span></>}>
        <div className="grid min-h-[380px] content-start gap-4 p-4 sm:p-5">
          <div className="relative h-[220px] overflow-hidden rounded-xl bg-[oklch(0.22_0.03_258)]">
            <svg viewBox="0 0 320 160" className="absolute inset-0 size-full" aria-hidden>
              <circle cx="160" cy="80" r="44" fill="none" stroke="oklch(0.7 0.08 258)" strokeWidth="1.5" />
              <g className="motion-safe:animate-[spin_6s_linear_infinite] [transform-box:view-box] [transform-origin:160px_80px]">
                <line x1="160" y1="80" x2="204" y2="80" stroke="oklch(0.85 0.1 70)" strokeWidth="1.5" />
                <circle cx="204" cy="80" r="4" fill="oklch(0.85 0.1 70)" />
              </g>
              <text x="220" y="140" fill="oklch(0.8 0.03 258)" fontSize="10" fontFamily="var(--font-jetbrains)">τ = r × F</text>
            </svg>
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-[oklch(0_0_0/0.5)] px-2 py-1 text-[11px] text-white">
              {ended ? <><Play className="size-3 fill-current" strokeWidth={0} />Recording</> : <><Radio className="size-3" />Live from OBS</>}
            </span>
            <AnimatePresence>
              {step >= 1 && step <= 3 && (
                <motion.div {...swap} className="absolute bottom-3 right-3 w-[58%] rounded-lg bg-surface p-2.5 text-ink shadow-2">
                  <p className="text-[11px] font-medium">Poll: which way does friction act?</p>
                  <ul className="mt-1.5 grid gap-1">
                    {poll.map(([k, v]) => (
                      <li key={k} className="relative h-5 overflow-hidden rounded bg-inset text-[10px]">
                        <motion.span className="absolute inset-y-0 left-0 w-full origin-left bg-academy-soft" initial={{ scaleX: 0 }} animate={{ scaleX: step >= 2 ? v / 100 : 0.04 }} transition={{ duration: 0.7, ease: ease.out }} />
                        <span className="relative flex h-full items-center justify-between px-1.5"><span>{k}</span><span className="num">{step >= 2 ? `${v}%` : ""}</span></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {ended ? (
              <motion.div key="saved" {...swap} className="flex items-center gap-3 rounded-xl border border-academy bg-academy-soft px-3.5 py-3">
                <Check className="size-4 text-academy" strokeWidth={2.5} />
                <p className="text-[13px]"><span className="font-medium">Recording added</span> <span className="text-ink-2">to Unit 6, Lesson 15 · 52 min</span></p>
              </motion.div>
            ) : (
              <motion.div key="chat" {...swap} className="grid gap-1.5">
                {[["Riya", 330, "Is torque a vector?"], ["Dev", 160, "So r and F must be perpendicular for max?"]].map(([n, h, m]) => (
                  <p key={n as string} className="flex items-center gap-2 text-[12px]"><Initials name={n as string} hue={h as number} size={18} /><span className="font-medium">{n}</span><span className="truncate text-ink-2">{m}</span></p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Frame>
    </div>
  );
}

/* 03 Graded practice: hidden tests run one by one */
const code: [string, string, string][] = [
  ["", "def", " pair_sum(nums, target):"],
  ["    ", "", "i, j = 0, len(nums) - 1"],
  ["    ", "while", " i < j:"],
  ["        ", "", "s = nums[i] + nums[j]"],
  ["        ", "if", " s == target: return [i, j]"],
  ["        ", "", "i, j = (i + 1, j) if s < target else (i, j - 1)"],
  ["    ", "return", " []"],
];
const TESTS = 6;
export function CodeTests() {
  const { ref, step } = useLoop(TESTS + 3, 650, TESTS + 1);
  const ran = Math.min(TESTS, Math.max(0, step - 1));
  const done = ran === TESTS;
  return (
    <div ref={ref}>
      <Frame product="academy" title="Problem 12 · Pair with target sum" meta={<span>Python 3</span>}>
        <div className="grid min-h-[380px] md:grid-cols-[1fr_13rem]">
          <pre className="overflow-hidden p-4 font-mono text-[11.5px] leading-[1.75] sm:p-5" aria-label="Solution code">
            {code.map(([ind, kw, rest], i) => (
              <div key={i} className="flex gap-3 whitespace-pre">
                <span className="w-4 select-none text-right text-ink-3">{i + 1}</span>
                <span className="min-w-0 truncate">
                  {ind}
                  {kw && <span className="text-academy">{kw}</span>}
                  <span className="text-ink-2">{rest}</span>
                </span>
              </div>
            ))}
          </pre>
          <div className="border-t border-line p-4 md:border-l md:border-t-0">
            <p className="label">Hidden tests</p>
            <ul className="mt-3 grid gap-1.5">
              {Array.from({ length: TESTS }, (_, i) => {
                const st = i < ran ? "pass" : i === ran && step >= 1 && !done ? "run" : "wait";
                return (
                  <li key={i} className="flex items-center gap-2.5 text-[12px]">
                    <span className={cn("grid size-5 place-items-center rounded-md transition-colors", st === "pass" ? "bg-ok-soft text-ok" : st === "run" ? "bg-academy-soft" : "bg-inset")}>
                      {st === "pass" ? <Check className="size-3" strokeWidth={3} /> : st === "run" ? <span className="size-2.5 rounded-full border-2 border-academy border-t-transparent motion-safe:animate-spin" /> : null}
                    </span>
                    <span className={cn(st === "wait" && "text-ink-3")}>Test {i + 1}</span>
                    <span className="ml-auto text-ink-3 num">{st === "pass" ? `${(12 + i * 7) % 40 + 8} ms` : ""}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 border-t border-line pt-4">
              <p className="label">Score</p>
              <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] num">{Math.round((ran / TESTS) * 100)}<span className="text-[14px] text-ink-3"> / 100</span></p>
              <AnimatePresence>{done && <motion.p {...swap} className="mt-1 text-[12px] text-ok">Accepted. Counts towards Unit 4.</motion.p>}</AnimatePresence>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* 04 Certificates that verify */
const URL_TXT = "verify.brightpath.in/LRN-7Q4K-2291";
export function CertificateVerify() {
  const { ref, step, reduce } = useLoop(5, 1500, 3);
  const typed = reduce ? URL_TXT.length : Math.min(URL_TXT.length, Math.max(0, step) * 14);
  const valid = step >= 3;
  return (
    <div ref={ref}>
      <Frame product="academy" title="Certificate · Full-stack web development" meta={<span className="num">LRN-7Q4K-2291</span>}>
        <div className="grid min-h-[380px] content-start gap-4 p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-xl border border-line-2 bg-surface-2 p-5">
            <span aria-hidden className="absolute -right-6 -top-6 size-24 rotate-12 rounded-2xl bg-academy-soft" />
            <p className="label relative">Certificate of completion</p>
            <p className="relative mt-3 text-[22px] font-semibold tracking-[-0.02em]">Riya Sharma</p>
            <p className="relative mt-1 text-[13px] text-ink-2">completed Full-stack web development, Cohort 4, with 92% in graded practice.</p>
            <div className="relative mt-5 flex items-end justify-between text-[11px] text-ink-3">
              <span>CodeCraft · issued 18 Oct 2026</span>
              <span className="grid size-10 place-items-center rounded-md border border-line bg-surface"><BadgeCheck className="size-5 text-academy" strokeWidth={1.75} /></span>
            </div>
          </div>
          <div>
            <p className="label">An employer checks it</p>
            <div className="mt-2 flex h-9 items-center gap-2 rounded-lg bg-inset px-3 text-[12px]">
              <Lock className="size-3 text-ink-3" />
              <span className="truncate num">{URL_TXT.slice(0, typed)}{typed < URL_TXT.length && <span className="ml-px inline-block h-3 w-px translate-y-0.5 bg-ink motion-safe:animate-[blink_1s_steps(1)_infinite]" />}</span>
            </div>
            <div className="mt-2 h-11">
              <AnimatePresence mode="wait" initial={false}>
                {valid ? (
                  <motion.p key="ok" {...swap} className="flex h-11 items-center gap-2 rounded-lg bg-ok-soft px-3 text-[12px] text-ok">
                    <Check className="size-4" strokeWidth={2.5} /><span><span className="font-medium">Valid.</span> Issued by CodeCraft to Riya Sharma.</span>
                  </motion.p>
                ) : (
                  <motion.p key="wait" {...swap} className="flex h-11 items-center gap-2 px-1 text-[12px] text-ink-3"><X className="size-3.5 opacity-0" />Checking the certificate ID</motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}

export const academySteps = [BrandSwitch, LiveClass, CodeTests, CertificateVerify];
