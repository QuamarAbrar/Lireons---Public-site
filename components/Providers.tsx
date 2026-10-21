"use client";
import { MotionConfig } from "motion/react";
import { CursorLabel } from "@/components/ui/Cursor";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12 }}>
      {children}
      <CursorLabel />
    </MotionConfig>
  );
}
