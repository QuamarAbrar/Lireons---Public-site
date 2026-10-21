"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Contextual cursor label. Any element with `data-cursor="Drag"` (or "Open",
 * "Play", "Type", ...) shows that word in a small edged tag that trails the
 * pointer, so the cursor says what a surface does before you act on it.
 * The system cursor stays visible; fine pointers only. Add `data-cursor-motion`
 * when the announced response is motion, so it is not promised under reduced motion.
 */
export function CursorLabel() {
  const reduce = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const [fine, setFine] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const last = useRef<string | null>(null);

  useEffect(() => {
    const mq = matchMedia("(pointer: fine)");
    setFine(mq.matches);
    if (!mq.matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as Element | null)?.closest?.("[data-cursor]");
      // labels that announce a motion response stay quiet when motion is reduced
      const next = t && !(reduce && t.hasAttribute("data-cursor-motion")) ? t.getAttribute("data-cursor") : null;
      if (next !== last.current) {
        last.current = next;
        setLabel(next);
      }
    };
    const out = () => {
      last.current = null;
      setLabel(null);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", out);
    window.addEventListener("blur", out);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", out);
      window.removeEventListener("blur", out);
    };
  }, [x, y, reduce]);

  if (!fine) return null;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ x: reduce ? x : sx, y: reduce ? y : sy }}>
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6, x: 14, y: 14 }}
            animate={{ opacity: 1, scale: 1, x: 18, y: 18 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", visualDuration: 0.22, bounce: 0.25 }}
            className="absolute left-0 top-0 inline-flex h-7 origin-top-left items-center whitespace-nowrap rounded-[8px] border-[1.5px] border-edge bg-surface px-2.5 text-[13px] font-medium text-ink shadow-[2px_2px_0_0_var(--edge)]"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
