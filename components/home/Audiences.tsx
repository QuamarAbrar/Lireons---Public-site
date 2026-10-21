import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { audiences, products } from "@/lib/products";
import { productColor } from "@/components/visuals/Frame";
import { Photo } from "@/components/ui/Photo";
import { Shot } from "@/components/ui/Shot";
import { Ruler } from "@/components/ui/Backdrop";
import { cn } from "@/lib/cn";

/**
 * Who it's for: one card per institution type, each a photo (or a product render
 * until a photo arrives) with the products that setup switches on. Each slot is a
 * file swap away from a commissioned photo.
 */
const media: Record<string, { photo?: { src: string; alt: string; position?: string } }> = {
  schools: { photo: { src: "/photos/children-group.jpg", alt: "A group of Indian schoolchildren smiling together outdoors", position: "50% 30%" } },
  coaching: { photo: { src: "/photos/college-class.jpg", alt: "Students at desks in a classroom while a teacher walks between the rows", position: "50% 40%" } },
  academies: {},
};

// staggered so the row reads as a sequence, not three identical tiles
const layout = ["md:col-span-5", "md:col-span-4 md:mt-10", "md:col-span-3 md:mt-20"];

export function Audiences() {
  return (
    <section aria-labelledby="who-title" className="wrap py-20 md:py-28">
      <Ruler index="03" label="Who it's for" aside="Three setups, one record" />
      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-12 md:items-end md:gap-6">
        <h2 id="who-title" className="text-d2 md:col-span-8">Made for the way Indian institutions run.</h2>
        <p className="max-w-[34ch] text-lead text-ink-2 md:col-span-4 md:pb-1">Pick your kind of institution. It comes set up with the products it needs.</p>
      </div>

      <ul className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:mt-14 md:grid md:grid-cols-12 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
        {audiences.map((a, i) => {
          const m = media[a.id];
          const uses = products.filter((p) => a.uses.includes(p.id));
          return (
            <li key={a.id} className={cn("w-[80%] shrink-0 snap-start sm:w-[46%] md:w-auto", layout[i])}>
              <Link href={`/solutions/${a.id}`} className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4">
                {m.photo ? (
                  <Photo src={m.photo.src} alt={m.photo.alt} aspect="square" tone="duo" position={m.photo.position} sizes="(min-width: 768px) 34vw, 80vw" className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1">
                    <Uses uses={uses} />
                  </Photo>
                ) : (
                  <div className="relative aspect-square overflow-hidden rounded-2xl border-[1.5px] border-edge bg-academy-soft transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1">
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
                    <div className="absolute left-[10%] top-[10%] w-[230%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-x-[4%]">
                      <Shot id="academy-storefront" alt="An online academy's own storefront on its own domain, with its course grid and a live batch" sizes="(min-width: 768px) 60vw, 200vw" className="shadow-3" />
                    </div>
                    <Uses uses={uses} />
                  </div>
                )}
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-h4">{a.name}</h3>
                    <p className="mt-1 max-w-[34ch] text-ui text-ink-2">{a.line}</p>
                  </div>
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-edge bg-surface shadow-[2px_2px_0_0_var(--edge)] transition-[translate,box-shadow] duration-200 group-hover:-translate-x-px group-hover:-translate-y-px group-hover:shadow-[3px_3px_0_0_var(--edge)]">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-meta text-ink-3">Photos are illustrative and show no Lireons customers.</p>
    </section>
  );
}

/** The products this setup switches on, as a glass strip on the image. */
function Uses({ uses }: { uses: (typeof products)[number][] }) {
  return (
    <ul aria-label="Products in this setup" className="glass absolute inset-x-3 bottom-3 flex flex-wrap gap-x-3 gap-y-1 rounded-[10px] px-3 py-2 text-[13px] font-medium text-ink">
      {uses.map((p) => (
        <li key={p.id} className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-[2px]" style={{ background: productColor[p.id] }} />
          {p.name}
        </li>
      ))}
    </ul>
  );
}
