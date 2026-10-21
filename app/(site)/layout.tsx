import { NavBar } from "@/components/site/NavBar";
import { Footer } from "@/components/site/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:shadow-2">Skip to content</a>
      <NavBar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
