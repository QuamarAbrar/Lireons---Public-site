import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { audiences } from "@/lib/products";
import { solutionPages } from "@/lib/solution-pages";
import { SolutionPage } from "@/components/solutions/SolutionPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return audiences.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = solutionPages[id];
  if (!s) return {};
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: `/solutions/${id}` },
    openGraph: { title: `${s.title} | Lireons`, description: s.description, url: `/solutions/${id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!solutionPages[id] || !audiences.some((a) => a.id === id)) notFound();
  return <SolutionPage id={id} />;
}
