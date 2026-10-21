"use client";

import dynamic from "next/dynamic";
import { products, type ProductId } from "@/lib/products";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { ButtonLink } from "@/components/ui/Button";

type VisualProps = { compact?: boolean; className?: string };
const Skeleton = () => <div className="skeleton h-[22rem] rounded-2xl" />;
const visuals: Record<ProductId, React.ComponentType<VisualProps>> = {
  academy: dynamic(() => import("@/components/visuals/AcademyVisual").then((m) => m.AcademyVisual), { loading: Skeleton }),
  assess: dynamic(() => import("@/components/visuals/AssessVisual").then((m) => m.AssessVisual), { loading: Skeleton }),
  ai: dynamic(() => import("@/components/visuals/AiVisual").then((m) => m.AiVisual), { loading: Skeleton }),
};

/** "/clips/assess.mp4" -> "assess" */
const fromClip = (media?: string): ProductId | undefined => {
  const id = media?.match(/\/clips\/([a-z]+)\./)?.[1];
  return products.some((p) => p.id === id) ? (id as ProductId) : undefined;
};

/**
 * Closing band, the same on every page: signal slab, heading and actions on the
 * left, the page's product running live in a small showcase frame on the right.
 * `product` picks the demo; without it the clip named in `primary.media` decides.
 */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
  product,
  visual,
  caption,
}: {
  title: string;
  body: string;
  primary: { href: string; label: string; media?: string };
  secondary?: { href: string; label: string };
  product?: ProductId;
  /** A page-specific product render (see CtaShot). Replaces the live demo, so no two pages close on the same card. */
  visual?: React.ReactNode;
  caption?: string;
  /** kept for callers; the slab is always signal */
  color?: string;
}) {
  const id = product ?? fromClip(primary.media) ?? "academy";
  const Visual = visuals[id];
  const name = products.find((p) => p.id === id)!.name;
  return (
    <section aria-labelledby="band-title" className="wrap pb-20 md:pb-28">
      <div className="frame relative grid items-center gap-12 overflow-hidden bg-signal px-6 py-14 text-on-signal sm:px-12 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="relative min-w-0 lg:col-span-6">
          <h2 id="band-title" className="text-d2">{title}</h2>
          <p className="mt-5 max-w-[46ch] text-lead">{body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={primary.href} size="lg" variant="ink" media={primary.media}>{primary.label}</ButtonLink>
            {secondary && <ButtonLink href={secondary.href} size="lg" variant="ghost" className="text-on-signal hover:bg-on-signal/10">{secondary.label}</ButtonLink>}
          </div>
        </div>

        {visual ? (
          <figure className="relative min-w-0 lg:col-span-6 lg:col-start-7">
            {visual}
            <figcaption className="mt-4 text-meta text-on-signal">{caption ?? "Product render. Names and figures are illustrative."}</figcaption>
          </figure>
        ) : (
        /* the product, live: a showcase frame on its soft field with the 32px grid */
        <figure className="relative min-w-0 lg:col-span-6 lg:col-start-7">
          <div
            aria-hidden
            inert
            className="relative isolate max-h-[24rem] overflow-hidden rounded-[22px] border-[1.5px] border-edge p-3 text-ink shadow-[5px_5px_0_0_var(--edge)] sm:max-h-[28rem] sm:p-5"
            style={{ background: productSoft[id] }}
          >
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
            <Visual compact />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(to bottom, transparent, ${productSoft[id]})` }} />
          </div>
          <figcaption className="mt-3 flex items-center gap-2 text-meta text-on-signal">
            <span aria-hidden className="size-2 rounded-[2px] border border-on-signal/60" style={{ background: productColor[id] }} />
            {name}, live. Names and figures are illustrative.
          </figcaption>
        </figure>
        )}
      </div>
    </section>
  );
}

/**
 * The closing band's render: a crop of the page's own screen on its product's soft
 * field, optionally with the phone it reaches, edged like the showcase frames.
 */
export function CtaShot({ product, children }: { product: ProductId; children: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[22px] border-[1.5px] border-edge p-3 text-ink shadow-[5px_5px_0_0_var(--edge)] sm:p-5" style={{ background: productSoft[product] }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      {children}
    </div>
  );
}
