"use client";

import Link from "next/link";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { productColor, productSoft } from "@/components/visuals/Frame";
import Image from "next/image";
import { Shot } from "@/components/ui/Shot";
import type { ShotId } from "@/components/shots/meta";
import { audiences, products, type ProductId } from "@/lib/products";
import { posts } from "@/lib/resources";
import { PostThumb, topicProduct } from "@/components/pages/PostThumb";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type MenuKey = "products" | "solutions" | "resources";
const order: MenuKey[] = ["products", "solutions", "resources"];
const labels: Record<MenuKey, string> = { products: "Products", solutions: "Solutions", resources: "Resources" };

type Entry = { name: string; href: string; dot?: string; tag?: string; feature?: Feature };
type Feature = { title: string; cta: string; href: string; product: ProductId; topic?: string; photo?: string };
type Column = { label: string; links: Entry[] };

const resources = [
  { name: "Help centre", href: "/resources" },
  { name: "Guides", href: "/resources#guides" },
  { name: "Changelog", href: "/resources#changelog" },
  { name: "Blog", href: "/resources#blog" },
];
const trust = [
  { name: "Security", href: "/security" },
  { name: "System status", href: "/status" },
  { name: "Terms of service", href: "/terms" },
  { name: "Privacy policy", href: "/privacy" },
];

/** The product render each menu story card crops, like a photo. */
const thumbs: Record<ProductId, ShotId> = {
  academy: "academy-storefront",
  assess: "assess-review",
  ai: "ai-student",
};
const audiencePhoto: Record<string, string | undefined> = {
  schools: "/photos/children-group.jpg",
  coaching: "/photos/college-class.jpg",
};

const productFeature = (id: ProductId): Feature => {
  const p = products.find((x) => x.id === id)!;
  return { title: p.short, cta: `See ${p.name}`, href: p.href, product: id };
};
const latest = posts[0];

/** Each menu: two link columns and the story card the hovered link drives. */
const menus: Record<MenuKey, { columns: Column[]; feature: Feature }> = {
  products: {
    columns: [
      { label: "Products", links: products.map((p) => ({ name: p.name, href: p.href, dot: productColor[p.id], tag: p.status, feature: productFeature(p.id) })) },
      {
        label: "Platform",
        links: [
          { name: "One learner record", href: "/platform" },
          { name: "Roles and access", href: "/platform#roles" },
          { name: "Audit log", href: "/platform#audit-title" },
          { name: "Integrations", href: "/platform#int-title" },
        ],
      },
    ],
    feature: productFeature("academy"),
  },
  solutions: {
    columns: [
      {
        label: "By institution",
        links: audiences.map((a) => ({ name: a.name, href: `/solutions/${a.id}`, feature: { title: a.line, cta: `See ${a.name.toLowerCase()}`, href: `/solutions/${a.id}`, product: a.id === "academies" ? "academy" : a.uses[0], photo: audiencePhoto[a.id] } })),
      },
      {
        label: "By team",
        links: [
          { name: "Teachers", href: "/products/academy", feature: productFeature("academy") },
          { name: "Exam cells", href: "/products/assessments", feature: productFeature("assess") },
          { name: "Students and parents", href: "/products/ai-doubt-solver", feature: productFeature("ai") },
        ],
      },
    ],
    feature: { title: audiences[1].line, cta: "See coaching centres", href: "/solutions/coaching", product: "academy", photo: audiencePhoto.coaching },
  },
  resources: {
    columns: [
      { label: "Learn", links: resources },
      { label: "Trust", links: trust },
    ],
    feature: { title: latest.title, cta: "Read the post", href: `/resources/blog/${latest.slug}`, product: topicProduct(latest.topic), topic: latest.topic },
  },
};


