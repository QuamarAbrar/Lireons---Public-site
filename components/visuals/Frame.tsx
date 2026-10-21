import { cn } from "@/lib/cn";
import type { ProductId } from "@/lib/products";

export const productColor: Record<ProductId, string> = {
  academy: "var(--p-academy)",
  assess: "var(--p-assess)",
  ai: "var(--p-ai)",
};
export const productSoft: Record<ProductId, string> = {
  academy: "var(--p-academy-soft)",
  assess: "var(--p-assess-soft)",
  ai: "var(--p-ai-soft)",
};

/** Product window: a quiet bar naming the product and view, then the UI. */
export function Frame({ product, title, meta, children, className, bodyClassName }: { product: ProductId; title: string; meta?: React.ReactNode; children: React.ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-surface shadow-3", className)}>
      <div className="flex h-11 items-center gap-2.5 border-b border-line px-4">
        <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: productColor[product] }} />
        <span className="truncate text-[13px] font-medium">{title}</span>
        {meta && <span className="ml-auto flex shrink-0 items-center gap-2 text-[12px] text-ink-3">{meta}</span>}
      </div>
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </div>
  );
}

export function LiveDot({ color = "var(--signal)", className }: { color?: string; className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-flex size-2", className)}>
      <span className="absolute inset-0 rounded-full motion-safe:animate-[pulse-ring_1.6s_var(--ease-out)_infinite]" style={{ background: color }} />
      <span className="relative inline-flex size-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

export function Initials({ name, hue = 250, size = 28, className }: { name: string; hue?: number; size?: number; className?: string }) {
  const ini = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span
      aria-hidden
      className={cn("inline-grid shrink-0 place-items-center rounded-full font-medium", className)}
      style={{ width: size, height: size, fontSize: size * 0.38, background: `oklch(0.9 0.04 ${hue})`, color: `oklch(0.32 0.08 ${hue})` }}
    >
      {ini}
    </span>
  );
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
