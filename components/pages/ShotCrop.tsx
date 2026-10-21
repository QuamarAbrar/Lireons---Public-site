import { Shot } from "@/components/ui/Shot";
import { shotMeta, type ShotId } from "@/components/shots/meta";
import { cn } from "@/lib/cn";

/** A region of a render as fractions of its width and height: [left, top, width, height]. */
export type Region = readonly [number, number, number, number];

/**
 * A crop of a product render: shows one region of the screen at a readable size,
 * in light and dark (Shot swaps the file). The box keeps the region's aspect, so a
 * crop never stretches. `width` is the box's CSS width at desktop, used for sizes.
 */
export function ShotCrop({
  id,
  region = [0, 0, 1, 1],
  alt,
  width = 600,
  className,
  priority,
  edge = true,
}: {
  id: ShotId;
  region?: Region;
  alt?: string;
  /** rendered CSS width of the crop box at desktop, in px */
  width?: number;
  className?: string;
  priority?: boolean;
  /** the 1.5px hard edge and 16px radius; off when a parent already frames it */
  edge?: boolean;
}) {
  const m = shotMeta[id];
  const [x, y, w, h] = region;
  const aspect = (w * m.w) / (h * m.h);
  const full = Math.round(width / w);
  const sizes = `(min-width: 1024px) ${Math.min(full, m.w)}px, ${Math.min(300, Math.round(100 / w))}vw`;
  return (
    <div
      className={cn("relative overflow-hidden bg-paper", edge && "rounded-2xl border-[1.5px] border-edge", className)}
      style={{ aspectRatio: `${aspect}` }}
    >
      <div className="absolute left-0 top-0" style={{ width: `${100 / w}%`, transform: `translate(${-x * 100}%, ${-y * 100}%)` }}>
        <Shot id={id} alt={alt} sizes={sizes} priority={priority} className="[&>div]:rounded-none! [&>div]:border-0!" />
      </div>
    </div>
  );
}
