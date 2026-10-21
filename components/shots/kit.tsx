import type { LucideIcon } from "lucide-react";
import { Bell, ChevronDown, CircleHelp, Search } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * Building blocks for the product screenshots rendered at /shot-src/<id>.
 * Static by design: no motion, no hooks, so a capture is deterministic.
 * Colours come from the site tokens so light and dark both follow the theme.
 */

/** The three products drawn in the screenshots. */
export type Prod = "academy" | "assess" | "ai";
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const pc: Record<Prod, string> = { academy: "var(--p-academy)", assess: "var(--p-assess)", ai: "var(--p-ai)" };
export const ps: Record<Prod, string> = { academy: "var(--p-academy-soft)", assess: "var(--p-assess-soft)", ai: "var(--p-ai-soft)" };

/** The institution in every in-app screen: a Pune school that runs Academy and Assessments. */
export const school = { name: "Brightpath School", sub: "Pune · CBSE · 2026-27", mono: "BS", hue: 152 };

/** Monogram mark for an institution: a rounded square with its initials. Never a logo. */
export function Monogram({ text, hue, size = 32, className }: { text: string; hue: number; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-grid shrink-0 place-items-center font-semibold tracking-[-0.02em] text-white", className)}
      style={{ width: size, height: size, borderRadius: size * 0.28, fontSize: size * 0.4, background: `oklch(0.46 0.12 ${hue})`, boxShadow: "inset 0 -1px 0 oklch(0 0 0 / 0.18), inset 0 1px 0 oklch(1 0 0 / 0.18)" }}
    >
      {text}
    </span>
  );
}

export function Avatar({ name, hue = 250, size = 28, className, ring }: { name: string; hue?: number; size?: number; className?: string; ring?: boolean }) {
  const ini = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s/, "").split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-semibold",
        "bg-[oklch(0.9_0.05_var(--h))] text-[oklch(0.34_0.09_var(--h))] dark:bg-[oklch(0.36_0.06_var(--h))] dark:text-[oklch(0.92_0.04_var(--h))]",
        ring && "ring-2 ring-surface",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.37), ["--h" as string]: hue }}
    >
      {ini}
    </span>
  );
}

