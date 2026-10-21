"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { CheckCheck, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { DesktopToc, MobileToc, useScrollSpy, type TocItem } from "@/components/pages/Contents";
import { GuideRow, guideProductColor, guideProductName } from "@/components/pages/GuideRow";
import { Ruler } from "@/components/ui/Backdrop";
import { Button } from "@/components/ui/Button";
import { GuideScreen } from "@/components/pages/GuideScreen";
import { PostThumb, topicProduct } from "@/components/pages/PostThumb";
import { CtaBand, CtaShot } from "@/components/pages/CtaBand";
import { ShotCrop, type Region } from "@/components/pages/ShotCrop";
import { guideShots } from "@/components/pages/guideShots";
import type { ShotId } from "@/components/shots/meta";

/** Closing render for posts and for guides without their own screen, by product. */
const ctaCrop: Record<string, { id: ShotId; region: Region }> = {
  academy: { id: "academy-player", region: [0, 0, 0.78, 0.7] },
  assess: { id: "assess-builder", region: [0.16, 0.06, 0.62, 0.6] },
  ai: { id: "ai-student", region: [0.16, 0.04, 0.6, 0.62] },
  platform: { id: "platform-record", region: [0.16, 0.04, 0.84, 0.62] },
};
import { headingId, type Block, type Guide, type GuideProduct } from "@/lib/resources";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Crumb = { label: string; href: string };

/** Renders `**text**` as strong; everything else is plain text. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((part, i) => (i % 2 ? <strong key={i} className="font-medium text-ink">{part}</strong> : <Fragment key={i}>{part}</Fragment>))}</>;
}

/**
 * A paragraph that quotes an example message ("…: Dear parent, … That is the
 * whole message.") is shown as the message itself, in a chat bubble.
 */
const quoted = /^(.*?:)\s(Dear .+?)\s(That is the whole message\..*)$/;

function ChatBubble({ text }: { text: string }) {
  const parts = text.split("[link]");
  return (
    <figure className="frame relative isolate my-8 overflow-hidden bg-surface-2 p-4 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-academy-soft text-academy"><MessageCircle className="size-4" strokeWidth={2} /></span>
        <span className="min-w-0">
          <span className="block text-ui font-medium text-ink">Your academy</span>
          <span className="block text-meta text-ink-3">WhatsApp template message</span>
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ type: "spring", visualDuration: 0.45, bounce: 0.2 }}
        className="relative mt-4 max-w-[30rem] origin-bottom-left rounded-2xl rounded-tl-[4px] border border-line bg-surface px-4 pb-2 pt-3 text-ui leading-relaxed text-ink shadow-1"
      >
        <blockquote>
          {parts.map((t, i) => (
            <Fragment key={i}>
              {t}
              {i < parts.length - 1 && <span className="font-medium text-academy underline decoration-1 underline-offset-2">class link</span>}
            </Fragment>
          ))}
        </blockquote>
        <span className="mt-1 flex items-center justify-end gap-1 text-meta text-ink-3 num">
          7:10 pm
          <CheckCheck className="size-4 text-ok" strokeWidth={2} aria-label="Read" />
        </span>
      </motion.div>
      <figcaption className="mt-4 text-meta text-ink-3">A reminder, sent the evening before. Illustrative.</figcaption>
    </figure>
  );
}

function BlockView({ b }: { b: Block }) {
  if (b.type === "paragraph") {
    const m = b.text.match(quoted);
    if (m)
      return (
        <>
          <p className="mt-5 first:mt-0"><Inline text={m[1]} /></p>
          <ChatBubble text={m[2]} />
          <p><Inline text={m[3]} /></p>
        </>
      );
    return <p className="mt-5 first:mt-0"><Inline text={b.text} /></p>;
  }
  if (b.type === "note")
    return (
      <div role="note" className="mt-7 rounded-2xl border border-line bg-surface px-5 py-4 text-body shadow-1">
        <p className="label mb-1.5">Note</p>
        <p className="text-ink"><Inline text={b.text} /></p>
      </div>
    );
  if (b.type === "steps")
    return (
      <ol className="mt-6 grid gap-4">
        {b.items.map((it, i) => (
          <li key={i} className="grid grid-cols-[1.75rem_1fr] gap-3">
            <span aria-hidden className="mt-[0.2em] grid size-7 place-items-center rounded-full border border-line bg-surface text-meta font-medium text-ink num">{i + 1}</span>
            <span><Inline text={it} /></span>
          </li>
        ))}
      </ol>
    );
  return null;
}

