import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/pages/Article";
import { byline, guideBySlug, postBySlug, posts, readMinutes, type Guide } from "@/lib/resources";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  const url = `/resources/blog/${p.slug}`;
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: url },
    authors: [{ name: byline }],
    openGraph: { title: `${p.title} | Lireons`, description: p.summary, url, type: "article", publishedTime: p.iso, authors: [byline] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();
  return (
    <ArticleView
      kind="post"
      slug={p.slug}
      title={p.title}
      label={p.topic}
      summary={p.summary}
      meta={[
        { term: "By", value: byline },
        { term: "Published", value: <time dateTime={p.iso} className="num">{p.date}</time> },
        { term: "Reading time", value: `${readMinutes(p.body)} min` },
      ]}
      crumbs={[{ label: "Resources", href: "/resources" }, { label: "Blog", href: "/resources#blog" }]}
      body={p.body}
      topic={p.topic}
      related={p.related.map(guideBySlug).filter((g): g is Guide => !!g)}
    />
  );
}
