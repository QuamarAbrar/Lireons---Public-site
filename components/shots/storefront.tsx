import { Award, BadgeCheck, CalendarDays, Check, ChevronDown, CirclePlay, Clock, Globe, Lock, PlayCircle, Radio, Search, ShoppingBag, Star, Users } from "lucide-react";
import { Avatar, Badge, Monogram, inr } from "./kit";
import { Lecture } from "./art";
import { cn } from "@/lib/cn";

/** Course cover: a chalk-on-colour title card, the kind an academy designs in an afternoon. */
function Cover({ hue, glyph, label, className }: { hue: number; glyph: string; label: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: `linear-gradient(135deg, oklch(0.42 0.09 ${hue}), oklch(0.3 0.07 ${hue}))` }}>
      <div className="absolute inset-0 opacity-[0.13]" style={{ backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <span className="absolute -right-2 bottom-[-18px] text-[88px] font-semibold italic leading-none tracking-[-0.04em] text-white/20">{glyph}</span>
      <span className="absolute left-3.5 top-3 text-[11px] font-medium text-white/80">{label}</span>
    </div>
  );
}

const courses = [
  { t: "JEE Physics, full year", s: "Classes 11 and 12 · 138 lessons · 24 live", price: 14999, was: 18999, hue: 258, g: "F = ma", l: "Physics", tag: "Bestseller", st: 1248 },
  { t: "Class 12 Calculus", s: "62 lessons · 8 mock tests", price: 6999, hue: 200, g: "∫ dx", l: "Maths", st: 864 },
  { t: "NEET Physics crash course", s: "45 days · daily live class", price: 4999, hue: 25, g: "λ = h/p", l: "Physics", tag: "Live batch 2 Nov", st: 412 },
  { t: "Physical chemistry for JEE", s: "74 lessons · DPP with solutions", price: 8499, hue: 150, g: "ΔG", l: "Chemistry", st: 590 },
  { t: "Class 11 Maths foundations", s: "88 lessons · coding practice", price: 5999, hue: 300, g: "nCr", l: "Maths", st: 703 },
  { t: "Vectors in 7 days", s: "Free mini course · 9 lessons", price: 0, hue: 70, g: "a × b", l: "Free", st: 2318 },
  { t: "Previous year papers, solved", s: "JEE Main 2019 to 2026", price: 2499, hue: 220, g: "PYQ", l: "Practice", st: 1520 },
  { t: "Rotational motion masterclass", s: "21 lessons · 3 live doubt sessions", price: 3499, hue: 10, g: "τ = Iα", l: "Physics", st: 377 },
];