/** Splits blocks into an intro and one section per heading. */
function group(body: Block[]) {
  const intro: Block[] = [];
  const sections: { id: string; title: string; blocks: Block[] }[] = [];
  for (const b of body) {
    if (b.type === "heading") sections.push({ id: headingId(b.text), title: b.text, blocks: [] });
    else (sections.length ? sections[sections.length - 1].blocks : intro).push(b);
  }
  return { intro, sections };
}

export function ArticleView({
  kind,
  slug,
  title,
  label,
  labelColor,
  summary,
  meta,
  crumbs,
  body,
  related,
  product,
  topic,
}: {
  kind: "guide" | "post";
  slug: string;
  title: string;
  label: string;
  labelColor?: string;
  summary: string;
  meta: { term: string; value: React.ReactNode }[];
  crumbs: Crumb[];
  body: Block[];
  related: Guide[];
  /** guides: the product whose screen the sticky visual draws */
  product?: GuideProduct;
  /** posts: the topic whose thumbnail becomes the cover */
  topic?: string;
}) {
  const { intro, sections } = useMemo(() => group(body), [body]);
  const [items] = useState<TocItem[]>(() => sections.map((s) => ({ id: s.id, title: s.title })));
  const [ids] = useState(() => items.map((s) => s.id));
  const active = useScrollSpy(ids);
  const ctaProduct = product && product !== "platform" ? product : topic ? topicProduct(topic) : "academy";
  const activeIdx = Math.max(0, sections.findIndex((s) => s.id === active));
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <>
      <article aria-labelledby="article-title">
        <header className="wrap pt-28 md:pt-32">
          <nav aria-label="Breadcrumb" className="enter-fade">
            <ol className="flex flex-wrap items-center gap-x-2 text-ui text-ink-3">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-line-2">/</span>}
                  <Link href={c.href} className="inline-flex min-h-10 items-center underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-line-2">{c.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-4 grid gap-6 md:mt-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="min-w-0 lg:col-span-7">
              <p className={cn("enter-fade marker", labelColor && "before:hidden")}>
                {labelColor && <span aria-hidden className="size-2 rounded-[2px]" style={{ background: labelColor }} />}
                {label}
              </p>
              <h1 id="article-title" className="mt-5 max-w-[22ch] text-d2">
                <span className="block overflow-hidden pb-[0.08em]">
                  <span className="enter-rise block [animation-delay:0.05s]">{title}</span>
                </span>
              </h1>
            </div>
            <div className="enter-fade min-w-0 [animation-delay:0.2s] lg:col-span-5 lg:pb-2">
              <p className="max-w-[48ch] text-lead text-ink-2">{summary}</p>
            </div>
          </div>
          <dl className="enter-fade mt-8 grid grid-cols-2 border-y border-line text-ui [animation-delay:0.25s] sm:grid-cols-4">
            {meta.map((m, i) => (
              <div key={m.term} className={cn("grid gap-0.5 py-4", i % 2 === 1 && "border-l border-line pl-4", i > 0 && "sm:border-l sm:pl-5", i > 1 && "border-t border-line sm:border-t-0")}>
                <dt className="text-meta text-ink-3">{m.term}</dt>
                <dd className="text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
          {topic && (
            <div className="enter-fade mt-10 [animation-delay:0.3s]">
              <PostThumb topic={topic} size="lg" sizes="(min-width: 1312px) 1232px, 100vw" className="aspect-[16/10] sm:aspect-[16/6]" />
            </div>
          )}
        </header>

        <div className="wrap pb-20 pt-10 md:pb-28 md:pt-14">
          {items.length > 0 && <MobileToc items={items} active={active} layoutKey={`${kind}-${slug}`} label="On this page" progress={progress} />}
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="hidden min-w-0 lg:col-span-3 lg:block">
              {items.length > 0 && <DesktopToc items={items} active={active} layoutKey={`${kind}-${slug}`} label="On this page" progress={progress} />}
            </div>
            <div className={cn("min-w-0 pt-6 lg:col-start-4 lg:pt-0", product ? "lg:col-span-5" : "lg:col-span-6")}>
              <div className="max-w-[65ch] text-body leading-[1.7] text-ink-2">
                {intro.map((b, i) => <BlockView key={i} b={b} />)}
                {sections.map((s) => (
                  <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-32 lg:scroll-mt-28">
                    <h2 id={`${s.id}-h`} className="mt-14 text-d3 text-ink">{s.title}</h2>
                    <div className="mt-4">{s.blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>
                  </section>
                ))}
              </div>
              <Helpful key={slug} kind={kind} />
            </div>
            {!product && related.length > 0 && (
              <div className="hidden min-w-0 lg:col-span-3 lg:block">
                <div className="sticky top-28">
                  <h2 id="practice-title" className="text-meta text-ink-3">Put it into practice</h2>
                  <ul className="mt-2 border-t border-line">
                    {related.map((g) => (
                      <li key={g.slug} className="border-b border-line">
                        <Link href={`/resources/guides/${g.slug}`} data-cursor="Open" className="group flex min-h-11 items-start gap-2.5 py-3 text-ui text-ink-2 transition-colors hover:text-ink">
                          <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-[2px]" style={{ background: guideProductColor(g.product) }} />
                          <span className="min-w-0">
                            <span className="block font-medium text-ink">{g.title}</span>
                            <span className="text-meta text-ink-3">{guideProductName(g.product)} · {g.audience}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-meta text-ink-3">Reading time {meta.find((m) => m.term === "Reading time")?.value ?? "a few minutes"}. Section {activeIdx + 1} of {sections.length || 1}.</p>
                </div>
              </div>
            )}
            {product && sections.length > 0 && (
              <div className="hidden min-w-0 lg:col-span-4 lg:block">
                <div className="sticky top-28">
                  <GuideScreen product={product} section={sections[activeIdx].title} index={activeIdx} total={sections.length} blocks={sections[activeIdx].blocks} />
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className={cn(!product && "lg:hidden")}>
          <div className="wrap pb-20 md:pb-28">
            <Ruler label="Keep going" index="" />
            <div className="mt-8 grid gap-5 md:grid-cols-12 md:gap-10">
              <h2 id="related-title" className="text-d3 md:col-span-4">Related guides</h2>
              <div className="min-w-0 md:col-span-8">
                <ul className="border-t border-line">
                  {related.map((g) => (
                    <li key={g.slug} className="border-b border-line">
                      <GuideRow href={`/resources/guides/${g.slug}`} product={g.product} audience={g.audience} title={g.title} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="See it with your own courses and tests."
        body="A 30-minute walkthrough with our team, set up around how your institution already works. Bring a sample spreadsheet."
        primary={{ href: "/demo", label: "Book a demo", media: `/clips/${ctaProduct}.mp4` }}
        secondary={{ href: "/resources", label: "All resources" }}
        product={ctaProduct}
        visual={(() => {
          const c = (kind === "guide" && guideShots[slug]) || ctaCrop[product ?? ctaProduct];
          return (
            <CtaShot product={ctaProduct}>
              <ShotCrop id={c.id} region={c.region} width={520} className={c.id.startsWith("phone") || c.region[2] < 0.35 ? "mx-auto max-w-[18rem]" : undefined} />
            </CtaShot>
          );
        })()}
      />
    </>
  );
}

/* ---------- was this helpful ---------- */

function Helpful({ kind }: { kind: "guide" | "post" }) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const noun = kind === "guide" ? "guide" : "article";
  return (
    <section aria-labelledby="helpful-title" className="mt-16 max-w-[68ch] border-t border-line pt-8">
      <div aria-live="polite" className="min-h-[5.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {answer === null ? (
            <motion.div key="ask" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: ease.out }} className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="helpful-title" className="text-h4">Was this {noun} helpful?</h2>
              <div className="flex gap-2" role="group" aria-label={`Rate this ${noun}`}>
                {(["yes", "no"] as const).map((v) => {
                  const Icon = v === "yes" ? ThumbsUp : ThumbsDown;
                  return (
                    <Button key={v} type="button" variant="outline" size="sm" onClick={() => setAnswer(v)} icon={<Icon className="size-4" />}>
                      {v === "yes" ? "Yes" : "No"}
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="thanks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="flex items-start gap-4">
              <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", visualDuration: 0.35, bounce: 0.3 }} className={cn("grid size-10 shrink-0 place-items-center rounded-full", answer === "yes" ? "bg-ok-soft text-ok" : "bg-surface-2 text-ink")}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: ease.out, delay: 0.1 }} />
                </svg>
              </motion.span>
              <div>
                <h2 id="helpful-title" className="text-h4">Thanks for telling us.</h2>
                <p className="mt-1 text-ui text-ink-2">
                  {answer === "yes" ? (
                    `We read every response and use it to decide which ${noun}s to expand next.`
                  ) : (
                    <>Tell us what was missing at <a href="mailto:hello@lireons.com" className="text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">hello@lireons.com</a> and we will update this {noun}.</>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
