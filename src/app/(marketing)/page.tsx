import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductPreview } from "@/components/marketing/product-preview";
import { PERSONA_OPTIONS } from "@/lib/onboarding/types";

export default function HomePage() {
  return (
    <div>
      {/* Hero — brand + one headline + support + CTAs + live preview */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 10% 0%, rgba(26,122,109,0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 20%, rgba(15,61,46,0.08), transparent 50%), linear-gradient(180deg, #f7faf6 0%, #e8f5ef 55%, #e8f2ec 100%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <p className="animate-rise font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            SignalForge
          </p>
          <h1 className="animate-rise mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
            Find the signal. Understand the evidence. Decide what to do next.
          </h1>
          <p className="animate-fade-delay mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Evidence-grounded competitive intelligence for pharma teams — traceable
            signals, reviewable briefs, and honest Ask Signal abstention on a seeded
            atopic dermatitis corpus.
          </p>
          <div className="animate-fade-delay mt-8 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--primary),black_12%)]"
            >
              Explore the interactive demo
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/platform"
              className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Explore the platform
            </Link>
          </div>
          <ProductPreview className="animate-fade-delay mt-12" />
        </div>
      </section>

      <section className="border-t border-border bg-paper/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            The problem
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Competitive, clinical, and regulatory information is fragmented across
            publications, registries, and press. Teams need a way to turn fragments
            into signals with provenance — without inventing certainty.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "01",
                t: "Surface signals",
                d: "Scan the seeded AD landscape for emerging competitive questions.",
              },
              {
                n: "02",
                t: "Inspect evidence",
                d: "Open provenance, lifecycle status, and claim↔evidence links.",
              },
              {
                n: "03",
                t: "Decide next action",
                d: "Assemble a brief, ask the corpus, or route a synthetic safety case.",
              },
            ].map((step) => (
              <li key={step.n}>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal">
                  {step.n}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                  {step.t}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-mint/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Capabilities
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Nine workbench areas on one corpus — overview, landscape, evidence,
            briefs, Ask Signal, safety, governance, evaluation, and delivery.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Competitive landscape with MoA / phase",
              "Six provenance lifecycle statuses",
              "Unsupported-claim gating on brief approve",
              "Deterministic Ask Signal (not a live LLM)",
              "Synthetic AE triage (fiction labelled)",
              "Product Owner backlog & change control",
            ].map((item) => (
              <li
                key={item}
                className="border-l-2 border-teal/40 pl-4 text-sm text-ink"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Interactive preview
          </h2>
          <p className="mt-2 text-sm text-amber-review">
            Illustrative only — live controls open the real demo workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/workspace"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Open workspace
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium"
            >
              Personalise first
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-paper/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Trust & honesty
          </h2>
          <ul className="mt-6 max-w-2xl space-y-3 text-sm text-muted-foreground">
            <li>
              Portfolio prototype with Neon Postgres persistence and demo session
              auth — not a production IdP.
            </li>
            <li>
              No fake logos, testimonials, or invented performance statistics.
            </li>
            <li>
              Not a validated pharmacovigilance system. Not for clinical decision
              support. Interpretations are hypotheses for human review.
            </li>
          </ul>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent-signal hover:underline"
          >
            Read full limitations
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Solutions by role
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Same underlying data — prioritised entry points. Onboarding persona
            does not grant server permissions.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PERSONA_OPTIONS.map((p) => (
              <li key={p.id}>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/solutions"
            className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent-signal hover:underline"
          >
            Role solutions detail
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Start the guided demo
          </h2>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">
            Welcome → role → objective → therapeutic area → experience level →
            optional display name → open a personalised workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="inline-flex h-11 items-center rounded-lg bg-card px-5 text-sm font-medium text-ink"
            >
              Guided demo
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex h-11 items-center rounded-lg border border-primary-foreground/30 px-5 text-sm font-medium text-primary-foreground"
            >
              Full onboarding
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
