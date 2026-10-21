"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import type { ProductId } from "@/lib/products";
import { productColor } from "./Frame";

/**
 * One region of a product demo that a point can point at. When `on`, a ring in
 * the product hue moves here (shared layoutId per demo) and pulses twice, so a
 * tile outside the demo works as a remote control for it.
 */
export function Spot({ on, group, product, children, className }: { on: boolean; group: string; product: ProductId; children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  // the pulse depends on the motion preference, which the server cannot know
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className={cn("relative", className)} data-spot={on || undefined}>
      {children}
      {on && (
        <motion.span
          layoutId={`spot-${group}`}
          aria-hidden
          className="pointer-events-none absolute -inset-2 z-10 rounded-[18px] border-2"
          style={{ borderColor: productColor[product] }}
          transition={reduce ? { duration: 0 } : { type: "spring", visualDuration: 0.42, bounce: 0.14 }}
        >
          {mounted && !reduce && (
            <motion.span
              key={group}
              className="absolute -inset-[2px] rounded-[inherit] border-2"
              style={{ borderColor: productColor[product] }}
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 1.035 }}
              transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1], repeat: 1, delay: 0.3 }}
            />
          )}
        </motion.span>
      )}
    </div>
  );
}
