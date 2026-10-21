"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * A track you can drag, tap or step with the arrow keys. It snaps to the
 * nearest of `positions` (0..1 along the track) and reports that index.
 * The caller draws ticks and the playhead as children, so the same control
 * serves the Day stage timeline and the backup restore strip.
 */
export function Scrubber({
  value,
  positions,
  onChange,
  onStart,
  label,
  valueText,
  className,
  children,
  cursor = "Drag",
}: {
  value: number;
  positions: number[];
  onChange: (i: number) => void;
  /** called once when a drag, tap or key press starts, e.g. to pause autoplay */
  onStart?: () => void;
  label: string;
  valueText: string;
  className?: string;
  children?: React.ReactNode;
  /** the contextual cursor tag shown while hovering the track */
  cursor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const n = positions.length;

  const nearest = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    let best = 0;
    positions.forEach((p, i) => {
      if (Math.abs(p - f) < Math.abs(positions[best] - f)) best = i;
    });
    return best;
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={n - 1}
      aria-valuenow={value}
      aria-valuetext={valueText}
      data-cursor={cursor}
      className={cn("relative h-11 cursor-ew-resize touch-none select-none rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal", className)}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        onStart?.();
        onChange(nearest(e.clientX));
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const i = nearest(e.clientX);
        if (i !== value) onChange(i);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onKeyDown={(e) => {
        const map: Record<string, number> = { ArrowRight: value + 1, ArrowUp: value + 1, ArrowLeft: value - 1, ArrowDown: value - 1, Home: 0, End: n - 1, PageUp: value + 3, PageDown: value - 3 };
        if (!(e.key in map)) return;
        e.preventDefault();
        onStart?.();
        onChange(Math.min(n - 1, Math.max(0, map[e.key])));
      }}
    >
      {children}
    </div>
  );
}
