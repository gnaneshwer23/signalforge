import Link from "next/link";
import { ProductPreview } from "@/components/marketing/product-preview";

export default function PlatformPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal">
        Platform
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Nine areas. One evidence corpus. Explicit limits.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        SignalForge is a portfolio workbench: Neon Postgres persistence, demo
        session cookies, and a seeded moderate-to-severe atopic dermatitis corpus.
        Ask Signal is deterministic retrieve-then-cite — not a live LLM.
      </p>

      <ProductPreview className="mt-12" />

      <ul className="mt-14 grid gap-8 sm:grid-cols-2">
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
          <li key={item.t}>
            <h2 className="font-display text-xl font-semibold text-ink">{item.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
            <Link
              href={item.href}
              className="mt-3 inline-block text-sm font-medium text-accent-signal hover:underline"
            >
              Open in demo →
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-xs text-muted-foreground">
        Independent portfolio prototype — not affiliated with Atacana Group. Not
        production-ready or regulatory-compliant.
      </p>
    </div>
  );
}
