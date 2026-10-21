import type { ProductId } from "@/lib/products";
import { productSoft } from "@/components/visuals/Frame";
import { Photo } from "@/components/ui/Photo";
import { Shot } from "@/components/ui/Shot";
import { ShotCrop, type Region } from "@/components/pages/ShotCrop";
import type { ShotId } from "@/components/shots/meta";
import { cn } from "@/lib/cn";

/** Which product's field a blog topic sits on. */
export const topicProduct = (topic: string): ProductId => (topic === "Exams" ? "assess" : topic === "Doubts" ? "ai" : "academy");

type Cover = {
  /** a licensed photo, or none: then the cover is a shot composition on the product field */
  photo?: { src: string; position: string };
  desk: { id: ShotId; region: Region };
  phone?: ShotId;
};

/**
 * One cover per topic: a photo of the setting with the screen it is about on top,
 * or, where no honest photo exists yet, the screens alone.
 */
const covers: Record<string, Cover> = {
  // photo slot: a teacher at a desk hosting a live class to camera, a writing tablet beside the laptop (16:9)
  "Live classes": { desk: { id: "academy-live", region: [0.16, 0.06, 0.84, 0.94] }, phone: "phone-live-class" },
  // photo slot: a student at night with a notebook, photographing a maths problem (16:9)
  Doubts: { desk: { id: "ai-student", region: [0.16, 0.04, 0.84, 0.94] }, phone: "phone-student-doubt" },
  // photo slot: an exam hall or computer lab during a mock test, candidates at screens (16:9). college-class stands in.
  Exams: { photo: { src: "/photos/college-class.jpg", position: "50% 40%" }, desk: { id: "assess-review", region: [0.5, 0.06, 0.5, 0.45] } },
  Academies: { photo: { src: "/photos/student-tablet.jpg", position: "50% 50%" }, desk: { id: "academy-storefront", region: [0, 0.04, 0.62, 0.5] } },
  // photo slot: an institute office desk with a printed batch list, a question paper and a laptop (16:9)
  Operations: { desk: { id: "platform-record", region: [0.16, 0.04, 0.84, 0.96] }, phone: "phone-parent-home" },
};

/**
 * The cover for a blog post: index card, article header and the nav's featured post.
 * Decorative (the post title carries the meaning), so images have empty alt.
 * Give an aspect class in className, or it defaults to 16:10. `size="sm"` is the
 * list thumbnail: one image, no overlay.
 */
export function PostThumb({ topic, className, size = "md", sizes = "(min-width: 1024px) 720px, 100vw" }: { topic: string; className?: string; size?: "sm" | "md" | "lg"; sizes?: string }) {
  const id = topicProduct(topic);
  const c = covers[topic] ?? covers.Academies;
  const aspect = className?.includes("aspect-") ? "" : size === "sm" ? "aspect-[4/3]" : "aspect-[16/10]";

  if (size === "sm") {
    return (
      <div aria-hidden className={cn("relative overflow-hidden rounded-[10px] border border-line", aspect, className)} style={{ background: productSoft[id] }}>
        {c.photo ? (
          <Photo src={c.photo.src} alt="" shape="none" position={c.photo.position} sizes="128px" className="absolute inset-0 [&>div]:h-full [&>div]:aspect-auto!" />
        ) : (
          <div className="absolute left-[10%] top-[14%] w-[150%]">
            <ShotCrop id={c.desk.id} region={c.desk.region} alt="" width={190} className="rounded-[8px]!" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div aria-hidden className={cn("frame relative isolate overflow-hidden", aspect, className)} style={{ background: productSoft[id] }}>
      {c.photo ? (
        <Photo src={c.photo.src} alt="" shape="none" position={c.photo.position} sizes={sizes} className="absolute inset-0 [&>div]:h-full [&>div]:aspect-auto!" />
      ) : (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      )}
      {c.photo ? (
        <div className="absolute bottom-[-6%] right-[5%] w-[52%] drop-shadow-[0_18px_30px_oklch(0_0_0/0.25)]">
          <ShotCrop id={c.desk.id} region={c.desk.region} alt="" width={380} />
        </div>
      ) : (
        <>
          <div className="absolute left-[7%] top-[12%] w-[72%] shadow-3">
            <ShotCrop id={c.desk.id} region={c.desk.region} alt="" width={520} />
          </div>
          {c.phone && (
            <div className="absolute right-[7%] top-[9%] w-[22%] drop-shadow-[0_18px_30px_oklch(0_0_0/0.2)]">
              <Shot id={c.phone} alt="" device sizes="(min-width: 1024px) 180px, 25vw" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
