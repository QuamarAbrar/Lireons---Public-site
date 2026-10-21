"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUp, Check } from "lucide-react";
import { Mark } from "@/components/ui/Logo";
import { UnderlineLink } from "@/components/ui/Button";
import { products, audiences } from "@/lib/products";
import { productColor } from "@/components/visuals/Frame";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const cols = [
  { title: "Products", links: products.map((p) => ({ label: p.name, href: p.href, dot: productColor[p.id] })) },
  { title: "Solutions", links: audiences.map((a) => ({ label: a.name, href: `/solutions/${a.id}` })) },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Book a demo", href: "/demo" },
      { label: "Security", href: "/security" },
      { label: "Status", href: "/status" },
      { label: "Contact", href: "/demo#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Refund policy", href: "/terms#refunds" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper">
      <div className="wrap grid gap-12 pt-16 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-4">
          <Link href="/" className="inline-flex h-11 items-center gap-2" aria-label="Lireons home"><Mark /><span className="text-[19px] font-semibold tracking-[-0.03em]">Lireons</span></Link>
          <p className="mt-4 max-w-[34ch] text-ui text-ink-2">Software for schools, coaching centres and online academies. Made in India.</p>
          <Newsletter />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="label">{c.title}</p>
              <ul className="mt-3 grid text-ui md:mt-4 md:gap-2.5">
                {c.links.map((l) => (
                  <li key={l.label} className="flex items-center gap-2">
                    {"dot" in l && <span className="size-1.5 rounded-[2px]" style={{ background: (l as { dot: string }).dot }} />}
                    <UnderlineLink href={l.href} className="inline-flex min-h-10 items-center text-ink-2 hover:text-ink md:min-h-0 md:pb-0.5">{l.label}</UnderlineLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <Wordmark />

      <div className="wrap">
        <div className="flex flex-col gap-4 border-t border-line py-6 text-meta text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>© {new Date().getFullYear()} Lireons</span>
            <Status />
            <Clock />
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}

/**
 * The footer's signature: the wordmark responds to the cursor. Letters near
 * the pointer grow heavier and wider (Archivo wght + wdth axes), the
 * rest relax. Touch devices get a slow breathing wave instead.
 */
function Wordmark() {
  const letters = Array.from("Lireons");
  const box = useRef<HTMLDivElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const reduce = useReducedMotion();
  const raf = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const el = box.current;
    if (!el) return;
    let px = -9999;
    let py = -9999;
    let hovering = false;
    let t0 = performance.now();
    const cur = letters.map(() => ({ w: 500, d: 100 }));

    const frame = (t: number) => {
      const centers = spans.current.map((s) => {
        if (!s) return { x: 0, y: 0 };
        const r = s.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      spans.current.forEach((s, i) => {
        if (!s) return;
        let tw: number;
        let td: number;
        if (hovering) {
          const dist = Math.hypot(px - centers[i].x, (py - centers[i].y) * 0.6);
          const k = Math.max(0, 1 - dist / 420);
          tw = 420 + 280 * k * k;
          td = 75 + 25 * k;
        } else {
          // idle wave so the footer never sits still
          const ph = (t - t0) / 1400 - i * 0.55;
          const k = (Math.sin(ph) + 1) / 2;
          tw = 480 + 180 * k;
          td = 82 + 18 * k;
        }
        cur[i].w += (tw - cur[i].w) * 0.12;
        cur[i].d += (td - cur[i].d) * 0.12;
        s.style.fontVariationSettings = `"wght" ${cur[i].w.toFixed(1)}, "wdth" ${cur[i].d.toFixed(1)}`;
      });
      raf.current = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf.current);
      if (e.isIntersecting) { t0 = performance.now(); raf.current = requestAnimationFrame(frame); }
    });
    io.observe(el);
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; hovering = true; };
    const leave = () => { hovering = false; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <div ref={box} data-cursor="Sweep" data-cursor-motion="" className="wrap select-none pb-4 pt-12 md:pt-16" aria-hidden>
      <div className="-ml-[0.07em] flex items-end leading-[0.78] text-ink" style={{ fontSize: "min(15vw, 14rem)", letterSpacing: "-0.06em" }}>
        {letters.map((l, i) => (
          <span key={i} ref={(el) => { spans.current[i] = el; }} className="inline-block font-medium" style={{ fontVariationSettings: '"wght" 500, "wdth" 100' }}>
            {l}
          </span>
        ))}
        <span className="mb-[0.08em] ml-[0.04em] inline-block size-[0.16em] shrink-0 bg-signal" />
      </div>
    </div>
  );
}

function Status() {
  return (
    <Link href="/status" className="group inline-flex min-h-10 items-center gap-2 hover:text-ink">
      <span className="relative inline-flex size-2">
        <span className="absolute inset-0 rounded-full bg-ok motion-safe:animate-[pulse-ring_2s_var(--ease-out)_infinite]" />
        <span className="relative size-2 rounded-full bg-ok" />
      </span>
      All systems normal
    </Link>
  );
}

function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () => new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date());
    setNow(fmt());
    const id = window.setInterval(() => setNow(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="num">{now ?? "--:--:--"} IST</span>;
}

function BackToTop() {
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group inline-flex min-h-10 items-center gap-2 self-start text-ink-2 hover:text-ink sm:self-auto">
      Back to top
      <span className="relative grid size-7 place-items-center overflow-hidden rounded-full border border-line-2 transition-colors group-hover:border-ink group-hover:bg-inverse group-hover:text-on-inverse">
        <ArrowUp className="size-3.5 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-[150%]" />
        <ArrowUp className="absolute size-3.5 translate-y-[150%] transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-y-0" />
      </span>
    </button>
  );
}

function Newsletter() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [email, setEmail] = useState("");
  const valid = /.+@.+\..+/.test(email);
  return (
    <form
      className="mt-8 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        setState("sending");
        window.setTimeout(() => setState("done"), 900);
      }}
    >
      <label htmlFor="nl" className="label">Product notes, once a month</label>
      <div className="mt-2 flex h-12 items-center rounded-[10px] border-[1.5px] border-edge bg-surface pl-3.5 pr-1 shadow-[3px_3px_0_0_var(--edge)] transition-shadow focus-within:shadow-[4px_4px_0_0_var(--signal)]">
        <input id="nl" type="email" required placeholder="you@school.edu.in" value={email} onChange={(e) => setEmail(e.target.value)} disabled={state !== "idle"} className="h-full min-w-0 flex-1 bg-transparent text-ui outline-none placeholder:text-ink-3" />
        <button type="submit" disabled={state !== "idle"} className={cn("relative h-10 min-w-[44px] overflow-hidden rounded-[7px] px-3.5 text-ui font-medium transition-colors", state === "done" ? "bg-ok text-white" : "bg-inverse text-on-inverse")}>
          <motion.span key={state} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease: ease.out }} className="flex items-center gap-1.5">
            {state === "idle" && "Subscribe"}
            {state === "sending" && "Sending…"}
            {state === "done" && <><Check className="size-3.5" strokeWidth={3} />Subscribed</>}
          </motion.span>
        </button>
      </div>
    </form>
  );
}
