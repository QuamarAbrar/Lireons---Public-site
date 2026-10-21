import {
  AlertTriangle, BookMarked, Check, CheckCheck, ChevronDown, ClipboardCheck, Code2, Copy, EyeOff, FileClock, FileText, Gauge, GripVertical, LayoutGrid, ListChecks, Lock, Mic,
  MonitorSmartphone, Pause, PenLine, Play, Plus, ScanFace, ScrollText, Settings, ShieldCheck, SquareStack, Timer, Trophy, Users, Wifi, X, Eye, UserRound, Laptop,
} from "lucide-react";
import { AppShell, Avatar, Badge, Btn, Card, Seg, Tabs, pc, school, type NavGroup } from "./kit";
import { Webcam, people } from "./art";
import { cn } from "@/lib/cn";

const nav = (active: string): NavGroup[] => [
  { items: [{ icon: LayoutGrid, label: "Overview" }] },
  {
    title: "Assessments",
    items: [
      { icon: ClipboardCheck, label: "Tests", count: 24 },
      { icon: BookMarked, label: "Question bank", count: "4,810" },
      { icon: ScanFace, label: "Live proctoring", dot: true },
      { icon: ShieldCheck, label: "Review queue", count: 7 },
      { icon: Trophy, label: "Results" },
      { icon: Users, label: "Candidates" },
    ],
  },
  { items: [{ icon: ScrollText, label: "Audit log" }, { icon: Settings, label: "Settings" }] },
].map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, active: i.label === active })) }));

const cands = [
  "Tanvi Joshi", "Rohan Das", "Aisha Khan", "Vikram Nair", "Pooja Shah", "Arjun Reddy", "Sneha Pillai", "Karan Malhotra",
  "Meghna Bose", "Siddharth Rane", "Neha Gupta", "Aditya Kale", "Isha Verma", "Yusuf Ansari", "Riya Menon", "Harsh Agarwal",
];
const status: Record<number, "flag" | "review" | "off" | "done"> = { 2: "flag", 9: "review", 13: "off", 6: "done" };

const lanes: { k: string; icon: typeof Eye; marks: { at: number; w?: number; hot?: boolean }[] }[] = [
  { k: "Face", icon: ScanFace, marks: [{ at: 0.351, w: 0.012, hot: true }] },
  { k: "Gaze", icon: Eye, marks: [{ at: 0.12, w: 0.006 }, { at: 0.36, w: 0.008 }, { at: 0.44, w: 0.004 }] },
  { k: "Tab", icon: SquareStack, marks: [{ at: 0.18, w: 0.004 }] },
  { k: "Voice", icon: Mic, marks: [{ at: 0.348, w: 0.02, hot: true }, { at: 0.47, w: 0.006 }] },
  { k: "Device", icon: MonitorSmartphone, marks: [] },
];
const NOW = 0.524; // 47:12 into a 90 minute paper

