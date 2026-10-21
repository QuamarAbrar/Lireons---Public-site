import {
  ArrowLeft, Award, Bell, BookOpen, Camera, Check, ChevronRight, CirclePlay, ClipboardCheck, ClipboardList, Clock, Download, Home, Maximize, MessageCircleQuestion,
  Mic, MonitorUp, MoreVertical, Pause, Radio, Receipt, ScanFace, Send, Share2, ShieldCheck, Tag, UserRound, Video, Wifi, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, Badge, Monogram, Progress, Spark, StatusBar, inr, pc } from "./kit";
import { Lecture, NotebookPhoto, Webcam, people } from "./art";
import { Orb } from "./ai";
import { cn } from "@/lib/cn";

function Screen({ children, time, className }: { children: React.ReactNode; time?: string; className?: string }) {
  return (
    <div className={cn("relative flex h-full w-full flex-col overflow-hidden bg-paper text-ink", className)}>
      <StatusBar time={time} />
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center"><span className="h-[5px] w-[134px] rounded-full bg-ink/85" /></div>
    </div>
  );
}

function TabBar({ items, active, color }: { items: [LucideIcon, string][]; active: number; color: string }) {
  return (
    <nav className="mt-auto grid shrink-0 border-t border-line bg-surface pb-6 pt-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map(([I, l], i) => (
        <span key={l} className={cn("flex flex-col items-center gap-1 text-[10.5px] font-medium", i === active ? "text-ink" : "text-ink-3")}>
          <I className="size-[22px]" strokeWidth={i === active ? 2.1 : 1.7} style={i === active ? { color } : undefined} />{l}
        </span>
      ))}
    </nav>
  );
}

const learnerTabs: [LucideIcon, string][] = [[Home, "Home"], [BookOpen, "Courses"], [Radio, "Live"], [ClipboardCheck, "Tests"], [MessageCircleQuestion, "Doubts"]];

/* 1. learner app home (id phone-parent-home kept for existing links) */
export function PhoneParentHome() {
  return (
    <Screen time="12:05">
      <div className="flex items-center gap-2.5 px-5 pb-3 pt-1">
        <Monogram text="BS" hue={152} size={30} />
        <span className="text-[15px] font-semibold tracking-[-0.01em]">Brightpath School</span>
        <span className="relative ml-auto grid size-9 place-items-center rounded-full bg-surface ring-1 ring-line"><Bell className="size-[18px]" /><span className="absolute right-2 top-2 size-2 rounded-full bg-signal ring-2 ring-surface" /></span>
      </div>
      <div className="flex-1 space-y-2.5 overflow-hidden px-4">
        <div className="px-1">
          <p className="text-[13px] text-ink-3">Monday, 19 October</p>
          <p className="text-[21px] font-semibold leading-tight tracking-[-0.025em]">Good afternoon, Aarav</p>
        </div>
        <div className="rounded-2xl bg-surface p-3.5 shadow-1 ring-1 ring-line">
          <div className="flex items-center justify-between"><p className="text-[13px] text-ink-3">Continue learning</p><span className="text-[12px] font-semibold num">58%</span></div>
          <p className="mt-0.5 text-[16px] font-semibold leading-tight">JEE Physics, full year</p>
          <Progress value={0.58} color={pc.academy} className="mt-2 h-2" />
          <div className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-surface-2 px-3 py-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-academy text-white dark:text-[oklch(0.16_0.02_262)]"><CirclePlay className="size-4" /></span>
            <div className="min-w-0 leading-tight"><p className="truncate text-[13px] font-medium">Friction on an incline</p><p className="text-[11.5px] text-ink-3">Lesson 4.6 · resume at 06:34</p></div>
            <ChevronRight className="ml-auto size-4 text-ink-3" />
          </div>
        </div>
        <div className="rounded-2xl bg-academy-soft p-3.5 ring-1 ring-academy/25">
          <div className="flex items-center gap-2 text-[12px] font-medium text-academy">
            <span className="relative inline-flex size-2"><span className="absolute inset-0 rounded-full bg-signal opacity-40" /><span className="relative size-2 rounded-full bg-signal" /></span>
            Next live class · today 7:00 PM
          </div>
          <p className="mt-1.5 text-[16px] font-semibold leading-tight">Doubt session: projectiles</p>
          <div className="mt-2 flex items-center gap-2 text-[12px] text-ink-2"><Avatar name="Neha Kulkarni" hue={258} size={22} />Neha Kulkarni · 90 min</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <span className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-surface text-[13px] font-medium ring-1 ring-line"><Bell className="size-4" />Remind me</span>
            <span className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-surface text-[13px] font-medium ring-1 ring-line"><MessageCircleQuestion className="size-4" />Ask ahead</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-1 ring-1 ring-line">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-assess-soft text-[oklch(0.45_0.11_58)] dark:text-assess"><ClipboardCheck className="size-5" /></span>
          <div className="min-w-0 leading-tight"><p className="text-[12px] text-ink-3">Upcoming test · proctored</p><p className="text-[14px] font-semibold">Chemistry Mock 7</p><p className="text-[12px] text-ink-3">Wed 21 Oct, 10:00 AM · 90 min</p></div>
          <span className="ml-auto shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-[12px] font-medium ring-1 ring-line">Device check</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-1 ring-1 ring-line">
          <Orb size={36} />
          <div className="min-w-0 leading-tight"><p className="flex items-center gap-1.5 text-[12px] text-ink-3">Recent doubt <Badge tone="ai" className="h-[18px] px-1 text-[10px]">Preview</Badge></p><p className="truncate text-[14px] font-semibold">Roots of 2x² − 7x + 3</p><p className="truncate text-[12px] text-ink-3">Answered from Ch 4, Lesson 3, 06:12</p></div>
          <ChevronRight className="ml-auto size-4 shrink-0 text-ink-3" />
        </div>
      </div>
      <TabBar items={learnerTabs} active={0} color={pc.academy} />
    </Screen>
  );
}

