import { Shot } from "@/components/ui/Shot";
import { shotMeta, type ShotId } from "@/components/shots/meta";
import { ShotCrop, type Region } from "@/components/pages/ShotCrop";
import { cn } from "@/lib/cn";

type Layout = { desk: number; phone: number; top: number; step: number };
// fractions of the composition's width. The phone overlaps the desktop's right edge.
const wide: Layout = { desk: 0.84, phone: 0.25, top: 0.13, step: 0.17 };
const narrow: Layout = { desk: 0.86, phone: 0.4, top: 0.2, step: 0.26 };

/**
 * A layered composition: a desktop render (or a crop of one) at the back and one
 * or two phone renders in front, overlapping its right edge, the way a school
 * office screen and a parent's phone show the same moment. Below sm the phones
 * grow so they stay readable at 390.
 */
export function ShotPair({
  desk,
  region = [0, 0, 1, 1],
  phones = [],
  priority,
  width = 1000,
  className,
  deskAlt,
}: {
  desk: ShotId;
  region?: Region;
  phones?: ShotId[];
  priority?: boolean;
  /** CSS width of the whole composition at desktop */
  width?: number;
  className?: string;
  deskAlt?: string;
}) {
  return (
    <div className={className}>
      <Comp l={narrow} {...{ desk, region, phones, width, deskAlt }} priority={priority} className="sm:hidden" />
      <Comp l={wide} {...{ desk, region, phones, width, deskAlt }} priority={priority} className="hidden sm:block" />
    </div>
  );
}

function Comp({ l, desk, region, phones, width, deskAlt, priority, className }: { l: Layout; desk: ShotId; region: Region; phones: ShotId[]; width: number; deskAlt?: string; priority?: boolean; className?: string }) {
  const m = shotMeta[desk];
  const [, , rw, rh] = region;
  const deskH = ((phones.length ? l.desk : 1) * (rh * m.h)) / (rw * m.w); // as a fraction of the width
  const phoneH = (l.phone * 844) / 390;
  const last = phones.length ? l.top + (phones.length - 1) * l.step * 0.5 + phoneH : 0;
  const pad = Math.max(0, last - deskH);
  return (
    <div className={cn("relative", className)} style={{ paddingBottom: `${pad * 100}%` }}>
      <div style={{ width: phones.length ? `${l.desk * 100}%` : "100%" }}>
        <ShotCrop id={desk} region={region} alt={deskAlt} width={width * (phones.length ? l.desk : 1)} priority={priority} className="shadow-3" />
      </div>
      {phones.map((p, i) => {
        const fromRight = (phones.length - 1 - i) * l.step;
        return (
          <div
            key={p}
            className="absolute right-0 top-0 drop-shadow-[0_18px_30px_oklch(0_0_0/0.18)]"
            style={{ width: `${l.phone * 100}%`, marginTop: `${(l.top + i * l.step * 0.5) * 100}%`, marginRight: `${fromRight * 100}%`, zIndex: 2 + i }}
          >
            <Shot id={p} device sizes={`(min-width: 640px) ${Math.round(width * l.phone)}px, ${Math.round(l.phone * 100)}vw`} priority={priority && i === phones.length - 1} />
          </div>
        );
      })}
    </div>
  );
}
