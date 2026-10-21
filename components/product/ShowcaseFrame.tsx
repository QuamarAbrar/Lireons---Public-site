import { cn } from "@/lib/cn";

/**
 * The home product-story stage: a .frame on a soft colour field with the 32px
 * grid. `field` is the background (a product's soft colour, or a neutral
 * surface). In dark mode the field is mixed toward the page so warm hues do
 * not turn muddy, and the offset shadow is a deep black rather than the light
 * edge colour, so the hard edge still reads as a shadow.
 *
 * `block` is kept for callers: the corner block it used to draw sat half
 * behind the panel and read as a rendering bug, so it is now a small tab in
 * the frame's own padding, always fully visible, and only from sm up.
 * `tight` trims the padding for stages that sit in half a column.
 */
export function ShowcaseFrame({
  field = "var(--surface-2)",
  block,
  tight,
  children,
  className,
}: {
  field?: string;
  block?: string;
  tight?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "frame relative isolate overflow-hidden bg-[var(--field)] dark:bg-[color-mix(in_oklch,var(--field)_55%,var(--paper))] dark:shadow-[6px_6px_0_0_oklch(0_0_0/0.6)]",
        tight ? "p-3 sm:p-5 xl:p-6" : "p-3 sm:p-8 xl:p-12",
        className,
      )}
      style={{ ["--field" as string]: field }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      {block && !tight && (
        <span aria-hidden className="absolute right-3 top-3 hidden size-3 rounded-[3px] border-[1.5px] border-edge sm:block xl:right-5 xl:top-5 xl:size-4" style={{ background: block }} />
      )}
      <div className="relative min-w-0">{children}</div>
    </div>
  );
}
