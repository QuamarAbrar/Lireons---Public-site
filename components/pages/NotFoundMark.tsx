"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * The L mark at poster size. The signal square has slipped out of its corner
 * and drifts back and forth, looking for where it belongs.
 */
export function NotFoundMark() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[22rem] text-ink" aria-hidden>
      <defs>
        <pattern id="nf-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="240" height="240" fill="url(#nf-grid)" />
      <motion.path d="M40 20v180h180" stroke="currentColor" strokeWidth="24" fill="none" strokeLinecap="square" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: ease.out }} />
      <rect x="160" y="20" width="60" height="60" fill="none" stroke="var(--line-2)" strokeWidth="1.5" strokeDasharray="5 5" className="motion-safe:animate-[dash_1.2s_linear_infinite]" />
      <motion.rect
        width="60"
        height="60"
        fill="var(--signal)"
        initial={{ x: 160, y: 20, rotate: 0 }}
        animate={reduce ? { x: 100, y: 90, rotate: 12 } : { x: [160, 92, 112, 160], y: [20, 96, 70, 20], rotate: [0, 14, -8, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 7, times: [0, 0.4, 0.75, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8, delay: 0.9 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
