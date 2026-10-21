"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
    setDark(next);
  };
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn("grid size-10 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink", className)}
    >
      <span className="relative size-[18px]">
        <Sun className="absolute inset-0 size-[18px] transition-[transform,opacity] duration-300 dark:rotate-90 dark:scale-50 dark:opacity-0" strokeWidth={1.75} />
        <Moon className="absolute inset-0 size-[18px] -rotate-90 scale-50 opacity-0 transition-[transform,opacity] duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100" strokeWidth={1.75} />
      </span>
    </button>
  );
}