type Tone = "ok" | "warn" | "bad" | "neutral" | "info" | Prod;
const toneCls: Record<Tone, string> = {
  ok: "bg-ok-soft text-[oklch(0.42_0.11_155)] dark:text-ok",
  warn: "bg-warn-soft text-[oklch(0.45_0.1_60)] dark:text-warn",
  bad: "bg-signal-soft text-[oklch(0.48_0.17_31)] dark:text-signal",
  neutral: "bg-surface-2 text-ink-2",
  info: "bg-academy-soft text-academy",
  academy: "bg-academy-soft text-academy",
  assess: "bg-assess-soft text-[oklch(0.45_0.11_58)] dark:text-assess",
  ai: "bg-ai-soft text-ai",
};
export function Badge({ tone = "neutral", children, dot, className, icon: I }: { tone?: Tone; children: React.ReactNode; dot?: boolean; className?: string; icon?: LucideIcon }) {
  return (
    <span className={cn("inline-flex h-[22px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-1.5 text-[12px] font-medium leading-none", toneCls[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {I && <I className="size-3.5" strokeWidth={2} />}
      {children}
    </span>
  );
}

export function Btn({ children, variant = "outline", icon: I, className, size = "md", color }: { children?: React.ReactNode; variant?: "primary" | "outline" | "ghost" | "product"; icon?: LucideIcon; className?: string; size?: "sm" | "md"; color?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] font-medium",
        size === "md" ? "h-8 text-[13px]" : "h-7 text-[12px]",
        children ? (size === "md" ? "px-3" : "px-2.5") : size === "md" ? "w-8" : "w-7",
        variant === "primary" && "bg-inverse text-on-inverse shadow-1",
        variant === "product" && "text-white shadow-1 dark:text-[oklch(0.16_0.02_262)]",
        variant === "outline" && "border border-line-2/80 bg-surface text-ink shadow-1",
        variant === "ghost" && "text-ink-2",
        className,
      )}
      style={variant === "product" ? { background: color } : undefined}
    >
      {I && <I className="size-[15px] shrink-0" strokeWidth={1.9} />}
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <span className="inline-grid h-5 min-w-5 place-items-center rounded border border-line bg-surface-2 px-1 font-mono text-[10.5px] text-ink-3">{children}</span>;
}

export function Card({ title, sub, action, children, className, bodyClassName, icon: I }: { title?: React.ReactNode; sub?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; bodyClassName?: string; icon?: LucideIcon }) {
  return (
    <section className={cn("flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-1", className)}>
      {title && (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-4">
          {I && <I className="size-4 text-ink-3" strokeWidth={1.9} />}
          <h3 className="truncate text-[14px] font-semibold tracking-[-0.01em]">{title}</h3>
          {sub && <span className="truncate text-[12.5px] text-ink-3">{sub}</span>}
          {action && <div className="ml-auto flex shrink-0 items-center gap-1.5">{action}</div>}
        </header>
      )}
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Tabs({ items, active, className }: { items: (string | [string, string | number])[]; active: number; className?: string }) {
  return (
    <div className={cn("flex items-end gap-5 border-b border-line", className)}>
      {items.map((it, i) => {
        const [l, n] = Array.isArray(it) ? it : [it, undefined];
        return (
          <span key={l} className={cn("relative -mb-px flex h-10 items-center gap-1.5 border-b-2 text-[13.5px] font-medium", i === active ? "border-ink text-ink" : "border-transparent text-ink-3")}>
            {l}
            {n !== undefined && <span className={cn("rounded-full px-1.5 text-[11px] num leading-[18px]", i === active ? "bg-inverse text-on-inverse" : "bg-surface-2 text-ink-3")}>{n}</span>}
          </span>
        );
      })}
    </div>
  );
}

export function Seg({ items, active, className }: { items: string[]; active: number; className?: string }) {
  return (
    <div className={cn("inline-flex h-8 items-center rounded-[8px] border border-line bg-surface-2 p-0.5 text-[12.5px]", className)}>
      {items.map((x, i) => (
        <span key={x} className={cn("flex h-full items-center rounded-[6px] px-2.5 font-medium", i === active ? "bg-surface text-ink shadow-1 ring-1 ring-line" : "text-ink-3")}>{x}</span>
      ))}
    </div>
  );
}

export function Progress({ value, color = "var(--ink)", className, track = "bg-inset" }: { value: number; color?: string; className?: string; track?: string }) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full", track, className)}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, value * 100)}%`, background: color }} />
    </div>
  );
}

/** Small line chart with an area fade. */
export function Spark({ data, w = 120, h = 36, color = "var(--ink)", fill = true, className, dots }: { data: number[]; w?: number; h?: number; color?: string; fill?: boolean; className?: string; dots?: boolean }) {
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const id = `sp${Math.round(data.reduce((a, b) => a + b, 0) * 7) % 100000}${w}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={cn("overflow-visible", className)} aria-hidden>
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.22" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
        </>
      )}
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      {dots && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={color} stroke="var(--surface)" strokeWidth="1.5" />}
    </svg>
  );
}

export function Donut({ parts, size = 120, stroke = 16, children }: { parts: { v: number; c: string }[]; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r, tot = parts.reduce((s, p) => s + p.v, 0);
  let acc = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--inset)" strokeWidth={stroke} />
        {parts.map((p, i) => {
          const len = (p.v / tot) * C;
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.c} strokeWidth={stroke} strokeDasharray={`${Math.max(0, len - 2)} ${C}`} strokeDashoffset={-acc} />;
          acc += len;
          return el;
        })}
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center text-center">{children}</div>}
    </div>
  );
}

export function Ring({ value, size = 44, stroke = 4, color = "var(--ink)", children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--inset)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${C * value} ${C}`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export type NavItem = { icon: LucideIcon; label: string; count?: string | number; active?: boolean; dot?: boolean };
export type NavGroup = { title?: string; items: NavItem[] };

/** Desktop app shell: institution sidebar, top bar with search, notifications and the signed-in user. */
export function AppShell({
  org,
  product,
  nav,
  crumbs,
  user,
  children,
  topRight,
  preview,
  sidebarFooter,
  contentClassName,
  search = "Search students, courses, tests",
}: {
  org: { name: string; sub: string; mono: string; hue: number };
  product: Prod;
  nav: NavGroup[];
  crumbs: string[];
  user: { name: string; role: string; hue: number };
  children: React.ReactNode;
  topRight?: React.ReactNode;
  preview?: boolean;
  sidebarFooter?: React.ReactNode;
  contentClassName?: string;
  search?: string;
}) {
  return (
    <div className="flex h-full w-full bg-paper text-ink">
      <aside className="flex w-[248px] shrink-0 flex-col border-r border-line bg-surface-2/60 dark:bg-[oklch(0.18_0.007_262)]">
        <div className="flex h-14 items-center gap-2.5 px-3.5">
          <Monogram text={org.mono} hue={org.hue} size={30} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em]">{org.name}</p>
            <p className="truncate text-[11.5px] text-ink-3">{org.sub}</p>
          </div>
          <ChevronDown className="size-4 text-ink-3" />
        </div>
        <div className="px-3 pb-2">
          <div className="flex h-8 items-center gap-2 rounded-[8px] border border-line bg-surface px-2.5 text-[12.5px] text-ink-3">
            <Search className="size-3.5" />Jump to
            <span className="ml-auto flex gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
          </div>
        </div>
        <nav className="flex-1 space-y-4 overflow-hidden px-2 pt-2">
          {nav.map((g, gi) => (
            <div key={gi}>
              {g.title && <p className="px-2 pb-1 text-[11.5px] font-medium text-ink-3">{g.title}</p>}
              <ul className="space-y-px">
                {g.items.map(({ icon: I, label, count, active, dot }) => (
                  <li key={label} className={cn("flex h-8 items-center gap-2.5 rounded-[7px] px-2 text-[13px]", active ? "bg-surface font-medium text-ink shadow-1 ring-1 ring-line" : "text-ink-2")}>
                    <I className="size-4 shrink-0" strokeWidth={1.8} style={active ? { color: pc[product] } : undefined} />
                    <span className="truncate">{label}</span>
                    {dot && <span className="size-1.5 rounded-full bg-signal" />}
                    {count !== undefined && <span className="ml-auto text-[11.5px] text-ink-3 num">{count}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {sidebarFooter}
        <div className="flex h-14 items-center gap-2.5 border-t border-line px-3.5">
          <Avatar name={user.name} hue={user.hue} size={28} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[12.5px] font-medium">{user.name}</p>
            <p className="truncate text-[11.5px] text-ink-3">{user.role}</p>
          </div>
          <LireonsMark />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-6">
          <div className="flex min-w-0 items-center gap-2 text-[13px]">
            {crumbs.map((c, i) => (
              <span key={c} className="flex items-center gap-2">
                {i > 0 && <span className="text-line-2">/</span>}
                <span className={cn(i === crumbs.length - 1 ? "font-medium text-ink" : "text-ink-3")}>{c}</span>
              </span>
            ))}
            {preview && <Badge tone="ai" className="ml-1">Preview</Badge>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex h-8 w-[300px] items-center gap-2 rounded-[8px] border border-line bg-surface-2 px-2.5 text-[12.5px] text-ink-3">
              <Search className="size-3.5 shrink-0" /><span className="truncate">{search}</span>
              <span className="ml-auto"><Kbd>/</Kbd></span>
            </div>
            {topRight}
            <span className="grid size-8 place-items-center rounded-[8px] text-ink-2"><CircleHelp className="size-[17px]" strokeWidth={1.8} /></span>
            <span className="relative grid size-8 place-items-center rounded-[8px] text-ink-2">
              <Bell className="size-[17px]" strokeWidth={1.8} />
              <span className="absolute right-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-signal px-0.5 text-[9px] font-semibold text-on-signal ring-2 ring-surface num">4</span>
            </span>
            <Avatar name={user.name} hue={user.hue} size={30} className="ml-1" />
          </div>
        </header>
        <main className={cn("relative min-h-0 flex-1 overflow-hidden", contentClassName)}>{children}</main>
      </div>
    </div>
  );
}

/** The small Lireons mark, as the vendor credit in the app chrome. */
export function LireonsMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Lireons" className="shrink-0 text-ink-3">
      <path d="M5 3.5v17h14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="square" />
      <rect x="14.5" y="3.5" width="4.5" height="4.5" fill="var(--signal)" />
    </svg>
  );
}

/** Page header inside the content area. */
export function PageHead({ title, sub, actions, badge }: { title: string; sub?: React.ReactNode; actions?: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="flex items-end gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.025em]">{title}</h1>
          {badge}
        </div>
        {sub && <p className="mt-1 text-[13px] text-ink-3">{sub}</p>}
      </div>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Stat({ label, value, foot, children, className }: { label: string; value: React.ReactNode; foot?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative min-w-0 rounded-xl border border-line bg-surface p-4 shadow-1", className)}>
      <p className="text-[12.5px] font-medium text-ink-3">{label}</p>
      <p className="mt-1.5 text-[26px] font-semibold leading-none tracking-[-0.03em] num">{value}</p>
      {foot && <div className="mt-2 text-[12px] text-ink-3">{foot}</div>}
      {children}
    </div>
  );
}

/** Phone status bar for the 390x844 screens. */
export function StatusBar({ className, time = "9:41" }: { className?: string; time?: string }) {
  return (
    <div className={cn("flex h-[50px] shrink-0 items-end justify-between px-8 pb-2 text-[15px] font-semibold", className)}>
      <span className="num">{time}</span>
      <span className="flex items-center gap-1.5">
        <svg width="18" height="11" viewBox="0 0 18 11" aria-hidden><g fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></g></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden><path d="M8 2.2c2.2 0 4.2.8 5.7 2.2l1.1-1.1A9.6 9.6 0 0 0 8 .6 9.6 9.6 0 0 0 1.2 3.3l1.1 1.1A8 8 0 0 1 8 2.2Zm0 3.2c1.3 0 2.5.5 3.4 1.3l1.1-1.1A6.4 6.4 0 0 0 8 3.8c-1.7 0-3.3.7-4.5 1.8l1.1 1.1c.9-.8 2.1-1.3 3.4-1.3Zm0 3.2c-.5 0-.9.2-1.2.5L8 10.4l1.2-1.3c-.3-.3-.7-.5-1.2-.5Z" fill="currentColor" /></svg>
        <span className="relative ml-0.5 inline-flex h-[12px] w-[25px] items-center rounded-[4px] border border-current/40 p-[1.5px]"><span className="h-full w-[78%] rounded-[2px] bg-current" /><span className="absolute -right-[3px] top-1/2 h-1 w-[1.5px] -translate-y-1/2 rounded-r bg-current/40" /></span>
      </span>
    </div>
  );
}
