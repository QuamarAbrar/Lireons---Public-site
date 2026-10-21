import Link from "next/link";
import { cn } from "@/lib/cn";

/** The mark: an L that frames a single signal square. */
export function Mark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M5 3.5v17h14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="square" />
      <rect x="14.5" y="3.5" width="4.5" height="4.5" fill="var(--signal)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Lireons home" className={cn("group/logo inline-flex h-11 items-center gap-2 text-ink", className)}>
      <Mark className="transition-transform duration-300 ease-[var(--ease-out)] group-hover/logo:-rotate-90" />
      <span className="text-[19px] font-semibold tracking-[-0.03em]">Lireons</span>
    </Link>
  );
}