export function NavBar() {
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [dir, setDir] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const triggers = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  const mainNav = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  const show = (k: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    if (open && open !== k) setDir(order.indexOf(k) > order.indexOf(open) ? 1 : -1);
    else if (!open) setDir(0);
    setOpen(k);
  };
  // keyboard: Enter, Space or ArrowDown opens the menu and moves focus into it
  const openWithKeys = (e: React.KeyboardEvent, k: MenuKey) => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "ArrowDown") return;
    e.preventDefault();
    show(k);
    window.setTimeout(() => document.querySelector<HTMLElement>("#nav-panel a")?.focus(), 60);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobile(false);
      setOpen((k) => {
        // hand focus back to the trigger when it was inside the panel
        if (k && document.activeElement?.closest("#nav-panel")) triggers.current[k]?.focus();
        return null;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // touch and pen have no hover-out: a tap outside the menu closes it
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (mainNav.current && !mainNav.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);
  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const pill = hover ?? open;
  const item = (key: string, children: React.ReactNode) => (
    <span className="relative" onPointerEnter={(e) => e.pointerType === "mouse" && setHover(key)}>
      {pill === key && (
        <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-[10px] bg-surface-2" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }} />
      )}
      {children}
    </span>
  );
  const link = "relative flex h-10 items-center gap-1 rounded-[10px] px-3 text-ui text-ink-2 transition-colors hover:text-ink";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "absolute inset-0 border-b transition-[background-color,border-color] duration-300",
          open ? "border-line bg-surface" : scrolled ? "border-line/70 bg-paper/90 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent",
        )}
      />
      <div className="wrap relative flex h-16 items-center gap-5">
        <Logo />
        <nav
          ref={mainNav}
          aria-label="Main"
          className="hidden flex-1 lg:block"
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            setHover(null);
            scheduleClose();
          }}
        >
          <ul className="flex items-center">
            {order.map((k, i) => (
              <Fragment key={k}>
                <li>
                  {item(
                    k,
                    <button
                      ref={(el) => {
                        triggers.current[k] = el;
                      }}
                      onPointerEnter={(e) => e.pointerType === "mouse" && show(k)}
                      onClick={() => (open === k ? setOpen(null) : show(k))}
                      onKeyDown={(e) => openWithKeys(e, k)}
                      aria-expanded={open === k}
                      aria-controls="nav-panel"
                      className={cn(link, open === k && "text-ink")}
                    >
                      {labels[k]}
                      <ChevronDown className={cn("size-3.5 transition-transform duration-300", open === k && "rotate-180")} strokeWidth={2} />
                    </button>,
                  )}
                </li>
                {i === 1 && (
                  <li onPointerEnter={(e) => e.pointerType === "mouse" && scheduleClose()}>
                    {item("platform", <Link href="/platform" className={link}>Platform</Link>)}
                  </li>
                )}
              </Fragment>
            ))}
            <li onPointerEnter={(e) => e.pointerType === "mouse" && scheduleClose()}>{item("pricing", <Link href="/pricing" className={link}>Pricing</Link>)}</li>
          </ul>

          <AnimatePresence>
            {open && (
              <motion.div
                id="nav-panel"
                onPointerEnter={() => window.clearTimeout(closeTimer.current)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2 }}
                className="fixed inset-x-0 top-16 border-b-[1.5px] border-edge bg-surface text-ink"
              >
                <AutoHeight>
                  <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.div
                      key={open}
                      initial={{ opacity: 0, x: dir * 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: dir * -32 }}
                      transition={{ duration: 0.28, ease: ease.out }}
                    >
                      <MenuPanel menu={open} onNavigate={() => setOpen(null)} />
                    </motion.div>
                  </AnimatePresence>
                </AutoHeight>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle className="hidden sm:grid" />
          <Link href="/sign-in" className="hidden h-10 items-center whitespace-nowrap rounded-[10px] px-3 text-ui text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink md:flex">Sign in</Link>
          <span className="hidden xl:contents">
            <ButtonLink href="/demo#contact" variant="outline" size="sm">Contact sales</ButtonLink>
          </span>
          <span className="ml-1.5 hidden sm:contents">
            <ButtonLink href="/demo" size="sm" media="/clips/academy.mp4" mediaSide="below">Book a demo</ButtonLink>
          </span>
          <button className="grid size-10 place-items-center rounded-lg hover:bg-surface-2 lg:hidden" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile(true)}>
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* dims the page under an open menu; a tap on it closes the menu */}
      <AnimatePresence>
        {open && <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-x-0 bottom-0 top-16 -z-10 hidden bg-paper/60 backdrop-blur-[2px] lg:block" />}
      </AnimatePresence>
      <AnimatePresence>{mobile && <MobileMenu onClose={() => setMobile(false)} />}</AnimatePresence>
    </header>
  );
}