export function AcademyStorefront() {
  return (
    <div className="h-full w-full overflow-hidden bg-paper text-ink">
      {/* the academy's own site chrome */}
      <header className="flex h-16 items-center gap-8 border-b border-line bg-surface px-10">
        <span className="flex items-center gap-2.5">
          <Monogram text="BP" hue={258} size={34} />
          <span className="leading-tight"><span className="block text-[16px] font-semibold tracking-[-0.02em]">BrightPath Academy</span><span className="block text-[11px] text-ink-3">academy.brightpath.in</span></span>
        </span>
        <nav className="flex items-center gap-6 text-[13.5px] text-ink-2">
          <span className="font-medium text-ink">Courses</span><span>Live batches</span><span>Free lessons</span><span>Verify a certificate</span>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex h-9 w-[240px] items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 text-[12.5px] text-ink-3"><Search className="size-3.5" />Search courses</div>
          <span className="text-[13.5px] font-medium">Sign in</span>
          <span className="flex h-9 items-center rounded-full bg-academy px-4 text-[13.5px] font-medium text-white dark:text-[oklch(0.16_0.02_262)]">Start free</span>
        </div>
      </header>

      <section className="grid grid-cols-[minmax(0,1fr)_620px] items-center gap-12 border-b border-line bg-surface px-10 py-9">
        <div>
          <Badge tone="academy" icon={Radio}>New live batch starts Monday, 2 November</Badge>
          <h1 className="mt-4 max-w-[17ch] text-[46px] font-semibold leading-[1.02] tracking-[-0.04em]">Physics and Maths for Classes 11 and 12, taught properly.</h1>
          <p className="mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-ink-2">Recorded lessons you can rewatch, live doubt sessions every week and DPPs with worked solutions. Taught by Neha Kulkarni and a team of four.</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-11 items-center gap-2 rounded-full bg-academy px-5 text-[14px] font-medium text-white dark:text-[oklch(0.16_0.02_262)]">Browse courses</span>
            <span className="flex h-11 items-center gap-2 rounded-full border border-line-2 bg-surface px-5 text-[14px] font-medium"><PlayCircle className="size-4" />Watch a free lesson</span>
          </div>
          <div className="mt-7 flex items-center gap-6 text-[13px] text-ink-2">
            <span className="flex items-center gap-2"><Users className="size-4 text-academy" /><b className="font-semibold text-ink num">3,912</b> students</span>
            <span className="flex items-center gap-2"><Clock className="size-4 text-academy" /><b className="font-semibold text-ink num">640</b> hours of lessons</span>
            <span className="flex items-center gap-2"><BadgeCheck className="size-4 text-academy" />Certificates you can verify</span>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-3 ring-1 ring-line">
            <div className="relative aspect-[16/9]"><Lecture id="sf" topic="friction" className="absolute inset-0 size-full" /></div>
          </div>
          <div className="absolute -bottom-5 -left-6 flex items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-3">
            <Avatar name="Neha Kulkarni" hue={258} size={38} />
            <div className="leading-tight"><p className="text-[13px] font-semibold">Neha Kulkarni</p><p className="text-[11.5px] text-ink-3">M.Sc. Physics · teaching since 2013</p></div>
          </div>
          <div className="absolute -right-4 top-5 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-3">
            <span className="relative inline-flex size-2"><span className="absolute -inset-1 rounded-full bg-signal/25" /><span className="relative size-2 rounded-full bg-signal" /></span>
            <span className="text-[12px] font-medium">Live now: Doubt session · <span className="num">412</span> watching</span>
          </div>
        </div>
      </section>

      <section className="px-10 pt-7">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em]">All courses</h2>
          <span className="text-[13px] text-ink-3">14</span>
          <div className="ml-6 flex gap-1.5 text-[12.5px]">
            {["All", "Physics", "Maths", "Chemistry", "Free", "Live batches"].map((x, i) => (
              <span key={x} className={cn("flex h-8 items-center rounded-full px-3", i === 0 ? "bg-inverse text-on-inverse" : "border border-line bg-surface text-ink-2")}>{x}</span>
            ))}
          </div>
          <span className="ml-auto flex items-center gap-1 text-[12.5px] text-ink-2">Most popular <ChevronDown className="size-3.5" /></span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {courses.map((c) => (
            <article key={c.t} className="overflow-hidden rounded-xl border border-line bg-surface shadow-1">
              <Cover hue={c.hue} glyph={c.g} label={c.l} className="h-[104px]" />
              <div className="p-3.5">
                <div className="flex items-start gap-2">
                  <h3 className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-[-0.01em]">{c.t}</h3>
                  {c.tag && <Badge tone="academy" className="h-5 px-1.5 text-[10.5px]">{c.tag}</Badge>}
                </div>
                <p className="mt-0.5 truncate text-[12px] text-ink-3">{c.s}</p>
                <div className="mt-3 flex items-center gap-2">
                  {c.price ? <span className="text-[15px] font-semibold num">{inr(c.price)}</span> : <span className="text-[15px] font-semibold text-ok">Free</span>}
                  {c.was && <span className="text-[12px] text-ink-3 line-through num">{inr(c.was)}</span>}
                  <span className="ml-auto flex items-center gap-1 text-[11.5px] text-ink-3"><Users className="size-3" /><span className="num">{c.st.toLocaleString("en-IN")}</span></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

