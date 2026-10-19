"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <header className="animate-rise">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          About & demo guide
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink">
          Honest scope for SignalForge
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Independent portfolio prototype for evidence-grounded pharmaceutical
          competitive intelligence. Not affiliated with Atacana Group. Therapeutic
          focus: moderate-to-severe atopic dermatitis.
        </p>
      </header>

      <section className="surface-panel animate-fade-delay space-y-3 p-5">
        <h2 className="font-display text-2xl text-ink">What is real</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Next.js workbench with nine navigable areas and a seeded AD corpus
          </li>
          <li>
            Prisma + SQLite persistence with migrations, seed, and audit trail
          </li>
          <li>
            Demo session auth with server-side role checks on mutations (UI role
            alone is not the security boundary)
          </li>
          <li>
            Claim→evidence→source provenance, unsupported-claim gating, Ask
            Signal abstention and injection resistance
          </li>
          <li>
            Explicit labels for verified sources, discovery-only URLs, and
            fictional demo records
          </li>
        </ul>
      </section>

      <section className="surface-panel space-y-3 p-5">
        <h2 className="font-display text-2xl text-ink">What is mocked</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-ink">Ask Signal is not a live LLM</strong> —
            deterministic keyword matcher over the seed corpus
          </li>
          <li>No live proprietary APIs or real-time ingestion</li>
          <li>
            Safety cases are synthetic / fictional; mock human-review queue only
          </li>
          <li>
            Evaluation metrics and targets are illustrative demo fixtures — not
            production KPIs
          </li>
          <li>
            Governance checklist items are requirements to validate, not
            certifications
          </li>
        </ul>
      </section>

      <section className="surface-panel space-y-3 p-5">
        <h2 className="font-display text-2xl text-ink">Demo walkthrough</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Sign in as <code className="text-ink">reviewer@signalforge.demo</code>{" "}
            / <code className="text-ink">reviewer-demo</code> (or admin for reset)
          </li>
          <li>
            Browse <Link href="/" className="text-ink underline-offset-2 hover:underline">Overview</Link>{" "}
            signals needing review
          </li>
          <li>
            Open an evidence record, note provenance kind, add to brief
          </li>
          <li>
            Review a brief — approval requires confirmation and is{" "}
            <em>not</em> regulatory validation
          </li>
          <li>
            Try Ask Signal with a SIGFOR-101 efficacy or injection-style prompt —
            expect abstention
          </li>
          <li>
            Run the mock evaluation centre and read failure remediation if any
          </li>
        </ol>
      </section>

      <section className="surface-panel space-y-3 border-amber-review p-5">
        <h2 className="font-display text-2xl text-ink">Limitations</h2>
        <p className="text-sm text-muted-foreground">
          Not for clinical decision support. Not a validated pharmacovigilance
          system. Interpretations are hypotheses for human review. See{" "}
          <Link href="/governance" className="text-ink underline-offset-2 hover:underline">
            Safety & governance
          </Link>{" "}
          and <code className="text-ink">AUDIT.md</code> for gate status. Do not
          treat this portfolio build as production-ready without completing
          documented gates.
        </p>
      </section>
    </div>
  );
}
