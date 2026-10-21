"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Ticks } from "@/components/ui/Backdrop";

const field =
  "block h-12 w-full rounded-[10px] border border-line bg-paper px-3.5 text-body text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] duration-150 hover:border-line-2 focus:border-ink focus:shadow-[0_0_0_4px_var(--inset)] focus-visible:outline-none aria-[invalid=true]:border-signal";

function Err({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.p id={id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: ease.out }} className="overflow-hidden text-meta text-signal">
          <span className="block pt-2">{msg}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Pending({ children }: { children: string }) {
  return (
    <span role="status" className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[12px] bg-signal/80 text-body font-medium text-on-signal">
      <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden />
      {children}
    </span>
  );
}

/** "sunrise-public-school" -> "Sunrise Public School" */
const displayName = (slug: string) => slug.split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const initialsOf = (name: string) => name.split(" ").map((w) => w[0]).slice(0, 2).join("") || "?";

export function SignIn() {
  const uid = useId();
  const [stage, setStage] = useState<"org" | "auth">("org");
  const [slug, setSlug] = useState("");
  const [slugErr, setSlugErr] = useState("");
  const [busy, setBusy] = useState(false);

  const host = `${slug}.lireons.com`;
  const name = displayName(slug);
  const checkSlug = (s: string) => (!s ? "Enter your institution’s address." : /^[a-z0-9]([a-z0-9-]{0,40}[a-z0-9])?$/.test(s) && s.length >= 2 ? "" : "Use letters, numbers and hyphens only, as in your welcome email.");

  const goOrg = (e: React.FormEvent) => {
    e.preventDefault();
    const err = checkSlug(slug);
    setSlugErr(err);
    if (err) return;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setStage("auth");
    }, 700);
  };

  return (
    <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
    <div className="mx-auto w-full max-w-[440px] lg:col-span-5 lg:mx-0">
      <AnimatePresence mode="wait" initial={false}>
        {stage === "org" ? (
          <motion.div key="org" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: ease.out }}>
            <h1 className="text-d3">Sign in</h1>
            <p className="mt-3 text-body text-ink-2">Each institution has its own address on Lireons. Start with yours.</p>
            <form noValidate onSubmit={goOrg} className="relative mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <Ticks inset={8} />
              <label htmlFor={`${uid}-slug`} className="text-ui font-medium">Your institution’s URL</label>
              <div className={cn("mt-2 flex h-12 items-stretch overflow-hidden rounded-[10px] border bg-paper transition-[border-color,box-shadow] duration-150 hover:border-line-2 focus-within:border-ink focus-within:shadow-[0_0_0_4px_var(--inset)]", slugErr ? "border-signal" : "border-line")}>
                <input
                  id={`${uid}-slug`}
                  value={slug}
                  onChange={(e) => { const v = e.target.value.toLowerCase().replace(/\s/g, "").replace(/\.lireons\.com.*$/, ""); setSlug(v); if (slugErr) setSlugErr(checkSlug(v)); }}
                  onBlur={() => slug && setSlugErr(checkSlug(slug))}
                  placeholder="yourschool"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  autoFocus
                  aria-invalid={!!slugErr}
                  aria-describedby={`${uid}-slug-hint${slugErr ? ` ${uid}-slug-err` : ""}`}
                  className="min-w-0 flex-1 bg-transparent pl-3.5 text-body placeholder:text-ink-3 focus-visible:outline-none"
                />
                <span className="grid place-items-center pr-3.5 text-body text-ink-3" aria-hidden>.lireons.com</span>
              </div>
              <Err id={`${uid}-slug-err`} msg={slugErr} />
              <p id={`${uid}-slug-hint`} className="mt-2 text-meta text-ink-3">It is in the welcome email from your institution, for example <span className="text-ink-2">yourschool.lireons.com</span>.</p>
              <div className="mt-6">
                {busy ? <Pending>Finding your institution</Pending> : <Button type="submit" size="lg" className="w-full" icon={<ArrowRight className="size-4" />}>Continue</Button>}
              </div>
              <p className="mt-5 text-meta leading-relaxed text-ink-3">Academy storefront on your own domain? Sign in from that domain instead.</p>
            </form>
          </motion.div>
        ) : (
          <motion.div key="auth" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3, ease: ease.out }}>
            <button onClick={() => setStage("org")} className="group -ml-2 inline-flex h-11 items-center gap-1.5 rounded-[10px] px-2 text-ui text-ink-2 transition-colors hover:text-ink">
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
              Change institution
            </button>
            <h1 className="mt-2 text-d3 [overflow-wrap:anywhere]">Sign in to {name}</h1>
            <p className="mt-2 flex items-center gap-2 text-ui text-ink-2"><span className="size-1.5 rounded-full bg-ok" aria-hidden />{host}</p>
            <AuthCard host={host} />
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-8 text-ui text-ink-2">
        New to Lireons?{" "}
        <Link href="/demo" className="-my-2 inline-block py-2 font-medium text-ink underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-ink">Book a demo</Link>
      </p>
    </div>
    <TenantPreview slug={slug} name={name} valid={!!slug && !checkSlug(slug)} state={stage === "auth" ? "found" : busy ? "finding" : "typing"} />
    </div>
  );
}

