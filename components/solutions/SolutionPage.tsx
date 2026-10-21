"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { audiences, products } from "@/lib/products";
import { solutionPages } from "@/lib/solution-pages";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { ButtonLink } from "@/components/ui/Button";
import { RiseHeadline } from "@/components/product/ProductHero";
import { CtaBand, Intro } from "@/components/product/Sections";
import { DayStage } from "./DayStage";
import { Magnetic } from "@/components/ui/Magnetic";
import { Needs } from "./Needs";
import { MeshField } from "@/components/ui/Shader";
import { Photo } from "@/components/ui/Photo";
import { CtaShot } from "@/components/pages/CtaBand";
import { ShotPair } from "@/components/product/ShotPair";
import type { ProductId } from "@/lib/products";

/**
 * The place each solution is for. Licensed photos (public/photos/CREDITS.md), no
 * customers implied. `slot` says what the commissioned photo should show; swapping
 * the file is the only change needed.
 */
const place: Record<string, { src: string; alt: string; position: string; slot: string }> = {
  schools: {
    src: "/photos/children-group.jpg",
    alt: "A group of primary school children in India smiling at the camera",
    position: "50% 35%",
    // photo slot: a school computer lab during an online unit test, uniforms, teacher walking the rows (4:5)
    slot: "school computer lab during a unit test",
  },
  coaching: {
    src: "/photos/college-class.jpg",
    alt: "Students at desks taking notes in a classroom while one walks between the rows with a notebook",
    position: "62% 40%",
    // photo slot: coaching batch at benches, whiteboard with physics working, evening light (4:5)
    slot: "coaching batch at a whiteboard",
  },
  academies: {
    src: "/photos/student-tablet.jpg",
    alt: "A learner with headphones following an online lesson on a laptop",
    position: "45% 40%",
    // photo slot: course creator teaching to camera at a desk with a ring light and a writing tablet (4:5)
    slot: "creator recording a lesson",
  },
};

/** Each solution closes on its own screen: the school's live class, the batch's mock, the academy's course sales. */
const closing: Record<string, { p: ProductId; node: React.ReactNode }> = {
  schools: { p: "academy", node: <ShotPair desk="academy-live" region={[0.16, 0.06, 0.84, 0.62]} phones={["phone-student-results"]} width={520} deskAlt="A live class in Academy: the teacher's stream, raised hands, a poll and the class chat" /> },
  coaching: { p: "assess", node: <ShotPair desk="assess-builder" region={[0.16, 0.06, 0.62, 0.6]} phones={["phone-candidate-check"]} width={520} deskAlt="Building Physics Mock 8 in Assessments: MCQ, written and coding sections" /> },
  academies: { p: "academy", node: <ShotPair desk="academy-storefront" region={[0, 0.55, 1, 0.45]} phones={["phone-student-lesson"]} width={520} deskAlt="The course grid on BrightPath Academy's storefront with prices in rupees" /> },
};

/** One line under the headline: what runs on the one record. */
const heroSub: Record<string, string> = {
  schools: "Lessons, live classes, proctored unit tests and evening doubts on one student record.",
  coaching: "Live lectures, recordings, Sunday mocks and late-night doubts on one record.",
  academies: "Storefront, cohorts, coding practice and certificates on your own domain.",
};

