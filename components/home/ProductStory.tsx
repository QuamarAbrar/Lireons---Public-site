"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, BadgeCheck, BarChart3, BookOpen, Camera, ClipboardCheck, Clock, CodeXml, Globe, GraduationCap, Hand, ListChecks, MessageCircleQuestion, Radio, ScanEye, UserCheck } from "lucide-react";
import { useLoop } from "@/lib/useLoop";
import { products, type ProductId } from "@/lib/products";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { Shot } from "@/components/ui/Shot";
import type { ShotId } from "@/components/shots/meta";
import { ButtonLink } from "@/components/ui/Button";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Ruler } from "@/components/ui/Backdrop";
import { MeshField, ThinkingOrb } from "@/components/ui/Shader";

/**
 * Each chapter is a layered composition: a desktop render cropped by the frame
 * behind, the matching phone render in front over the frame edge. Every point
 * tile has a spot on one of the two screens; the selected tile rings it.
 * Spots are boxes in % of the screen they sit on: [x, y, w, h].
 */
type Spot = { on: "shot" | "phone"; box: [number, number, number, number] };
type Comp = { shot: ShotId; phone: ShotId; side: "right" | "left"; spots: Spot[] };
const comps: Record<ProductId, Comp> = {
  academy: {
    shot: "academy-storefront",
    phone: "phone-student-lesson",
    side: "right",
    spots: [
      { on: "shot", box: [1.6, 1, 21, 6.4] },
      { on: "phone", box: [0, 10.4, 100, 26.4] },
      { on: "phone", box: [3, 81.6, 94, 8.4] },
      { on: "shot", box: [32.6, 1.4, 9.4, 4.6] },
    ],
  },
  assess: {
    shot: "assess-review",
    phone: "phone-candidate-check",
    side: "left",
    spots: [
      { on: "shot", box: [16.4, 7, 32, 6.6] },
      { on: "shot", box: [51.6, 20.4, 27.8, 28] },
      { on: "shot", box: [80.4, 43.6, 18.4, 6.4] },
      { on: "shot", box: [69.2, 7.4, 30, 7.4] },
    ],
  },
  ai: {
    shot: "ai-student",
    phone: "phone-student-doubt",
    side: "right",
    spots: [
      { on: "phone", box: [2.6, 38.6, 94.8, 6.4] },
      { on: "shot", box: [52, 7.4, 22.8, 24.4] },
      { on: "phone", box: [49.6, 58.6, 47.2, 7] },
      { on: "shot", box: [15.8, 9.8, 18.6, 36.4] },
    ],
  },
};

type Icon = React.ComponentType<{ className?: string; strokeWidth?: number }>;
const pointIcons: Record<ProductId, Icon[]> = {
  academy: [Globe, Radio, CodeXml, BadgeCheck],
  assess: [ListChecks, ScanEye, UserCheck, Clock],
  ai: [BookOpen, Camera, Hand, BarChart3],
};
const productIcons: Record<ProductId, Icon> = {
  academy: GraduationCap,
  assess: ClipboardCheck,
  ai: MessageCircleQuestion,
};

/** Keeps times like "11 pm" on one line without touching the copy. */
const nb = (s: string) => s.replace(/(\d+) (am|pm)\b/g, "$1 $2");

const POINT_MS = 3200;

/**
 * A product's points as four icon tiles that drive the demo: the selected tile
 * tells the visual which part to ring. The selection cycles while idle;
 * pointing at, focusing or tapping a tile holds it there. Each tile's detail
 * is a tooltip on hover, keyboard focus or tap, never a printed paragraph.
 */
