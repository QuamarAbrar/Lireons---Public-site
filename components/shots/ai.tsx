import {
  BookOpen, CalendarDays, Camera, Check, ChevronRight, CirclePlay, ClipboardList, FileText, GraduationCap, Inbox, LayoutGrid, MessageCircleQuestion, Paperclip, Send,
  ThumbsDown, ThumbsUp, UserRound, BarChart3, ShieldCheck, Pencil, ArrowUpRight, Settings, Clock,
} from "lucide-react";
import { AppShell, Avatar, Badge, Btn, Card, Seg, Stat, pc, school, type NavGroup } from "./kit";
import { NotebookPhoto } from "./art";
import { cn } from "@/lib/cn";

/** The AI working mark: a soft, static orb in the AI hue. Not a sparkle. */
export function Orb({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 34% 30%, color-mix(in oklch, var(--p-ai) 25%, white) 0%, var(--p-ai) 55%, color-mix(in oklch, var(--p-ai) 70%, black) 100%)",
        boxShadow: "inset 0 -2px 4px oklch(0 0 0 / 0.2), 0 0 0 3px var(--p-ai-soft)",
      }}
    />
  );
}

export function Board({ className, small }: { className?: string; small?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden bg-[#22352d] font-medium italic text-[#eef0e6]", className)}>
      {!small && <div className="absolute left-3 top-2 whitespace-nowrap text-[12px]">Quadratic formula</div>}
      <div className={cn("absolute inset-0 grid place-items-center whitespace-nowrap", small ? "text-[10px]" : "text-[17px]")}>x = (−b ± √D)/2a</div>
      <div className={cn("absolute whitespace-nowrap", small ? "bottom-1 right-1.5 text-[8px] opacity-70" : "bottom-2 right-3 text-[12px]")}>D = b² − 4ac</div>
      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20"><span className="block h-full w-[38%] bg-[oklch(0.72_0.12_295)]" /></span>
    </div>
  );
}

const studentNav: NavGroup[] = [
  { items: [{ icon: LayoutGrid, label: "Today" }, { icon: BookOpen, label: "My courses" }, { icon: CirclePlay, label: "Live classes" }, { icon: ClipboardList, label: "Practice", count: 3 }, { icon: GraduationCap, label: "Tests" }] },
  { title: "Help", items: [{ icon: MessageCircleQuestion, label: "Doubts", active: true, count: 2 }] },
  { items: [{ icon: Settings, label: "Settings" }] },
];

const history = [
  { q: "2x² − 7x + 3 = 0, I got 6 and 1", t: "9:14 PM", s: "Answered", cur: true },
  { q: "Why is sin(90° + θ) = cos θ?", t: "Yesterday", s: "Mr. Kulkarni replied" },
  { q: "Sum of first 20 terms of 7, 10, 13 ...", t: "Mon", s: "Answered" },
  { q: "Is 0.101001000... rational?", t: "Sun", s: "Answered" },
  { q: "Distance formula when both points are negative", t: "12 Oct", s: "Answered" },
  { q: "Section formula, internal vs external", t: "10 Oct", s: "Sent to Mr. Kulkarni" },
];

const steps = [
  { h: "Read the coefficients", b: <>Compare with ax² + bx + c = 0: a = 2, b = −7, c = 3.</> },
  { h: "Discriminant", b: <>D = b² − 4ac = 49 − 24 = 25. <span className="text-ok">Your working is right here.</span></> },
  { h: "Apply the formula", b: <>x = (−b ± √D) / 2a = (7 ± 5) / <b>4</b>. You divided by 2, but the formula divides by 2a = 4.</> },
  { h: "Roots and nature", b: <>x = 12/4 = <b>3</b> or x = 2/4 = <b>1/2</b>. D &gt; 0 and a perfect square, so the roots are real, distinct and rational.</> },
];

export function AiStudent() {
  return (
    <AppShell org={school} product="ai" nav={studentNav} crumbs={["Doubts", "Quadratic equations"]} preview user={{ name: "Aarav Mehta", role: "Class 10 B · Roll 14", hue: 30 }} search="Search lessons and doubts" contentClassName="flex">
      <div className="flex w-[300px] shrink-0 flex-col border-r border-line bg-surface">
        <div className="flex items-center justify-between p-4 pb-3">
          <p className="text-[15px] font-semibold">Your doubts</p>
          <Btn size="sm" variant="product" color={pc.ai} icon={Camera}>Ask</Btn>
        </div>
        <ul className="space-y-0.5 px-2">
          {history.map((h) => (
            <li key={h.q} className={cn("rounded-lg px-3 py-2.5", h.cur && "bg-ai-soft")}>
              <p className="truncate text-[13px] font-medium">{h.q}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-3">
                {h.s.includes("Kulkarni") ? <UserRound className="size-3" /> : <Check className="size-3" />}{h.s} · {h.t}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t border-line p-4 text-[12px] leading-snug text-ink-3">
          <p className="mb-1 font-medium text-ink">Preview</p>
          The Doubt Solver answers only from Brightpath lessons and notes, and sends anything it is unsure of to your teacher.
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-paper">
        <div className="min-h-0 flex-1 space-y-5 overflow-hidden px-10 pt-6">
          <div className="flex justify-end">
            <div className="max-w-[400px]">
              <div className="overflow-hidden rounded-2xl rounded-br-md border border-line bg-surface shadow-1">
                <div className="relative aspect-[4/2.3]"><NotebookPhoto id="ds" className="absolute inset-0 size-full" /></div>
                <p className="px-3.5 py-2.5 text-[13.5px]">I got x = 6 and 1 but the book says 3 and 1/2. Where did I go wrong?</p>
              </div>
              <p className="mt-1 text-right text-[11px] text-ink-3">9:14 PM</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Orb size={30} />
            <div className="min-w-0 max-w-[640px] flex-1">
              <p className="flex items-center gap-2 text-[12.5px]"><span className="font-semibold">Doubt Solver</span><span className="text-ink-3">read your photo · answered from your class material</span></p>
              <div className="mt-2 rounded-2xl rounded-tl-md border border-line bg-surface p-4 shadow-1">
                <div className="flex items-center gap-3 rounded-xl border border-ai/30 bg-ai-soft/60 p-2">
                  <Board small className="h-[46px] w-[78px] shrink-0 rounded-md" />
                  <div className="min-w-0 leading-tight">
                    <p className="text-[12.5px] font-semibold">Ch 4 Quadratics, Lesson 3, 06:12</p>
                    <p className="text-[11.5px] text-ink-3">Mr. Kulkarni · worked example 2 is this exact mistake</p>
                  </div>
                  <span className="ml-auto flex h-7 items-center gap-1 rounded-md bg-surface px-2 text-[12px] font-medium shadow-1"><CirclePlay className="size-3.5 text-ai" />Watch from 06:12</span>
                </div>
                <ol className="mt-3 space-y-2.5">
                  {steps.map((s, i) => (
                    <li key={s.h} className="flex gap-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 text-[11.5px] font-semibold ring-1 ring-line num">{i + 1}</span>
                      <div className="text-[13.5px] leading-snug"><p className="font-semibold">{s.h}</p><p className="mt-0.5 text-ink-2">{s.b}</p></div>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex items-center gap-4 border-t border-line pt-3">
                  <div className="w-[230px]">
                    <div className="mb-1 flex justify-between text-[11.5px]"><span className="text-ink-3">Confidence</span><span className="font-semibold text-ok">High · 0.93</span></div>
                    <div className="flex gap-[3px]">{Array.from({ length: 10 }, (_, i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < 9 ? "bg-ok" : "bg-inset")} />)}</div>
                  </div>
                  <span className="text-[11.5px] text-ink-3">Checked against Lesson 3 and notes p. 42</span>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <Btn size="sm" icon={Pencil}>Try a similar one</Btn>
                <Btn size="sm" icon={UserRound}>Ask Mr. Kulkarni</Btn>
                <span className="ml-auto flex items-center gap-1 text-ink-3"><Btn size="sm" variant="ghost" icon={ThumbsUp} /><Btn size="sm" variant="ghost" icon={ThumbsDown} /></span>
              </div>
            </div>
          </div>

        </div>
        <div className="px-10 pb-6 pt-3">
          <div className="flex h-12 items-center gap-3 rounded-xl border border-line-2/70 bg-surface px-3 shadow-2">
            <Camera className="size-[18px] text-ink-3" /><Paperclip className="size-[18px] text-ink-3" />
            <span className="text-[13.5px] text-ink-3">Type a doubt or photograph a problem</span>
            <span className="ml-auto grid size-8 place-items-center rounded-[8px] bg-ai text-white dark:text-[oklch(0.16_0.02_262)]"><Send className="size-4" /></span>
          </div>
        </div>
      </div>

      <div className="flex w-[320px] shrink-0 flex-col gap-4 overflow-hidden border-l border-line bg-surface-2/50 p-4">
        <Card title="Sources used" icon={FileText}>
          <ul className="divide-y divide-line">
            <li className="flex items-center gap-3 p-3">
              <Board small className="h-[44px] w-[72px] shrink-0 rounded-md" />
              <div className="min-w-0 leading-tight"><p className="text-[12.5px] font-medium">Lesson 3: the formula</p><p className="text-[11px] text-ink-3">Video · 06:12 to 08:40</p></div>
            </li>
            <li className="flex items-center gap-3 p-3">
              <span className="grid h-[44px] w-[72px] shrink-0 place-items-center rounded-md bg-surface-2 ring-1 ring-line"><FileText className="size-5 text-ai" /></span>
              <div className="min-w-0 leading-tight"><p className="text-[12.5px] font-medium">Class notes, Quadratics</p><p className="text-[11px] text-ink-3">Page 42 · nature of roots</p></div>
            </li>
            <li className="flex items-center gap-3 p-3">
              <span className="grid h-[44px] w-[72px] shrink-0 place-items-center rounded-md bg-surface-2 ring-1 ring-line"><ClipboardList className="size-5 text-ai" /></span>
              <div className="min-w-0 leading-tight"><p className="text-[12.5px] font-medium">DPP 4, Q2</p><p className="text-[11px] text-ink-3">Same pattern, for practice</p></div>
            </li>
          </ul>
        </Card>
        <Card title="Your teacher" icon={UserRound}>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name="Rahul Kulkarni" hue={200} size={36} />
              <div className="leading-tight"><p className="text-[13px] font-medium">Mr. Rahul Kulkarni</p><p className="text-[11.5px] text-ink-3">Maths, Class 10 · replies by 8 AM</p></div>
            </div>
            <p className="mt-3 text-[12px] leading-snug text-ink-2">When the Doubt Solver is below 0.70 confidence, your question goes to Mr. Kulkarni with your photo and working attached.</p>
          </div>
        </Card>
        <Card title="Classmates had the same doubt" icon={UserRound}>
          <div className="flex items-center gap-3 p-4">
            <div className="flex -space-x-1.5">{[["Ishita R", 200], ["Om K", 110], ["Diya I", 20], ["Sahil J", 160]].map(([n, h]) => <Avatar key={n as string} name={n as string} hue={h as number} size={24} ring />)}</div>
            <p className="text-[12px] leading-snug text-ink-2"><span className="font-medium text-ink num">26</span> students divided by 2 instead of 2a this week. Mr. Kulkarni is revising it on Thursday.</p>
          </div>
        </Card>
        <Card title="This week" icon={BarChart3}>
          <div className="grid grid-cols-2 gap-2 p-3">
            {[["9", "doubts asked"], ["2", "sent to teacher"], ["Quadratics", "most asked"], ["14 min", "saved per doubt"]].map(([v, l]) => (
              <div key={l} className="rounded-lg bg-surface px-3 py-2 leading-tight ring-1 ring-line"><p className="text-[14px] font-semibold">{v}</p><p className="text-[11px] text-ink-3">{l}</p></div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

/* -------------------------------------------------------------- teacher */

const teacherNav: NavGroup[] = [
  { items: [{ icon: LayoutGrid, label: "Today" }, { icon: CirclePlay, label: "Live classes" }, { icon: ClipboardList, label: "Practice sets" }, { icon: GraduationCap, label: "Test results" }] },
  { title: "AI Doubt Solver", items: [{ icon: BarChart3, label: "Doubt topics", active: true }, { icon: Inbox, label: "Sent to you", count: 11 }, { icon: ShieldCheck, label: "Spot checks", count: 6 }, { icon: BookOpen, label: "Source material" }] },
  { items: [{ icon: Settings, label: "Settings" }] },
];

const chaptersT = ["Real numbers", "Polynomials", "Linear equations", "Quadratics", "Arithmetic progressions", "Triangles", "Coordinate geometry", "Trigonometry"];
const heat = [
  [2, 1, 3, 1, 0, 1, 0],
  [3, 4, 2, 2, 1, 0, 1],
  [4, 3, 5, 3, 2, 1, 1],
  [9, 12, 14, 11, 16, 6, 4],
  [5, 6, 4, 7, 5, 2, 1],
  [2, 3, 3, 2, 4, 1, 0],
  [6, 5, 8, 7, 6, 3, 2],
  [7, 9, 6, 10, 8, 4, 3],
];

export function AiTeacher() {
  return (
    <AppShell org={school} product="ai" nav={teacherNav} crumbs={["AI Doubt Solver", "Doubt topics"]} preview user={{ name: "Rahul Kulkarni", role: "Maths, Class 10", hue: 200 }} search="Search doubts, students, chapters">
      <div className="flex h-full flex-col gap-5 px-7 pb-6 pt-6">
        <div className="flex items-end gap-4">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.025em]">This week&rsquo;s doubts</h1>
            <p className="mt-1 text-[13px] text-ink-3">Class 10, all sections · 13 to 19 Oct · from 187 students</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Seg items={["10 A", "10 B", "10 C", "All"]} active={3} />
            <Btn icon={CalendarDays}>This week</Btn>
            <Btn variant="product" color={pc.ai} icon={ArrowUpRight}>Plan a revision class</Btn>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Stat label="Doubts asked" value="241" foot="up 22% before the unit test" />
          <Stat label="Answered from your material" value="205" foot="85.1% · each with a cited source" />
          <Stat label="Sent to you" value="36" foot={<span className="flex items-center gap-1.5"><Badge tone="warn" dot>11 waiting</Badge>oldest 9 h</span>} />
          <Stat label="Average confidence" value="0.88" foot="hand-off below 0.70" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_420px] gap-4">
          <div className="flex min-h-0 flex-col gap-4">
            <Card title="Doubts by chapter and day" action={<div className="flex items-center gap-1.5 text-[11.5px] text-ink-3">Fewer {[0.12, 0.3, 0.5, 0.75, 1].map((o) => <span key={o} className="size-3 rounded-[3px] bg-ai" style={{ opacity: o }} />)} More</div>}>
              <div className="px-4 pb-4 pt-3">
                <div className="grid grid-cols-[170px_repeat(7,minmax(0,1fr))_56px] items-center gap-1.5 text-[12px]">
                  <span />
                  {["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"].map((d) => <span key={d} className="text-center text-[11px] text-ink-3">{d}</span>)}
                  <span className="text-right text-[11px] text-ink-3">Total</span>
                  {chaptersT.map((c, r) => (
                    <div key={c} className="contents">
                      <span className={cn("truncate", r === 3 ? "font-semibold" : "text-ink-2")}>{c}</span>
                      {heat[r].map((v, d) => (
                        <span key={d} className="relative grid h-[26px] place-items-center rounded-[5px] text-[11px] num" style={{ background: v ? `color-mix(in oklch, var(--p-ai) ${Math.min(100, 10 + v * 6)}%, var(--surface-2))` : "var(--surface-2)", color: v > 8 ? "white" : "var(--ink-2)" }}>
                          {v || ""}
                        </span>
                      ))}
                      <span className="text-right font-medium num">{heat[r].reduce((a, b) => a + b, 0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card title="What is confusing in Quadratics" sub="72 doubts" className="min-h-0 flex-1">
              <ul className="space-y-[11px] p-4">
                {[["Dividing by 2 instead of 2a", 26, "Lesson 3, 06:12"], ["Nature of roots from D", 14, "Notes p. 42"], ["Word problems: forming the equation", 12, "Lesson 5"], ["Completing the square", 8, "Lesson 2, 11:40"], ["Sign of b in the formula", 6, "Lesson 3, 04:05"], ["Roots from a factorised form", 4, "Lesson 1, 09:15"], ["Checking roots by substitution", 2, "Notes p. 44"]].map(([t, n, src]) => (
                  <li key={t as string} className="grid grid-cols-[minmax(0,1fr)_200px_120px] items-center gap-4 text-[12.5px]">
                    <span className="truncate font-medium">{t}</span>
                    <span className="flex items-center gap-2"><span className="h-2 rounded-full bg-ai" style={{ width: `${((n as number) / 26) * 150}px` }} /><span className="text-ink-3 num">{n}</span></span>
                    <span className="truncate text-right text-[11.5px] text-ink-3">{src}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <div className="flex min-h-0 flex-col gap-4">
            <Card title="Sent to you" icon={Inbox} action={<Badge tone="warn">11 waiting</Badge>}>
              <ul className="divide-y divide-line">
                {[["Ishita Rao", 200, "10 B", "Why is the angle of elevation measured from the horizontal?", 0.52, "9 h"], ["Kabir Singh", 140, "10 A", "Proof that √3 is irrational, my step 4", 0.61, "6 h"], ["Diya Iyer", 20, "10 B", "AP: which term is the first negative one?", 0.66, "2 h"]].map(([n, h, c, q, conf, age]) => (
                  <li key={n as string} className="flex gap-3 px-4 py-3">
                    <Avatar name={n as string} hue={h as number} size={28} />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="text-[12.5px]"><span className="font-medium">{n}</span> <span className="text-ink-3">{c} · {age} ago</span></p>
                      <p className="mt-0.5 truncate text-[12.5px] text-ink-2">{q}</p>
                      <p className="mt-1 flex items-center gap-2 text-[11px] text-ink-3"><Paperclip className="size-3" />Attempt attached · AI confidence <span className="font-medium text-[oklch(0.45_0.1_60)] dark:text-warn num">{(conf as number).toFixed(2)}</span></p>
                    </div>
                    <ChevronRight className="mt-2 size-4 text-ink-3" />
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Spot-check AI answers" icon={ShieldCheck} sub="6 sampled today" className="min-h-0 flex-1">
              <div className="p-4">
                <p className="text-[12px] text-ink-3">Aarav Mehta · 10 B · 9:14 PM</p>
                <p className="mt-1 text-[13px] font-medium">2x² − 7x + 3 = 0, I got 6 and 1</p>
                <div className="mt-2 rounded-lg bg-surface-2 p-3 text-[12px] leading-snug text-ink-2">
                  Pointed to the 2a in the denominator, roots 3 and 1/2. Cited <span className="font-medium text-ink">Ch 4 Quadratics, Lesson 3, 06:12</span>. Confidence 0.93.
                </div>
                <div className="mt-3 flex gap-2">
                  <Btn size="sm" icon={Check} className="flex-1">Approve</Btn>
                  <Btn size="sm" icon={Pencil} className="flex-1">Correct the answer</Btn>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-ink-3"><Clock className="size-3.5" />Corrections are shown to the student and kept in the audit log.</p>
                <ul className="mt-3 space-y-2 border-t border-line pt-3 text-[12px]">
                  {[["Om Kulkarni", "Sum of an AP, n = 20", "Approved 10:02 AM"], ["Zoya Shaikh", "tan 45° from the unit circle", "Corrected 9:40 AM"]].map(([n, q, st]) => (
                    <li key={n} className="flex items-center gap-2"><span className="font-medium">{n}</span><span className="truncate text-ink-2">{q}</span><Badge tone={st.startsWith("Approved") ? "ok" : "ai"} className="ml-auto">{st}</Badge></li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
