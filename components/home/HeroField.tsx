"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { MeshField } from "@/components/ui/Shader";

/**
 * The colour field the hero stage floats over: a live mesh shader in the four
 * product tints that leans toward the pointer, under a faint drafting grid.
 * The glass stage on top tilts toward the pointer.
 */
export function HeroField({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3.5, 3.5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);

  return (
    <div
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative overflow-hidden rounded-[28px] border-[1.5px] border-edge isolate px-2.5 py-3 shadow-[6px_6px_0_0_var(--edge)] sm:px-8 sm:py-10 lg:px-14 lg:py-14"
    >
      {/* live mesh in the four product tints; it leans toward the cursor */}
      <MeshField palette="brand" follow />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 [mask-image:linear-gradient(transparent,#000_30%,#000_70%,transparent)]" />
      <div className="relative [perspective:1600px]">
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>{children}</motion.div>
      </div>
    </div>
  );
}
