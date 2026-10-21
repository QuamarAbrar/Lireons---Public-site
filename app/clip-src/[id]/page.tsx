import { notFound } from "next/navigation";
import { ClipStage } from "./ClipStage";

export const metadata = { robots: { index: false } };

export default async function Clip({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!["academy", "assess", "ai"].includes(id)) notFound();
  return <ClipStage id={id as "academy" | "assess" | "ai"} />;
}
