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
              "radial-gradient(ellipse 85% 65% at 8% 0%, rgba(17,122,107,0.16), transparent 55%), radial-gradient(ellipse 55% 45% at 92% 15%, rgba(11,58,44,0.07), transparent 50%), linear-gradient(180deg, #f4f8f5 0%, #e3f2eb 52%, #e6f0ea 100%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
          <p className="animate-rise font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
            SignalForge
          </p>
          <h1 className="animate-rise mt-4 max-w-3xl font-display text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl lg:text-[1.75rem]">
            Find the signal. Understand the evidence. Decide what to do next.
          </h1>
          <p className="animate-fade-delay mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Evidence-grounded competitive intelligence for pharma teams — traceable
            signals, reviewable briefs, and honest Ask Signal abstention on a seeded
            atopic dermatitis corpus.
          </p>
          <div className="animate-fade-delay mt-6 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--primary),black_12%)]"
            >
              Explore the interactive demo
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/platform"
              className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Explore the platform
            </Link>
          </div>
          <ProductPreview className="animate-fade-delay mt-8" />
        </div>
      </section>

      <section className="border-t border-border bg-paper/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="meta-label text-teal">Context</p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            The problem
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Competitive, clinical, and regulatory information is fragmented across
            publications, registries, and press. Teams need a way to turn fragments
            into signals with provenance — without inventing certainty.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="meta-label text-teal">Method</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
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
              <li key={step.n} className="border-t border-border pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                <p className="meta-label text-teal">{step.n}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                  {step.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-mint/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="meta-label text-teal">Workbench</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Capabilities
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Nine workbench areas on one corpus — overview, landscape, evidence,
            briefs, Ask Signal, safety, governance, evaluation, and delivery.
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                className="border-l-2 border-teal/45 pl-4 text-sm leading-relaxed text-ink"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="meta-label text-teal">Try it</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Interactive preview
          </h2>
          <p className="mt-3 text-sm text-amber-review">
            Illustrative only — live controls open the real demo workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/workspace"
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--primary),black_12%)]"
            >
              Open workspace
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Personalise first
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-paper/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="meta-label text-teal">Trust</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Trust & honesty
          </h2>
          <ul className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
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
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent-signal hover:underline"
          >
            Read full limitations
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="meta-label text-teal">Roles</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Solutions by role
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Same underlying data — prioritised entry points. Onboarding persona
            does not grant server permissions.
          </p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PERSONA_OPTIONS.map((p) => (
              <li key={p.id} className="border-t border-border pt-5">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.summary}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/solutions"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-accent-signal hover:underline"
          >
            Role solutions detail
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Start the guided demo
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
            Welcome → role → objective → therapeutic area → experience level →
            optional display name → open a personalised workspace.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="inline-flex h-11 items-center rounded-md bg-card px-5 text-sm font-medium text-ink transition-colors hover:bg-paper"
            >
              Guided demo
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex h-11 items-center rounded-md border border-primary-foreground/30 px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Full onboarding
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