/* 2. mock test result */
export function PhoneStudentResults() {
  const sections: [string, number, number][] = [["MCQ", 96, 120], ["Numerical", 18, 20], ["Written", 14, 20]];
  const chapters: [string, number][] = [["Kinematics", 0.92], ["Laws of motion", 0.84], ["Friction", 0.5], ["Work and energy", 0.78]];
  return (
    <Screen time="11:24">
      <div className="flex items-center gap-3 px-4 pb-2 pt-1">
        <ArrowLeft className="size-5" />
        <div className="leading-tight"><p className="text-[16px] font-semibold">Physics Mock 7</p><p className="text-[12px] text-ink-3">Result · reviewed by A. Deshpande</p></div>
        <Share2 className="ml-auto size-5 text-ink-2" />
      </div>
      <div className="flex-1 space-y-2.5 overflow-hidden px-4 pt-1">
        <div className="rounded-2xl bg-surface p-4 shadow-1 ring-1 ring-line">
          <div className="flex items-end justify-between">
            <div><p className="text-[12.5px] text-ink-3">Your score</p><p className="text-[40px] font-semibold leading-none tracking-[-0.04em] num">128<span className="text-[17px] font-normal text-ink-3"> / 160</span></p></div>
            <div className="text-right"><Spark data={[96, 104, 110, 117, 128]} w={96} h={34} color={pc.assess} dots /><p className="mt-1 text-[11.5px] text-ok">+11 on Mock 6</p></div>
          </div>
          <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
            {[["Batch rank", "6", "of 41"], ["Percentile", "87.8", "in batch"], ["Time", "82", "of 90 min"]].map(([k, v, u]) => (
              <div key={k} className="rounded-xl bg-surface-2 px-2 py-2 leading-tight"><p className="text-[11px] text-ink-3">{k}</p><p className="mt-0.5 text-[18px] font-semibold num">{v}</p><p className="text-[11px] text-ink-3">{u}</p></div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-surface p-4 shadow-1 ring-1 ring-line">
          <p className="text-[14px] font-semibold">Sections</p>
          <ul className="mt-2.5 space-y-3">
            {sections.map(([k, v, of]) => (
              <li key={k}>
                <div className="flex justify-between text-[13px]"><span className="text-ink-2">{k}</span><span className="font-semibold num">{v}<span className="font-normal text-ink-3"> / {of}</span></span></div>
                <Progress value={v / of} color={pc.assess} className="mt-1.5 h-2" />
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-surface p-4 shadow-1 ring-1 ring-line">
          <div className="flex items-center justify-between"><p className="text-[14px] font-semibold">By chapter</p><span className="text-[12px] text-ink-3">accuracy</span></div>
          <ul className="mt-2 space-y-2">
            {chapters.map(([k, v]) => (
              <li key={k} className="flex items-center gap-3 text-[13px]">
                <span className="w-[120px] shrink-0 truncate">{k}</span>
                <Progress value={v} color={v < 0.6 ? "var(--warn)" : "var(--ok)"} className="h-1.5 flex-1" />
                <span className="w-9 text-right font-medium num">{Math.round(v * 100)}%</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-warn-soft px-3 py-2.5">
            <ClipboardList className="size-4 shrink-0 text-[oklch(0.45_0.1_60)] dark:text-warn" />
            <p className="text-[12.5px] leading-snug">Friction is your weakest chapter. <span className="font-semibold">DPP 4</span> has 10 questions on it.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-1 text-[12px] text-ink-3"><ShieldCheck className="size-4 text-ok" />No proctor flags in this attempt</div>
      </div>
      <div className="px-4 pb-9 pt-2">
        <span className="flex h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white dark:text-[oklch(0.16_0.02_262)]" style={{ background: pc.assess }}>See answers and solutions</span>
      </div>
    </Screen>
  );
}

/* 3. live class about to start */
export function PhoneLiveClass() {
  return (
    <Screen time="6:50">
      <div className="flex items-center gap-3 px-4 pb-2 pt-1">
        <ArrowLeft className="size-5" />
        <p className="text-[16px] font-semibold">Live class</p>
        <MoreVertical className="ml-auto size-5 text-ink-2" />
      </div>
      <div className="flex-1 overflow-hidden px-4 pt-1">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2">
          <Lecture id="lc" className="absolute inset-0 size-full opacity-60" />
          <div className="absolute inset-0 grid place-items-center bg-black/35 text-center text-white">
            <div>
              <p className="text-[12.5px] font-medium opacity-85">Starts in</p>
              <p className="text-[40px] font-semibold leading-none tracking-[-0.03em] num">09:42</p>
              <p className="mt-1.5 text-[12px] opacity-80">Waiting room opens at 6:55 PM</p>
            </div>
          </div>
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11.5px] font-medium text-white"><span className="size-1.5 rounded-full bg-signal" />Live today</span>
        </div>
        <p className="mt-3.5 text-[12px] text-ink-3">JEE Physics, full year · Batch A</p>
        <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.025em]">Doubt session: projectiles</h1>
        <div className="mt-2.5 flex items-center gap-2.5">
          <Avatar name="Neha Kulkarni" hue={258} size={32} />
          <div className="leading-tight"><p className="text-[14px] font-medium">Neha Kulkarni</p><p className="text-[12px] text-ink-3">Today 7:00 to 8:30 PM</p></div>
          <span className="ml-auto flex items-center -space-x-1.5">
            {[["Aman V", 140], ["Kriti J", 30], ["Dev N", 200]].map(([n, h]) => <Avatar key={n as string} name={n as string} hue={h as number} size={24} ring />)}
            <span className="pl-2.5 text-[12px] text-ink-3"><span className="num">412</span> joining</span>
          </span>
        </div>
        <ul className="mt-3.5 divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-1 ring-1 ring-line">
          {([[Video, "Camera off for learners", "You can turn it on to ask"], [Mic, "Raise a hand to speak", "The teacher unmutes you"], [MessageCircleQuestion, "2 questions sent ahead", "Projectile on an incline"], [Clock, "Recording after class", "In your course by 9:00 PM"]] as [LucideIcon, string, string][]).map(([I, k, v]) => (
            <li key={k} className="flex h-[52px] items-center gap-3 px-3.5">
              <span className="grid size-8 place-items-center rounded-lg bg-academy-soft text-academy"><I className="size-4" /></span>
              <div className="leading-tight"><p className="text-[13.5px] font-medium">{k}</p><p className="text-[12px] text-ink-3">{v}</p></div>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-1 ring-1 ring-line">
          <Bell className="size-5 text-ink-2" />
          <p className="flex-1 text-[13.5px]">Remind me 5 min before</p>
          <span className="flex h-6 w-10 items-center rounded-full bg-academy p-0.5"><span className="ml-auto size-5 rounded-full bg-white shadow-1" /></span>
        </div>
      </div>
      <div className="px-4 pb-9 pt-3">
        <span className="flex h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white dark:text-[oklch(0.16_0.02_262)]" style={{ background: pc.academy }}><Radio className="size-5" />Join class</span>
        <p className="mt-2 text-center text-[11.5px] text-ink-3">Opens at 6:55 PM · works on mobile data</p>
      </div>
    </Screen>
  );
}

/* 4. course bought */
export function PhoneCoursePurchase() {
  return (
    <Screen time="11:42">
      <div className="flex items-center px-4 pb-2 pt-1"><X className="size-6" /><p className="mx-auto text-[15px] font-semibold">Payment</p><Share2 className="size-5" /></div>
      <div className="flex flex-1 flex-col overflow-hidden px-4">
        <div className="flex flex-col items-center pt-4 text-center">
          <span className="relative grid size-[80px] place-items-center rounded-full bg-academy-soft">
            <span className="absolute inset-2 rounded-full bg-academy/20" />
            <span className="relative grid size-14 place-items-center rounded-full bg-academy text-white shadow-2 dark:text-[oklch(0.16_0.02_262)]"><Check className="size-8" strokeWidth={3} /></span>
          </span>
          <p className="mt-3.5 text-[34px] font-semibold tracking-[-0.035em] num">{inr(4999)}</p>
          <p className="text-[15px] font-medium">Paid to BrightPath Academy</p>
          <p className="mt-0.5 text-[13px] text-ink-3">Monday 19 Oct, 11:42 AM · UPI</p>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-1 ring-1 ring-line">
          <div className="relative h-[54px] w-[86px] shrink-0 overflow-hidden rounded-lg bg-black"><Lecture id="cp" className="absolute inset-0 size-full" /></div>
          <div className="min-w-0 leading-tight"><p className="truncate text-[14px] font-semibold">JEE Maths crash course</p><p className="text-[12px] text-ink-3">Rahul Kulkarni · 6 weeks</p><p className="text-[12px] text-ink-3">48 lessons · 12 live classes</p></div>
        </div>
        <div className="mt-2.5 rounded-2xl bg-surface p-4 shadow-1 ring-1 ring-line">
          <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-[14px] font-semibold"><Receipt className="size-4 text-academy" />Receipt #A-2207</p><Badge tone="ok">Emailed</Badge></div>
          <dl className="mt-3 space-y-2 text-[13px]">
            {[["Course price", inr(5499)], ["Coupon EARLY500", `−${inr(500)}`], ["Paid", inr(4999)], ["UPI reference", "UTR 6281•••0934"], ["Access", "Till 31 Mar 2027"]].map(([k, v]) => (
              <div key={k} className={cn("flex justify-between", k === "Paid" && "border-t border-line pt-2 font-semibold")}><dt className={k === "Paid" ? "" : "text-ink-3"}>{k === "Coupon EARLY500" ? <span className="flex items-center gap-1.5"><Tag className="size-3.5" />{k}</span> : k}</dt><dd className={cn("font-medium", k === "UPI reference" && "font-mono text-[12px]", k.startsWith("Coupon") && "text-ok")}>{v}</dd></div>
            ))}
          </dl>
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <span className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-surface-2 text-[13.5px] font-medium ring-1 ring-line"><Download className="size-4" />Receipt PDF</span>
            <span className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-surface-2 text-[13.5px] font-medium ring-1 ring-line"><Award className="size-4" />Certificate info</span>
          </div>
        </div>
        <p className="mt-3 text-center text-[11.5px] text-ink-3">GST included · first live class Wed 21 Oct, 7:00 PM</p>
      </div>
      <div className="px-4 pb-9 pt-2">
        <span className="flex h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white dark:text-[oklch(0.16_0.02_262)]" style={{ background: pc.academy }}><CirclePlay className="size-5" />Start Lesson 1: Limits</span>
      </div>
    </Screen>
  );
}
/* 5. student lesson player */
export function PhoneStudentLesson() {
  const marks = [["00:00", "Set-up", true], ["02:40", "Forces on the block", true], ["06:10", "Limiting friction", "now"], ["09:30", "Sliding or not", false], ["12:20", "Summary", false]] as const;
  return (
    <Screen time="10:05">
      <div className="flex items-center gap-2.5 px-4 pb-2.5 pt-1">
        <ArrowLeft className="size-5" />
        <Monogram text="BP" hue={258} size={26} />
        <span className="text-[14px] font-semibold">BrightPath Academy</span>
        <MoreVertical className="ml-auto size-5 text-ink-2" />
      </div>
      <div className="relative aspect-video w-full bg-black">
        <Lecture id="ph" topic="friction" className="absolute inset-0 size-full" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-8 text-white">
          <div className="relative h-1 rounded-full bg-white/30"><span className="absolute inset-y-0 left-0 w-[47%] rounded-full bg-[oklch(0.72_0.13_258)]" /><span className="absolute left-[47%] top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" /></div>
          <div className="mt-1.5 flex items-center gap-3 text-[11.5px]"><Pause className="size-4" fill="currentColor" /><span className="num">06:34 / 14:02</span><span className="ml-auto">1.25x</span><Maximize className="size-4" /></div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden px-4 pt-3">
        <p className="text-[12px] text-ink-3">Laws of motion · Lesson 4.6</p>
        <h1 className="text-[21px] font-semibold leading-tight tracking-[-0.025em]">Friction on an incline</h1>
        <div className="mt-2.5 flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-1 ring-1 ring-line">
          <div className="flex-1">
            <div className="flex justify-between text-[12px]"><span className="text-ink-3">JEE Physics, full year</span><span className="font-semibold num">58%</span></div>
            <Progress value={0.58} color={pc.academy} className="mt-1.5 h-2" />
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-academy-soft text-academy"><Download className="size-4" /></span>
        </div>
        <div className="mt-3 flex gap-5 border-b border-line text-[13.5px] font-medium">
          {["Chapters", "Notes 2", "Doubts", "Files"].map((t, i) => <span key={t} className={cn("-mb-px border-b-2 pb-2", i === 0 ? "border-ink" : "border-transparent text-ink-3")}>{t}</span>)}
        </div>
        <ul className="mt-1">
          {marks.map(([t, l, st]) => (
            <li key={t} className={cn("flex h-10 items-center gap-3 rounded-lg px-2", st === "now" && "bg-academy-soft")}>
              <span className={cn("grid size-5 place-items-center rounded-full", st === true ? "bg-ok text-white dark:text-[oklch(0.16_0.02_262)]" : st === "now" ? "bg-academy text-white dark:text-[oklch(0.16_0.02_262)]" : "ring-2 ring-line-2")}>{st === true ? <Check className="size-3" strokeWidth={3.5} /> : st === "now" ? <CirclePlay className="size-3.5" /> : null}</span>
              <span className={cn("flex-1 text-[14px]", st === "now" ? "font-semibold" : st ? "text-ink-2" : "")}>{l}</span>
              <span className="font-mono text-[11.5px] text-ink-3">{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-1 ring-1 ring-line">
          <span className="grid size-10 place-items-center rounded-xl bg-academy-soft text-academy"><ClipboardList className="size-5" /></span>
          <div className="leading-tight"><p className="text-[13.5px] font-medium">Up next: DPP 4, friction</p><p className="text-[12px] text-ink-3">10 questions · about 25 min</p></div>
          <ChevronRight className="ml-auto size-4 text-ink-3" />
        </div>
      </div>
      <TabBar items={[[Home, "Home"], [BookOpen, "Courses"], [CirclePlay, "Live"], [ClipboardList, "Practice"], [UserRound, "Me"]]} active={1} color={pc.academy} />
    </Screen>
  );
}

/* 6. candidate device check */
export function PhoneCandidateCheck() {
  const checks: [LucideIcon, string, string][] = [
    [Camera, "Camera", "Face detected, good light"],
    [Mic, "Microphone", "Room is quiet"],
    [MonitorUp, "Screen share", "Entire screen shared"],
    [Wifi, "Internet", "42 Mbps, stable"],
    [ShieldCheck, "Locked browser", "Other apps closed"],
    [ScanFace, "ID match", "Matches your school photo"],
  ];
  return (
    <Screen time="9:45">
      <div className="flex items-center gap-3 px-4 pb-2 pt-1">
        <ArrowLeft className="size-5" />
        <div className="leading-tight"><p className="text-[16px] font-semibold">Physics Mock 8</p><p className="text-[12px] text-ink-3">Brightpath School · Class 10 · 90 min</p></div>
        <span className="ml-auto rounded-full bg-assess-soft px-2.5 py-1 text-[12px] font-semibold text-[oklch(0.45_0.11_58)] dark:text-assess num">Starts in 14:32</span>
      </div>
      <div className="flex-1 overflow-hidden px-4 pt-2">
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-black shadow-2">
          <Webcam p={people[3]} id="cc" className="absolute inset-0 size-full" />
          <span className="absolute rounded-[28px] border-[2.5px] border-dashed border-white/85" style={{ left: "33%", top: "10%", width: "34%", height: "66%" }} />
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[12px] font-medium text-white"><Check className="size-3.5 text-[oklch(0.8_0.15_155)]" strokeWidth={3} />Face in frame</span>
          <span className="absolute right-3 top-3 flex h-7 items-end gap-[3px] rounded-full bg-black/60 px-2.5 pb-1.5 pt-1.5">{[0.4, 0.7, 1, 0.6, 0.3].map((h, i) => <span key={i} className="w-[3px] rounded-full bg-white" style={{ height: `${h * 14}px` }} />)}</span>
        </div>
        <p className="mt-3.5 text-[15px] font-semibold">System check</p>
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-1 ring-1 ring-line">
          {checks.map(([I, k, v]) => (
            <li key={k} className="flex h-[50px] items-center gap-3 px-3.5">
              <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-ink-2"><I className="size-4" /></span>
              <div className="min-w-0 flex-1 leading-tight"><p className="text-[14px] font-medium">{k}</p><p className="text-[12px] text-ink-3">{v}</p></div>
              <span className="grid size-6 place-items-center rounded-full bg-ok text-white dark:text-[oklch(0.16_0.02_262)]"><Check className="size-3.5" strokeWidth={3} /></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 pb-9 pt-3">
        <span className="flex h-12 items-center justify-center rounded-xl text-[15px] font-semibold text-white dark:text-[oklch(0.16_0.02_262)]" style={{ background: pc.assess }}>Enter waiting room</span>
        <p className="mt-2 text-center text-[11.5px] text-ink-3">Opens at 10:00 AM · a teacher reviews every AI flag</p>
      </div>
    </Screen>
  );
}

/* 7. student doubt chat */
export function PhoneStudentDoubt() {
  return (
    <Screen time="9:16">
      <div className="flex items-center gap-2.5 border-b border-line px-4 pb-2.5 pt-1">
        <ArrowLeft className="size-5" />
        <Orb size={30} />
        <div className="leading-tight"><p className="flex items-center gap-1.5 text-[15px] font-semibold">Doubt Solver <Badge tone="ai" className="h-[18px] px-1.5 text-[10.5px]">Preview</Badge></p><p className="text-[11.5px] text-ink-3">Answers from Brightpath lessons and notes</p></div>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden px-3.5 pt-3">
        <div className="flex justify-end">
          <div className="w-[230px] overflow-hidden rounded-2xl rounded-br-md bg-surface shadow-1 ring-1 ring-line">
            <div className="relative aspect-[4/2.5]"><NotebookPhoto id="pd" className="absolute inset-0 size-full" /></div>
            <p className="px-3 py-2 text-[13.5px] leading-snug">I got 6 and 1. The book says 3 and 1/2?</p>
          </div>
        </div>
        <div className="rounded-2xl rounded-tl-md bg-surface p-3 shadow-1 ring-1 ring-line">
          <div className="flex items-center gap-2 rounded-xl bg-ai-soft px-2.5 py-2">
            <CirclePlay className="size-4 shrink-0 text-ai" />
            <p className="text-[12.5px] font-semibold">Ch 4 Quadratics, Lesson 3, 06:12</p>
          </div>
          <ol className="mt-2.5 space-y-2 text-[13.5px] leading-snug">
            {[<>D = 49 − 24 = 25. <span className="text-ok">This part is right.</span></>, <>x = (7 ± 5) / <b>2a</b>, and 2a = 4, not 2.</>, <>So x = <b>3</b> or x = <b>1/2</b>. Real, distinct, rational.</>].map((t, i) => (
              <li key={i} className="flex gap-2.5"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold ring-1 ring-line">{i + 1}</span><span className="text-ink-2">{t}</span></li>
            ))}
          </ol>
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-2.5">
            <span className="text-[11.5px] text-ink-3">Confidence</span>
            <div className="flex flex-1 gap-[2px]">{Array.from({ length: 10 }, (_, i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < 9 ? "bg-ok" : "bg-inset")} />)}</div>
            <span className="text-[11.5px] font-semibold text-ok num">0.93</span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <span className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-surface-2 text-[12.5px] font-medium ring-1 ring-line"><CirclePlay className="size-3.5" />Watch 06:12</span>
            <span className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-surface-2 text-[12.5px] font-medium ring-1 ring-line"><UserRound className="size-3.5" />Ask Mr. Kulkarni</span>
          </div>
        </div>
        <div className="flex justify-end"><div className="rounded-2xl rounded-br-md bg-inverse px-3.5 py-2 text-[13.5px] text-on-inverse">And if D is negative?</div></div>
        <div className="flex items-center gap-3">
          <span className="relative grid size-11 place-items-center">
            <span className="absolute inset-0 rounded-full bg-ai/15" />
            <span className="absolute inset-1.5 rounded-full bg-ai/20" />
            <Orb size={24} />
          </span>
          <div className="flex-1 rounded-2xl rounded-tl-md bg-surface px-3 py-2.5 shadow-1 ring-1 ring-line">
            <p className="text-[12.5px] text-ink-2">Finding it in your notes, p. 42</p>
            <div className="mt-2 space-y-1.5"><span className="skeleton block h-2 w-[90%] rounded-full" /><span className="skeleton block h-2 w-[64%] rounded-full" /></div>
          </div>
        </div>
      </div>
      <div className="px-3 pb-8 pt-2">
        <div className="flex h-11 items-center gap-2.5 rounded-full bg-surface px-3 shadow-2 ring-1 ring-line">
          <Camera className="size-5 text-ink-3" /><span className="text-[14px] text-ink-3">Ask or photograph a problem</span>
          <span className="ml-auto grid size-8 place-items-center rounded-full bg-ai text-white dark:text-[oklch(0.16_0.02_262)]"><Send className="size-4" /></span>
        </div>
      </div>
    </Screen>
  );
}

