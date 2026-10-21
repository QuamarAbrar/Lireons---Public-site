"use client";
import { AcademyVisual } from "@/components/visuals/AcademyVisual";
import { AssessVisual } from "@/components/visuals/AssessVisual";
import { AiVisual } from "@/components/visuals/AiVisual";

type Id = "academy" | "assess" | "ai";
// zoom into the part of each demo that still reads at button size
const focus: Record<Id, { left: number; top: number }> = {
  academy: { left: -40, top: -36 },
  assess: { left: -40, top: -10 },
  ai: { left: -40, top: 0 },
};

/** Source for the short loops shown inside buttons on hover. Recorded with Playwright. */
export function ClipStage({ id }: { id: Id }) {
  const V = { academy: AcademyVisual, assess: AssessVisual, ai: AiVisual }[id];
  const f = focus[id];
  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-paper">
      <div className="absolute w-[560px]" style={{ left: f.left, top: f.top }}>
        <V compact />
      </div>
    </div>
  );
}
