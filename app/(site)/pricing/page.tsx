import type { Metadata } from "next";
import { Comparison, PricingFaq, PricingHero, QuoteSheetPreview } from "@/components/pages/Pricing";
import { CtaBand, CtaShot } from "@/components/pages/CtaBand";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Lireons is priced per active student, per year, for each product you switch on. Build a plan and get a quote for exactly that.",
};

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <Comparison />
      <PricingFaq />
      <CtaBand
        title="Get a quote for exactly your plan."
        body="Book a 30-minute walkthrough. We load your courses or a sample test, then send a quote with every line priced."
        primary={{ href: "/demo", label: "Book a demo", media: "/clips/academy.mp4" }}
        secondary={{ href: "#builder", label: "Change my plan" }}
        visual={
          <CtaShot product="academy">
            <div className="mx-auto max-w-[30rem] rotate-[-1.5deg] drop-shadow-[0_18px_30px_oklch(0_0_0/0.16)] motion-reduce:rotate-0">
              <QuoteSheetPreview />
            </div>
          </CtaShot>
        }
        caption="Example: a quote for Academy and Assessments at 1,000 students. Your quote prices every line."
      />
    </>
  );
}
