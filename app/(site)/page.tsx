import { Hero } from "@/components/home/Hero";
import { ProductStory } from "@/components/home/ProductStory";
import { Consolidate } from "@/components/home/Consolidate";
import { Audiences } from "@/components/home/Audiences";
import { Faq, FinalCta, IntegrationStrip } from "@/components/home/Sections";
import { Trust } from "@/components/home/Trust";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mt-16 md:mt-20"><IntegrationStrip /></div>
      <Consolidate />
      <ProductStory />
      <Audiences />
      <Trust />
      <Faq />
      <FinalCta />
    </>
  );
}