/** Right half: a glass address bar resolving the tenant as the person types. */
function TenantPreview({ slug, name, valid, state }: { slug: string; name: string; valid: boolean; state: "typing" | "finding" | "found" }) {
  const shown = slug || "yourschool";
  return (
    <div aria-hidden className="relative hidden min-h-[30rem] lg:col-span-6 lg:col-start-7 lg:block">
      <div className="frame absolute inset-0 isolate overflow-hidden bg-surface-2">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
        {/* hard-edged product blocks the glass floats over */}
        <span className="absolute left-[8%] top-[10%] -z-10 size-40 rounded-[28px] border-[1.5px] border-edge bg-academy" />
        <span className="absolute right-[10%] top-[18%] -z-10 size-28 rounded-[22px] border-[1.5px] border-edge bg-assess" />
        <span className="absolute bottom-[12%] left-[30%] -z-10 size-24 rounded-[20px] border-[1.5px] border-edge bg-ai" />
      </div>
      <div className="absolute inset-x-[10%] top-1/2 -translate-y-1/2">
        <div className="glass rounded-2xl p-5">
          <div className="flex h-12 items-center gap-2.5 rounded-[12px] border border-line bg-surface px-4 text-body">
            <Lock className={cn("size-4 shrink-0 transition-colors", state === "found" ? "text-ok" : "text-ink-3")} />
            <span className="min-w-0 truncate">
              <span className={cn("font-medium", slug ? "text-ink" : "text-ink-3")}>{shown}</span>
              <span className="text-ink-3">.lireons.com</span>
            </span>
            {state === "typing" && <span className="h-5 w-px bg-ink motion-safe:animate-[blink_1s_steps(1)_infinite]" />}
            {state === "finding" && <LoaderCircle className="ml-auto size-4 shrink-0 text-ink-3 motion-safe:animate-spin" />}
            {state === "found" && <Check className="ml-auto size-4 shrink-0 text-ok" strokeWidth={2.5} />}
          </div>
          <div className="mt-4 flex items-center gap-4 rounded-[12px] border border-line bg-surface p-4">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={initialsOf(name)} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.25, ease: ease.out }} className={cn("grid size-14 shrink-0 place-items-center rounded-[14px] border-[1.5px] border-edge text-h4", slug ? "bg-inverse text-on-inverse" : "bg-inset text-ink-3")}>
                {slug ? initialsOf(name) : "?"}
              </motion.span>
            </AnimatePresence>
            <div className="min-w-0">
              <p className="truncate text-h4">{slug ? name : "Your institution"}</p>
              <p className="mt-1 flex items-center gap-2 text-meta text-ink-2">
                <span className={cn("size-2 rounded-full", state === "found" ? "bg-ok" : valid ? "bg-ink-3" : "bg-line-2")} />
                {state === "found" ? "Workspace found" : state === "finding" ? "Finding your institution" : valid ? "Ready to continue" : "Type your address"}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(["academy", "assess", "ai"] as const).map((p, i) => (
              <motion.span key={p} animate={{ opacity: state === "found" ? 1 : 0.35 }} transition={{ duration: 0.3, delay: state === "found" ? i * 0.06 : 0 }} className="h-2 rounded-full" style={{ background: `var(--p-${p})` }} />
            ))}
          </div>
          <p className="mt-4 text-meta text-ink-2">Every institution has its own address and its own data.</p>
        </div>
      </div>
    </div>
  );
}