/** Animates the panel height as menus of different sizes swap in. */
function AutoHeight({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<number | "auto">("auto");
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <motion.div animate={{ height: h }} transition={{ duration: 0.32, ease: ease.out }} className="overflow-hidden">
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}

function MenuPanel({ menu, onNavigate }: { menu: MenuKey; onNavigate: () => void }) {
  const m = menus[menu];
  const [feature, setFeature] = useState<Feature>(m.feature);
  return (
    <div className="wrap grid grid-cols-12 gap-6 pb-8 pt-8">
      {m.columns.map((c) => (
        <div key={c.label} className="col-span-4">
          <p className="marker">{c.label}</p>
          <ul className="mt-4">
            {c.links.map((l) => (
              <li key={l.name}>
                <Link
                  href={l.href}
                  onClick={onNavigate}
                  onPointerEnter={() => l.feature && setFeature(l.feature)}
                  onFocus={() => l.feature && setFeature(l.feature)}
                  className="group flex min-h-12 items-center gap-3 whitespace-nowrap rounded-[10px] text-[26px] font-[480] leading-tight tracking-[-0.025em] text-ink-2 transition-colors hover:text-ink"
                >
                  {l.dot && <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: l.dot }} />}
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1.5px]">{l.name}</span>
                  {l.tag && <span className="rounded-full bg-ai-soft px-2 py-0.5 text-[12px] font-medium tracking-normal text-ai">{l.tag}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="col-span-4">
        <Story f={feature} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

/** The story card: a product render (or a photo for an institution) cropped like a photo, its line on top, a pill to read on. */
function Story({ f, onNavigate }: { f: Feature; onNavigate: () => void }) {
  return (
    <Link href={f.href} onClick={onNavigate} tabIndex={-1} aria-hidden className="frame group relative block h-[21rem] overflow-hidden" style={{ background: productSoft[f.product] }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={f.href + f.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: ease.out }} className="absolute inset-0">
          {f.photo ? (
            <>
              <Image src={f.photo} alt="" fill sizes="420px" className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]" style={{ objectPosition: "50% 35%" }} />
              <span className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-surface/95 to-transparent" />
            </>
          ) : f.topic ? (
            <div className="pointer-events-none absolute left-[14%] top-[30%] w-[640px] origin-top-left scale-[0.7] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-2">
              <PostThumb topic={f.topic} size="lg" />
            </div>
          ) : (
            <div className="pointer-events-none absolute left-[10%] top-[30%] w-[170%] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-2">
              <Shot id={thumbs[f.product]} alt="" sizes="700px" className="shadow-3" />
            </div>
          )}
          <p className="absolute inset-x-6 top-5 line-clamp-2 text-h4 text-ink">{f.title}</p>
        </motion.div>
      </AnimatePresence>
      <span className="absolute bottom-5 left-6 inline-flex h-10 items-center gap-2 rounded-[10px] border-[1.5px] border-edge bg-surface px-3.5 text-[14px] font-medium text-ink shadow-[3px_3px_0_0_var(--edge)] transition-[translate,box-shadow] duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0_0_var(--edge)]">
        {f.cta}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [sec, setSec] = useState<string | null>("products");
  type L = { label: string; href: string; dot?: string; tag?: string };
  const groups: { key: string; label: string; links: L[] }[] = [
    { key: "products", label: "Products", links: products.map((p) => ({ label: p.name, href: p.href, dot: productColor[p.id], tag: p.status })) },
    { key: "solutions", label: "Solutions", links: audiences.map((a) => ({ label: a.name, href: `/solutions/${a.id}` })) },
    { key: "resources", label: "Resources", links: [...resources, ...trust].map((r) => ({ label: r.name, href: r.href })) },
  ];
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
    >
      <div className="wrap flex h-16 shrink-0 items-center justify-between">
        <Logo />
        <button className="grid size-10 place-items-center rounded-lg hover:bg-surface-2" aria-label="Close menu" onClick={onClose} autoFocus>
          <X className="size-5" />
        </button>
      </div>
      <div className="wrap flex-1 overflow-y-auto pb-8">
        {groups.map((g, gi) => (
          <motion.div key={g.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * gi, duration: 0.3, ease: ease.out }} className="border-b border-line">
            <button className="flex w-full items-center justify-between py-4 text-[22px] font-medium tracking-[-0.02em]" aria-expanded={sec === g.key} onClick={() => setSec(sec === g.key ? null : g.key)}>
              {g.label}
              <ChevronDown className={cn("size-5 transition-transform", sec === g.key && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {sec === g.key && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }} className="overflow-hidden">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} onClick={onClose} className="flex items-center gap-3 py-2.5 text-body text-ink-2">
                        {l.dot && <span className="size-2 rounded-[2px]" style={{ background: l.dot }} />}
                        {l.label}
                        {l.tag && <span className="rounded-full bg-ai-soft px-2 text-[12px] font-medium text-ai">{l.tag}</span>}
                      </Link>
                    </li>
                  ))}
                  <li className="h-3" />
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {[{ l: "Platform", h: "/platform" }, { l: "Pricing", h: "/pricing" }, { l: "Contact sales", h: "/demo#contact" }, { l: "Sign in", h: "/sign-in" }].map((x) => (
          <Link key={x.l} href={x.h} onClick={onClose} className="block border-b border-line py-4 text-[22px] font-medium tracking-[-0.02em]">{x.l}</Link>
        ))}
        <ButtonLink href="/demo" size="lg" className="mt-6 w-full">Book a demo</ButtonLink>
        <div className="mt-4 flex items-center justify-between rounded-[10px] border border-line py-1 pl-4 pr-1">
          <span className="text-ui text-ink-2">Theme</span>
          <span className="flex items-center gap-1 text-meta text-ink-3">
            <span className="dark:hidden">Light</span>
            <span className="hidden dark:inline">Dark</span>
            <ThemeToggle />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
