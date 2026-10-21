import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { productColor } from "@/components/visuals/Frame";
import type { GuideProduct } from "@/lib/resources";
import { cn } from "@/lib/cn";

export const guideProductName = (p: GuideProduct) => (p === "platform" ? "Platform" : products.find((x) => x.id === p)!.name);
export const guideProductColor = (p: GuideProduct) => (p === "platform" ? "var(--ink-3)" : productColor[p]);

/** One guide as a full-width link row: marker, title, product, audience, and an arrow that slides in on hover. */
export function GuideRow({ href, product, audience, title, className }: { href: string; product: GuideProduct; audience: string; title: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/row relative grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-4 transition-colors duration-200 hover:bg-surface focus-visible:bg-surface active:bg-surface-2 sm:grid-cols-[auto_1fr_8rem_6rem_1.25rem] sm:px-2",
        className,
      )}
    >
      <span className="size-2 rounded-[2px]" style={{ background: guideProductColor(product) }} aria-hidden />
      <span className="min-w-0 text-body font-medium transition-transform duration-300 ease-[var(--ease-out)] sm:group-hover/row:translate-x-1 motion-reduce:transform-none">{title}</span>
      <span className="col-start-2 row-start-2 text-meta text-ink-3 sm:col-start-auto sm:row-start-auto">
        {guideProductName(product)}
        <span className="sm:hidden"> · {audience}</span>
      </span>
      <span className="hidden text-meta text-ink-3 sm:block">{audience}</span>
      <ArrowRight
        aria-hidden
        className="col-start-3 row-span-2 row-start-1 size-4 text-ink-3 transition-[opacity,transform,color] duration-300 ease-[var(--ease-out)] group-hover/row:text-ink sm:col-start-auto sm:row-span-1 sm:row-start-auto sm:-translate-x-2 sm:opacity-0 sm:group-hover/row:translate-x-0 sm:group-hover/row:opacity-100 sm:group-focus-visible/row:translate-x-0 sm:group-focus-visible/row:opacity-100 motion-reduce:transform-none"
      />
    </Link>
  );
}
