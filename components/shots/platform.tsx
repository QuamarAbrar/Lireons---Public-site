import {
  Award, Bell, BookOpen, Check, ChevronDown, CircleHelp, ClipboardCheck, Database, Download, GraduationCap, HardDrive, KeyRound,
  LaptopMinimal, LayoutGrid, LogOut, MessageCircle, MessageCircleQuestion, MoreHorizontal, Radio, Receipt, ScanFace, ScrollText, Search, Settings, ShieldCheck,
  Smartphone, Trash2, Users, Filter, RotateCcw, Lock, Globe, Wallet, CirclePlay,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, Badge, Btn, Card, Kbd, LireonsMark, Monogram, Progress, Ring, Seg, Spark, Tabs, inr, pc, ps, type Prod } from "./kit";
import { cn } from "@/lib/cn";

type Item = { icon: LucideIcon; label: string; count?: string | number; active?: boolean };
const groups: { id: Prod | "core"; name: string; tag?: string; items: Item[] }[] = [
  { id: "core", name: "Platform", items: [{ icon: LayoutGrid, label: "Home" }, { icon: Users, label: "Learners", count: "1,284" }, { icon: ScrollText, label: "Audit log" }] },
  { id: "academy", name: "Academy", items: [{ icon: BookOpen, label: "Courses", count: 14 }, { icon: Radio, label: "Live classes", count: 3 }, { icon: Wallet, label: "Course sales" }, { icon: Award, label: "Certificates" }] },
  { id: "assess", name: "Assessments", items: [{ icon: ClipboardCheck, label: "Tests", count: 24 }, { icon: ScanFace, label: "Review queue", count: 7 }] },
  { id: "ai", name: "AI Doubt Solver", tag: "Preview", items: [{ icon: MessageCircleQuestion, label: "Doubts" }] },
];

