import Image from "next/image";
import { cn } from "@/lib/cn";

type Aspect = "square" | "portrait" | "landscape" | "wide" | "tall" | `${number}/${number}`;

type Props = {
  /** Path under /public, e.g. "/photos/children-group.jpg". Swap the file, keep the slot. */
  src: string;
  /** What the photo shows. Pass "" only when it is purely decorative. */
  alt: string;
  /** Box shape; the photo covers it. square 1/1, portrait 4/5, landscape 3/2, wide 16/9, tall 3/4, or "w/h". Default landscape. */
  aspect?: Aspect;
  /** "duo": two-tone ink/paper treatment (CSS only), colour returns on hover/focus of the nearest `.group`. Default "none". */
  tone?: "none" | "duo";
  /** Small caption under the photo (illustrative captions stay honest: no implied customers). */
  caption?: React.ReactNode;
  /** next/image sizes. Required in spirit: describe the rendered width. Default "(min-width: 768px) 50vw, 100vw". */
  sizes?: string;
  /** Only for an above-the-fold photo. Everything else lazy loads. */
  priority?: boolean;
  /** CSS object-position, e.g. "50% 30%" to keep faces in frame. Default "50% 50%". */
  position?: string;
  /** Radius: "panel" 16px (default), "frame" 28px with the hard edge and offset shadow, "none". */
  shape?: "panel" | "frame" | "none";
  className?: string;
  /** Extra layer over the photo (labels, a shot pop-out). Rendered above the image, inside the box. */
  children?: React.ReactNode;
};

const ratios: Record<string, string> = { square: "1 / 1", portrait: "4 / 5", landscape: "3 / 2", wide: "16 / 9", tall: "3 / 4" };

/**
 * A photo slot. Designed so a new file is the only change needed: the box keeps its
 * aspect, the image covers it, and the two-tone treatment is CSS (see .photo-duo in globals.css).
 */
export function Photo({ src, alt, aspect = "landscape", tone = "none", caption, sizes = "(min-width: 768px) 50vw, 100vw", priority, position = "50% 50%", shape = "panel", className, children }: Props) {
  const ratio = ratios[aspect] ?? aspect.replace("/", " / ");
  const box = (
    <div
      className={cn(
        "relative overflow-hidden bg-inset",
        shape === "panel" && "rounded-2xl border-[1.5px] border-edge",
        shape === "frame" && "frame",
        tone === "duo" && "photo-duo",
      )}
      style={{ aspectRatio: ratio }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="photo-img object-cover" style={{ objectPosition: position }} />
      {tone === "duo" && <span aria-hidden className="photo-duo-paper pointer-events-none absolute inset-0" />}
      {children}
    </div>
  );
  if (!caption) return <div className={className}>{box}</div>;
  return (
    <figure className={className}>
      {box}
      <figcaption className="mt-3 text-meta text-ink-3">{caption}</figcaption>
    </figure>
  );
}
