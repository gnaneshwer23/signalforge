import Link from "next/link";

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="meta-label text-teal">Methodology</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Provenance before persuasion
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        SignalForge treats interpretations as hypotheses. Material claims without
        evidence links stay unsupported. Discovery URLs are not the same as
        verified claim support.
      </p>

      <section className="mt-14 space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Provenance lifecycle
        </h2>
        <ul className="space-y-3.5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-ink">Unverified</strong> — no usable locator,
            or fictional demo only.
          </li>
          <li>
            <strong className="text-ink">Source located</strong> — URL/identifier
            found; review incomplete.
          </li>
          <li>
            <strong className="text-ink">Evidence reviewed</strong> — human review
            recorded; support not yet established.
          </li>
          <li>
            <strong className="text-ink">Supported</strong> — linked via verified
            source to a supported fact/interpretation.
          </li>
          <li>
            <strong className="text-ink">Conflicting</strong> — contradictions or
            mixed support.
          </li>
          <li>
            <strong className="text-ink">Insufficient</strong> — cannot establish
            verified claim support.
          </li>
        </ul>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Ask Signal honesty
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Queries run through a deterministic matcher over the seed corpus with
          rate limiting and abstention (including prompt-injection style inputs and
          patient-advice requests). The UI never claims a live model.
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          What we do not claim
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Regulatory compliance, production pharmacovigilance validation, live
          proprietary feeds, or clinical decision support. See{" "}
          <Link href="/about" className="text-accent-signal hover:underline">
            About
          </Link>{" "}
          and AUDIT.md in the repository.
        </p>
      </section>
    </div>
  );
}
