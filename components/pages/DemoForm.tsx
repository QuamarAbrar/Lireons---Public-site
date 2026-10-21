"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarClock, Check, Copy, LoaderCircle, Mail, Video } from "lucide-react";
import { products, type ProductId } from "@/lib/products";
import { productColor, productSoft } from "@/components/visuals/Frame";
import { Button } from "@/components/ui/Button";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ShowcaseFrame } from "@/components/product/ShowcaseFrame";
import { ShotPair } from "@/components/product/ShotPair";
import type { ShotId } from "@/components/shots/meta";

const types = [
  { id: "school", label: "K-12 school" },
  { id: "coaching", label: "Coaching centre" },
  { id: "academy", label: "Online academy" },
  { id: "other", label: "Other" },
] as const;
const agenda = [
  { m: "0 to 5", w: 5, t: "Your setup", b: "How you run classes, courses and tests today." },
  { m: "5 to 20", w: 15, t: "The products you picked", b: "Live in a demo tenant, with your data." },
  { m: "20 to 25", w: 5, t: "Moving over", b: "How the import works in the first week." },
  { m: "25 to 30", w: 5, t: "Questions and pricing", b: "A quote follows for the plan we discussed." },
];
const sizes = ["Under 200", "200 to 499", "500 to 999", "1,000 to 2,999", "3,000 to 9,999", "10,000 or more"];
const sizeFor = (n: number) => (n < 200 ? 0 : n < 500 ? 1 : n < 1000 ? 2 : n < 3000 ? 3 : n < 10000 ? 4 : 5);

/** What the walkthrough shows for the product picked first: the admin's screen and the phone it reaches. */
const demoShots: Record<ProductId, { desk: ShotId; phone: ShotId }> = {
  academy: { desk: "academy-builder", phone: "phone-student-lesson" },
  assess: { desk: "assess-review", phone: "phone-candidate-check" },
  ai: { desk: "ai-teacher", phone: "phone-student-doubt" },
};

type Values = { name: string; email: string; phone: string; org: string; type: string; size: string; products: ProductId[]; message: string };
type Key = keyof Values;
const order: Key[] = ["name", "email", "phone", "org", "type", "size", "products", "message"];

function validate(k: Key, v: Values): string {
  switch (k) {
    case "name":
      return v.name.trim().length < 2 ? "Enter your full name." : "";
    case "email":
      if (!v.email.trim()) return "Enter your work email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()) ? "" : "That email looks incomplete. Check for a missing @ or domain.";
    case "phone": {
      const d = v.phone.replace(/\D/g, "");
      if (!d) return "Enter a mobile number so we can confirm the time.";
      return /^[6-9]\d{9}$/.test(d) ? "" : "Enter a 10-digit Indian mobile number.";
    }
    case "org":
      return v.org.trim().length < 2 ? "Enter your institution’s name." : "";
    case "type":
      return v.type ? "" : "Choose the kind of institution.";
    case "size":
      return v.size ? "" : "Choose a range. A rough number is fine.";
    case "products":
      return v.products.length ? "" : "Pick at least one product.";
    case "message":
      return v.message.length > 1000 ? "Keep the message under 1,000 characters." : "";
  }
}

const inputCls =
  "block h-12 w-full rounded-[10px] border bg-paper px-3.5 text-body text-ink placeholder:font-normal placeholder:text-ink-3/55 transition-[border-color,box-shadow] duration-150 hover:border-line-2 focus:border-ink focus:shadow-[0_0_0_4px_var(--inset)] focus-visible:outline-none";