function Tiles({ id, step, hold, scope }: { id: ProductId; step: number; hold: (i: number) => void; scope: string }) {
  const q = products.find((x) => x.id === id)!;
  const uid = useId();
  const [tip, setTip] = useState<number | null>(null);
  const [touchTip, setTouchTip] = useState(false);

  // a tip opened by touch has no hover to end it
  useEffect(() => {
    if (tip === null || !touchTip) return;
    const t = window.setTimeout(() => setTip(null), 4500);
    return () => window.clearTimeout(t);
  }, [tip, touchTip]);

  return (
    <ul data-cursor="Hover a tile" className="grid grid-cols-2 gap-1.5" onKeyDown={(e) => e.key === "Escape" && setTip(null)}>
      {q.points.map((x, i) => {
        const I = pointIcons[id][i];
        const on = i === step;
        const tipId = `${uid}-tip-${i}`;
        return (
          <li key={x.title} className="relative">
            <button
              type="button"
              aria-pressed={on}
              aria-describedby={tipId}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                hold(i);
                setTouchTip(false);
                setTip(i);
              }}
              onPointerLeave={(e) => e.pointerType === "mouse" && setTip((t) => (t === i ? null : t))}
              onPointerDown={(e) => setTouchTip(e.pointerType !== "mouse")}
              onFocus={(e) => {
                if (!e.currentTarget.matches(":focus-visible")) return;
                hold(i);
                setTouchTip(false);
                setTip(i);
              }}
              onBlur={() => setTip((t) => (t === i ? null : t))}
              onClick={() => {
                hold(i);
                if (touchTip) setTip(i);
              }}
              className={cn(
                "group relative flex min-h-12 w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-ui transition-[color,transform] duration-150 ease-out active:scale-[0.98]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge",
                on ? "text-ink" : "text-ink-2 hover:text-ink",
              )}
            >
              {on && <motion.span layoutId={`pt-${scope}`} className="seg-on absolute inset-0 z-0 rounded-[10px]" transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12 }} />}
              {!on && <span aria-hidden className="absolute inset-0 rounded-[10px] bg-surface-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />}
              <span className="relative z-[1] grid size-8 shrink-0 place-items-center rounded-lg transition-colors duration-200" style={{ background: on ? productColor[id] : productSoft[id], color: on ? "var(--surface)" : productColor[id] }}>
                <I className="size-4" strokeWidth={1.9} />
              </span>
              <span className={cn("relative z-[1] leading-tight", on && "font-medium")}>{x.title}</span>
            </button>
            <span
              role="tooltip"
              id={tipId}
              className={cn(
                "pointer-events-none absolute z-30 w-[min(17rem,80vw)] rounded-[10px] border-[1.5px] border-edge bg-surface px-3.5 py-3 text-meta leading-snug text-ink shadow-[3px_3px_0_0_var(--edge)] transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
                i % 2 ? "right-0" : "left-0",
                i < 2 ? "bottom-full mb-2" : "top-full mt-2",
                tip === i ? "visible translate-y-0 opacity-100" : cn("invisible opacity-0", i < 2 ? "translate-y-1" : "-translate-y-1"),
              )}
            >
              {x.body}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** The product's glyph tag, sitting on the frame's top edge. */
function GlyphTag({ id }: { id: ProductId }) {
  const q = products.find((x) => x.id === id)!;
  const I = productIcons[id];
  return (
    <span className="inline-flex h-10 items-center gap-2 rounded-full border-[1.5px] border-edge bg-surface pl-1.5 pr-4 text-ui font-medium shadow-[3px_3px_0_0_var(--edge)]">
      <span className="grid size-7 place-items-center rounded-full text-white" style={{ background: productColor[id] }}>
        <I className="size-4" strokeWidth={1.9} />
      </span>
      {q.name}
    </span>
  );
}

/** The ring and label for the selected point, drawn on whichever screen holds it. */
function Callout({ id, spot, label, i }: { id: ProductId; spot: Spot; label: string; i: number }) {
  const [x, y, w, h] = spot.box;
  const below = y < 12;
  return (
    <motion.span
      key={`${id}-${i}`}
      aria-hidden
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.35, ease: ease.out }}
      className="pointer-events-none absolute z-10 rounded-[8px]"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, boxShadow: `0 0 0 2px ${productColor[id]}, 0 0 0 6px color-mix(in oklch, ${productColor[id]} 22%, transparent)` }}
    >
      <span
        className={cn("absolute whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium leading-none text-white shadow-[2px_2px_0_0_var(--edge)]", below ? "top-full mt-2" : "bottom-full mb-2", x + w > 88 ? "right-0" : "left-0")}
        style={{ background: productColor[id] }}
      >
        {label}
      </span>
    </motion.span>
  );
}

