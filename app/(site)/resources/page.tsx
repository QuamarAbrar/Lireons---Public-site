import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/PageHeader";
import { Blog, Changelog, HelpSearch, Integrations, TopTasks } from "@/components/pages/Resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides for admins, teachers, parents and students, the Lireons changelog, integrations and notes on running institutions well.",
};

const jumps = [
  ["All guides", "#guides"],
  ["Changelog", "#changelog"],
  ["Integrations", "#integrations"],
  ["Blog", "#blog"],
] as const;

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        label="Help centre"
        title="How do I do that in Lireons?"
        lead="Step-by-step guides for the office, teachers, parents and students."
        backdrop="cross"
      >
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
          {jumps.map(([l, h]) => (
            <a key={h} href={h} className="inline-flex h-10 items-center rounded-full border border-line bg-surface px-4 text-ui text-ink-2 transition-colors hover:border-line-2 hover:text-ink active:bg-surface-2">{l}</a>
          ))}
        </nav>
      </PageHeader>
      <TopTasks />
      <HelpSearch />
      <Changelog />
      <Integrations />
      <Blog />
    </>
  );
}
