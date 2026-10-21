"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Section backgrounds. Crisp patterns only (lines, dots, hatching, tints),
 * never glows. With `live`, a denser copy of the pattern is revealed in a
 * circle under the cursor, so the surface answers the pointer without
 * moving any content. Place inside a `relative` section; it sits behind.
 */
type Variant = "grid" | "dots" | "hatch" | "cross";

const pattern: Record<Variant, string> = {
  grid: "bg-[linear-gradient(var(--bd-line,var(--line))_1px,transparent_1px),linear-gradient(90deg,var(--bd-line,var(--line))_1px,transparent_1px)] bg-[size:40px_40px]",
  dots: "bg-[radial-gradient(var(--bd-line2,var(--line-2))_1px,transparent_1.2px)] bg-[size:16px_16px]",
  hatch: "bg-[repeating-linear-gradient(135deg,var(--bd-line,var(--line))_0_1px,transparent_1px_9px)]",
  cross: "bg-[linear-gradient(var(--bd-line2,var(--line-2))_1px,transparent_1px),linear-gradient(90deg,var(--bd-line2,var(--line-2))_1px,transparent_1px)] bg-[size:80px_80px] bg-[position:-1px_-1px]",
};
const strong: Record<Variant, string> = {
  grid: "bg-[linear-gradient(var(--bd-strong,var(--ink-3))_1px,transparent_1px),linear-gradient(90deg,var(--bd-strong,var(--ink-3))_1px,transparent_1px)] bg-[size:40px_40px] opacity-40",
  dots: "bg-[radial-gradient(var(--bd-strong,var(--ink-2))_1.2px,transparent_1.4px)] bg-[size:16px_16px] opacity-70",
  hatch: "bg-[repeating-linear-gradient(135deg,var(--bd-strong,var(--ink-3))_0_1px,transparent_1px_9px)] opacity-50",
  cross: "bg-[linear-gradient(var(--bd-strong,var(--ink-3))_1px,transparent_1px),linear-gradient(90deg,var(--bd-strong,var(--ink-3))_1px,transparent_1px)] bg-[size:80px_80px] bg-[position:-1px_-1px] opacity-50",
};

const tones: Record<"slab" | "signal", React.CSSProperties> = {
  slab: { ["--bd-line" as string]: "color-mix(in oklch, var(--on-slab) 9%, transparent)", ["--bd-line2" as string]: "color-mix(in oklch, var(--on-slab) 14%, transparent)", ["--bd-strong" as string]: "color-mix(in oklch, var(--on-slab) 45%, transparent)" },
  signal: { ["--bd-line" as string]: "color-mix(in oklch, var(--on-signal) 14%, transparent)", ["--bd-line2" as string]: "color-mix(in oklch, var(--on-signal) 20%, transparent)", ["--bd-strong" as string]: "color-mix(in oklch, var(--on-signal) 50%, transparent)" },
};

export function Backdrop({
  variant = "grid",
  live = false,
  fade = "edges",
  tint,
  tone,
  className,
}: {
  /** recolour the lines for a band that keeps its own colour: the slab or the signal frame */
  tone?: "slab" | "signal";
  variant?: Variant;
  /** reveal a denser pattern under the cursor (fine pointers only) */
  live?: boolean;
  /** mask the pattern so it fades out: toward the edges, the bottom, or not at all */
  fade?: "edges" | "bottom" | "top" | "none";
  /** optional flat tint under the pattern, e.g. "var(--surface-2)" */
  tint?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!live) return;
    const el = spot.current;
    const host = ref.current?.parentElement;
    if (!el || !host || !matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el.style.setProperty("--mr", "220px");
      });
    };
    const leave = () => el.style.setProperty("--mr", "0px");
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [live]);

  const mask =
    fade === "edges"
      ? "[mask-image:radial-gradient(ellipse_at_center,#000_45%,transparent_85%)]"
      : fade === "bottom"
        ? "[mask-image:linear-gradient(#000_40%,transparent)]"
        : fade === "top"
          ? "[mask-image:linear-gradient(transparent,#000_60%)]"
          : "";

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} style={{ ...(tint ? { background: tint } : null), ...(tone ? tones[tone] : null) }}>
      <div className={cn("absolute inset-0", pattern[variant], mask)} />
      {live && (
        <div
          ref={spot}
          className={cn("absolute inset-0 transition-[--mr] duration-300 motion-reduce:hidden", strong[variant])}
          style={{ maskImage: "radial-gradient(circle var(--mr,0px) at var(--mx,50%) var(--my,50%), #000 0%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle var(--mr,0px) at var(--mx,50%) var(--my,50%), #000 0%, transparent 100%)" }}
        />
      )}
    </div>
  );
}

/**
 * Registration ticks: four small corner marks that frame a block like a
 * print crop. Gives empty space a visible edge without drawing a box.
 */
export function Ticks({ className, inset = 0 }: { className?: string; inset?: number }) {
  const s = "absolute size-3 border-ink-3/70";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)} style={{ inset: -inset }}>
      <span className={cn(s, "left-0 top-0 border-l border-t")} />
      <span className={cn(s, "right-0 top-0 border-r border-t")} />
      <span className={cn(s, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(s, "bottom-0 right-0 border-b border-r")} />
    </div>
  );
}

/**
 * A section's top rule: hairline across the grid with its index and name,
 * plus column ticks. Use instead of a lone marker floating in space.
 */
export function Ruler({ index, label, aside, tone, className }: { index: string; label: string; aside?: React.ReactNode; tone?: "slab"; className?: string }) {
  const slab = tone === "slab";
  return (
    <div className={cn("relative flex min-h-9 items-center gap-3 border-t pt-3 text-meta", slab ? "border-on-slab/20" : "border-line-2", className)}>
      <span className={cn("num", slab ? "text-on-slab/70" : "text-ink-3")}>{index}</span>
      <span className={cn("size-1.5", slab ? "bg-signal" : "bg-ink")} aria-hidden />
      <span className={cn("font-medium", slab ? "text-on-slab" : "text-ink")}>{label}</span>
      {aside && <span className={cn("ml-auto hidden text-right sm:block", slab ? "text-on-slab/70" : "text-ink-3")}>{aside}</span>}
      <span aria-hidden className={cn("absolute inset-x-0 -top-px hidden h-2 bg-[size:calc(100%/12)_100%] md:block", slab ? "bg-[linear-gradient(90deg,color-mix(in_oklch,var(--on-slab)_25%,transparent)_1px,transparent_1px)]" : "bg-[linear-gradient(90deg,var(--line-2)_1px,transparent_1px)]")} />
    </div>
  );
}
