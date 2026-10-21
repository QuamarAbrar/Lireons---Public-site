"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type MotionValue } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type TocItem = { id: string; title: string };

/** Returns the id of the last section whose top has scrolled past the header. */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      // last section can be short: mark it active when the page bottoms out
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1];
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [ids]);
  return active;
}

/** Numbered contents list with a moving highlight on the active item. */
export function TocList({ items, active, layoutKey, scope, onPick }: { items: TocItem[]; active: string; layoutKey: string; scope: string; onPick?: () => void }) {
  return (
    <ol className="grid gap-0.5">
      {items.map((s, i) => {
        const on = s.id === active;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={onPick}
              aria-current={on ? "location" : undefined}
              className={cn("relative flex min-h-9 items-center gap-3 rounded-lg py-1.5 pl-3 pr-2 text-ui transition-colors", on ? "text-ink" : "text-ink-3 hover:text-ink-2")}
            >
              {on && <motion.span layoutId={`${layoutKey}-${scope}-toc`} aria-hidden className="absolute inset-0 rounded-lg bg-surface-2" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
              {on && <motion.span layoutId={`${layoutKey}-${scope}-bar`} aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-signal" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />}
              <span className="relative w-5 shrink-0 text-meta num">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative">{s.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Mobile: sticky bar under the nav showing the current section, expanding to the full list. */
export function MobileToc({ items, active, layoutKey, label, progress }: { items: TocItem[]; active: string; layoutKey: string; label: string; progress: MotionValue<number> }) {
  const [open, setOpen] = useState(false);
  const idx = Math.max(0, items.findIndex((s) => s.id === active));
  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-paper/90 px-4 backdrop-blur-md lg:hidden">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={`${layoutKey}-toc-m`} className="flex h-12 w-full items-center gap-3 text-left text-ui">
        <span className="text-ink-3 num">{String(idx + 1).padStart(2, "0")}</span>
        <span className="min-w-0 flex-1 truncate font-medium">{items[idx]?.title}</span>
        <ChevronDown className={cn("size-4 text-ink-3 transition-transform duration-300", open && "rotate-180")} aria-hidden />
      </button>
      <motion.span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink" style={{ scaleX: progress }} />
      {open && <nav id={`${layoutKey}-toc-m`} aria-label={label} className="max-h-[60vh] overflow-y-auto pb-3"><TocList items={items} active={active} layoutKey={layoutKey} scope="m" onPick={() => setOpen(false)} /></nav>}
    </div>
  );
}

/** Desktop: sticky contents with count and a reading progress rule. */
export function DesktopToc({ items, active, layoutKey, label, progress }: { items: TocItem[]; active: string; layoutKey: string; label: string; progress: MotionValue<number> }) {
  const idx = Math.max(0, items.findIndex((s) => s.id === active));
  const ref = useRef<HTMLElement>(null);
  const [more, setMore] = useState({ above: false, below: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setMore({ above: el.scrollTop > 4, below: el.scrollTop + el.clientHeight < el.scrollHeight - 4 });
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { el.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);
  // keep the active item in view inside the list as the page scrolls
  useEffect(() => {
    const el = ref.current;
    const a = el?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!el || !a) return;
    const top = a.offsetTop - el.offsetTop;
    if (top < el.scrollTop + 40 || top > el.scrollTop + el.clientHeight - 80) el.scrollTo({ top: top - el.clientHeight / 3, behavior: "smooth" });
  }, [active]);
  const mask = more.below && more.above ? "linear-gradient(to bottom, transparent, #000 2.5rem, #000 calc(100% - 4rem), transparent)" : more.below ? "linear-gradient(to bottom, #000 calc(100% - 4rem), transparent)" : more.above ? "linear-gradient(to bottom, transparent, #000 2.5rem)" : undefined;
  return (
    <div className="sticky top-24">
    <nav ref={ref} aria-label={label} className="max-h-[calc(100dvh-10rem)] overflow-y-auto pb-6 scrollbar-none" style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}>
      <p className="label mb-3 flex items-center justify-between pl-3">
        {label}
        <span className="num">{idx + 1}/{items.length}</span>
      </p>
      <div className="relative mb-4 ml-3 h-px bg-line"><motion.span className="absolute inset-0 origin-left bg-ink" style={{ scaleX: progress }} /></div>
      <TocList items={items} active={active} layoutKey={layoutKey} scope="d" />
    </nav>
      {more.below && (
        <button type="button" onClick={() => ref.current?.scrollBy({ top: 200, behavior: "smooth" })} className="ml-1 mt-1 inline-flex h-10 items-center gap-1.5 rounded-[10px] px-2 text-meta text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink">
          <ChevronDown className="size-4" aria-hidden />
          More sections below
        </button>
      )}
    </div>
  );
}
