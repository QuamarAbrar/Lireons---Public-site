import { Shot } from "@/components/ui/Shot";
import { shotMeta, type ShotId } from "@/components/shots/meta";

export const metadata = { robots: { index: false, follow: false } };

/** Private contact sheet of every captured shot and the Shot component's variants. Not linked anywhere. */
export default function Gallery() {
  const ids = Object.keys(shotMeta) as ShotId[];
  const desk = ids.filter((i) => shotMeta[i].w > 600);
  const phones = ids.filter((i) => shotMeta[i].w < 600);
  return (
    <div className="wrap space-y-16 py-16">
      <section className="grid gap-10 md:grid-cols-2">
        <Shot id="home-app" tilt priority />
        <div className="overflow-hidden"><Shot id="academy-live" crop="right" /></div>
        <Shot id="assess-review" crop="bottom" cropAmount={0.35} />
        <div className="flex gap-6"><Shot id="phone-parent-home" device className="w-[260px]" /><Shot id="phone-student-doubt" device tilt className="w-[260px]" /></div>
      </section>
      <section className="grid gap-8 md:grid-cols-2">
        {desk.map((id) => <figure key={id}><Shot id={id} /><figcaption className="mt-2 text-meta text-ink-3">{id}</figcaption></figure>)}
      </section>
      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {phones.map((id) => <figure key={id}><Shot id={id} /><figcaption className="mt-2 text-meta text-ink-3">{id}</figcaption></figure>)}
      </section>
    </div>
  );
}
