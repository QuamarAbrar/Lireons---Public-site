"use client";

import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "signal" | "ink" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

/*
 * One button system. Filled and outline buttons share a neo-brutalist edge:
 * a hard ink border and an offset shadow that lifts on hover and presses flat
 * on click. Ghost buttons have no edge and are for low-emphasis actions only.
 */
const base =
  "group/btn relative isolate inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium tracking-[-0.005em] transition-[background-color,color,box-shadow,translate] duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

/* disabled presses flat: no offset shadow, no lift, muted fill and ink-3 text */
const disabledCls =
  "disabled:pointer-events-none disabled:translate-x-0 disabled:translate-y-0 disabled:border-line-2 disabled:bg-surface-2 disabled:text-ink-3 disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:translate-x-0 aria-disabled:translate-y-0 aria-disabled:border-line-2 aria-disabled:bg-surface-2 aria-disabled:text-ink-3 aria-disabled:shadow-none";

const edged =
  "border-[1.5px] border-edge shadow-[3px_3px_0_0_var(--edge)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--edge)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_var(--edge)] motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0";

const variants: Record<Variant, string> = {
  signal: cn("bg-signal text-on-signal hover:bg-signal-hover", edged),
  ink: cn("bg-inverse text-on-inverse", edged),
  outline: cn("bg-surface text-ink hover:bg-inverse hover:text-on-inverse", edged),
  ghost: "text-ink hover:bg-ink/[0.06] active:bg-ink/10",
};

const sizes: Record<Size, string> = {
  sm: "h-10 gap-2 rounded-[10px] px-3.5 text-[14px]",
  md: "h-11 gap-2.5 rounded-[10px] px-[18px] text-[15px]",
  lg: "h-[52px] gap-3 rounded-[12px] px-6 text-[16px]",
};

/**
 * Label that rolls up on hover: two stacked copies move as one block, so the
 * word is never caught half-drawn mid-transition.
 */
export function RollText({ children, className }: { children: string; className?: string }) {
  const row = "block transition-transform duration-300 ease-[var(--ease-out)] group-hover/btn:-translate-y-full group-focus-visible/btn:-translate-y-full motion-reduce:transition-none";
  return (
    <span className={cn("relative block overflow-hidden leading-[1.3]", className)}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className={row}>{children}</span>
      <span aria-hidden className={cn(row, "absolute inset-x-0 top-full")}>{children}</span>
    </span>
  );
}

/**
 * Looping clip shown in a small edged card next to the button on hover, so the
 * preview never squeezes or covers the label. Hover-capable pointers only.
 */
function HoverMedia({ src, side }: { src: string; side: "above" | "below" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-1/2 z-20 hidden w-40 -translate-x-1/2 overflow-hidden rounded-[10px] border-[1.5px] border-edge bg-surface opacity-0 shadow-[3px_3px_0_0_var(--edge)] transition-[opacity,translate,scale] duration-300 ease-[var(--ease-out)] [@media(hover:hover)]:block",
        side === "above" ? "bottom-[calc(100%+12px)] translate-y-1 scale-95 origin-bottom" : "top-[calc(100%+12px)] -translate-y-1 scale-95 origin-top",
        "group-hover/btn:translate-y-0 group-hover/btn:scale-100 group-hover/btn:opacity-100 group-focus-visible/btn:translate-y-0 group-focus-visible/btn:scale-100 group-focus-visible/btn:opacity-100 motion-reduce:transition-none",
      )}
    >
      <video muted loop playsInline preload="metadata" className="block aspect-[8/5] w-full object-cover">
        {/* VP9 for Chromium and Firefox builds without H.264, MP4 for Safari */}
        <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
        <source src={src} type="video/mp4" />
      </video>
    </span>
  );
}

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: string;
  /** looping clip previewed in a card on hover */
  media?: string;
  /** where the preview card opens; "below" for buttons near the top edge */
  mediaSide?: "above" | "below";
  icon?: React.ReactNode;
};

function useHoverHandlers() {
  const ref = useRef<HTMLElement | null>(null);
  const play = (on: boolean) => {
    const v = ref.current?.querySelector("video");
    if (!v) return;
    if (on) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  };
  return {
    ref,
    onPointerEnter: () => play(true),
    onPointerLeave: () => play(false),
    onFocus: () => play(true),
    onBlur: () => play(false),
  };
}

function Inner({ children, media, mediaSide = "above", icon }: Pick<Common, "children" | "media" | "mediaSide" | "icon">) {
  return (
    <>
      {media && <HoverMedia src={media} side={mediaSide} />}
      <RollText>{children}</RollText>
      {icon && (
        <span aria-hidden className="relative -mr-0.5 grid size-4 place-items-center overflow-hidden">
          <span className="transition-transform duration-[380ms] ease-[var(--ease-out)] group-hover/btn:translate-x-[150%]">{icon}</span>
          <span className="absolute -translate-x-[150%] transition-transform duration-[380ms] ease-[var(--ease-out)] group-hover/btn:translate-x-0">{icon}</span>
        </span>
      )}
    </>
  );
}

export function ButtonLink({ href, variant = "signal", size = "md", className, children, media, mediaSide, icon, disabled }: Common & { href: string; disabled?: boolean }) {
  const h = useHoverHandlers();
  if (disabled)
    return (
      <span role="link" aria-disabled="true" className={cn(base, variants[variant], sizes[size], disabledCls, className)}>
        <Inner icon={icon}>{children}</Inner>
      </span>
    );
  return (
    <Link
      href={href}
      ref={h.ref as React.Ref<HTMLAnchorElement>}
      onPointerEnter={h.onPointerEnter}
      onPointerLeave={h.onPointerLeave}
      onFocus={h.onFocus}
      onBlur={h.onBlur}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      <Inner media={media} mediaSide={mediaSide} icon={icon}>{children}</Inner>
    </Link>
  );
}

export function Button({ variant = "signal", size = "md", className, children, media, mediaSide, icon, ...rest }: Common & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  const h = useHoverHandlers();
  return (
    <button
      {...rest}
      ref={h.ref as React.Ref<HTMLButtonElement>}
      onPointerEnter={h.onPointerEnter}
      onPointerLeave={h.onPointerLeave}
      onFocus={h.onFocus}
      onBlur={h.onBlur}
      className={cn(base, variants[variant], sizes[size], disabledCls, className)}
    >
      <Inner media={media} mediaSide={mediaSide} icon={icon}>{children}</Inner>
    </button>
  );
}

/** Text link with an underline that draws in from the left and leaves to the right. */
export function UnderlineLink({ href, children, className, external }: { href: string; children: React.ReactNode; className?: string; external?: boolean }) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "relative inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:100%_100%] bg-no-repeat pb-0.5 transition-[background-size,color] duration-300 ease-[var(--ease-out)] hover:bg-[length:100%_1px] hover:bg-[position:0%_100%]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