export function AssessReview() {
  return (
    <AppShell org={school} product="assess" nav={nav("Review queue")} crumbs={["Tests", "Physics Mock 7", "Proctor review"]} user={{ name: "Anjali Deshpande", role: "Exam controller", hue: 60 }} search="Search candidates, tests, flags">
      <div className="flex h-full flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] font-semibold tracking-[-0.025em]">Physics Mock 7</h1>
              <Badge tone="bad" dot>Live</Badge>
              <span className="text-[13px] text-ink-3 num">47:12 elapsed · 42:48 left</span>
            </div>
            <p className="mt-0.5 text-[13px] text-ink-3">Class 10, all sections · 90 min · Locked browser, camera and mic required</p>
          </div>
          <div className="ml-auto flex items-center divide-x divide-line rounded-xl border border-line bg-surface shadow-1">
            {[["62", "candidates"], ["57", "writing"], ["4", "submitted"], ["7", "flags open", true], ["12", "cleared"], ["2", "upheld"]].map(([v, l, hot]) => (
              <div key={l as string} className="px-4 py-2 leading-tight">
                <p className={cn("text-[17px] font-semibold num", hot && "text-[oklch(0.5_0.12_58)] dark:text-assess")}>{v}</p>
                <p className="text-[11.5px] text-ink-3">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[528px_minmax(0,1fr)] gap-4">
          <Card title="Candidates" sub="16 of 62" action={<Seg items={["All", "Flagged 7", "Offline 1"]} active={0} className="h-7" />} className="min-h-0">
            <div className="grid grid-cols-4 gap-2.5 p-3">
              {cands.map((n, i) => {
                const st = status[i];
                return (
                  <div key={n} className={cn("overflow-hidden rounded-lg border bg-surface-2", st === "flag" ? "border-assess ring-2 ring-assess/30" : "border-line")}>
                    <div className="relative aspect-[4/3]">
                      <Webcam p={people[i % people.length]} id={`c${i}`} extra={st === "flag"} dim={st === "off"} className="absolute inset-0 size-full" />
                      {st === "flag" && <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-md bg-assess text-white dark:text-[oklch(0.16_0.02_262)]"><AlertTriangle className="size-3" strokeWidth={2.5} /></span>}
                      {st === "off" && <span className="absolute inset-0 grid place-items-center text-[11px] font-medium text-white">Reconnecting</span>}
                      {st === "done" && <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[10.5px] font-medium text-white">Submitted</span>}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5">
                      <span className={cn("size-1.5 shrink-0 rounded-full", st === "flag" || st === "review" ? "bg-assess" : st === "off" ? "bg-line-2" : "bg-ok")} />
                      <span className="truncate text-[11.5px] font-medium">{n}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-line px-4 py-2.5">
              <p className="mb-2 text-[12px] font-medium text-ink-3">Open flags, oldest first</p>
              <ul className="space-y-1.5 text-[12.5px]">
                {[["Aisha Khan", "Second face in frame", "31:42", 0.86, true], ["Siddharth Rane", "Looked away 14 s, twice", "38:05", 0.61], ["Rohan Das", "Phone-shaped object on desk", "41:19", 0.72], ["Meghna Bose", "Switched tab for 3 s", "44:50", 0.58]].map(([n, s, t, c, sel]) => (
                  <li key={n as string} className={cn("flex h-9 items-center gap-2.5 rounded-lg px-2.5", sel ? "bg-assess-soft" : "bg-surface-2")}>
                    <AlertTriangle className="size-3.5 text-assess" />
                    <span className="font-medium">{n}</span>
                    <span className="truncate text-ink-2">{s}</span>
                    <span className="ml-auto font-mono text-[11px] text-ink-3">{t}</span>
                    <span className="w-9 text-right text-[11.5px] font-medium num">{(c as number).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <div className="flex min-h-0 flex-col gap-4">
            <Card className="shrink-0" title={<span className="flex items-center gap-2">Aisha Khan <span className="font-normal text-ink-3">Roll 10C-031</span></span>} action={<><span className="flex items-center gap-1.5 text-[12px] text-ink-3"><Laptop className="size-3.5" />Chrome on Windows · locked browser</span><Badge tone="assess" icon={AlertTriangle}>Flag 1 of 7</Badge></>}>
              <div className="grid grid-cols-[minmax(0,1fr)_300px]">
                <div className="p-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-black">
                    <Webcam p={people[2]} id="ev" extra className="absolute inset-0 size-full" />
                    <span className="absolute rounded-md border-2 border-assess" style={{ left: "72%", top: "20%", width: "16%", height: "28%" }}>
                      <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-assess px-1.5 py-0.5 text-[10.5px] font-semibold text-white dark:text-[oklch(0.16_0.02_262)]">Face 2 · 0.86</span>
                    </span>
                    <span className="absolute rounded-md border-2 border-white/70" style={{ left: "34%", top: "18%", width: "27%", height: "52%" }} />
                    <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white"><span className="size-1.5 rounded-full bg-signal" />Evidence clip · 16 s</span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-8 text-white">
                      <div className="relative h-1 rounded-full bg-white/30"><span className="absolute inset-y-0 left-0 w-[56%] rounded-full bg-white" /><span className="absolute left-[38%] top-1/2 h-2.5 w-[16%] -translate-y-1/2 rounded-sm bg-assess/70" /></div>
                      <div className="mt-2 flex items-center gap-3 text-[11.5px]"><Pause className="size-3.5" fill="currentColor" /><span className="font-mono">31:36.4 / 31:52.0</span><span className="ml-auto">0.5x</span><span>Audio on</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col border-l border-line p-4">
                  <p className="text-[12px] font-medium text-ink-3">AI proctor</p>
                  <p className="mt-1 text-[15px] font-semibold">Second face in frame</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-ink-2">A second person appeared behind the candidate at 31:42 for 9 s, with a voice detected at the same time.</p>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[11.5px]"><span className="text-ink-3">Confidence</span><span className="font-semibold num">0.86</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-inset"><div className="h-full w-[86%] rounded-full bg-assess" /></div>
                  </div>
                  <p className="mt-3 rounded-md bg-surface-2 px-2.5 py-2 text-[11.5px] leading-snug text-ink-2">Gaze stayed on screen. No answer change during the 16 s window.</p>
                  <div className="mt-auto pt-3">
                    <p className="mb-2 text-[12px] font-medium">Your decision</p>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="flex h-9 items-center justify-center gap-1.5 rounded-[8px] border border-line-2/80 bg-surface text-[13px] font-medium shadow-1"><X className="size-4" />Uphold</span>
                      <span className="flex h-9 items-center justify-center gap-1.5 rounded-[8px] bg-ok text-[13px] font-medium text-white shadow-1 ring-2 ring-ok/30 dark:text-[oklch(0.16_0.02_262)]"><Check className="size-4" strokeWidth={2.5} />Clear</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Session signals" sub="0 to 90 min" action={<div className="flex items-center gap-3 text-[11.5px] text-ink-3"><span className="flex items-center gap-1.5"><span className="h-2.5 w-1 rounded-full bg-assess" />Flagged</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-1 rounded-full bg-ink-3" />Noted</span></div>} className="shrink-0">
              <div className="relative px-4 pb-2 pt-3">
                {lanes.map(({ k, icon: I, marks }) => (
                  <div key={k} className="flex h-[24px] items-center gap-3">
                    <span className="flex w-[78px] items-center gap-1.5 text-[12px] text-ink-2"><I className="size-3.5 text-ink-3" />{k}</span>
                    <div className="relative h-[14px] flex-1 overflow-hidden rounded-[4px] bg-surface-2">
                      <span className="absolute inset-y-0 left-0 bg-assess/10" style={{ width: `${NOW * 100}%` }} />
                      {marks.map((m, i) => <span key={i} className={cn("absolute inset-y-0 rounded-[2px]", m.hot ? "bg-assess" : "bg-ink-3/70")} style={{ left: `${m.at * 100}%`, width: `max(3px, ${(m.w ?? 0.004) * 100}%)` }} />)}
                    </div>
                  </div>
                ))}
                <div className="ml-[90px] mt-1 flex justify-between font-mono text-[10.5px] text-ink-3">{["0:00", "15:00", "30:00", "45:00", "60:00", "75:00", "90:00"].map((t) => <span key={t}>{t}</span>)}</div>
                <span className="absolute bottom-6 top-2 w-px bg-ink" style={{ left: `calc(106px + (100% - 122px) * ${NOW})` }}><span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-ink" /></span>
              </div>
            </Card>

            <Card title="Audit note" icon={FileClock} action={<span className="text-[11.5px] text-ink-3">Saved to the audit log on submit</span>} className="min-h-0 flex-1">
              <div className="grid h-full grid-cols-[minmax(0,1fr)_300px]">
                <div className="flex flex-col px-4 py-3">
                  <div className="rounded-lg border border-ok/50 bg-surface px-3 py-2 text-[12.5px] leading-snug ring-2 ring-ok/15">
                    Younger sibling walked behind and spoke once. Candidate kept eyes on screen and did not reply. No answers changed. Clearing; parent reminded about a closed room.
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Badge tone="neutral">Reason: background person</Badge>
                    <Btn variant="primary" className="ml-auto" icon={Check}>Submit decision</Btn>
                  </div>
                </div>
                <ul className="space-y-2 border-l border-line px-4 py-3 text-[12px]">
                  {[["AI proctor", "Flagged second face, 0.86", "11:12:42", "assess"], ["Anjali Deshpande", "Opened evidence, watched at 0.5x", "11:19:03", 60], ["Anjali Deshpande", "Marked as cleared, note added", "11:20:37", 60]].map(([who, what, t, h], i) => (
                    <li key={i} className="flex gap-2.5">
                      {h === "assess" ? <span className="grid size-6 shrink-0 place-items-center rounded-full bg-assess-soft text-assess"><ScanFace className="size-3.5" /></span> : <Avatar name={who as string} hue={h as number} size={24} />}
                      <div className="min-w-0 leading-tight">
                        <p><span className="font-medium">{who}</span> <span className="text-ink-2">{what}</span></p>
                        <p className="mt-0.5 font-mono text-[10.5px] text-ink-3">{t}</p>
                      </div>
                    </li>
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

/* ------------------------------------------------------------- builder */

const outline = [
  { s: "Section A", t: "MCQ", n: 30, m: "+4 / −1", icon: ListChecks, qs: ["Q1 Kinematics, graphs", "Q2 Relative motion", "Q3 Projectile range"] },
  { s: "Section B", t: "Written", n: 4, m: "5 marks each", icon: PenLine, qs: ["Q31 Banking of roads", "Q32 Work-energy theorem"] },
  { s: "Section C", t: "Coding", n: 2, m: "10 marks each", icon: Code2, qs: ["Q35 Projectile simulator", "Q36 Collision counter"], open: true },
];

export function AssessBuilder() {
  return (
    <AppShell org={school} product="assess" nav={nav("Tests")} crumbs={["Tests", "Physics Mock 8", "Questions"]} user={{ name: "Anjali Deshpande", role: "Exam controller", hue: 60 }} search="Search questions, tags, tests">
      <div className="flex h-full flex-col">
        <div className="space-y-3 border-b border-line bg-surface px-7 pt-5">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-[-0.025em]">Physics Mock 8</h1>
            <Badge tone="warn" dot>Draft</Badge>
            <span className="text-[13px] text-ink-3">Class 10 · Sat 24 Oct, 10:00 AM · 62 candidates · 90 min · 160 marks</span>
            <div className="ml-auto flex gap-2">
              <Btn icon={Eye}>Preview as candidate</Btn>
              <Btn variant="product" color={pc.assess}>Schedule test</Btn>
            </div>
          </div>
          <Tabs items={[["Questions", 36], "Sections and timing", "Proctoring", ["Candidates", 62], "Results"]} active={0} className="border-none" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)_320px]">
          <div className="overflow-hidden border-r border-line bg-surface p-3">
            {outline.map((o) => (
              <div key={o.s} className="mb-3 rounded-xl border border-line">
                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-assess-soft text-[oklch(0.45_0.11_58)] dark:text-assess"><o.icon className="size-4" /></span>
                  <div className="min-w-0 flex-1 leading-tight"><p className="text-[13px] font-semibold">{o.s} · {o.t}</p><p className="text-[11.5px] text-ink-3"><span className="num">{o.n}</span> questions · {o.m}</p></div>
                  <ChevronDown className="size-4 text-ink-3" />
                </div>
                <ul className="border-t border-line p-1.5">
                  {o.qs.map((q, i) => (
                    <li key={q} className={cn("flex h-8 items-center gap-2 rounded-md px-2 text-[12.5px]", o.open && i === 0 ? "bg-assess-soft font-medium" : "text-ink-2")}>
                      <GripVertical className="size-3.5 text-line-2" />{q}
                    </li>
                  ))}
                  {o.n > o.qs.length && <li className="px-2 py-1 text-[11.5px] text-ink-3">+{o.n - o.qs.length} more</li>}
                </ul>
              </div>
            ))}
            <div className="flex h-9 items-center justify-center gap-2 rounded-[8px] border border-dashed border-line-2 text-[12.5px] text-ink-2"><Plus className="size-3.5" />Add from question bank</div>
            <div className="mt-3 rounded-xl border border-line p-3">
              <p className="mb-2 text-[12.5px] font-semibold">Checks before scheduling</p>
              <ul className="space-y-1.5 text-[12px]">
                {[["Every MCQ has one answer key", true], ["Every coding question has hidden cases", true], ["Marks add up to 160", true], ["2 MCQs missing a difficulty tag", false]].map(([t, ok]) => (
                  <li key={t as string} className="flex items-center gap-2">
                    {ok ? <Check className="size-3.5 text-ok" strokeWidth={2.5} /> : <AlertTriangle className="size-3.5 text-warn" />}
                    <span className={ok ? "text-ink-2" : "font-medium"}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="overflow-hidden bg-paper px-7 py-5">
            <div className="flex items-center gap-2 text-[12px] text-ink-3">Section C · Q35 · Coding <Badge tone="assess">10 marks</Badge><Badge tone="neutral">Medium</Badge><span className="ml-auto">Auto-saved 11:02 AM</span></div>
            <h2 className="mt-1.5 text-[22px] font-semibold tracking-[-0.025em]">Projectile simulator</h2>
            <div className="mt-3 rounded-xl border border-line bg-surface p-4 text-[13px] leading-relaxed shadow-1">
              <p>Read <span className="font-mono text-[12px]">u</span> (m/s), <span className="font-mono text-[12px]">θ</span> (degrees) and <span className="font-mono text-[12px]">g</span>. Print the time of flight, maximum height and range, each rounded to two decimals, separated by spaces.</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-surface-2 p-3 font-mono text-[12px]"><p className="mb-1 font-sans text-[11px] text-ink-3">Sample input</p>20 30 9.8</div>
                <div className="rounded-lg bg-surface-2 p-3 font-mono text-[12px]"><p className="mb-1 font-sans text-[11px] text-ink-3">Sample output</p>2.04 5.10 35.35</div>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface shadow-1">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <p className="text-[13px] font-semibold">Test cases</p>
                <span className="text-[12px] text-ink-3">2 sample · 8 hidden</span>
                <Btn size="sm" icon={Plus} className="ml-auto">Add case</Btn>
              </div>
              <table className="w-full text-[12.5px]">
                <thead><tr className="h-8 border-b border-line text-left text-[11.5px] text-ink-3"><th className="pl-4 font-medium">Case</th><th className="font-medium">Visibility</th><th className="font-medium">Input</th><th className="font-medium">Weight</th><th className="pr-4 text-right font-medium">Reference run</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {[["1", "Sample", "20 30 9.8", "0"], ["2", "Sample", "10 45 9.8", "0"], ["3", "Hidden", "0 60 9.8", "1"], ["4", "Hidden", "50 89.9 9.8", "1"], ["5", "Hidden", "35 15 1.62", "1"], ["6", "Hidden", "1e3 45 9.81", "2"]].map(([c, v, inp, w]) => (
                    <tr key={c} className="h-9">
                      <td className="pl-4 num">#{c}</td>
                      <td>{v === "Hidden" ? <Badge tone="neutral" icon={EyeOff}>Hidden from candidates</Badge> : <Badge tone="assess">Shown as example</Badge>}</td>
                      <td className="font-mono text-[11.5px]">{inp}</td>
                      <td className="num">{w}</td>
                      <td className="pr-4 text-right"><span className="inline-flex items-center gap-1 text-[12px] text-ok"><Check className="size-3.5" strokeWidth={2.5} />Pass · {[12, 11, 9, 14, 10, 13][+c - 1]} ms</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-line bg-[oklch(0.2_0.01_262)] shadow-1">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-[12px] text-white/70"><Code2 className="size-3.5" />Starter code shown to candidates<span className="ml-auto flex gap-1">{["Python", "C++", "Java"].map((l, i) => <span key={l} className={cn("rounded px-1.5 py-0.5", i === 0 ? "bg-white/15 text-white" : "")}>{l}</span>)}</span></div>
              <pre className="px-4 py-3 font-mono text-[12px] leading-[1.7] text-[oklch(0.9_0.01_262)]">
<span className="text-white/35">1  </span><span className="text-[oklch(0.75_0.13_300)]">import</span> math{"\n"}
<span className="text-white/35">2  </span>{"\n"}
<span className="text-white/35">3  </span><span className="text-[oklch(0.75_0.13_300)]">def</span> <span className="text-[oklch(0.8_0.12_220)]">solve</span>(u: float, theta: float, g: float) -&gt; tuple:{"\n"}
<span className="text-white/35">4  </span>    <span className="text-white/40"># return (time_of_flight, max_height, range)</span>{"\n"}
<span className="text-white/35">5  </span>    ...{"\n"}
<span className="text-white/35">6  </span>{"\n"}
<span className="text-white/35">7  </span>u, theta, g = <span className="text-[oklch(0.8_0.12_220)]">map</span>(float, <span className="text-[oklch(0.8_0.12_220)]">input</span>().split()){"\n"}
<span className="text-white/35">8  </span><span className="text-[oklch(0.8_0.12_220)]">print</span>(*(<span className="text-[oklch(0.82_0.12_80)]">f&quot;{"{"}v:.2f{"}"}&quot;</span> <span className="text-[oklch(0.75_0.13_300)]">for</span> v <span className="text-[oklch(0.75_0.13_300)]">in</span> solve(u, theta, g)))
              </pre>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[["Languages", "Python 3.12, C++17, Java 21"], ["Limits", "1 s · 256 MB per case"], ["Scoring", "Partial, by case weight"]].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-line bg-surface px-3 py-2.5 leading-tight shadow-1"><p className="text-[11.5px] text-ink-3">{k}</p><p className="mt-1 text-[12.5px] font-medium">{v}</p></div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden border-l border-line bg-surface">
            <div className="border-b border-line p-4">
              <p className="mb-2.5 text-[12.5px] font-semibold">Paper</p>
              <div className="flex h-3 overflow-hidden rounded-full">
                <span className="bg-assess" style={{ width: "75%" }} /><span className="bg-assess/55" style={{ width: "12.5%" }} /><span className="bg-assess/30" style={{ width: "12.5%" }} />
              </div>
              <ul className="mt-2.5 space-y-1.5 text-[12px]">
                {[["MCQ", "30 · 120 marks"], ["Written", "4 · 20 marks"], ["Coding", "2 · 20 marks"]].map(([k, v]) => <li key={k} className="flex justify-between"><span className="text-ink-2">{k}</span><span className="font-medium num">{v}</span></li>)}
              </ul>
            </div>
            <div className="border-b border-line p-4">
              <p className="mb-2 text-[12.5px] font-semibold">Proctoring</p>
              {[["Camera and face", true], ["Tab and window switches", true], ["Voice detection", true], ["Second device check", true], ["Screen recording", false]].map(([k, on]) => (
                <div key={k as string} className="flex h-8 items-center justify-between text-[12.5px]">
                  <span className="text-ink-2">{k}</span>
                  <span className={cn("relative inline-flex h-[18px] w-8 rounded-full", on ? "bg-assess" : "bg-line-2")}><span className={cn("absolute top-[2px] size-[14px] rounded-full bg-white shadow-1", on ? "left-4" : "left-[2px]")} /></span>
                </div>
              ))}
              <p className="mt-2 rounded-md bg-surface-2 px-2.5 py-2 text-[11.5px] leading-snug text-ink-2">AI flags go to the review queue. A reviewer clears or upholds each one before results publish.</p>
            </div>
            <div className="p-4">
              <p className="mb-2 text-[12.5px] font-semibold">Rules</p>
              {[["Negative marking", "−1 on Section A"], ["Shuffle", "Questions and options"], ["Results", "After review, same day"], ["Late entry", "Up to 10 min"]].map(([k, v]) => (
                <div key={k} className="flex h-8 items-center justify-between text-[12.5px]"><span className="text-ink-3">{k}</span><span className="font-medium">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

