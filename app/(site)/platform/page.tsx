import type { Metadata } from "next";
import { AuditLog, Integrations, PlatformHero, RoleMatrix } from "@/components/platform/Platform";
import { CtaBand } from "@/components/product/Sections";
import { CtaShot } from "@/components/pages/CtaBand";
import { ShotCrop } from "@/components/pages/ShotCrop";

export const metadata: Metadata = {
  title: "Platform",
  description: "The shared student record under every Lireons product, with role-based permissions, an audit log across products, and integrations with Razorpay, UPI, WhatsApp and more.",
  alternates: { canonical: "/platform" },
};

export default function PlatformPage() {
  return (
    <>
      <PlatformHero />
      <RoleMatrix />
      <AuditLog />
      <Integrations />
      <CtaBand
        title="See your roles and records on Lireons."
        body="We will set up your roles during the demo and show you the audit log filling in as we work."
        primary={{ href: "/demo", label: "Book a demo", media: "/clips/assess.mp4" }}
        secondary={{ href: "/security", label: "Security overview" }}
        visual={
          <CtaShot product="assess">
            <ShotCrop id="security-admin" region={[0.16, 0.12, 0.56, 0.6]} width={520} alt="The append-only audit log: time, person, event and the record it touched, across every product" />
          </CtaShot>
        }
      />
    </>
  );
}
