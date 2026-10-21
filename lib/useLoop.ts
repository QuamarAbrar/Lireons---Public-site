"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Drives the ambient product demos. Advances a step counter on an interval
 * while the element is on screen, pauses off screen, and with reduced motion
 * holds on `restStep` so the demo still reads as a finished state.
 */
export function useLoop<T extends Element = HTMLDivElement>(count: number, interval = 2000, restStep = count - 1, start = 0) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(start);
  // the server can't know the motion preference, so hold step 0 until mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // a person picking a step holds the loop there for a while before it resumes
  const [held, setHeld] = useState<number | null>(null);
  useEffect(() => {
    if (held === null) return;
    const id = window.setTimeout(() => setHeld(null), 9000);
    return () => window.clearTimeout(id);
  }, [held]);

  // an explicit pause (a play/pause control) stops the loop until resumed
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || !inView || held !== null || paused) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [inView, reduce, count, interval, held, paused]);

  const hold = (i: number) => {
    setStep(i);
    if (!paused) setHeld(i);
  };

  // resuming also releases any hold, so play means play now
  const setPausedNow = (v: boolean) => {
    setPaused(v);
    if (!v) setHeld(null);
  };

  const still = mounted && !!reduce;
  const shown = held ?? (still ? restStep : mounted ? step : start);
  const shownStep = paused ? step : shown;
  return { ref, step: shownStep, active: inView && !still && held === null && !paused, reduce: still, hold, held: held !== null, paused, setPaused: setPausedNow };
}

/** Wall-clock tick for counters that should feel live (timers, ETAs). */
export function useTick(ms = 1000, enabled = true) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setT((v) => v + 1), ms);
    return () => window.clearInterval(id);
  }, [ms, enabled]);
  return t;
}
