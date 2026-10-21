"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { isPhone, shotMeta, type ShotId } from "@/components/shots/meta";

type Props = {
  id: ShotId;
  /** Defaults to the catalogue's alt text for this shot. Pass "" only when the image is decorative. */
  alt?: string;
  priority?: boolean;
  className?: string;
  /** next/image sizes; defaults to full width up to the screen's CSS size. */
  sizes?: string;
  /** Static 3D lean (a few degrees). With a pointer, it follows the cursor slightly; held still under reduced motion. */
  tilt?: boolean;
  /** Bleed the screen off its container: show the left/top part and let the rest run past the edge. */
  crop?: "right" | "bottom";
  /** How much to hide when cropped, 0 to 0.5. Default 0.22. */
  cropAmount?: number;
  /** Phones only: a thin neutral device outline around the screen. */
  device?: boolean;
  /** Overlay inside the screen (callouts, live chips), positioned in % of the screen. */
  children?: React.ReactNode;
};

/**
 * A product screenshot from /public/shots, in light and dark (the inactive theme's
 * image is display:none, so only one is fetched eagerly when `priority` is set).
 * Desktop shots carry the site's 1.5px edge and a 16px radius; phones a 28px radius,
 * or a device outline with `device`.
 */
export function Shot({ id, alt, priority, className, sizes, tilt, crop, cropAmount = 0.22, device, children }: Props) {
  const m = shotMeta[id];
  const phone = isPhone(id);
  const ref = useRef<HTMLDivElement>(null);
  const a = alt ?? m.alt;
  const sz = sizes ?? `(min-width: ${m.w}px) ${m.w}px, 100vw`;
  const k = Math.min(0.5, Math.max(0, cropAmount));

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !tilt || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  const imgs = (
    <>
      <Image src={`/shots/${id}-light.webp`} alt={a} width={m.w} height={m.h} sizes={sz} priority={priority} className={cn("block h-auto max-w-none dark:hidden", crop === "right" ? "" : "w-full")} style={crop === "right" ? { width: `${100 / (1 - k)}%` } : undefined} />
      <Image src={`/shots/${id}-dark.webp`} alt={a} width={m.w} height={m.h} sizes={sz} priority={priority} className={cn("hidden h-auto max-w-none dark:block", crop === "right" ? "" : "w-full")} style={crop === "right" ? { width: `${100 / (1 - k)}%` } : undefined} />
    </>
  );

  const radius = phone ? "rounded-[28px]" : "rounded-2xl";
  const edge =
    crop === "right" ? cn("border-[1.5px] border-r-0 border-edge", phone ? "rounded-l-[28px]" : "rounded-l-2xl")
    : crop === "bottom" ? cn("border-[1.5px] border-b-0 border-edge", phone ? "rounded-t-[28px]" : "rounded-t-2xl")
    : cn("border-[1.5px] border-edge", radius);

  const screen = (
    <div
      className={cn("relative overflow-hidden bg-paper", device && phone ? "rounded-[40px]" : edge)}
      style={crop === "bottom" ? { aspectRatio: `${m.w} / ${m.h * (1 - k)}` } : undefined}
    >
      {imgs}
      {children}
    </div>
  );

  const body = device && phone ? (
    <div className="rounded-[50px] border-[1.5px] border-line-2 bg-surface p-[7px] shadow-3 dark:border-line-2 dark:bg-[oklch(0.22_0.008_262)]">
      <div className="relative">
        {screen}
        <span aria-hidden className="absolute left-1/2 top-[1.1%] aspect-[92/26] w-[30%] -translate-x-1/2 rounded-full bg-[oklch(0.12_0.005_262)]" />
      </div>
    </div>
  ) : screen;

  if (!tilt) return <div className={className}>{body}</div>;
  return (
    <div className={cn("[perspective:1800px]", className)} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={ref}
        className="origin-center transition-transform duration-500 ease-[var(--ease-out)] [transform:rotateX(calc(5deg_-_var(--py,0)*3deg))_rotateY(calc(-9deg_+_var(--px,0)*4deg))] [transform-style:preserve-3d] motion-reduce:transition-none motion-reduce:[transform:rotateX(5deg)_rotateY(-9deg)]"
      >
        {body}
      </div>
    </div>
  );
}
