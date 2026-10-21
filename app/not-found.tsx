import type { Metadata } from "next";
import Link from "next/link";
import { MinimalShell } from "@/components/pages/MinimalShell";
import { NotFoundMark } from "@/components/pages/NotFoundMark";
import { ButtonLink } from "@/components/ui/Button";
import { products } from "@/lib/products";
import { productColor } from "@/components/visuals/Frame";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <MinimalShell ornament={false}>
      <div className="grid w-full max-w-[82rem] gap-12 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <NotFoundMark />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="marker num">Error 404</p>
          <h1 className="mt-4 text-d1">This page is not on the record.</h1>
          <p className="mt-5 max-w-[44ch] text-lead text-ink-2">The link may be old, or the address mistyped. If you were signing in, use your institution’s own address, such as yourschool.lireons.com.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/" size="lg">Go to the home page</ButtonLink>
            <ButtonLink href="/sign-in" size="lg" variant="outline">Sign in</ButtonLink>
          </div>
          <nav aria-label="Products" className="mt-12 border-t border-line pt-6">
            <p className="label">Or go straight to a product</p>
            <ul className="mt-3 grid sm:grid-cols-2">
              {products.map((p) => (
                <li key={p.id}>
                  <Link href={p.href} className="group flex min-h-11 items-center gap-3 rounded-lg text-ui text-ink-2 transition-colors hover:text-ink">
                    <span className="size-2.5 rounded-[3px] transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45" style={{ background: productColor[p.id] }} aria-hidden />
                    <span className="text-meta text-ink-3 num">{p.index}</span>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </MinimalShell>
  );
}
