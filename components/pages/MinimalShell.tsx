import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LiveDot } from "@/components/visuals/Frame";

/** Bare chrome for auth and error pages: logo top-left, content centred, a quiet footer. */
/** `ornament` is kept for callers; the cropped decorative mark is gone. */
export function MinimalShell({ children, center = true }: { children: React.ReactNode; center?: boolean; ornament?: boolean }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-paper">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:shadow-2">Skip to content</a>
      <header className="wrap relative z-10 flex h-16 items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>
      <main id="main" className={center ? "wrap relative z-10 flex flex-1 items-center justify-center py-12" : "wrap relative z-10 flex-1 py-12"}>
        {children}
      </main>
      <footer className="wrap relative z-10 flex flex-wrap items-center justify-between gap-4 py-6 text-meta text-ink-3">
        <Link href="/status" className="inline-flex min-h-10 items-center gap-2 transition-colors hover:text-ink">
          <LiveDot color="var(--ok)" />
          All systems normal
        </Link>
        <nav aria-label="Legal" className="flex gap-5">
          <Link href="/terms" className="inline-flex min-h-11 min-w-11 items-center justify-center transition-colors hover:text-ink">Terms</Link>
          <Link href="/privacy" className="inline-flex min-h-11 min-w-11 items-center justify-center transition-colors hover:text-ink">Privacy</Link>
          <Link href="/demo#contact" className="inline-flex min-h-11 min-w-11 items-center justify-center transition-colors hover:text-ink">Help</Link>
        </nav>
      </footer>
    </div>
  );
}