/**
 * Desktop render behind, phone in front over the frame's edge, the live mesh in
 * the product's tints under both. `step` picks the point to ring.
 */
function Composition({ id, step, compact }: { id: ProductId; step: number; compact?: boolean }) {
  const c = comps[id];
  const q = products.find((x) => x.id === id)!;
  const spot = c.spots[step];
  const label = q.points[step]?.title ?? "";
  const right = c.side === "right";
  return (
    <div className="relative">
      <div className={cn("frame relative isolate overflow-hidden", compact ? "aspect-[5/4] sm:aspect-[16/11]" : "aspect-[16/11]")} style={compact ? { background: productSoft[id] } : undefined}>
        {!compact && <MeshField palette={id} follow />}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
        <div className={cn("absolute", compact ? cn("top-[7%] w-[150%] sm:top-[9%]", right ? "left-[6%] sm:w-[104%]" : "left-[-45%] sm:left-[-8%] sm:w-[110%]") : cn("top-[9%]", right ? "left-[6%] w-[104%]" : "left-[-8%] w-[110%]"))}>
          <Shot id={c.shot} sizes="(min-width: 1024px) 780px, 150vw" className="shadow-3">
            <AnimatePresence>{spot?.on === "shot" && <Callout key={`${id}-${step}`} id={id} spot={spot} label={label} i={step} />}</AnimatePresence>
          </Shot>
        </div>
      </div>
      <div className={cn("absolute -bottom-[7%] z-10", compact ? cn("w-[42%] sm:w-[28%]", right ? "right-[3%]" : "left-[3%]") : cn("w-[25%]", right ? "-right-[2%]" : "-left-[2%]"))}>
        <Shot id={c.phone} device sizes="(min-width: 1024px) 200px, 42vw" className="drop-shadow-[0_24px_32px_oklch(0.2_0.02_262/0.3)]">
          <AnimatePresence>{spot?.on === "phone" && <Callout key={`${id}-${step}`} id={id} spot={spot} label={label} i={step} />}</AnimatePresence>
        </Shot>
        {id === "ai" && !compact && (
          <div aria-hidden className="glass absolute -left-[80%] top-[88%] flex items-center gap-2 rounded-full border-[1.5px] border-edge py-1.5 pl-1.5 pr-3.5">
            <ThinkingOrb className="size-9" />
            <span className="whitespace-nowrap text-[13px] font-medium">Finding it in your notes</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Three products as one pinned chapter: scroll advances the index on the left
 * and swaps the live product on the right. Below lg it unpins into a stack.
 */
export function ProductStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const n = products.length;
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.999)))));
  const pts = useLoop<HTMLDivElement>(4, POINT_MS, 0);

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    if (!el.offsetParent) {
      document.getElementById(`chapter-${products[i].id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * (i + 0.15)) / n, behavior: "smooth" });
  };

  const p = products[active];

  return (
    <section id="products" aria-labelledby="products-title" className="relative">
      <div className="wrap pt-16 md:pt-24">
        <Ruler index="02" label="Three products, one record" aside={`${products.reduce((n, q) => n + q.modules.length, 0)} modules in all`} />
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
          <h2 id="products-title" className="text-d2 md:col-span-7">
            Start with one. The rest already know your students.
          </h2>
          <div className="md:col-span-5 md:pb-1">
            <p className="max-w-[40ch] text-lead text-ink-2">Each product works on its own. Switch on a second and it reads the same student, with nothing to import.</p>
          </div>
        </div>
      </div>

      {/* desktop: pinned chapter */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${n * 48 + 10}vh` }}>
        <div ref={pts.ref} className="sticky top-16 flex h-[calc(100vh-4rem)] items-center">
          <div className="wrap grid grid-cols-12 items-center gap-10">
            <div className="col-span-5 xl:col-span-4">
              <ol className="grid gap-1 border-l border-line" aria-label="Products">
                {products.map((q, i) => (
                  <li key={q.id}>
                    <button onClick={() => jump(i)} className="group relative flex min-h-10 w-full items-baseline gap-4 py-2 pl-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge" aria-current={i === active ? "step" : undefined}>
                      <Bar progress={scrollYProgress} i={i} n={n} color={productColor[q.id]} />
                      <span className="text-meta text-ink-3 num">{q.index}</span>
                      <span className={cn("text-body tracking-[-0.01em] transition-colors duration-300", i === active ? "font-medium text-ink" : "text-ink-3 group-hover:text-ink-2")}>
                        {q.name}
                      </span>
                      {q.status && <span className="text-meta text-ai">{q.status}</span>}
                    </button>
                  </li>
                ))}
              </ol>

              <div className="relative mt-10 min-h-[17rem] [@media(max-height:820px)]:mt-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: ease.out }}>
                    <h3 className="max-w-[16ch] text-d3">{nb(p.headline)}</h3>
                    <div className="mt-7 [@media(max-height:820px)]:mt-5">
                      <Tiles id={p.id} step={pts.step} hold={pts.hold} scope="desk" />
                    </div>
                    <div className="mt-7 [@media(max-height:820px)]:mt-5">
                      <ButtonLink href={p.href} variant="outline" size="sm" icon={<ArrowUpRight className="size-4" />}>{`Explore ${p.name}`}</ButtonLink>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative col-span-7 pb-[4%] xl:col-span-8">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={p.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.5, ease: ease.out }}>
                  <Composition id={p.id} step={pts.step} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute left-8 top-0 z-20 -translate-y-1/2 xl:left-12">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={p.id} initial={{ opacity: 0, y: 8, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }} transition={{ duration: 0.25, ease: ease.out }}>
                    <GlyphTag id={p.id} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* below lg: a plain stack, each product with its own tiles driving its demo */}
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-14 pb-4 pt-10 lg:hidden">
        {products.map((q) => <MobileChapter key={q.id} id={q.id} />)}
      </div>
    </section>
  );
}

