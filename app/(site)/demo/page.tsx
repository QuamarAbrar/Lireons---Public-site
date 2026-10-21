import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/pages/PageHeader";
import { DemoForm, DemoFormSkeleton } from "@/components/pages/DemoForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "A 30-minute walkthrough of Lireons with your own courses, batches or tests loaded in.",
};

export default function DemoPage() {
  return (
    <>
      <PageHeader
        label="Book a demo"
        title="See Lireons with your own data."
        lead="Tell us what you want to fix first. We load your courses, batches or a sample test into a demo tenant and walk your team through it in 30 minutes."
        backdrop="dots"
        facts={[
          { k: "Length", v: "30 minutes" },
          { k: "Data", v: "Your own, in a demo tenant" },
          { k: "Who joins", v: "Your office and teachers" },
          { k: "After", v: "A quote for your plan" },
        ]}
      />
      <section aria-label="Demo request" className="wrap pb-20 pt-10 md:pb-28 md:pt-12">
        <Suspense fallback={<DemoFormSkeleton />}>
          <DemoForm />
        </Suspense>
      </section>
    </>
  );
}