export function SolutionPage({ id }: { id: string }) {
  const a = audiences.find((x) => x.id === id)!;
  const s = solutionPages[id];
  const demo = `/demo?products=${encodeURIComponent(a.uses.join(","))}`;
  const firstClip = products.find((p) => p.id === a.uses[0])!.clip;
  const others = audiences.filter((x) => x.id !== id);

  return (
    <>
      <section aria-labelledby="sol-title" className="relative isolate pb-6 pt-28 md:pt-32">
        <MeshField palette="brand" follow className="[mask-image:linear-gradient(#000_55%,transparent)]" />
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-4">
            <motion.p className="enter-fade flex flex-wrap items-center gap-x-3 gap-y-2 text-ui">
              <span className="marker">{a.name}</span>
              <span className="text-ink-3">· Solutions</span>
            </motion.p>
            <RiseHeadline id="sol-title" text={s.headline} className="mt-7 text-d2" />
            <motion.div className="enter-fade [animation-delay:0.35s]">
              <p className="mt-6 max-w-[40ch] text-lead text-ink-2">{heroSub[id] ?? a.line}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic><ButtonLink href={demo} size="lg" media={firstClip}>Book a demo</ButtonLink></Magnetic>
                <ButtonLink href="/pricing" size="lg" variant="outline">See pricing</ButtonLink>
              </div>
              <div className="mt-10 border-t border-line pt-4">
                <p className="text-meta text-ink-3">Runs on</p>
                <ul className="mt-2 grid gap-px">
                  {a.uses.map((u) => {
                    const pr = products.find((x) => x.id === u)!;
                    return (
                      <li key={u}>
                        <Link href={pr.href} className="group flex min-h-11 items-center gap-3 whitespace-nowrap border-b border-line text-ui transition-colors hover:text-ink">
                          <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: productColor[u] }} />
                          <span className="font-medium">{pr.name}</span>
                          <span className="min-w-0 truncate text-ink-3">{pr.status ?? `${pr.modules.length} modules`}</span>
                          <ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0 text-ink-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </div>

          <motion.div id="day" className="enter-opacity [animation-delay:0.45s] min-w-0 scroll-mt-20 lg:col-span-7">
            <p className="sr-only">{s.subject.label}</p>
            {/* a sense of place: the photo, with the day's live record overlapping its edge */}
            <div className="grid grid-cols-12">
              <Photo
                src={place[id].src}
                alt={place[id].alt}
                aspect="portrait"
                position={place[id].position}
                priority
                sizes="(min-width: 1024px) 400px, 90vw"
                className="col-start-1 col-end-12 row-start-1 max-sm:[&>div]:aspect-[4/3]! sm:col-end-8"
              />
              <div className="relative z-10 col-start-1 col-end-13 row-start-2 -mt-24 min-w-0 sm:col-start-5 sm:row-start-1 sm:mt-14 sm:self-start">
                <div className="rounded-[18px] border-[1.5px] border-edge shadow-[6px_6px_0_0_var(--edge)] dark:shadow-[6px_6px_0_0_oklch(0_0_0/0.6)]">
                  <DayStage id={id} uses={a.uses} />
                </div>
              </div>
            </div>
            <p className="mt-5 text-meta text-ink-3">Drag the timeline or pick a product. Every event writes to the same records. Photo is illustrative, not a Lireons customer; names and figures are illustrative.</p>
          </motion.div>
        </div>
      </section>

      <Needs id={id} />

      <section aria-labelledby="also-title" className="wrap pb-20 pt-4 md:pb-28">
        <Intro label="Also built for" index="02" id="also-title" title="The same products, set up for a different day.">
          Same record, same products, switched on in a different mix.
        </Intro>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12">
          {others.map((o) => {
            const os = solutionPages[o.id];
            return (
              <li key={o.id}>
                <Link href={`/solutions/${o.id}`} data-cursor="Open" className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-3 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:border-edge hover:shadow-[4px_4px_0_0_var(--edge)] active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal">
                  <Photo src={place[o.id].src} alt="" aspect="2/1" tone="duo" position={place[o.id].position} sizes="(min-width: 640px) 40vw, 90vw" />
                  <span className="flex items-start gap-3 px-2 pb-2 pt-4 sm:px-3">
                    <span className="min-w-0">
                      <span className="block text-h4">{o.name}</span>
                      <span className="mt-1 block text-ui text-ink-2">{o.line}</span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {o.uses.map((u) => (
                          <span key={u} className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-meta text-ink" style={{ background: productSoft[u] }}>
                            <span aria-hidden className="size-2 rounded-[2px]" style={{ background: productColor[u] }} />
                            {products.find((p) => p.id === u)!.name}
                          </span>
                        ))}
                      </span>
                      <span className="sr-only">{os.subject.label}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="ml-auto size-5 shrink-0 text-ink-3 transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45 group-hover:text-ink" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-meta text-ink-3">Photos are illustrative, not Lireons customers.</p>
      </section>

      <CtaBand title={s.closing.title} body={s.closing.body} primary={{ href: demo, label: "Book a demo", media: firstClip }} secondary={{ href: "/pricing", label: "See pricing" }} product={a.uses[1] ?? a.uses[0]} visual={<CtaShot product={closing[id].p}>{closing[id].node}</CtaShot>} />
    </>
  );
}
