import type { ProductId } from "@/lib/products";
import { products } from "@/lib/products";
import { productPages } from "@/lib/product-pages";
import { productColor } from "@/components/visuals/Frame";
import { ProductHero } from "./ProductHero";
import { Walkthrough } from "./Walkthrough";
import { CtaBand, FaqList, ModulesList, WorksWith } from "./Sections";
import { CtaShot } from "@/components/pages/CtaBand";
import { ShotCrop } from "@/components/pages/ShotCrop";

/** Each product page closes on its own screen, never a card another page uses. */
const closing: Record<ProductId, React.ReactNode> = {
  academy: <ShotCrop id="academy-storefront" region={[0, 0.06, 0.62, 0.5]} width={520} alt="The top of BrightPath Academy's storefront on its own domain: headline, Browse courses and a free lesson" />,
  assess: <ShotCrop id="assess-review" region={[0.16, 0.06, 0.4, 0.45]} width={520} alt="Physics Mock 7 live: a grid of candidate webcams, one flagged for review" />,
  ai: <ShotCrop id="ai-student" region={[0.33, 0.3, 0.45, 0.6]} width={520} alt="AI Doubt Solver preview: the working for a quadratic, step by step, with the lesson it was checked against and a confidence meter" />,
};

/** Shared template for /products/[slug]. Everything product-specific comes from lib. */
export function ProductPage({ id }: { id: ProductId }) {
  const p = products.find((x) => x.id === id)!;
  const d = productPages[id];
  const soon = p.status === "Coming soon";
  return (
    <>
      <ProductHero id={id} />
      <Walkthrough id={id} title={d.walk} />
      <ModulesList id={id} modules={d.modules} />
      <WorksWith id={id} shares={d.shares} />
      <FaqList title={`Questions about ${p.name}`} items={d.faqs} />
      <CtaBand
        title={d.closing.title}
        body={d.closing.body}
        primary={{ href: d.cta.href, label: d.cta.label, media: p.clip }}
        secondary={soon ? { href: "/products/academy", label: "See Academy" } : { href: "/pricing", label: "See pricing" }}
        color={productColor[id]}
        visual={<CtaShot product={id}>{closing[id]}</CtaShot>}
        caption={soon ? "Preview of a product that is coming soon. Names and figures are illustrative." : undefined}
      />
    </>
  );
}
