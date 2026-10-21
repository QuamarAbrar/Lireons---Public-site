"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { products, type ProductId } from "@/lib/products";
import { productPages } from "@/lib/product-pages";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { ShowcaseFrame } from "./ShowcaseFrame";
import { AcademyVisual } from "@/components/visuals/AcademyVisual";
import { AssessVisual } from "@/components/visuals/AssessVisual";
import { AiVisual } from "@/components/visuals/AiVisual";
import { ease } from "@/lib/motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { MeshField, ThinkingOrb } from "@/components/ui/Shader";
import { ShotPair } from "./ShotPair";
import type { ShotId } from "@/components/shots/meta";

export const visuals: Record<ProductId, React.ComponentType<{ className?: string; compact?: boolean }>> = {
  academy: AcademyVisual,
  assess: AssessVisual,
  ai: AiVisual,
};

/** Two lines, outcome only: the frame below shows the features. */
const heroSub: Record<ProductId, string> = {
  academy: "Courses, live classes, graded practice and certificates on your own domain, paid for over UPI.",
  assess: "MCQ, written and coding tests in a locked browser. The AI proctor flags, your reviewers decide.",
  ai: "Students ask in text or photos and get answers cited from your own notes. Unsure answers go to a teacher.",
};

/** The hero render per product: the office screen at the back, the phone it reaches in front. */
const heroShots: Record<ProductId, { desk: ShotId; phones: ShotId[]; deskAlt?: string }> = {
  academy: { desk: "academy-storefront", phones: ["phone-student-lesson"] },
  assess: { desk: "assess-review", phones: ["phone-candidate-check"] },
  ai: { desk: "ai-teacher", phones: ["phone-student-doubt"] },
};

/** Splits a headline into words that rise out of a mask one after another. */
export function RiseHeadline({ text, id, className, delay = 0.08 }: { text: string; id?: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <h1 id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className="enter-rise inline-block" style={{ animationDelay: `${delay + i * 0.035}s` }}>
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </h1>
  );
}

export function ProductHero({ id }: { id: ProductId }) {
  const p = products.find((x) => x.id === id)!;
  const d = productPages[id];
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "start 30%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [32, 0]);

  return (
    <section aria-labelledby="product-title" className="relative pt-28 md:pt-32">
      <div className="wrap">
        <motion.p className="enter-fade flex flex-wrap items-center gap-x-3 gap-y-2 text-ui text-ink-2">
          <motion.span aria-hidden initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", visualDuration: 0.4, bounce: 0.3 }} className="size-3 rounded-[3px]" style={{ background: productColor[id] }} />
          <span className="text-ink-3 num">{p.index}</span>
          <span className="font-medium text-ink">{p.name}</span>
          {p.status && <span className="rounded-md bg-ai-soft px-1.5 py-0.5 text-meta font-medium text-ai">{p.status}</span>}
          <span className="hidden text-ink-3 sm:inline">· {p.short}</span>
        </motion.p>

        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
          <RiseHeadline id="product-title" text={p.headline} className="text-d1 lg:col-span-8" />
          <motion.div className="enter-fade [animation-delay:0.35s] lg:col-span-4 lg:pb-2">
            <p className="max-w-[40ch] text-lead text-ink-2">{heroSub[id]}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic><ButtonLink href={d.cta.href} size="lg" media={p.clip}>{d.cta.label}</ButtonLink></Magnetic>
              <ButtonLink href="#how" size="lg" variant="outline" icon={<ArrowDown className="size-4" />}>How it works</ButtonLink>
            </div>
          </motion.div>
        </div>
      </div>

      <div ref={stage} className="relative isolate mt-10 pb-4 pt-4 md:mt-12 md:pt-8">
        {/* the stage stands on a measured ground; the grid answers the cursor */}
        <MeshField palette={id} follow className="[mask-image:radial-gradient(ellipse_at_center,#000_50%,transparent_85%)]" />
        <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <motion.div style={{ scale, y }} className="enter-opacity [animation-delay:0.45s] min-w-0 origin-top lg:col-span-9">
            <ShowcaseFrame field={productSoft[id]} block={productColor[id]}>
              <div className="relative">
                <ShotPair desk={heroShots[id].desk} phones={heroShots[id].phones} priority width={940} />
                {id === "ai" && (
                  <div className="pointer-events-none absolute bottom-[4%] left-[3%] z-10 flex items-center gap-3 rounded-full border-[1.5px] border-edge bg-surface py-1.5 pl-1.5 pr-4 shadow-3 max-sm:hidden">
                    <ThinkingOrb className="size-12" />
                    <span className="grid text-meta leading-tight">
                      <span className="font-medium text-ink">Finding it in your notes</span>
                      <span className="text-ink-3">Coming soon. Answers cite the lesson.</span>
                    </span>
                  </div>
                )}
              </div>
            </ShowcaseFrame>
            <p className="mt-4 text-meta text-ink-3">{id === "ai" ? "Preview of AI Doubt Solver, coming soon. " : ""}Product renders in the {p.name} app. Names and figures are illustrative.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: ease.out, delay: 0.6 }} className="min-w-0 lg:col-span-3 lg:pt-2">
            <div className="flex items-end gap-4 border-b border-line pb-4">
              <p className="figure text-[clamp(4rem,3rem+3vw,6.5rem)] leading-[0.85]" aria-hidden>{p.modules.length}</p>
              <p className="pb-1 text-h4">modules, one record</p>
            </div>
            <ul className="grid grid-cols-2 border-b border-line text-ui lg:grid-cols-1" aria-label={`${p.name} modules`}>
              {p.modules.map((m, i) => (
                <li key={m} className="flex items-center gap-2.5 border-t border-line py-2.5 first:border-t-0 max-lg:[&:nth-child(2)]:border-t-0">
                  <span className="w-5 text-meta text-ink-3 num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 truncate">{m}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-[30ch] text-ui text-ink-2">Shared with every other Lireons product.</p>
            <a href="#modules" className="mt-2 inline-flex min-h-10 items-center gap-2 text-ui font-medium text-ink underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-ink">
              See the modules
            </a>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}
