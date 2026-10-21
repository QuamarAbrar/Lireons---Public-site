import {
  BarChart3, Bold, BookOpen, Captions, Check, ChevronDown, ChevronRight, CirclePlay, Code2, Copy, Eye, FileText, GripVertical, Heading2, Image as ImageIcon, Italic, Link2, List,
  ListChecks, Lock, Maximize, MessageSquare, MonitorPlay, Pause, Plus, Radio, Settings, Sigma, StickyNote, Users, Volume2, Wallet, Award, LayoutGrid, Search, Bell, Globe, Download, Clock, Paperclip,
} from "lucide-react";
import { AppShell, Avatar, Badge, Btn, Card, Kbd, Monogram, Progress, Ring, Tabs, inr, pc, type NavGroup } from "./kit";
import { Lecture } from "./art";
import { cn } from "@/lib/cn";

const brand = { name: "BrightPath Academy", sub: "academy.brightpath.in", mono: "BP", hue: 258 };

const nav = (active: string): NavGroup[] => [
  { items: [{ icon: LayoutGrid, label: "Overview" }] },
  {
    title: "Teach",
    items: [
      { icon: BookOpen, label: "Courses", count: 14 },
      { icon: Radio, label: "Live classes", count: 3 },
      { icon: ListChecks, label: "Quizzes and DPPs" },
      { icon: Code2, label: "Coding problems" },
      { icon: Award, label: "Certificates" },
    ],
  },
  {
    title: "Grow",
    items: [
      { icon: Users, label: "Students", count: "3,912" },
      { icon: Wallet, label: "Payments" },
      { icon: MessageSquare, label: "Community", dot: true },
      { icon: BarChart3, label: "Analytics" },
    ],
  },
  { items: [{ icon: Globe, label: "Storefront" }, { icon: Settings, label: "Settings" }] },
].map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, active: i.label === active })) }));

type L = { n: string; t: string; k: "video" | "quiz" | "live" | "notes" | "code"; d: string; sel?: boolean; draft?: boolean; free?: boolean };
const ch3: L[] = [
  { n: "3.1", t: "Motion in a straight line", k: "video", d: "18:42", free: true },
  { n: "3.2", t: "Relative velocity", k: "video", d: "14:05" },
  { n: "3.3", t: "Projectile motion", k: "video", d: "22:10" },
  { n: "3.4", t: "Projectile on an inclined plane", k: "video", d: "16:38", sel: true, draft: true },
  { n: "3.5", t: "Formula sheet, kinematics", k: "notes", d: "4 pages" },
  { n: "3.6", t: "DPP 3: projectiles", k: "quiz", d: "12 questions" },
  { n: "3.7", t: "Doubt session", k: "live", d: "Thu, 7:00 PM" },
];
const kindIcon = { video: CirclePlay, quiz: ListChecks, live: Radio, notes: FileText, code: Code2 };

const markers = [
  { t: "00:00", l: "Set-up", at: 0 },
  { t: "03:20", l: "Axes along the incline", at: 0.2 },
  { t: "07:45", l: "Time of flight", at: 0.466 },
  { t: "12:10", l: "Range on the incline", at: 0.731 },
  { t: "15:02", l: "Summary", at: 0.904 },
];

