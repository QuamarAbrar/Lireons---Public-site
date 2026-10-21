import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/pages/Article";
import { guideProductColor, guideProductName } from "@/components/pages/GuideRow";
import { guideBySlug, guides, readMinutes, relatedGuides } from "@/lib/resources";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return {};
  const url = `/resources/guides/${g.slug}`;
  return {
    title: g.title,
    description: g.summary,
    alternates: { canonical: url },
    openGraph: { title: `${g.title} | Lireons help centre`, description: g.summary, url, type: "article" },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();
  return (
    <ArticleView
      kind="guide"
      slug={g.slug}
      title={g.title}
      label={guideProductName(g.product)}
      labelColor={guideProductColor(g.product)}
      summary={g.summary}
      meta={[
        { term: "For", value: g.audience },
        { term: "Product", value: guideProductName(g.product) },
        { term: "Reading time", value: `${readMinutes(g.body)} min` },
      ]}
      crumbs={[{ label: "Resources", href: "/resources" }, { label: "Guides", href: "/resources#guides" }]}
      body={g.body}
      related={relatedGuides(g.slug)}
      product={g.product}
    />
  );
}