/** The Lireons app frame: the three products in one sidebar, institution switcher in the top bar. */
function LireonsShell({ active, crumbs, children, user = { name: "Meera Joshi", role: "Academic head", hue: 330 } }: { active: string; crumbs: string[]; children: React.ReactNode; user?: { name: string; role: string; hue: number } }) {
  return (
    <div className="flex h-full w-full bg-paper text-ink">
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-line bg-surface-2/60 dark:bg-[oklch(0.18_0.007_262)]">
        <div className="flex h-14 items-center gap-2 px-4">
          <LireonsMark size={20} />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">Lireons</span>
        </div>
        <nav className="flex-1 space-y-3.5 overflow-hidden px-2 pt-1">
          {groups.map((g) => (
            <div key={g.name}>
              <p className="flex items-center gap-2 px-2 pb-1 text-[11.5px] font-medium text-ink-3">
                {g.id !== "core" && <span className="size-2 rounded-[2px]" style={{ background: pc[g.id] }} />}
                {g.name}
                {g.tag && <Badge tone="ai" className="h-[18px] px-1 text-[10.5px]">{g.tag}</Badge>}
              </p>
              <ul className="space-y-px">
                {g.items.map(({ icon: I, label, count }) => {
                  const on = label === active;
                  return (
                    <li key={label} className={cn("flex h-8 items-center gap-2.5 rounded-[7px] px-2 text-[13px]", on ? "bg-surface font-medium text-ink shadow-1 ring-1 ring-line" : "text-ink-2")}>
                      <I className="size-4 shrink-0" strokeWidth={1.8} style={g.id !== "core" ? { color: pc[g.id] } : undefined} />
                      <span className="truncate">{label}</span>
                      {count !== undefined && <span className="ml-auto text-[11.5px] text-ink-3 num">{count}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="space-y-px px-2 pb-2">
          {[[Settings, "Settings"], [CircleHelp, "Help and status"]].map(([I, l]) => {
            const Icon = I as LucideIcon;
            return <div key={l as string} className={cn("flex h-8 items-center gap-2.5 rounded-[7px] px-2 text-[13px]", l === active ? "bg-surface font-medium shadow-1 ring-1 ring-line" : "text-ink-2")}><Icon className="size-4" strokeWidth={1.8} />{l as string}</div>;
          })}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-5">
          <span className="flex h-9 items-center gap-2 rounded-[9px] border border-line bg-surface pl-1.5 pr-2.5 shadow-1">
            <Monogram text="BS" hue={152} size={24} />
            <span className="text-[13px] font-semibold">Brightpath School</span>
            <span className="text-[12px] text-ink-3">Pune</span>
            <ChevronDown className="size-3.5 text-ink-3" />
          </span>
          <span className="text-line-2">/</span>
          <div className="flex items-center gap-2 text-[13px]">
            {crumbs.map((c, i) => (
              <span key={c} className="flex items-center gap-2">{i > 0 && <span className="text-line-2">/</span>}<span className={i === crumbs.length - 1 ? "font-medium" : "text-ink-3"}>{c}</span></span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex h-8 w-[280px] items-center gap-2 rounded-[8px] border border-line bg-surface-2 px-2.5 text-[12.5px] text-ink-3"><Search className="size-3.5" />Search learners, courses, tests<span className="ml-auto flex gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></span></div>
            <span className="relative grid size-8 place-items-center text-ink-2"><Bell className="size-[17px]" strokeWidth={1.8} /><span className="absolute right-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-signal px-0.5 text-[9px] font-semibold text-on-signal ring-2 ring-surface num">3</span></span>
            <Avatar name={user.name} hue={user.hue} size={30} />
          </div>
        </header>
        <main className="relative flex min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- learner record */

function RecordHead({ tab }: { tab: number }) {
  return (
    <div className="border-b border-line bg-surface px-7 pt-5">
      <div className="flex items-center gap-4">
        <span className="relative">
          <Avatar name="Aarav Mehta" hue={30} size={60} className="text-[22px]" />
          <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-ok ring-[3px] ring-surface" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[24px] font-semibold tracking-[-0.025em]">Aarav Mehta</h1>
            <Badge tone="ok" dot>Active today</Badge>
            <Badge tone="academy">3 courses</Badge>
          </div>
          <p className="mt-1 text-[13px] text-ink-3">Class 10 B · Learner ID BPS-0412 · JEE Physics Batch A · Guardian Sunita Mehta</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Btn icon={MessageCircle}>Message learner</Btn>
          <Btn icon={MoreHorizontal} />
        </div>
      </div>
      <Tabs className="mt-4 border-none" active={tab} items={["Overview", "Academy", "Assessments", "AI Doubt Solver", ["Documents", 4], "Audit"]} />
    </div>
  );
}

const live: { t: string; p: Prod; h: string; d: string; fresh?: boolean }[] = [
  { t: "11:42", p: "academy", h: "Bought JEE Maths crash course", d: `${inr(4999)} by UPI · receipt #A-2207 emailed`, fresh: true },
  { t: "11:20", p: "assess", h: "Physics Mock 7 result published", d: "128 / 160 · reviewed by A. Deshpande" },
  { t: "10:05", p: "academy", h: "Lesson watched: Friction on an incline", d: "Physics course now 58% complete" },
  { t: "07:00", p: "academy", h: "Joined live class: Laws of motion", d: "Neha Kulkarni · stayed 86 of 90 min" },
  { t: "Sun", p: "ai", h: "Doubt answered from class notes", d: "Ch 4 Quadratics, Lesson 3, 06:12" },
  { t: "Sun", p: "academy", h: "DPP 3 attempted", d: "9 of 12 correct" },
  { t: "Sat", p: "academy", h: "Certificate issued: Vectors", d: "Chapter test 18 / 20" },
  { t: "Sat", p: "assess", h: "Device check passed for Mock 7", d: "Camera, mic and screen share" },
  { t: "Fri", p: "assess", h: "Chemistry Mock 6 submitted", d: "One flag, cleared with a note" },
  { t: "Fri", p: "ai", h: "Doubt handed to Mr. Kulkarni", d: "Answered in 2 h 10 min" },
];

function LiveRail() {
  return (
    <aside className="flex w-[330px] shrink-0 flex-col border-l border-line bg-surface">
      <div className="flex h-12 items-center gap-2 border-b border-line px-4">
        <span className="relative inline-flex size-2"><span className="absolute -inset-1 rounded-full bg-signal/25" /><span className="relative size-2 rounded-full bg-signal" /></span>
        <p className="text-[13.5px] font-semibold">Live on this record</p>
        <span className="ml-auto text-[12px] text-ink-3">Today, 19 Oct</span>
      </div>
      <ol className="relative flex-1 overflow-hidden px-4 py-3">
        <span className="absolute bottom-0 left-[27px] top-5 w-px bg-line" />
        {live.map((e, i) => (
          <li key={i} className={cn("relative mb-2 flex gap-3 rounded-xl p-2.5", e.fresh && "bg-signal-soft ring-1 ring-signal/30")}>
            <span className="relative z-10 mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full ring-4 ring-surface" style={{ background: ps[e.p] }}>
              <span className="size-2 rounded-full" style={{ background: e.fresh ? "var(--signal)" : pc[e.p] }} />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="flex items-center gap-2 text-[12.5px] font-medium">{e.h}</p>
              <p className="mt-1 text-[11.5px] text-ink-3">{e.d}</p>
            </div>
            <span className="shrink-0 text-[11px] text-ink-3 num">{e.t}</span>
          </li>
        ))}
      </ol>
      <div className="border-t border-line p-4">
        <p className="text-[11.5px] text-ink-3">One record across Academy, Assessments and the Doubt Solver. Names and figures are illustrative.</p>
      </div>
    </aside>
  );
}

const courses: [string, string, number, string, number][] = [
  ["JEE Physics, full year", "Neha Kulkarni", 0.58, "Friction on an incline, today 10:05", 258],
  ["Chemistry foundation", "Kavita Joshi", 0.81, "Chemical bonding, Sat", 140],
  ["JEE Maths crash course", "Rahul Kulkarni", 0.04, "Bought today, Lesson 1 unlocked", 200],
];

const mocks: [string, string, number, string, number[]][] = [
  ["Physics Mock 7", "19 Oct", 128, "6 of 41", [96, 18, 14]],
  ["Chemistry Mock 6", "16 Oct", 112, "9 of 41", [84, 14, 14]],
  ["Maths Mock 6", "12 Oct", 134, "4 of 41", [100, 17, 17]],
  ["Physics Mock 6", "5 Oct", 117, "11 of 41", [88, 15, 14]],
];

function Overview() {
  return (
    <div className="grid min-w-0 flex-1 grid-cols-3 content-start gap-4 overflow-hidden px-7 py-6">
      <Card title="Courses" icon={BookOpen} action={<span className="text-[12px] text-ink-3">Academy</span>} className="col-span-2">
        <div className="grid grid-cols-[minmax(0,1fr)_230px] gap-5 p-4">
          <ul className="space-y-3">
            {courses.map(([c, t, v, last, h]) => (
              <li key={c}>
                <div className="flex items-center gap-2.5">
                  <Avatar name={t} hue={h} size={22} />
                  <p className="min-w-0 flex-1 truncate text-[13px] font-medium">{c}</p>
                  <span className="text-[13px] font-semibold num">{Math.round(v * 100)}%</span>
                </div>
                <Progress value={Math.max(v, 0.02)} color={pc.academy} className="ml-[32px] mt-1.5 h-1.5" />
                <p className="ml-[32px] mt-1 text-[11.5px] text-ink-3">{last}</p>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-dashed border-line-2 p-3">
            <p className="flex items-center gap-1.5 text-[12px] font-medium"><Receipt className="size-3.5 text-academy" />Course receipt #A-2207</p>
            <dl className="mt-2 space-y-1 text-[11.5px]">
              {[["Course", "JEE Maths crash course"], ["Amount", inr(4999)], ["Method", "UPI"], ["Reference", "UTR 6281•••0934"], ["Paid", "19 Oct, 11:42 AM"]].map(([k, v]) => <div key={k} className="flex justify-between gap-2"><dt className="shrink-0 text-ink-3">{k}</dt><dd className="truncate font-medium num">{v}</dd></div>)}
            </dl>
          </div>
        </div>
      </Card>
      <Card title="Live classes" icon={Radio} action={<span className="text-[12px] text-ink-3">October</span>}>
        <div className="flex items-center gap-4 p-4">
          <Ring value={11 / 12} size={72} stroke={7} color={pc.academy}><span className="text-[17px] font-semibold num">11/12</span></Ring>
          <div className="text-[12px] leading-snug text-ink-2"><p><span className="font-medium text-ink">11 joined</span>, 1 recording watched</p><p>Avg. 84 of 90 min</p><p>Asked 6 questions</p></div>
        </div>
        <div className="mx-4 mb-4 flex items-center gap-2.5 rounded-lg bg-academy-soft/70 px-3 py-2">
          <CirclePlay className="size-4 shrink-0 text-academy" />
          <div className="min-w-0 leading-tight"><p className="truncate text-[12px] font-medium">Doubt session: projectiles</p><p className="text-[11.5px] text-ink-3">Today 7:00 PM · Neha Kulkarni</p></div>
        </div>
      </Card>
      <Card title="Physics Mock 7" icon={ClipboardCheck} action={<Badge tone="assess">Reviewed</Badge>}>
        <div className="p-4">
          <div className="flex items-end justify-between"><p className="text-[28px] font-semibold leading-none tracking-[-0.03em] num">128<span className="text-[15px] font-normal text-ink-3"> / 160</span></p><p className="text-[12px] text-ink-3">Batch rank 6 of 41</p></div>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-[11.5px]">
            {[["MCQ", "96/120"], ["Numerical", "18/20"], ["Written", "14/20"]].map(([k, v]) => <div key={k} className="rounded-md bg-surface-2 px-2 py-1.5"><p className="text-ink-3">{k}</p><p className="font-medium num">{v}</p></div>)}
          </div>
          <p className="mt-2.5 text-[11.5px] text-ink-3">Up from 117 in Mock 6</p>
        </div>
      </Card>
      <Card title="Proctor review" icon={ScanFace} action={<Badge tone="ok" icon={Check}>Clear</Badge>}>
        <ul className="divide-y divide-line text-[12px]">
          {[["Physics Mock 7", "No flags", "ok"], ["Chemistry Mock 6", "1 flag cleared, note added", "warn"], ["Maths Mock 6", "No flags", "ok"]].map(([t, d, tone]) => (
            <li key={t} className="flex items-center gap-2.5 px-4 py-2.5">
              <span className={cn("size-2 shrink-0 rounded-full", tone === "ok" ? "bg-ok" : "bg-warn")} />
              <span className="font-medium">{t}</span>
              <span className="ml-auto truncate text-ink-3">{d}</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-line px-4 py-2.5 text-[11.5px] text-ink-3">Reviewed by Anjali Deshpande</p>
      </Card>
      <Card title="Doubts" icon={MessageCircleQuestion} action={<Badge tone="ai">Preview</Badge>}>
        <div className="p-4">
          <div className="flex items-end justify-between"><p className="text-[28px] font-semibold leading-none tracking-[-0.03em] num">9</p><p className="text-[12px] text-ink-3">this week · 2 to teacher</p></div>
          <p className="mt-3 rounded-lg bg-ai-soft/70 px-3 py-2 text-[12px] leading-snug">Quadratic roots, answered from <span className="font-medium">Ch 4 Quadratics, Lesson 3, 06:12</span></p>
        </div>
      </Card>
      <Card title="Mock test results" icon={GraduationCap} action={<Spark data={[117, 112, 134, 128]} w={90} h={22} color={pc.assess} dots />} className="col-span-2">
        <table className="w-full text-[12.5px]">
          <thead><tr className="h-8 border-b border-line text-left text-[11.5px] text-ink-3"><th className="pl-4 font-medium">Test</th><th className="font-medium">Date</th><th className="font-medium">Score</th><th className="font-medium">MCQ · Num. · Written</th><th className="pr-4 text-right font-medium">Batch rank</th></tr></thead>
          <tbody className="divide-y divide-line">
            {mocks.map(([t, d, sc, r, sec]) => (
              <tr key={t} className="h-9"><td className="pl-4 font-medium">{t}</td><td className="text-ink-2">{d}</td><td><span className="flex items-center gap-2"><Progress value={sc / 160} color={pc.assess} className="w-20" /><span className="num">{sc}</span></span></td><td className="text-ink-2 num">{sec.join(" · ")}</td><td className="pr-4 text-right font-medium num">{r}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title="Certificates" icon={Award} action={<span className="text-[12px] text-ink-3 num">2 issued</span>}>
        <ul className="divide-y divide-line text-[12px]">
          {[["Vectors", "Issued Sat, 18 / 20"], ["Units and measurement", "Issued 2 Oct, 19 / 20"]].map(([t, d]) => (
            <li key={t} className="flex items-center gap-2.5 px-4 py-2.5"><Award className="size-4 text-academy" strokeWidth={1.8} /><span className="flex-1 truncate font-medium">{t}</span><span className="text-ink-3">{d}</span></li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-2.5"><div className="flex justify-between text-[11.5px] text-ink-3"><span>Next: Kinematics</span><span className="num">3 of 7 lessons</span></div><Progress value={3 / 7} color={pc.academy} className="mt-1.5" /></div>
      </Card>
    </div>
  );
}

export function HomeApp() {
  return (
    <LireonsShell active="Learners" crumbs={["Learners", "Aarav Mehta"]}>
      <div className="flex min-w-0 flex-1 flex-col">
        <RecordHead tab={0} />
        <Overview />
      </div>
      <LiveRail />
    </LireonsShell>
  );
}

/* ---------------------------------------------- platform record + audit */

const audit = [
  { who: "System", h: 0, what: "Emailed course receipt #A-2207 to Aarav Mehta", where: "Academy", t: "11:42:09" },
  { who: "Payment gateway", h: 0, what: `Recorded UPI payment ${inr(4999)}, UTR 6281•••0934`, where: "Academy", t: "11:42:05" },
  { who: "Anjali Deshpande", h: 60, what: "Published Mock 7 result after review", where: "Assessments", t: "11:20:37" },
  { who: "Meera Joshi", h: 330, what: "Viewed course progress", where: "Academy", t: "10:12:51" },
  { who: "System", h: 0, what: "Logged live class, 86 of 90 min", where: "Academy", t: "08:31:16" },
  { who: "Neha Kulkarni", h: 258, what: "Moved learner to JEE Physics Batch A", where: "Academy", t: "07:58:02" },
  { who: "Rahul Kulkarni", h: 200, what: "Approved an AI answer on this record", where: "AI Doubt Solver", t: "Sun 21:30" },
  { who: "Anjali Deshpande", h: 60, what: "Cleared a flag on Chemistry Mock 6, note added", where: "Assessments", t: "Fri 13:05" },
  { who: "Aarav Mehta", h: 30, what: "Signed in on a new phone, Android", where: "Platform", t: "Fri 19:48" },
];

const liveLog: [string, string, string, "joined" | "rec" | "next"][] = [
  ["Mon 19 Oct", "Doubt session: projectiles", "7:00 PM", "next"],
  ["Mon 19 Oct", "Laws of motion, part 2", "86 of 90 min", "joined"],
  ["Thu 15 Oct", "Kinematics problem class", "90 of 90 min", "joined"],
  ["Tue 13 Oct", "Organic chemistry basics", "Recording, 72 min", "rec"],
  ["Mon 12 Oct", "Laws of motion, part 1", "88 of 90 min", "joined"],
  ["Thu 8 Oct", "Vectors revision", "81 of 90 min", "joined"],
  ["Tue 6 Oct", "Chemical bonding Q and A", "90 of 90 min", "joined"],
  ["Mon 5 Oct", "Units and measurement test prep", "77 of 90 min", "joined"],
  ["Thu 1 Oct", "Vectors, part 2", "85 of 90 min", "joined"],
];

export function PlatformRecord() {
  return (
    <LireonsShell active="Learners" crumbs={["Learners", "Aarav Mehta", "Academy"]}>
      <div className="flex min-w-0 flex-1 flex-col">
        <RecordHead tab={1} />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_300px] content-start gap-4 overflow-hidden px-7 py-6">
          <Card title="Enrolled courses" icon={BookOpen} action={<Btn size="sm" icon={Download}>Progress report</Btn>}>
            <table className="w-full text-[12.5px]">
              <thead><tr className="h-9 border-b border-line text-left text-[11.5px] text-ink-3"><th className="pl-4 font-medium">Course</th><th className="font-medium">Teacher</th><th className="font-medium">Progress</th><th className="font-medium">Last lesson</th><th className="pr-4 text-right font-medium">Access</th></tr></thead>
              <tbody className="divide-y divide-line">
                {[["JEE Physics, full year", "Neha Kulkarni", 0.58, "Today 10:05", "Till 31 May 2027"], ["Chemistry foundation", "Kavita Joshi", 0.81, "Sat 18:40", "Till 31 Mar 2027"], ["JEE Maths crash course", "Rahul Kulkarni", 0.04, "Today 11:50", "New today"], ["Coding basics, Python", "Farah Ali", 1, "2 Sep", "Completed"]].map(([c, t, v, l, a]) => (
                  <tr key={c as string} className={cn("h-[42px]", a === "New today" && "bg-academy-soft/50")}>
                    <td className="pl-4 font-medium">{c}</td><td className="text-ink-2">{t}</td>
                    <td><span className="flex items-center gap-2"><Progress value={Math.max(v as number, 0.02)} color={pc.academy} className="w-20" /><span className="num">{Math.round((v as number) * 100)}%</span></span></td>
                    <td className="text-ink-2">{l}</td>
                    <td className="pr-4 text-right">{a === "New today" ? <Badge tone="academy">New today</Badge> : a === "Completed" ? <Badge tone="ok" icon={Check}>Completed</Badge> : <span className="text-[12px] text-ink-3">{a}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card title="Purchases" icon={Wallet}>
            <ul className="divide-y divide-line">
              {[["JEE Maths crash course", 4999, "Today · UPI", "#A-2207"], ["Chemistry foundation", 6500, "12 Jun · UPI", "#A-1180"], ["JEE Physics, full year", 24000, "3 Apr · card, 3 EMIs", "#A-0961"]].map(([c, a, d, r]) => (
                <li key={c as string} className="flex items-center gap-2.5 px-4 py-2.5">
                  <Receipt className="size-4 shrink-0 text-ink-3" />
                  <div className="min-w-0 flex-1 leading-tight"><p className="truncate text-[12.5px] font-medium">{c}</p><p className="text-[11.5px] text-ink-3">{d} · <span className="font-mono">{r}</span></p></div>
                  <span className="text-[12.5px] font-medium num">{inr(a as number)}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Live classes" icon={Radio} action={<span className="text-[12px] font-medium num">11 of 12 joined</span>}>
            <ul className="divide-y divide-line">
              {liveLog.map(([d, t, m, st]) => (
                <li key={t} className={cn("flex h-[40px] items-center gap-3 px-4 text-[12.5px]", st === "next" && "bg-academy-soft/50")}>
                  <span className="w-[86px] shrink-0 text-[11.5px] text-ink-3">{d}</span>
                  <span className="flex-1 truncate font-medium">{t}</span>
                  <span className="text-ink-2 num">{m}</span>
                  {st === "next" ? <Badge tone="academy" dot>Upcoming</Badge> : st === "rec" ? <Badge tone="neutral" icon={CirclePlay}>Recording</Badge> : <Badge tone="ok" icon={Check}>Joined</Badge>}
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Certificates" icon={Award} action={<Badge tone="ok">2 issued</Badge>}>
            <ul className="divide-y divide-line">
              {[["Vectors", "Issued Sat · 18 / 20"], ["Units and measurement", "Issued 2 Oct · 19 / 20"], ["Coding basics, Python", "Issued 2 Sep · course"], ["Kinematics", "3 of 7 lessons left"]].map(([d, st]) => (
                <li key={d} className="flex items-center gap-2.5 px-4 py-2.5 text-[12px]">
                  <Award className={cn("size-3.5", st.startsWith("Issued") ? "text-academy" : "text-ink-3")} /><span className="flex-1 truncate font-medium">{d}</span>
                  <span className="text-ink-3">{st}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <aside className="flex w-[330px] shrink-0 flex-col border-l border-line bg-surface">
        <div className="flex h-12 items-center gap-2 border-b border-line px-4">
          <ScrollText className="size-4 text-ink-3" />
          <p className="text-[13.5px] font-semibold">Who touched this record</p>
          <span className="ml-auto text-[12px] text-ink-3">Today</span>
        </div>
        <ol className="flex-1 space-y-3 overflow-hidden px-4 py-4">
          {audit.map((a, i) => (
            <li key={i} className="flex gap-3">
              {a.h ? <Avatar name={a.who} hue={a.h} size={26} /> : <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-surface-2 ring-1 ring-line"><LireonsMark size={12} /></span>}
              <div className="min-w-0 leading-tight">
                <p className="text-[12.5px]"><span className="font-medium">{a.who}</span></p>
                <p className="mt-0.5 text-[12px] text-ink-2">{a.what}</p>
                <p className="mt-1 font-mono text-[10.5px] text-ink-3">{a.t} · {a.where}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="border-t border-line p-4 text-[11.5px] text-ink-3">Every view and change is logged with the person, time and product. Names and figures are illustrative.</div>
      </aside>
    </LireonsShell>
  );
}

/* --------------------------------------------------------------- security */

const log = [
  ["11:42:09", "System", 0, "receipt.sent", "Course receipt #A-2207 → Aarav Mehta", "Email"],
  ["11:20:37", "Anjali Deshpande", 60, "result.published", "Physics Mock 7, 62 candidates", "103.21.x.x · Chrome"],
  ["11:19:03", "Anjali Deshpande", 60, "flag.cleared", "Aisha Khan, second face, note added", "103.21.x.x · Chrome"],
  ["10:58:44", "Imran Shaikh", 140, "role.changed", "Kavita Joshi: Teacher → Course author", "49.36.x.x · Safari"],
  ["10:12:51", "Meera Joshi", 330, "progress.viewed", "Course progress, JEE Physics batches", "103.21.x.x · Edge"],
  ["09:47:20", "Imran Shaikh", 140, "export.created", "Physics Mock 7 results, Class 10 (CSV)", "49.36.x.x · Safari"],
  ["09:31:02", "System", 0, "reminder.batch", "412 live class reminders queued for 6:50 PM", "Scheduler"],
  ["08:42:16", "Neha Kulkarni", 258, "lesson.published", "JEE Physics 3.4, Projectile on an incline", "Chrome · Windows"],
  ["08:31:16", "System", 0, "recording.ready", "Live class, Laws of motion part 2, 90 min", "Media pipeline"],
  ["02:00:11", "System", 0, "backup.completed", "Encrypted snapshot, 18.4 GB, verified", "Mumbai region"],
  ["Sun 21:30", "Rahul Kulkarni", 200, "ai.answer.approved", "Doubt from Aarav Mehta, Quadratics", "Teacher app · iOS"],
  ["Sun 20:04", "System", 0, "signin.blocked", "5 failed attempts, account locked 15 min", "106.77.x.x"],
  ["Sun 19:48", "Rahul Kulkarni", 200, "test.scheduled", "Chemistry Mock 7, Wed 10:00 AM, proctored", "Teacher app · iOS"],
  ["Sun 18:30", "System", 0, "payout.settled", "Course sales for the week, ₹1,84,300", "Payments"],
  ["Sun 17:12", "Imran Shaikh", 140, "policy.updated", "Two-step sign-in required for all staff", "49.36.x.x · Safari"],
] as const;

export function SecurityAdmin() {
  return (
    <LireonsShell active="Settings" crumbs={["Settings", "Security"]} user={{ name: "Imran Shaikh", role: "Administrator", hue: 140 }}>
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden px-7 py-6">
        <div className="flex items-end gap-4">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.025em]">Security</h1>
            <p className="mt-1 text-[13px] text-ink-3">Brightpath School · data stored in India (Mumbai) · 48 staff accounts</p>
          </div>
          <div className="ml-auto flex gap-2"><Btn icon={Download}>Export audit log</Btn><Btn variant="primary" icon={KeyRound}>Access policies</Btn></div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[[ShieldCheck, "Two-step sign-in", "48 of 48 staff", "ok"], [Database, "Last backup", "2:00 AM, verified", "ok"], [RotateCcw, "Restore drill", "Passed 14 Oct, 11 min", "ok"], [Lock, "Encryption", "At rest and in transit", "ok"]].map(([I, k, v]) => {
            const Icon = I as LucideIcon;
            return (
              <div key={k as string} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 shadow-1">
                <span className="grid size-9 place-items-center rounded-lg bg-ok-soft text-ok"><Icon className="size-[18px]" strokeWidth={1.8} /></span>
                <div className="leading-tight"><p className="text-[12px] text-ink-3">{k as string}</p><p className="mt-0.5 text-[13.5px] font-semibold">{v as string}</p></div>
              </div>
            );
          })}
        </div>
        <Card title="Audit log" icon={ScrollText} sub="Append-only · 1,92,418 events this year" action={<><Seg items={["All", "People", "System"]} active={0} className="h-7" /><Btn size="sm" icon={Filter}>All products</Btn></>} className="min-h-0 flex-1">
          <table className="w-full text-[12.5px]">
            <thead><tr className="h-9 border-b border-line text-left text-[11.5px] text-ink-3"><th className="pl-4 font-medium">Time</th><th className="font-medium">Actor</th><th className="font-medium">Event</th><th className="font-medium">Target</th><th className="pr-4 font-medium">Source</th></tr></thead>
            <tbody className="divide-y divide-line">
              {log.map(([t, who, h, ev, tgt, src]) => (
                <tr key={t} className={cn("h-[37px]", ev === "role.changed" && "bg-warn-soft/50")}>
                  <td className="whitespace-nowrap pl-4 font-mono text-[11.5px] text-ink-3">{t}</td>
                  <td><span className="flex items-center gap-2">{h ? <Avatar name={who} hue={h} size={20} /> : <span className="grid size-5 place-items-center rounded-full bg-surface-2 ring-1 ring-line"><LireonsMark size={10} /></span>}<span className="font-medium">{who}</span></span></td>
                  <td><span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11px]">{ev}</span></td>
                  <td className="max-w-[320px] truncate text-ink-2">{tgt}</td>
                  <td className="pr-4 text-[12px] text-ink-3">{src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <aside className="flex w-[360px] shrink-0 flex-col gap-4 overflow-hidden border-l border-line bg-surface-2/50 p-4">
        <Card title="Backups" icon={HardDrive} action={<Badge tone="ok" dot>Healthy</Badge>}>
          <div className="p-4">
            <div className="flex h-10 items-end gap-[3px]">{Array.from({ length: 30 }, (_, i) => <span key={i} className="flex-1 rounded-[2px] bg-ok" style={{ height: `${55 + ((i * 37) % 45)}%`, opacity: i === 29 ? 1 : 0.55 }} />)}</div>
            <p className="mt-1 flex justify-between text-[11px] text-ink-3"><span>20 Sep</span><span>Nightly, 30 of 30 verified</span><span>Today</span></p>
            <dl className="mt-3 space-y-1.5 text-[12px]">
              {[["Point-in-time restore", "Any minute, last 7 days"], ["Retention", "35 days"], ["Region", "India (Mumbai), second copy Hyderabad"]].map(([k, v]) => <div key={k} className="flex justify-between gap-3"><dt className="shrink-0 text-ink-3">{k}</dt><dd className="truncate text-right font-medium">{v}</dd></div>)}
            </dl>
          </div>
        </Card>
        <Card title="Active sessions" icon={Globe} action={<span className="text-[12px] text-ink-3">12 now</span>}>
          <ul className="divide-y divide-line">
            {[[LaptopMinimal, "Imran Shaikh", "Safari on macOS · Pune", "This device"], [LaptopMinimal, "Meera Joshi", "Edge on Windows · Pune", "4 min ago"], [Smartphone, "Rahul Kulkarni", "Teacher app · iOS", "12 min ago"], [LaptopMinimal, "Neha Kulkarni", "Live studio · Chrome", "Live"]].map(([I, n, d, t]) => {
              const Icon = I as LucideIcon;
              return (
                <li key={n as string} className="flex items-center gap-3 px-4 py-2.5">
                  <Icon className="size-4 text-ink-3" />
                  <div className="min-w-0 flex-1 leading-tight"><p className="text-[12.5px] font-medium">{n as string}</p><p className="truncate text-[11.5px] text-ink-3">{d as string} · {t as string}</p></div>
                  {t !== "This device" && <span className="flex h-7 items-center gap-1 rounded-md px-1.5 text-[11.5px] text-ink-2"><LogOut className="size-3.5" />Sign out</span>}
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title="Delete a learner's data" icon={Trash2}>
          <div className="p-4">
            <p className="text-[12px] leading-snug text-ink-2">Removes the record from every product after the 30-day hold. Course receipts stay for tax law. Type the learner&rsquo;s full name to confirm.</p>
            <div className="mt-2.5 flex h-9 items-center rounded-[8px] border border-signal/60 bg-surface px-2.5 text-[12.5px] ring-2 ring-signal/15">Rohan Kapo<span className="ml-px h-4 w-px bg-ink" /></div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[11.5px] text-ink-3">Matches &ldquo;Rohan Kapoor&rdquo; only when complete</span>
              <span className="ml-auto flex h-8 shrink-0 items-center whitespace-nowrap rounded-[8px] bg-surface-2 px-3 text-[12.5px] font-medium text-ink-3">Delete data</span>
            </div>
          </div>
        </Card>
      </aside>
    </LireonsShell>
  );
}