export function AcademyBuilder() {
  return (
    <AppShell org={brand} product="academy" nav={nav("Courses")} crumbs={["Courses", "JEE Physics, full year", "Curriculum"]} user={{ name: "Neha Kulkarni", role: "Owner", hue: 258 }} search="Search courses, lessons, students">
      <div className="flex h-full flex-col">
        <div className="space-y-4 border-b border-line bg-surface px-7 pt-5">
          <div className="flex items-center gap-4">
            <div className="grid h-[52px] w-[84px] shrink-0 place-items-center overflow-hidden rounded-lg"><Lecture id="lb0" className="size-full" /></div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-[22px] font-semibold tracking-[-0.025em]">JEE Physics, full year</h1>
                <Badge tone="ok" dot>Live on storefront</Badge>
                <Badge tone="warn">3 unpublished changes</Badge>
              </div>
              <p className="mt-0.5 text-[13px] text-ink-3"><span className="num">1,248</span> students · {inr(14999)} or 3 instalments of {inr(5333)} · academy.brightpath.in/jee-physics</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Btn icon={Eye}>Preview as student</Btn>
              <Btn variant="product" color={pc.academy}>Publish changes</Btn>
            </div>
          </div>
          <Tabs items={["Curriculum", "Pricing", ["Students", "1,248"], ["Live classes", 3], "Certificate", "Settings"]} active={0} className="border-none" />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[312px_minmax(0,1fr)_316px]">
          {/* curriculum */}
          <div className="flex flex-col overflow-hidden border-r border-line bg-surface">
            <div className="flex items-center gap-2 px-4 py-3">
              <p className="text-[13px] font-semibold">Curriculum</p>
              <span className="text-[12px] text-ink-3">12 chapters · 138 lessons</span>
              <Btn size="sm" variant="ghost" icon={Plus} className="ml-auto" />
            </div>
            <div className="px-2 text-[13px]">
              {[["1", "Units and measurement", 6], ["2", "Vectors", 7]].map(([n, t, c]) => (
                <div key={n as string} className="flex h-9 items-center gap-2 rounded-[7px] px-2 text-ink-2">
                  <ChevronRight className="size-3.5 text-ink-3" /><span className="w-4 text-ink-3 num">{n}</span><span className="truncate">{t}</span><span className="ml-auto text-[11.5px] text-ink-3 num">{c}</span>
                </div>
              ))}
              <div className="flex h-9 items-center gap-2 rounded-[7px] px-2 font-semibold">
                <ChevronDown className="size-3.5 text-ink-3" /><span className="w-4 text-ink-3 num">3</span><span>Kinematics</span><span className="ml-auto text-[11.5px] font-normal text-ink-3 num">7</span>
              </div>
              <ul className="mb-1 ml-[22px] border-l border-line pl-1.5">
                {ch3.map((l) => {
                  const I = kindIcon[l.k];
                  return (
                    <li key={l.n} className={cn("group relative flex h-[42px] items-center gap-2 rounded-[7px] px-2", l.sel && "bg-academy-soft ring-1 ring-academy/40")}>
                      <GripVertical className={cn("size-3.5 shrink-0", l.sel ? "text-academy" : "text-line-2")} />
                      <I className="size-4 shrink-0 text-academy" strokeWidth={1.8} />
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className={cn("truncate text-[12.5px]", l.sel && "font-semibold")}>{l.t}</p>
                        <p className="text-[11px] text-ink-3 num">{l.n} · {l.d}</p>
                      </div>
                      {l.draft && <Badge tone="warn">Draft</Badge>}
                      {l.free && <Badge tone="academy">Free</Badge>}
                    </li>
                  );
                })}
              </ul>
              {[["4", "Laws of motion", 11], ["5", "Work, energy and power", 9], ["6", "Rotational motion", 12], ["7", "Gravitation", 8], ["8", "Properties of matter", 10], ["9", "Thermodynamics", 9]].map(([n, t, c]) => (
                <div key={n as string} className="flex h-9 items-center gap-2 rounded-[7px] px-2 text-ink-2">
                  <ChevronRight className="size-3.5 text-ink-3" /><span className="w-4 text-ink-3 num">{n}</span><span className="truncate">{t}</span><span className="ml-auto text-[11.5px] text-ink-3 num">{c}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto border-t border-line p-3">
              <div className="flex h-9 items-center justify-center gap-2 rounded-[8px] border border-dashed border-line-2 text-[12.5px] text-ink-2"><Plus className="size-3.5" />Add lesson, quiz, coding problem or live class</div>
            </div>
          </div>

          {/* editor */}
          <div className="overflow-hidden bg-paper px-8 pb-6 pt-6">
            <div className="mx-auto max-w-[700px]">
              <p className="text-[12px] text-ink-3">Chapter 3 · Lesson 3.4 · Video lesson</p>
              <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.03em]">Projectile on an inclined plane</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface shadow-1">
                <div className="relative aspect-[16/8.2] overflow-hidden">
                  <Lecture id="lb1" className="absolute inset-0 size-full" />
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/65 px-1.5 py-0.5 text-[11.5px] font-medium text-white num">16:38</span>
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[11.5px] text-white"><Check className="size-3.5" strokeWidth={2.6} />Processed · 1080p, 720p, 480p</span>
                  <span className="absolute inset-0 m-auto grid size-14 place-items-center rounded-full bg-white/90 text-[oklch(0.2_0.01_262)] shadow-3"><CirclePlay className="size-7" strokeWidth={1.6} /></span>
                </div>
                <div className="px-4 pb-3 pt-3">
                  <div className="relative h-1.5 rounded-full bg-inset">
                    {markers.slice(1).map((m) => <span key={m.t} className="absolute top-1/2 h-3 w-[2px] -translate-y-1/2 rounded bg-academy" style={{ left: `${m.at * 100}%` }} />)}
                  </div>
                  <ul className="mt-3 grid grid-cols-5 gap-2">
                    {markers.map((m) => (
                      <li key={m.t} className="rounded-md bg-surface-2 px-2 py-1.5 leading-tight">
                        <p className="font-mono text-[10.5px] text-academy">{m.t}</p>
                        <p className="truncate text-[11.5px]">{m.l}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center gap-3 text-[12px] text-ink-3">
                    <span className="flex items-center gap-1.5"><Captions className="size-3.5" />Captions: English, Hindi</span>
                    <span className="flex items-center gap-1.5"><FileText className="size-3.5" />Transcript ready</span>
                    <span className="ml-auto">projectile-incline-v3.mp4 · 1.4 GB</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface shadow-1">
                <div className="flex items-center gap-0.5 border-b border-line px-2 py-1.5 text-ink-2">
                  {[Heading2, Bold, Italic, List, Link2, Sigma, ImageIcon, Code2].map((I, i) => (
                    <span key={i} className={cn("grid size-7 place-items-center rounded-md", i === 5 && "bg-surface-2 text-ink")}><I className="size-4" strokeWidth={1.8} /></span>
                  ))}
                  <span className="ml-auto pr-2 text-[11.5px] text-ink-3">Lesson notes · saved 2 min ago</span>
                </div>
                <div className="space-y-3 px-5 py-4 text-[13.5px] leading-relaxed">
                  <p className="text-[15px] font-semibold">Take the axes along the incline</p>
                  <p className="text-ink-2">Resolve <i>g</i> along and perpendicular to the plane. The motion along <i>y′</i> decides the time of flight; the motion along <i>x′</i> gives the range for that time.</p>
                  <div className="flex items-center justify-center gap-6 rounded-lg border border-academy/30 bg-academy-soft/60 py-3 font-mono text-[13px]">
                    <span>T = 2u sin α / (g cos β)</span>
                    <span className="text-line-2">|</span>
                    <span>R = 2u² sin α cos(α + β) / (g cos² β)</span>
                  </div>
                  <p className="text-ink-2">Check: with β = 0 the range reduces to <span className="font-mono text-[12.5px]">u² sin 2α / g</span>, the level-ground result from 3.3.</p>
                </div>
                <div className="flex items-center gap-2 border-t border-line px-4 py-2.5">
                  <Paperclip className="size-3.5 text-ink-3" />
                  {[["Incline projectiles worksheet.pdf", "1.2 MB"], ["JEE Main 2025, Q14 solution.pdf", "380 KB"]].map(([n, s]) => (
                    <span key={n} className="flex h-7 items-center gap-1.5 rounded-md bg-surface-2 px-2 text-[12px]"><FileText className="size-3.5 text-academy" />{n}<span className="text-ink-3">{s}</span></span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* inspector */}
          <div className="flex flex-col gap-0 overflow-hidden border-l border-line bg-surface">
            <Section title="Lesson settings">
              <Row k="Status"><Badge tone="warn" dot>Draft</Badge></Row>
              <Row k="Access">Enrolled students</Row>
              <Row k="Free preview"><Toggle /></Row>
              <Row k="Unlocks">7 days after enrolment</Row>
              <Row k="Requires">3.3 Projectile motion</Row>
              <Row k="Complete when">80% watched + DPP 3</Row>
            </Section>
            <Section title="Live class" right={<Badge tone="academy">Thu 22 Oct, 7:00 PM</Badge>}>
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-academy-soft text-academy"><MonitorPlay className="size-[18px]" strokeWidth={1.8} /></span>
                <div className="leading-tight">
                  <p className="text-[12.5px] font-medium">Doubt session: projectiles</p>
                  <p className="text-[11.5px] text-ink-3">90 min · OBS or browser · auto-recorded</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <Field k="Server" v="rtmps://live.brightpath.in/app" />
                <Field k="Stream key" v="live_sk_••••••••7Q4K" masked />
              </div>
              <div className="mt-3 flex -space-x-1.5">
                {[["Ritika S", 350], ["Aman V", 140], ["Kriti J", 30], ["Dev N", 200], ["Sana M", 300]].map(([n, h]) => <Avatar key={n as string} name={n as string} hue={h as number} size={24} ring />)}
                <span className="pl-3 text-[11.5px] leading-6 text-ink-3"><span className="num">412</span> registered</span>
              </div>
            </Section>
            <Section title="Chapter 3 this month">
              <div className="grid grid-cols-2 gap-2">
                {[["1,086", "started"], ["82%", "avg. watched"], ["7.4/12", "DPP average"], ["96", "open doubts"]].map(([v, l]) => (
                  <div key={l} className="rounded-lg bg-surface-2 px-3 py-2 leading-tight">
                    <p className="text-[16px] font-semibold num">{v}</p>
                    <p className="text-[11px] text-ink-3">{l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex h-[38px] items-end gap-[3px]">
                {[22, 30, 26, 38, 44, 40, 52, 48, 61, 58, 66, 72, 69, 80, 76, 84, 90, 86, 94, 100].map((v, i) => (
                  <span key={i} className="flex-1 rounded-[2px] bg-academy" style={{ height: `${v}%`, opacity: 0.35 + (i / 20) * 0.65 }} />
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border-b border-line px-4 py-3.5 last:border-b-0">
      <div className="mb-2.5 flex items-center justify-between"><p className="text-[12.5px] font-semibold">{title}</p>{right}</div>
      {children}
    </div>
  );
}
function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return <div className="flex h-[30px] items-center justify-between text-[12.5px]"><span className="text-ink-3">{k}</span><span className="font-medium">{children}</span></div>;
}
function Toggle({ on }: { on?: boolean }) {
  return <span className={cn("relative inline-flex h-[18px] w-8 rounded-full", on ? "bg-academy" : "bg-line-2")}><span className={cn("absolute top-[2px] size-[14px] rounded-full bg-white shadow-1", on ? "left-4" : "left-[2px]")} /></span>;
}
function Field({ k, v, masked }: { k: string; v: string; masked?: boolean }) {
  return (
    <div>
      <p className="mb-1 text-[11px] text-ink-3">{k}</p>
      <div className="flex h-8 items-center gap-2 rounded-[7px] border border-line bg-surface-2 pl-2.5 pr-1">
        <span className="min-w-0 flex-1 truncate font-mono text-[11px]">{v}</span>
        {masked && <span className="flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] text-ink-2"><Lock className="size-3" />Reveal</span>}
        <span className="grid size-6 place-items-center rounded-md text-ink-3"><Copy className="size-3.5" /></span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ player */

const chapters: { t: string; done: number; of: number; open?: boolean }[] = [
  { t: "Units and measurement", done: 6, of: 6 },
  { t: "Vectors", done: 7, of: 7 },
  { t: "Kinematics", done: 3, of: 7, open: true },
  { t: "Laws of motion", done: 0, of: 11 },
  { t: "Work, energy and power", done: 0, of: 9 },
  { t: "Rotational motion", done: 0, of: 12 },
];

const notes = [
  { t: "03:41", n: "Choose x′ along the plane so the landing point has y′ = 0. Much easier than the level axes." },
  { t: "08:12", n: "Time of flight only depends on the perpendicular component: u sin α against g cos β." },
  { t: "11:56", n: "Revise this for DPP Q6, the down-the-incline case flips the sign of g sin β." },
  { t: "14:30", n: "Max range on the incline when α = 45° − β/2. Asked in JEE Main 2025, Q14." },
];

export function AcademyPlayer() {
  return (
    <div className="flex h-full w-full flex-col bg-paper text-ink">
      <header className="flex h-14 shrink-0 items-center gap-6 border-b border-line bg-surface px-5">
        <span className="flex items-center gap-2.5">
          <Monogram text="BP" hue={258} size={30} />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">BrightPath Academy</span>
        </span>
        <nav className="flex items-center gap-1 text-[13px]">
          {["My courses", "Live", "Practice", "Community"].map((x, i) => (
            <span key={x} className={cn("flex h-8 items-center rounded-[7px] px-3", i === 0 ? "bg-surface-2 font-medium" : "text-ink-2")}>{x}</span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex h-8 w-[260px] items-center gap-2 rounded-[8px] border border-line bg-surface-2 px-2.5 text-[12.5px] text-ink-3"><Search className="size-3.5" />Search lessons and notes<span className="ml-auto"><Kbd>/</Kbd></span></div>
          <span className="flex h-8 items-center gap-1.5 rounded-full bg-warn-soft px-2.5 text-[12px] font-medium text-[oklch(0.45_0.1_60)] dark:text-warn">12 day streak</span>
          <span className="relative grid size-8 place-items-center text-ink-2"><Bell className="size-[17px]" strokeWidth={1.8} /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-signal ring-2 ring-surface" /></span>
          <Avatar name="Ritika Sharma" hue={350} size={30} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[300px] shrink-0 flex-col border-r border-line bg-surface">
          <div className="border-b border-line p-4">
            <p className="text-[12px] text-ink-3">Course</p>
            <p className="text-[15px] font-semibold tracking-[-0.01em]">JEE Physics, full year</p>
            <div className="mt-3 flex items-center gap-3">
              <Ring value={0.24} size={40} stroke={4} color={pc.academy}><span className="text-[10.5px] font-semibold num">24%</span></Ring>
              <div className="text-[12px] leading-tight text-ink-3"><p><span className="font-medium text-ink num">33</span> of 138 lessons</p><p>Next live class Thursday</p></div>
            </div>
          </div>
          <ul className="flex-1 overflow-hidden px-2 py-2">
            {chapters.map((c, ci) => (
              <li key={c.t}>
                <div className="flex h-10 items-center gap-2.5 px-2">
                  <span className={cn("grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold", c.done === c.of ? "bg-academy text-white dark:text-[oklch(0.16_0.02_262)]" : "bg-surface-2 text-ink-2 ring-1 ring-line")}>{c.done === c.of ? <Check className="size-3" strokeWidth={3} /> : ci + 1}</span>
                  <span className={cn("truncate text-[13px]", c.open ? "font-semibold" : c.done === c.of ? "text-ink-2" : "")}>{c.t}</span>
                  <span className="ml-auto text-[11.5px] text-ink-3 num">{c.done}/{c.of}</span>
                </div>
                {c.open && (
                  <ul className="mb-1 ml-[19px] border-l border-line pl-2">
                    {ch3.map((l, i) => {
                      const I = kindIcon[l.k];
                      const done = i < 3, cur = i === 3;
                      return (
                        <li key={l.n} className={cn("flex h-[38px] items-center gap-2 rounded-[7px] px-2 text-[12.5px]", cur && "bg-academy-soft")}>
                          {done ? <span className="grid size-4 place-items-center rounded-full bg-ok text-white dark:text-[oklch(0.16_0.02_262)]"><Check className="size-2.5" strokeWidth={3.5} /></span> : <I className={cn("size-4", cur ? "text-academy" : "text-ink-3")} strokeWidth={1.8} />}
                          <span className={cn("min-w-0 flex-1 truncate", cur ? "font-semibold" : done ? "text-ink-2" : "")}>{l.t}</span>
                          <span className="text-[11px] text-ink-3 num">{l.k === "live" ? "Thu" : l.d.replace(" questions", " Qs")}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden px-7 pt-6">
          <div className="overflow-hidden rounded-xl bg-black shadow-3">
            <div className="relative aspect-video">
              <Lecture id="lp" className="absolute inset-0 size-full" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-black/55 px-2 py-1 text-[12px] text-white">3.4 · Projectile on an inclined plane</div>
              <div className="absolute bottom-[108px] left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-3 py-1 text-[14px] text-white">so the time of flight depends only on u sin α and g cos β</div>
              <div className="absolute inset-x-4 bottom-3 text-white">
                <div className="relative mb-2.5 flex h-1.5 gap-[3px]">
                  {markers.map((m, i) => {
                    const end = markers[i + 1]?.at ?? 1;
                    const fill = Math.max(0, Math.min(1, (0.373 - m.at) / (end - m.at)));
                    return <span key={m.t} className="relative h-full overflow-hidden rounded-full bg-white/30" style={{ width: `${(end - m.at) * 100}%` }}><span className="absolute inset-y-0 left-0 bg-[oklch(0.72_0.13_258)]" style={{ width: `${fill * 100}%` }} /></span>;
                  })}
                  <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-2" style={{ left: "37.3%" }} />
                  <span className="absolute -top-9 -translate-x-1/2 rounded-md bg-black/80 px-2 py-1 text-[11px]" style={{ left: "37.3%" }}>Axes along the incline</span>
                </div>
                <div className="flex items-center gap-4 text-[12.5px]">
                  <Pause className="size-[18px]" fill="currentColor" />
                  <Volume2 className="size-[18px]" />
                  <span className="num">06:12 / 16:38</span>
                  <span className="ml-auto flex items-center gap-4">
                    <span className="rounded border border-white/60 px-1 text-[10.5px] font-semibold">CC</span>
                    <span className="num">1.25x</span>
                    <span>1080p</span>
                    <Maximize className="size-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <div className="min-w-0">
              <h1 className="text-[22px] font-semibold tracking-[-0.025em]">Projectile on an inclined plane</h1>
              <p className="mt-1 flex items-center gap-2 text-[13px] text-ink-3"><Avatar name="Neha Kulkarni" hue={258} size={20} />Neha Kulkarni · Chapter 3, Lesson 4 · 16 min</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Btn icon={Download}>Worksheet</Btn>
              <Btn variant="product" color={pc.academy} icon={Check}>Mark complete</Btn>
            </div>
          </div>
          <Tabs items={[["My notes", 3], ["Discussion", 23], "Transcript", "Resources"]} active={0} className="mt-4" />
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_260px] gap-4">
            <ul className="space-y-2">
              {notes.map((x) => (
                <li key={x.t} className="flex items-start gap-3 rounded-lg border border-line bg-surface px-3 py-2.5">
                  <span className="mt-px rounded bg-academy-soft px-1.5 py-0.5 font-mono text-[11px] text-academy">{x.t}</span>
                  <p className="text-[13px] leading-snug">{x.n}</p>
                </li>
              ))}
            </ul>
            <div className="flex h-fit items-center gap-2 rounded-lg border border-dashed border-line-2 px-3 py-2.5 text-[12.5px] text-ink-3"><StickyNote className="size-4" />Add a note at 06:12</div>
          </div>
        </main>

        <aside className="flex w-[330px] shrink-0 flex-col gap-4 overflow-hidden border-l border-line bg-surface-2/50 p-4">
          <div className="overflow-hidden rounded-xl border border-academy/40 bg-surface shadow-2">
            <div className="flex items-center gap-2 bg-academy-soft px-4 py-2.5 text-[12px] font-medium text-academy">
              <span className="relative inline-flex size-2"><span className="absolute inset-0 rounded-full bg-signal opacity-40" /><span className="relative size-2 rounded-full bg-signal" /></span>
              Live in 12 min
            </div>
            <div className="p-4">
              <p className="text-[14px] font-semibold">Doubt session: projectiles</p>
              <p className="mt-0.5 text-[12px] text-ink-3">Today 7:00 PM · Neha Kulkarni · 90 min</p>
              <div className="mt-3 flex items-center -space-x-1.5">
                {[["Aman V", 140], ["Kriti J", 30], ["Dev N", 200], ["Sana M", 300]].map(([n, h]) => <Avatar key={n as string} name={n as string} hue={h as number} size={24} ring />)}
                <span className="pl-3 text-[11.5px] text-ink-3"><span className="num">412</span> joining</span>
              </div>
              <Btn variant="product" color={pc.academy} icon={Radio} className="mt-3 w-full">Join live class</Btn>
            </div>
          </div>
          <Card title="Practice for this lesson" icon={ListChecks}>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between text-[12.5px]"><span>DPP 3: projectiles</span><span className="text-ink-3">12 questions</span></div>
              <div><div className="mb-1 flex justify-between text-[11.5px] text-ink-3"><span>Your best attempt</span><span className="font-medium text-ink num">9 / 12</span></div><Progress value={0.75} color={pc.academy} /></div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 12 }, (_, i) => <span key={i} className={cn("h-6 flex-1 rounded-[4px]", [2, 5, 9].includes(i) ? "bg-warn-soft ring-1 ring-warn/40" : "bg-ok-soft")} />)}
              </div>
              <p className="text-[11.5px] text-ink-3">Q3, Q6 and Q10 to retry. Solutions unlock after your next attempt.</p>
            </div>
          </Card>
          <Card title="Up next" icon={Clock}>
            <ul className="divide-y divide-line">
              {ch3.slice(4, 7).map((l) => {
                const I = kindIcon[l.k];
                return (
                  <li key={l.n} className="flex items-center gap-2.5 px-4 py-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-academy-soft text-academy"><I className="size-4" strokeWidth={1.8} /></span>
                    <div className="min-w-0 leading-tight"><p className="truncate text-[12.5px] font-medium">{l.t}</p><p className="text-[11px] text-ink-3">{l.n} · {l.d}</p></div>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card title="This week" icon={BarChart3} action={<span className="text-[12px] text-ink-3 num">4 h 12 m</span>}>
            <div className="flex h-[92px] items-end gap-2 px-4 pb-3 pt-4">
              {[["M", 0.5], ["T", 0.72], ["W", 0.3], ["T", 0.88], ["F", 0.62], ["S", 1], ["S", 0.2]].map(([d, v], i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="w-full rounded-[3px]" style={{ height: `${(v as number) * 56}px`, background: i === 5 ? pc.academy : "var(--inset)" }} />
                  <span className="text-[10.5px] text-ink-3">{d}</span>
                </div>
              ))}
            </div>
          </Card>
          <p className="mt-auto text-center text-[11px] text-ink-3">academy.brightpath.in · Powered by Lireons</p>
        </aside>
      </div>
    </div>
  );
}



/* ------------------------------------------------------------ live class, host view */

const hands: [string, number, string, string][] = [
  ["Aarav Mehta", 30, "Why does g cos β set the time of flight?", "1 min"],
  ["Kriti Joshi", 330, "Down-the-incline case, Q6 of DPP 3", "2 min"],
  ["Dev Nair", 200, "Max range formula, where is 45° − β/2 from?", "4 min"],
];
const chat: [string, number, string][] = [
  ["Sana Mirza", 300, "Ma'am can you redo the axes part once"],
  ["Aman Verma", 140, "got 2.4 s for Q3"],
  ["Ritika Sharma", 350, "same, 2.4 s"],
  ["Ishaan Bhatt", 90, "is this in the recording later?"],
  ["Pooja Rao, TA", 60, "Yes, recording is in the course by 9 PM"],
  ["Gauri Patil", 250, "y′ = 0 at landing makes sense now"],
  ["Farhan Qureshi", 200, "can we do one down the incline example"],
  ["Kavya Reddy", 250, "voted along the incline"],
  ["Manav Shah", 60, "audio is clear now, thanks"],
  ["Navya Pillai", 180, "what if β is 0, does it become normal projectile?"],
  ["Pooja Rao, TA", 60, "Yes, β = 0 gives the level ground formulas"],
];

export function AcademyLive() {
  return (
    <div className="flex h-full w-full flex-col bg-paper text-ink">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-5">
        <span className="flex items-center gap-2.5">
          <Monogram text="BP" hue={258} size={30} />
          <span className="leading-tight"><span className="block text-[13.5px] font-semibold tracking-[-0.01em]">BrightPath Academy</span><span className="block text-[11.5px] text-ink-3">Live studio</span></span>
        </span>
        <span className="text-line-2">/</span>
        <div className="leading-tight">
          <p className="text-[14px] font-semibold">Doubt session: projectiles</p>
          <p className="text-[11.5px] text-ink-3">JEE Physics, full year · Batch A · Mon 19 Oct</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="flex h-8 items-center gap-2 rounded-[8px] bg-signal px-2.5 text-[12.5px] font-semibold text-on-signal"><span className="size-2 rounded-full bg-on-signal" />LIVE <span className="font-mono num">00:24:18</span></span>
          <span className="flex h-8 items-center gap-1.5 rounded-[8px] border border-line px-2.5 text-[12.5px]"><Users className="size-4 text-ink-3" /><span className="font-medium num">412</span> watching</span>
          <span className="flex h-8 items-center gap-1.5 rounded-[8px] border border-line px-2.5 text-[12.5px]"><span className="size-2 rounded-full bg-signal" />Recording</span>
          <Avatar name="Neha Kulkarni" hue={258} size={30} className="ml-1" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-5">
          <div className="relative overflow-hidden rounded-xl bg-black shadow-3">
            <div className="relative aspect-[16/8]">
              <Lecture id="lv" className="absolute inset-0 size-full" />
              <span className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-black/55 px-2 py-1 text-[12px] text-white"><MonitorPlay className="size-3.5" />Sharing: board camera</span>
              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[12px] text-white">1080p · 3.2 Mbps · 2.1 s delay</span>
              <div className="absolute bottom-4 left-4 w-[300px] rounded-lg bg-black/70 p-3 text-white">
                <p className="text-[11.5px] opacity-75">Poll on screen</p>
                <p className="mt-0.5 text-[13px] font-medium">Which axes make the landing point y′ = 0?</p>
                <div className="mt-2 space-y-1.5 text-[12px]">
                  {[["Along the incline", 0.71, true], ["Horizontal and vertical", 0.22, false], ["Not sure", 0.07, false]].map(([l, v, ok]) => (
                    <div key={l as string}>
                      <div className="flex justify-between"><span>{l as string}</span><span className="num">{Math.round((v as number) * 100)}%</span></div>
                      <div className="mt-0.5 h-1.5 rounded-full bg-white/20"><div className="h-full rounded-full" style={{ width: `${(v as number) * 100}%`, background: ok ? "oklch(0.72 0.13 258)" : "oklch(1 0 0 / 0.55)" }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[[Volume2, "Mic on"], [Eye, "Camera on"], [MonitorPlay, "Share screen"], [BarChart3, "New poll"], [Paperclip, "Share file"]].map(([I, l], i) => {
              const Icon = I as typeof Volume2;
              return <span key={l as string} className={cn("flex h-10 items-center gap-2 rounded-[10px] px-3.5 text-[13px] font-medium", i < 2 ? "bg-academy-soft text-academy" : "border border-line bg-surface")}><Icon className="size-4" />{l as string}</span>;
            })}
            <span className="ml-auto flex h-10 items-center rounded-[10px] bg-signal px-4 text-[13px] font-semibold text-on-signal">End class</span>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-4">
            <Card title="Raised hands" icon={Users} action={<Badge tone="academy">3 waiting</Badge>}>
              <ul className="divide-y divide-line">
                {hands.map(([n, h, q, t]) => (
                  <li key={n} className="flex items-center gap-3 px-4 py-2.5">
                    <Avatar name={n} hue={h} size={28} />
                    <div className="min-w-0 flex-1 leading-tight"><p className="text-[12.5px] font-medium">{n} <span className="font-normal text-ink-3">· {t}</span></p><p className="truncate text-[12px] text-ink-2">{q}</p></div>
                    <Btn size="sm" variant="product" color={pc.academy}>Let speak</Btn>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Class so far" icon={Clock}>
              <dl className="space-y-2 p-4 text-[12.5px]">
                {[["Joined", "412 of 448 enrolled"], ["On mobile", "68%"], ["Questions asked", "31, 14 answered"], ["Poll answers", "389"], ["Recording", "In the course by 9:00 PM"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3"><dt className="text-ink-3">{k}</dt><dd className="font-medium num">{v}</dd></div>
                ))}
              </dl>
            </Card>
          </div>
        </main>

        <aside className="flex w-[360px] shrink-0 flex-col border-l border-line bg-surface">
          <Tabs items={[["Chat", 128], ["Questions", 17], ["People", 412]]} active={0} className="px-4" />
          <div className="mx-4 mt-3 rounded-lg border border-academy/30 bg-academy-soft/60 px-3 py-2.5">
            <p className="text-[11.5px] font-medium text-academy">Pinned by Neha Kulkarni</p>
            <p className="mt-0.5 text-[12.5px] leading-snug">DPP 3 solutions unlock after class. Send doubts in Questions, not chat.</p>
          </div>
          <ul className="flex-1 space-y-3 overflow-hidden px-4 py-3">
            {chat.map(([n, h, m]) => (
              <li key={n + m} className="flex gap-2.5">
                <Avatar name={n} hue={h} size={24} />
                <div className="min-w-0 leading-tight"><p className={cn("text-[12px] font-medium", n.endsWith(", TA") && "text-academy")}>{n}</p><p className="mt-0.5 text-[12.5px] text-ink-2">{m}</p></div>
              </li>
            ))}
          </ul>
          <div className="border-t border-line p-3">
            <div className="flex h-10 items-center gap-2 rounded-[10px] border border-line bg-surface-2 px-3 text-[12.5px] text-ink-3">Message 412 learners<span className="ml-auto"><Kbd>↵</Kbd></span></div>
            <p className="mt-2 text-center text-[11px] text-ink-3">academy.brightpath.in · Powered by Lireons</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
