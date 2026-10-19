import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="meta-label text-teal">About</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Honest scope for SignalForge
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Independent portfolio prototype for evidence-grounded pharmaceutical
        competitive intelligence. Therapeutic focus: moderate-to-severe atopic
        dermatitis.
      </p>

      <section className="mt-14 space-y-3">
        <h2 className="font-display text-xl font-semibold text-ink">What is real</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Next.js public site + nine-area workbench with a seeded AD corpus
          </li>
          <li>
            Prisma + Neon PostgreSQL persistence with migrations, seed, and audit
            trail
          </li>
          <li>
            Demo session auth with server-side role checks on mutations (UI /
            onboarding persona alone is not the security boundary)
          </li>
          <li>
            Claim→evidence→source provenance, unsupported-claim gating, Ask Signal
            abstention
          </li>
          <li>
            Optional onboarding preferences persisted via Prisma (or labelled
            localStorage fallback)
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl font-semibold text-ink">What is mocked</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-ink">Ask Signal is not a live LLM</strong> —
            deterministic keyword matcher over the seed corpus
          </li>
          <li>No live proprietary APIs or real-time ingestion</li>
          <li>
            Safety cases are synthetic / fictional; mock human-review queue only
          </li>
          <li>
            Evaluation targets are illustrative; fixture runs measured against the
            seed corpus only
          </li>
          <li>
            Governance checklist items are requirements to validate, not
            certifications
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl font-semibold text-ink">Limitations</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Not a validated pharmacovigilance system</li>
          <li>Not for clinical decision support</li>
          <li>Not production-ready or regulatory-compliant</li>
          <li>Demo credentials are intentionally public</li>
          <li>
            Portfolio demo-ready — not pilot-ready (see repository AUDIT.md)
          </li>
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/demo"
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--primary),black_12%)]"
        >
          Guided demo
        </Link>
        <Link
          href="/workspace"
          className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Open workspace
        </Link>
      </div>
    </div>
  );
}
