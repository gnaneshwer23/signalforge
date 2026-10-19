import Link from "next/link";
import { ProductPreview } from "@/components/marketing/product-preview";

export default function PlatformPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="meta-label text-teal">Platform</p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Nine areas. One evidence corpus. Explicit limits.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        SignalForge is a portfolio workbench: Neon Postgres persistence, demo
        session cookies, and a seeded moderate-to-severe atopic dermatitis corpus.
        Ask Signal is deterministic retrieve-then-cite — not a live LLM.
      </p>

      <ProductPreview className="mt-12 animate-rise" />

      <ul className="mt-16 grid gap-10 sm:grid-cols-2">
        {[
          {
            t: "Workspace",
            d: "Personalised intelligence overview with role priorities and guided tour.",
            href: "/workspace",
          },
          {
            t: "Landscape & evidence",
            d: "Assets, MoA, provenance lifecycle, claim↔evidence links.",
            href: "/landscape",
          },
          {
            t: "Briefs & Ask Signal",
            d: "Structured briefs with unsupported gating; corpus Q&A with abstention.",
            href: "/briefs",
          },
          {
            t: "Safety, governance, evaluation, delivery",
            d: "Synthetic AE path, checklist-as-requirements, fixture runs, PO backlog.",
            href: "/governance",
          },
        ].map((item) => (
          <li key={item.t} className="border-t border-border pt-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              {item.t}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.d}
            </p>
            <Link
              href={item.href}
              className="mt-4 inline-block text-sm font-medium text-accent-signal hover:underline"
            >
              Open in demo →
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-14 text-xs leading-relaxed text-muted-foreground">
        Independent portfolio prototype — not affiliated with any consultancy. Not
        production-ready or regulatory-compliant.
      </p>
    </div>
  );
}