function MobileChapter({ id }: { id: ProductId }) {
  const q = products.find((x) => x.id === id)!;
  const { ref, step, hold } = useLoop<HTMLElement>(4, POINT_MS, 0);
  return (
    <article ref={ref} id={`chapter-${id}`} className="scroll-mt-24">
      <div className="flex items-center gap-2.5 text-ui">
        <span className="size-2.5 rounded-[3px]" style={{ background: productColor[id] }} />
        <span className="text-ink-3 num">{q.index}</span>
        <span className="font-medium">{q.name}</span>
        {q.status && <span className="text-ai">{q.status}</span>}
        <Link href={q.href} aria-label={`Explore ${q.name}`} className="-mr-2 ml-auto inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-ui font-medium text-ink-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge">Explore<ArrowUpRight className="size-4" /></Link>
      </div>
      <h3 className="mt-3 text-d3">{nb(q.headline)}</h3>
      <div className="mt-6 pb-[6%]"><Composition id={id} step={step} compact /></div>
      <div className="mt-6"><Tiles id={id} step={step} hold={hold} scope={`m-${id}`} /></div>
    </article>
  );
}

function Bar({ progress, i, n, color }: { progress: MotionValue<number>; i: number; n: number; color: string }) {
  const scaleY = useTransform(progress, [i / n, (i + 1) / n], [0, 1], { clamp: true });
  return <motion.span aria-hidden className="absolute -left-px top-0 h-full w-[2px] origin-top" style={{ scaleY, background: color }} />;
}
