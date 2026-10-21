import type { Metadata } from "next";
import { Accountability, Backups, Disclosure, Isolation, RoleCheck, SecurityHero, TypedConfirm } from "@/components/pages/Security";
import { CtaBand } from "@/components/product/Sections";
import { CtaShot } from "@/components/pages/CtaBand";
import { ShotCrop } from "@/components/pages/ShotCrop";

export const metadata: Metadata = {
  title: "Security",
  description: "How Lireons isolates each institution’s data, controls access by role, logs sensitive actions, keeps AI decisions reviewable and backs up your records.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return (
    <>
      <SecurityHero />
      <Isolation />
      <RoleCheck />
      <Accountability />
      <TypedConfirm />
      <Backups />
      <Disclosure />
      <CtaBand
        title="Ask us the hard questions."
        body="Bring your IT lead to the demo. We will walk through isolation, roles, the audit log and backups on a live tenant, and share our security overview."
        primary={{ href: "/demo", label: "Book a demo", media: "/clips/assess.mp4" }}
        secondary={{ href: "/platform", label: "See the platform" }}
        visual={
          <CtaShot product="academy">
            <ShotCrop id="security-admin" region={[0.725, 0.04, 0.275, 0.72]} width={340} alt="Backup health, active sessions and the typed confirmation to delete a student's data" className="mx-auto max-w-[22rem]" />
          </CtaShot>
        }
      />
    </>
  );
}
