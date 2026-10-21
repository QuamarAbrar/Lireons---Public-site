"use client";
import { useEffect } from "react";

/** Puts the requested theme on <html> so the page background and color-scheme match the capture. */
export function ThemeSync({ dark }: { dark: boolean }) {
  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("dark", dark);
    el.style.colorScheme = dark ? "dark" : "light";
    document.body.style.margin = "0";
  }, [dark]);
  return null;
}
