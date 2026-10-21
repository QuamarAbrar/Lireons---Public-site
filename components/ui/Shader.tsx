"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useReducedMotion, useSpring, useMotionValueEvent } from "motion/react";
import { Dithering, GrainGradient, MeshGradient, SmokeRing } from "@paper-design/shaders-react";
import type { ProductId } from "@/lib/products";
import { cn } from "@/lib/cn";

/*
 * WebGL backgrounds from Paper Shaders (Apache-2.0). Each one sits behind
 * content in a `relative isolate` parent, follows the light/dark theme with
 * its own palette, pauses itself off screen, and holds still under reduced
 * motion. Hex values approximate the oklch tokens in globals.css, because
 * the shader colour parser reads hex and rgb, not oklch.
 */

type Palette = ProductId | "brand";

const mesh: Record<"light" | "dark", Record<Palette, string[]>> = {
  light: {
    brand: ["#f2f3f6", "#a8dcc8", "#b7c9f4", "#f2c9a2", "#d2c3f5"],
    academy: ["#eff3fc", "#adc3f3", "#d7e1fa", "#86a6ee"],
    assess: ["#fbf3ea", "#f0c69c", "#f8e1c9", "#e6a86d"],
    ai: ["#f4f1fb", "#cbbbf3", "#e3dbf8", "#aa92ec"],
  },
  dark: {
    brand: ["#15171c", "#0f3a2f", "#1a2c5a", "#4a2b12", "#2f2160"],
    academy: ["#13171f", "#1a3370", "#121e3d", "#2449a0"],
    assess: ["#1a1612", "#5a3210", "#2e1d0e", "#7d4615"],
    ai: ["#16151e", "#3a2873", "#1f1840", "#5338a8"],
  },
};

const orb: Record<Palette, string[]> = {
  brand: ["#d2341c", "#2257c9", "#6d4fc2"],
  academy: ["#2257c9", "#6d8ff0"],
  assess: ["#b05a12", "#e8973f"],
  ai: ["#6d4fc2", "#2257c9", "#b49cf5"],
};

/** Current theme from the `dark` class on <html>, kept in sync with the toggle. */
export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains("dark"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark ? "dark" : "light";
}

/** Renders only after mount, so server HTML and the first client render match. */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

const fill = "pointer-events-none absolute inset-0 -z-10";

/**
 * Slow mesh gradient in a product's tints. With `follow`, the colour field
 * drifts toward the cursor, so the surface answers the pointer.
 */
export function MeshField({ palette = "brand", follow = false, className, speed = 0.18 }: { palette?: Palette; follow?: boolean; className?: string; speed?: number }) {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const sx = useSpring(ox, { stiffness: 40, damping: 20 });
  const sy = useSpring(oy, { stiffness: 40, damping: 20 });
  const [off, setOff] = useState({ x: 0, y: 0 });
  useMotionValueEvent(sx, "change", (x) => setOff((o) => ({ ...o, x })));
  useMotionValueEvent(sy, "change", (y) => setOff((o) => ({ ...o, y })));
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    const parent = host?.parentElement;
    if (!follow || reduce || !parent || !matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      ox.set(((e.clientX - r.left) / r.width - 0.5) * 0.35);
      oy.set(((e.clientY - r.top) / r.height - 0.5) * 0.35);
    };
    const leave = () => {
      ox.set(0);
      oy.set(0);
    };
    parent.addEventListener("pointermove", move);
    parent.addEventListener("pointerleave", leave);
    return () => {
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
    };
  }, [follow, reduce, host, ox, oy]);
  return (
    <div ref={setHost} aria-hidden className={cn(fill, "overflow-hidden", className)} style={{ background: mesh[theme][palette][0] }}>
      {mounted && (
        <MeshGradient
          className="size-full"
          colors={mesh[theme][palette]}
          distortion={0.8}
          swirl={0.35}
          grainMixer={0}
          grainOverlay={theme === "dark" ? 0.12 : 0.06}
          speed={reduce ? 0 : speed}
          offsetX={off.x}
          offsetY={off.y}
          maxPixelCount={1920 * 1080}
        />
      )}
    </div>
  );
}

/** Grainy animated gradient for a coloured band, e.g. the red closing CTA. */
export function GrainField({ colors, back, shape = "wave", className }: { colors: string[]; back: string; shape?: "wave" | "corners" | "ripple" | "blob"; className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  return (
    <div aria-hidden className={cn(fill, "overflow-hidden", className)} style={{ background: back }}>
      {mounted && <GrainGradient className="size-full" colors={colors} colorBack={back} softness={0.7} intensity={0.35} noise={0.25} shape={shape} speed={reduce ? 0 : 0.35} />}
    </div>
  );
}

/** Ordered-dither texture for the dark band: a moving print screen, not a glow. */
export function DitherField({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  return (
    <div aria-hidden className={cn(fill, "overflow-hidden", className)}>
      {mounted && <Dithering className="size-full" colorBack="#00000000" colorFront="#ffffff14" shape="warp" type="4x4" size={2} speed={reduce ? 0 : 0.25} />}
    </div>
  );
}

/**
 * The thinking orb: a smoke ring that turns while the AI works. Size it with
 * className (it fills its box). `busy` speeds it up while an answer is being written.
 */
export function ThinkingOrb({ palette = "ai", busy = true, className }: { palette?: Palette; busy?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  return (
    <div aria-hidden className={cn("pointer-events-none relative shrink-0", className)}>
      {mounted && (
        <SmokeRing
          className="absolute inset-0"
          colors={orb[palette]}
          colorBack="#00000000"
          noiseScale={1.4}
          noiseIterations={6}
          thickness={0.6}
          radius={0.32}
          innerShape={0.7}
          scale={1}
          speed={reduce ? 0 : busy ? 1.1 : 0.35}
        />
      )}
    </div>
  );
}

/** The red closing band: a slow grain gradient kept close to the signal colour so text contrast holds. */
export function SignalField({ className }: { className?: string }) {
  const theme = useTheme();
  return theme === "dark" ? (
    <GrainField className={className} back="#ec6a45" colors={["#f2825d", "#e35d36", "#f59473"]} shape="corners" />
  ) : (
    <GrainField className={className} back="#c23a22" colors={["#b8321c", "#cf4127", "#a82c17"]} shape="corners" />
  );
}