function AuthCard({ host }: { host: string }) {
  const uid = useId();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState<string | null>(null);
  const switchTo = (m: "password" | "otp") => {
    setDir(m === "otp" ? 1 : -1);
    setMode(m);
  };

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="p-6 sm:p-7">
        <div role="tablist" aria-label="Sign-in method" className="grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1">
          {(["password", "otp"] as const).map((m) => (
            <button key={m} role="tab" id={`${uid}-tab-${m}`} aria-selected={mode === m} aria-controls={`${uid}-panel`} onClick={() => switchTo(m)} className={cn("relative h-10 rounded-full px-2 text-ui transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal", mode === m ? "font-medium text-ink" : "text-ink-3 hover:text-ink")}>
              {mode === m && <motion.span layoutId={`${uid}-tab`} aria-hidden className="seg-on absolute inset-0 rounded-full" transition={{ type: "spring", visualDuration: 0.3, bounce: 0.12 }} />}
              <span className="relative">{m === "password" ? "Email and password" : "Sign in with OTP"}</span>
            </button>
          ))}
        </div>

        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${mode}`} className="relative mt-6">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={mode}
              custom={dir}
              variants={{ enter: (d: number) => ({ opacity: 0, x: d * 40 }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: d * -40 }) }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: ease.out }}
            >
              {mode === "password" ? <PasswordForm host={host} onDone={setDone} onOtp={() => switchTo("otp")} /> : <OtpForm host={host} onDone={setDone} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="my-6 flex items-center gap-3 text-meta text-ink-3" aria-hidden>
          <span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" />
        </div>
        <Button type="button" variant="outline" size="lg" className="w-full" icon={<GoogleG />} onClick={() => setDone(`Continuing with Google for ${host}`)}>Continue with Google</Button>
      </div>
      <div aria-live="polite" className="border-t border-line bg-paper/60 px-6 text-ui text-ink-2 empty:hidden sm:px-7">
        {done && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 py-4">
            <LoaderCircle className="size-4 shrink-0 text-ink-3 motion-safe:animate-spin" aria-hidden />
            {done}
          </motion.p>
        )}
      </div>
    </div>
  );
}

function PasswordForm({ host, onDone, onOtp }: { host: string; onDone: (m: string) => void; onOtp: () => void }) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<{ email?: string; pw?: string }>({});
  const [busy, setBusy] = useState(false);
  const vEmail = (v: string) => (!v.trim() ? "Enter your email." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "That email looks incomplete.");
  const vPw = (v: string) => (v ? "" : "Enter your password.");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { email: vEmail(email), pw: vPw(pw) };
    setErr(next);
    if (next.email || next.pw) return;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      onDone(`Signing you in to ${host}`);
    }, 900);
  };

  return (
    <form noValidate onSubmit={submit} className="grid gap-5">
      <div>
        <label htmlFor={`${uid}-e`} className="text-ui font-medium">Email</label>
        <input id={`${uid}-e`} type="email" autoComplete="username" inputMode="email" value={email} onChange={(e) => { setEmail(e.target.value); if (err.email) setErr((x) => ({ ...x, email: vEmail(e.target.value) })); }} onBlur={() => email && setErr((x) => ({ ...x, email: vEmail(email) }))} aria-invalid={!!err.email} aria-describedby={err.email ? `${uid}-e-err` : undefined} className={cn(field, "mt-2")} placeholder="you@school.edu.in" />
        <Err id={`${uid}-e-err`} msg={err.email} />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor={`${uid}-p`} className="text-ui font-medium">Password</label>
          <button type="button" onClick={onOtp} className="-my-3 inline-block py-3 text-meta text-ink-3 underline decoration-line-2 underline-offset-4 transition-colors hover:text-ink">Forgot it? Use OTP</button>
        </div>
        <div className="relative mt-2">
          <input id={`${uid}-p`} type={show ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => { setPw(e.target.value); if (err.pw) setErr((x) => ({ ...x, pw: vPw(e.target.value) })); }} aria-invalid={!!err.pw} aria-describedby={err.pw ? `${uid}-p-err` : undefined} className={cn(field, "pr-12")} />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-[10px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink">
            {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
        <Err id={`${uid}-p-err`} msg={err.pw} />
      </div>
      {busy ? <Pending>Signing in</Pending> : <Button type="submit" size="lg" className="w-full">Sign in</Button>}
    </form>
  );
}

function OtpForm({ host, onDone }: { host: string; onDone: (m: string) => void }) {
  const uid = useId();
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [codeErr, setCodeErr] = useState("");
  const [wait, setWait] = useState(0);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  const vPhone = (v: string) => {
    const d = v.replace(/\D/g, "");
    return !d ? "Enter your mobile number." : /^[6-9]\d{9}$/.test(d) ? "" : "Enter a 10-digit Indian mobile number.";
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const er = vPhone(phone);
    setErr(er);
    if (er) return;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setSent(true);
      setWait(30);
      setCode(Array(6).fill(""));
    }, 800);
  };

  const setDigit = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setCode((c) => c.map((x, k) => (k === i ? "" : x)));
      return;
    }
    setCode((c) => {
      const next = [...c];
      digits.slice(0, 6 - i).split("").forEach((d, k) => (next[i + k] = d));
      return next;
    });
    setCodeErr("");
    boxes.current[Math.min(i + digits.length, 5)]?.focus();
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join("").length < 6) {
      setCodeErr("Enter all 6 digits.");
      boxes.current[code.findIndex((c) => !c)]?.focus();
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      onDone(`Verified. Signing you in to ${host}`);
    }, 900);
  };

  const masked = `+91 ${phone.replace(/\D/g, "").slice(0, 2)}••• ••${phone.replace(/\D/g, "").slice(-3)}`;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!sent ? (
        <motion.form key="phone" noValidate onSubmit={send} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25, ease: ease.out }} className="grid gap-5">
          <div>
            <label htmlFor={`${uid}-ph`} className="text-ui font-medium">Mobile number</label>
            <div className={cn("mt-2 flex h-12 items-stretch overflow-hidden rounded-[10px] border bg-paper transition-[border-color,box-shadow] hover:border-line-2 focus-within:border-ink focus-within:shadow-[0_0_0_4px_var(--inset)]", err ? "border-signal" : "border-line")}>
              <span className="grid place-items-center border-r border-line px-3.5 text-body text-ink-2 num" aria-hidden>+91</span>
              <input id={`${uid}-ph`} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={12} value={phone} onChange={(e) => { setPhone(e.target.value.replace(/[^\d ]/g, "")); if (err) setErr(vPhone(e.target.value)); }} onBlur={() => phone && setErr(vPhone(phone))} aria-invalid={!!err} aria-describedby={`${uid}-ph-hint${err ? ` ${uid}-ph-err` : ""}`} className="min-w-0 flex-1 bg-transparent px-3.5 text-body num placeholder:text-ink-3 focus-visible:outline-none" placeholder="98765 43210" />
            </div>
            <Err id={`${uid}-ph-err`} msg={err} />
            <p id={`${uid}-ph-hint`} className="mt-2 text-meta text-ink-3">Use the number your institution has on record. We send the code by SMS and WhatsApp.</p>
          </div>
          {busy ? <Pending>Sending code</Pending> : <Button type="submit" size="lg" className="w-full">Send OTP</Button>}
        </motion.form>
      ) : (
        <motion.form key="code" noValidate onSubmit={verify} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: ease.out }} className="grid gap-5">
          <fieldset>
            <legend className="text-ui font-medium">Enter the 6-digit code</legend>
            <p className="mt-1 text-meta text-ink-3">Sent to <span className="text-ink-2 num">{masked}</span>. <button type="button" onClick={() => setSent(false)} className="-my-3 inline-block py-3 underline decoration-line-2 underline-offset-4 hover:text-ink">Change number</button></p>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { boxes.current[i] = el; }}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !code[i] && i > 0) boxes.current[i - 1]?.focus();
                    if (e.key === "ArrowLeft" && i > 0) boxes.current[i - 1]?.focus();
                    if (e.key === "ArrowRight" && i < 5) boxes.current[i + 1]?.focus();
                  }}
                  onFocus={(e) => e.currentTarget.select()}
                  autoFocus={i === 0}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Digit ${i + 1} of 6`}
                  aria-invalid={!!codeErr && !d}
                  className={cn(field, "h-14 px-0 text-center text-[22px] font-medium num", d && "border-ink-3")}
                />
              ))}
            </div>
            <Err id={`${uid}-code-err`} msg={codeErr} />
          </fieldset>
          {busy ? <Pending>Verifying</Pending> : <Button type="submit" size="lg" className="w-full">Verify and sign in</Button>}
          <p className="text-center text-meta text-ink-3">
            {wait > 0 ? <>Resend code in <span className="num">0:{String(wait).padStart(2, "0")}</span></> : <button type="button" onClick={() => send()} className="-my-2 inline-block h-10 font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">Resend code</button>}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/** Monochrome G mark for the Google button. */
function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="currentColor" d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7zM12 21c2.6 0 4.7-.9 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H3.5v2.5A9.5 9.5 0 0 0 12 21zM6.7 13.3a5.7 5.7 0 0 1 0-3.6V7.2H3.5a9.5 9.5 0 0 0 0 8.6zM12 6.8c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9.1 9.1 0 0 0 12 3a9.5 9.5 0 0 0-8.5 4.2l3.2 2.5C7.4 8.5 9.5 6.8 12 6.8z" />
    </svg>
  );
}
