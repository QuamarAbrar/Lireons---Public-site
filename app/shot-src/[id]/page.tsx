import { notFound } from "next/navigation";
import { screens, shotMeta, type ShotId } from "@/components/shots/registry";
import { ThemeSync } from "./ThemeSync";

export const metadata = { robots: { index: false, follow: false } };

/** Private capture source for the product screenshots (scripts/shots.mjs). Not linked anywhere. */
export default async function ShotSrc({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ theme?: string }> }) {
  const { id } = await params;
  const { theme } = await searchParams;
  if (!(id in shotMeta)) notFound();
  const m = shotMeta[id as ShotId];
  const C = screens[id as ShotId];
  const dark = theme === "dark";
  return (
    <div className={dark ? "dark" : undefined}>
      <ThemeSync dark={dark} />
      <div id="shot" className="relative overflow-hidden bg-paper font-sans text-ink antialiased" style={{ width: m.w, height: m.h }}>
        <C />
      </div>
    </div>
  );
}
