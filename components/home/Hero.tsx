"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Shot } from "@/components/ui/Shot";
import { MeshField } from "@/components/ui/Shader";
import { products } from "@/lib/products";
import { productColor } from "@/components/visuals/Frame";
import { ease } from "@/lib/motion";
import { HeroStage, type DayEvent } from "./HeroStage";

const lines = ["Teach, test, answer,", "on one record."];

/**
 * The hero: the whole Lireons app, tilted on the brand mesh (the mesh bleeds off
 * the right edge; the app stays whole inside it), with the learner's phone in front of it. Under it, the day's
 * controls; whatever they pick arrives on the render's live rail.
 */
export function Hero() {
  const reduce = useReducedMotion();
  // the server can't know the motion preference: hold the moving render until mounted
  const still = useRef(false);
  useEffect(() => {
    still.current = !!reduce;
  }, [reduce]);
  const section = useRef<HTMLElement>(null);
  const [ev, setEv] = useState<DayEvent | null>(null);
  const onEvent = useCallback((e: DayEvent) => setEv(e), []);

  // depth: the app drifts slowly, the phone faster, and the app flattens as you scroll into it
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const appY = useTransform(scrollYProgress, (v) => (still.current ? 0 : v * -50));
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const flatten = useTransform(scrollYProgress, [0, 0.6], [1, 0.35], { clamp: true });

  // pointer: the app leans toward the cursor, the phone slides against it
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.7 });
  const rotY = useTransform([sx, flatten], ([x, f]: number[]) => (still.current ? -14 : -14 * f + x * 4));
  const rotX = useTransform([sy, flatten], ([y, f]: number[]) => (still.current ? 10 : 10 * f - y * 3));
  const phoneX = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const phoneDy = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const phoneYAll = useTransform([phoneY, phoneDy], ([a, b]: number[]) => (still.current ? 0 : a + b));

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative isolate overflow-x-clip pt-24 md:pt-28">
      <div className="wrap">
        <p className="enter-fade flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-ui text-ink-2 text-center">
          <span className="flex gap-1" aria-hidden>
            {products.map((p, i) => (
              <motion.span key={p.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 + i * 0.06, type: "spring", visualDuration: 0.35, bounce: 0.3 }} className="size-2.5 rounded-[3px]" style={{ background: productColor[p.id] }} />
            ))}
          </span>
          For K-12 schools, coaching centres and online academies
        </p>

        <h1 id="hero-title" className="mt-5 text-center text-[clamp(2.75rem,1rem+6.6vw,7rem)] font-[560] leading-[0.92] tracking-[-0.05em] [font-stretch:108%]">
          {lines.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.07em]">
              <span className="enter-rise block" style={{ animationDelay: `${0.08 + i * 0.09}s` }}>
                {l}
              </span>
            </span>
          ))}
        </h1>
        <div style={{ animationDelay: "0.3s" }} className="enter-fade mt-6 flex flex-col items-center text-center md:mt-8">
          <p className="max-w-[48ch] text-lead text-ink-2">
            Courses, live classes, proctored tests and doubts write to one learner record. Nobody types anything twice.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap md:mt-8">
            <Magnetic><ButtonLink href="/demo" size="lg">Book a demo</ButtonLink></Magnetic>
            <ButtonLink href="#products" size="lg" variant="outline" icon={<ArrowDown className="size-4" />}>See the products</ButtonLink>
          </div>
        </div>
      </div>

      {/* the composition: mesh stage bleeding off the right edge, app render on it, phone in front */}
      <div className="wrap relative mt-12 md:mt-16" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="relative mr-[calc(50%-50vw)]">
          <div className="enter-opacity relative isolate h-[440px] overflow-hidden rounded-l-[28px] border-[1.5px] border-r-0 border-edge sm:h-[520px] md:h-[clamp(480px,43vw,620px)]">
            <MeshField palette="brand" follow />
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 [mask-image:linear-gradient(transparent,#000_25%)]" />
            <div className="absolute left-[34%] top-6 w-[720px] [perspective:1800px] sm:left-[30%] sm:w-[860px] md:left-[13%] md:top-[8%] md:w-[min(83%,1180px)]">
              <div className="hero-rise">
                <motion.div style={{ rotateY: rotY, rotateX: rotX, y: appY }} className="origin-[0%_50%] [transform-style:preserve-3d]">
                  <Shot id="home-app" priority sizes="(min-width: 1440px) 1180px, (min-width: 768px) 84vw, 860px" className="shadow-[0_40px_90px_-30px_oklch(0.2_0.02_262/0.45)] rounded-2xl" />
                  {/* the live rail: the moment picked below arrives on the render */}
                  <div className="pointer-events-none absolute left-[80.6%] top-[12%] hidden w-[14%] md:block" aria-hidden>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {ev && (
                        <motion.div key={ev.time} initial={{ opacity: 0, y: -14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.45, ease: ease.out }} className="rounded-[10px] border-[1.5px] border-signal bg-surface px-2.5 py-2 text-ink shadow-[3px_3px_0_0_var(--signal)]">
                          <p className="flex items-center gap-1.5 text-[11px] font-medium text-signal"><span className="size-1.5 rounded-full bg-signal" />Live, {ev.time}</p>
                          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug">{ev.text}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* the learner's phone, in front of the app and over the stage edge */}
          <div className="absolute -bottom-12 left-3 w-[200px] sm:w-[220px] md:-bottom-16 md:left-[4%] md:w-[clamp(200px,17vw,250px)]">
            <div className="hero-rise" style={{ animationDelay: "0.45s" }}>
              <motion.div style={{ x: phoneX, y: phoneYAll }}>
                <Shot id="phone-parent-home" device priority sizes="(min-width: 768px) 262px, 220px" className="drop-shadow-[0_30px_40px_oklch(0.2_0.02_262/0.35)]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* the interactive layer: drives the day; it sits under the stage, beside the phone */}
        <div className="relative z-10 mt-16 md:mt-8 md:ml-[calc(clamp(200px,17vw,250px)+6%)] lg:mr-[8%]">
          <div className="enter-fade" style={{ animationDelay: "0.7s" }}>
            <HeroStage onEvent={onEvent} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-meta text-ink-3">
            <p>Names and figures are illustrative.</p>
            <p className="hidden sm:block">One student, 07:00 to 23:00. Drag the day or pick a product.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
