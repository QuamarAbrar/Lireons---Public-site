import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { productBySlug, productPages, slugOf } from "@/lib/product-pages";
import { ProductPage } from "@/components/product/ProductPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: slugOf(p) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  const d = productPages[p.id];
  return {
    title: p.status ? `${p.name} (${p.status.toLowerCase()})` : p.name,
    description: d.description,
    alternates: { canonical: p.href },
    openGraph: { title: `${p.name} | Lireons`, description: d.description, url: p.href },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  return <ProductPage id={p.id} />;
}