function Field({ id, label, hint, error, optional, children }: { id: string; label: string; hint?: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-ui font-medium">
        {label}
        {optional && <span className="text-meta font-normal text-ink-3">Optional</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-meta text-ink-3">{hint}</p>}
      <div className="mt-2">{children}</div>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p id={id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: ease.out }} className="overflow-hidden text-meta text-signal">
          <span className="block pt-2">{error}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function DemoForm() {
  const params = useSearchParams();
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const initial = (): Values => {
    const valid = new Set(products.map((p) => p.id));
    const fromQ = (params.get("products") ?? "").split(",").map((s) => s.trim()).filter((s): s is ProductId => valid.has(s as ProductId));
    const n = Number(params.get("students"));
    return { name: "", email: "", phone: "", org: "", type: "", size: n > 0 ? sizes[sizeFor(n)] : "", products: fromQ, message: "" };
  };
  const [v, setV] = useState<Values>(initial);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const set = <K extends Key>(k: K, val: Values[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    // once a field has been visited, re-check it as the person corrects it
    if (touched[k] || errors[k]) setErrors((e) => ({ ...e, [k]: validate(k, next) }));
  };
  const blur = (k: Key) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validate(k, v) }));
  };
  const toggleProduct = (p: ProductId) => {
    const next = v.products.includes(p) ? v.products.filter((x) => x !== p) : [...v.products, p];
    set("products", next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const all: Partial<Record<Key, string>> = {};
    order.forEach((k) => (all[k] = validate(k, v)));
    setErrors(all);
    setTouched(Object.fromEntries(order.map((k) => [k, true])));
    const first = order.find((k) => all[k]);
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.focus();
      return;
    }
    setStatus("sending");
    window.setTimeout(() => setStatus("done"), 1400);
  };

  useEffect(() => {
    if (status === "done") {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, [status]);

  const reset = () => {
    setV({ ...initial(), products: v.products });
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  const describe = (k: Key, hint?: boolean) => [hint ? id(`${k}-hint`) : "", errors[k] ? id(`${k}-error`) : ""].filter(Boolean).join(" ") || undefined;
  const lead = (v.products.find((p) => p !== "ai") ?? v.products[0] ?? "academy") as ProductId;
  const chosen = products.filter((p) => v.products.includes(p.id));

  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-6">
        <div ref={resultRef} tabIndex={-1} aria-live="polite" className="scroll-mt-28 focus-visible:outline-none">
          <AnimatePresence mode="wait" initial={false}>
            {status !== "done" ? (
              <motion.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={submit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: ease.out }}
                className="frame grid gap-7 bg-surface p-5 sm:p-8"
                aria-busy={status === "sending"}
              >
                <Field id={id("name")} label="Full name" error={errors.name}>
                  <input data-field="name" id={id("name")} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} aria-invalid={!!errors.name} aria-describedby={describe("name")} className={cn(inputCls, errors.name ? "border-signal" : "border-line")} placeholder="Your name" />
                </Field>
                <Field id={id("email")} label="Work email" hint="Use your institution’s address if you have one." error={errors.email}>
                  <input data-field="email" id={id("email")} type="email" inputMode="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} aria-invalid={!!errors.email} aria-describedby={describe("email", true)} className={cn(inputCls, errors.email ? "border-signal" : "border-line")} placeholder="name@institution.in" />
                </Field>
                <Field id={id("phone")} label="Mobile number" error={errors.phone}>
                  <div className={cn("flex h-12 items-stretch overflow-hidden rounded-[10px] border bg-paper transition-[border-color,box-shadow] duration-150 hover:border-line-2 focus-within:border-ink focus-within:shadow-[0_0_0_4px_var(--inset)]", errors.phone ? "border-signal" : "border-line")}>
                    <span className="grid place-items-center border-r border-line px-3.5 text-body text-ink-2 num" aria-hidden>+91</span>
                    <input data-field="phone" id={id("phone")} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={12} value={v.phone} onChange={(e) => set("phone", e.target.value.replace(/[^\d ]/g, ""))} onBlur={() => blur("phone")} aria-invalid={!!errors.phone} aria-describedby={describe("phone")} aria-label="Mobile number, India +91" className="min-w-0 flex-1 bg-transparent px-3.5 text-body num placeholder:font-normal placeholder:text-ink-3/55 focus-visible:outline-none" placeholder="10-digit mobile" />
                  </div>
                </Field>
                <Field id={id("org")} label="Institution name" error={errors.org}>
                  <input data-field="org" id={id("org")} autoComplete="organization" value={v.org} onChange={(e) => set("org", e.target.value)} onBlur={() => blur("org")} aria-invalid={!!errors.org} aria-describedby={describe("org")} className={cn(inputCls, errors.org ? "border-signal" : "border-line")} placeholder="Institution and city" />
                </Field>

                <fieldset className="min-w-0" aria-describedby={errors.type ? id("type-error") : undefined}>
                  <legend className="text-ui font-medium">Institution type</legend>
                  <div className={cn("mt-2 grid gap-2 sm:flex sm:gap-1 sm:rounded-full sm:border sm:bg-surface-2 sm:p-1", errors.type ? "sm:border-signal" : "sm:border-line")}>
                    {types.map((t, i) => {
                      const on = v.type === t.id;
                      return (
                        <label
                          key={t.id}
                          className={cn(
                            "relative flex h-12 cursor-pointer items-center gap-3 rounded-[10px] border px-4 text-ui transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal sm:h-10 sm:flex-auto sm:justify-center sm:whitespace-nowrap sm:rounded-full sm:border-0 sm:px-3 sm:text-center",
                            on ? "border-ink bg-paper font-medium text-ink sm:bg-transparent" : cn("bg-paper text-ink-2 hover:text-ink sm:bg-transparent", errors.type ? "border-signal" : "border-line"),
                          )}
                        >
                          <input data-field={i === 0 ? "type" : undefined} type="radio" name={id("type")} value={t.id} checked={on} onChange={() => { set("type", t.id); setErrors((e) => ({ ...e, type: "" })); }} className="sr-only" />
                          {on && <motion.span layoutId={`${uid}-seg`} aria-hidden className="seg-on absolute inset-0 hidden rounded-full sm:block" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.12 }} />}
                          <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] sm:hidden", on ? "border-ink" : "border-line-2")}>{on && <span className="size-2.5 rounded-full bg-ink" />}</span>
                          <span className="relative">{t.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <ErrorText id={id("type-error")} error={errors.type} />
                </fieldset>

                <Field id={id("size")} label="Number of students" error={errors.size}>
                  <div className="relative">
                    <select data-field="size" id={id("size")} value={v.size} onChange={(e) => { set("size", e.target.value); setErrors((er) => ({ ...er, size: "" })); }} onBlur={() => blur("size")} aria-invalid={!!errors.size} aria-describedby={describe("size")} className={cn(inputCls, "appearance-none pr-10", !v.size && "text-ink-3", errors.size ? "border-signal" : "border-line")}>
                      <option value="" disabled>Choose a range</option>
                      {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
                  </div>
                </Field>

                <fieldset className="min-w-0" aria-describedby={[id("products-hint"), errors.products ? id("products-error") : ""].filter(Boolean).join(" ")}>
                  <legend className="text-ui font-medium">Products you are interested in</legend>
                  <p id={id("products-hint")} className="mt-1 text-meta text-ink-3">Choosing AI Doubt Solver adds you to its waitlist.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {products.map((p, i) => {
                      const on = v.products.includes(p.id);
                      return (
                        <label key={p.id} className={cn("group relative inline-flex h-10 cursor-pointer select-none items-center gap-2 rounded-full border px-3.5 text-ui transition-[border-color,background-color,color] duration-200 active:scale-[0.98] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal", on ? "border-transparent font-medium" : "border-line bg-paper text-ink-2 hover:border-line-2 hover:text-ink")} style={on ? { background: productSoft[p.id], color: productColor[p.id] } : undefined}>
                          <input data-field={i === 0 ? "products" : undefined} type="checkbox" checked={on} onChange={() => toggleProduct(p.id)} className="sr-only" />
                          <span className="grid size-4 place-items-center rounded-[4px] transition-colors" style={{ background: on ? productColor[p.id] : "var(--inset)" }} aria-hidden>
                            <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="size-3 text-white" strokeWidth={3.5} /></motion.span>}</AnimatePresence>
                          </span>
                          {p.name}
                          {p.status && <span className="text-meta">· {p.status}</span>}
                        </label>
                      );
                    })}
                  </div>
                  <ErrorText id={id("products-error")} error={errors.products} />
                </fieldset>

                <Field id={id("message")} label="Anything we should know" optional error={errors.message}>
                  <textarea data-field="message" id={id("message")} rows={4} value={v.message} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")} aria-invalid={!!errors.message} aria-describedby={describe("message")} className={cn(inputCls, "h-auto min-h-28 resize-y py-3 leading-relaxed", errors.message ? "border-signal" : "border-line")} placeholder="Branches, how you teach and test today, what you want to fix first" />
                  <p className={cn("mt-1.5 text-right text-meta num", v.message.length > 1000 ? "text-signal" : "text-ink-3")} aria-hidden>{v.message.length.toLocaleString("en-IN")} / 1,000</p>
                </Field>

                <div className="flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[36ch] text-meta leading-relaxed text-ink-3">We use these details only to arrange your demo. See our <a href="/privacy" className="text-ink-2 underline decoration-line-2 underline-offset-4 hover:text-ink">privacy policy</a>.</p>
                  {status === "sending" ? (
                    <span role="status" className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-xl bg-signal/80 px-6 text-body font-medium text-on-signal">
                      <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden />
                      Sending request
                    </span>
                  ) : (
                    <Button type="submit" size="lg" media={`/clips/${lead}.mp4`} icon={<ArrowRight className="size-4" />}>Request my demo</Button>
                  )}
                </div>
              </motion.form>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: ease.out }}>
                <div className="flex items-center gap-3">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", visualDuration: 0.4, bounce: 0.35, delay: 0.1 }} className="grid size-10 place-items-center rounded-full bg-ok text-white">
                    <Check className="size-5" strokeWidth={2.5} aria-hidden />
                  </motion.span>
                  <h2 className="text-d3">Request received</h2>
                </div>
                <p className="mt-4 max-w-[48ch] text-lead text-ink-2">Thanks, {v.name.trim().split(" ")[0]}. We reply to {v.email.trim()} with times that suit your team, and call +91 {v.phone.trim()} if email is slow.</p>

                <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
                  <h3 className="label">You asked for</h3>
                  <dl className="mt-4 grid gap-x-6 gap-y-4 text-ui sm:grid-cols-2">
                    <div><dt className="text-ink-3">Institution</dt><dd className="mt-0.5 font-medium">{v.org}</dd></div>
                    <div><dt className="text-ink-3">Type</dt><dd className="mt-0.5 font-medium">{types.find((t) => t.id === v.type)?.label}</dd></div>
                    <div><dt className="text-ink-3">Students</dt><dd className="mt-0.5 font-medium num">{v.size}</dd></div>
                    <div className="sm:col-span-2">
                      <dt className="text-ink-3">Products</dt>
                      <dd className="mt-1.5 flex flex-wrap gap-1.5">
                        {chosen.map((p) => (
                          <span key={p.id} className="rounded-md px-2 py-1 text-meta font-medium" style={{ background: productSoft[p.id], color: productColor[p.id] }}>{p.status ? `${p.name} · ${p.status}` : p.name}</span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="mt-8">
                  <Button type="button" variant="outline" size="md" onClick={reset}>Send another request</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ContactLine />
      </div>

      <div className="min-w-0 lg:col-span-5 lg:col-start-8">
        <div className="lg:sticky lg:top-24">
          <AnimatePresence mode="wait" initial={false}>
            {status === "done" ? (
              <motion.div key="slot" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: ease.out, delay: 0.15 }}>
                <SlotCard org={v.org} email={v.email.trim()} chosen={chosen} />
              </motion.div>
            ) : (
              <motion.div key="agenda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: ease.out }}>
          <h2 className="text-h4">What the 30 minutes cover</h2>
          {/* the half hour as a bar: each block is as wide as its share of the call */}
          <div aria-hidden className="mt-5 flex h-2.5 gap-1">
            {agenda.map((s, i) => (
              <motion.span key={s.t} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: ease.out, delay: 0.1 + i * 0.08 }} className={cn("origin-left rounded-[3px]", i === 1 ? "bg-ink" : "bg-line-2")} style={{ flexGrow: s.w }} />
            ))}
          </div>
          <ol className="mt-4 border-t border-line">
            {agenda.map((s) => (
              <li key={s.t} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-line py-3.5">
                <span className="pt-0.5 text-meta text-ink-3 num">{s.m} min</span>
                <span>
                  <span className="block text-ui font-medium">{s.t}</span>
                  <span className="block text-ui text-ink-2">{s.b}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="relative mt-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={lead} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.4, ease: ease.out }}>
                {/* photo slot: a Lireons team member on a call, walking a school admin through their own data (4:5) */}
                <ShowcaseFrame field={productSoft[lead]} tight>
                  <ShotPair desk={demoShots[lead].desk} phones={[demoShots[lead].phone]} width={480} />
                </ShowcaseFrame>
              </motion.div>
            </AnimatePresence>
            <p className="mt-3 text-meta text-ink-3">{products.find((p) => p.id === lead)?.name}, as we walk you through it, with your own data in place of these. Product render; names and figures are illustrative.</p>
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** One line under the form: the two addresses, each with a copy button. */
const emails = [
  { label: "Sales and support", value: "hello@lireons.com" },
  { label: "Security reports", value: "security@lireons.com" },
];

function ContactLine() {
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(null), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);
  const copy = async (v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(v);
    } catch {
      window.location.href = `mailto:${v}`;
    }
  };
  return (
    <div id="contact" className="mt-8 flex scroll-mt-28 flex-wrap items-center gap-x-5 gap-y-2 text-ui text-ink-2">
      <h2 className="text-ui font-medium text-ink">Prefer email?</h2>
      {emails.map((e) => (
        <span key={e.value} className="inline-flex items-center">
          <a href={`mailto:${e.value}`} title={e.label} className="inline-flex min-h-10 items-center text-ink underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-ink">{e.value}</a>
          <button type="button" onClick={() => copy(e.value)} aria-label={`Copy ${e.value}`} className="ml-1 grid size-10 place-items-center rounded-[10px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink active:bg-inset">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={copied === e.value ? "ok" : "copy"} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15, ease: ease.out }}>
                {copied === e.value ? <Check className="size-4 text-ok" strokeWidth={2.5} aria-hidden /> : <Copy className="size-4" aria-hidden />}
              </motion.span>
            </AnimatePresence>
          </button>
        </span>
      ))}
      <span role="status" className="sr-only">{copied ? `Copied ${copied}` : ""}</span>
    </div>
  );
}

/** After a request: the aside becomes the slot being arranged, one timeline only. */
function SlotCard({ org, email, chosen }: { org: string; email: string; chosen: typeof products }) {
  const steps = [
    { t: "Requested", d: "Just now", done: true },
    { t: "Time confirmed", d: "By email", done: false },
    { t: "Walkthrough", d: "30 minutes", done: false },
  ];
  return (
    <section aria-labelledby="slot-title" className="frame overflow-hidden bg-surface">
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span aria-hidden className="grid w-16 shrink-0 overflow-hidden rounded-[10px] border-[1.5px] border-edge text-center">
          <span className="bg-inverse py-1 text-meta font-medium text-on-inverse">Slot</span>
          <span className="grid h-12 place-items-center bg-paper"><CalendarClock className="size-6 text-ink" strokeWidth={1.75} /></span>
        </span>
        <div className="min-w-0">
          <p className="label">Your slot</p>
          <h2 id="slot-title" className="mt-1 text-h4">30-minute walkthrough</h2>
          <p className="mt-1 text-ui text-ink-2 [overflow-wrap:anywhere]">{org}</p>
        </div>
      </div>
      <dl className="grid gap-4 p-5 text-ui sm:p-6">
        <div className="flex items-start gap-3">
          <Video className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden />
          <div><dt className="sr-only">Where</dt><dd>Video call, link in the confirmation</dd></div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden />
          <div><dt className="sr-only">Confirmation sent to</dt><dd className="[overflow-wrap:anywhere]">{email}</dd></div>
        </div>
        <div>
          <dt className="sr-only">Products</dt>
          <dd className="flex flex-wrap gap-1.5">
            {chosen.map((p) => (
              <span key={p.id} className="rounded-md px-2 py-1 text-meta font-medium text-ink" style={{ background: productSoft[p.id] }}>{p.status ? `${p.name} · ${p.status}` : p.name}</span>
            ))}
          </dd>
        </div>
      </dl>
      <ol className="grid grid-cols-3 border-t border-line bg-paper/60" aria-label="Progress">
        {steps.map((st, i) => (
          <li key={st.t} className={cn("relative px-4 py-4 sm:px-5", i > 0 && "border-l border-line")}>
            <motion.span aria-hidden initial={{ scaleX: 0 }} animate={{ scaleX: st.done ? 1 : 0 }} transition={{ duration: 0.6, ease: ease.out, delay: 0.4 }} className="absolute inset-x-0 top-0 h-1 origin-left bg-ok" />
            <span className="flex items-center gap-1.5 text-meta font-medium text-ink">
              {st.done ? <Check className="size-3.5 text-ok" strokeWidth={3} aria-hidden /> : <span aria-hidden className="size-2 rounded-full border border-line-2" />}
              {st.t}
              <span className="sr-only">{st.done ? ", done" : ", next"}</span>
            </span>
            <span className="mt-0.5 block text-meta text-ink-3">{st.d}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Skeleton shown while search params resolve. */
export function DemoFormSkeleton() {
  return (
    <div className="grid gap-14 lg:grid-cols-12" aria-hidden>
      <div className="grid gap-7 lg:col-span-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton mt-2 h-12 rounded-[10px]" />
          </div>
        ))}
      </div>
      <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
        <div className="skeleton h-5 w-48 rounded" />
        <div className="skeleton mt-4 h-56 rounded-xl" />
        <div className="skeleton mt-8 h-72 rounded-2xl" />
      </div>
    </div>
  );
}
