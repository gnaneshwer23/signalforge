import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Personalise (optional)",
    body: "Choose a role, objective, and experience level. Skip anytime — persona never grants server permissions.",
    href: "/onboarding",
    cta: "Start onboarding",
  },
  {
    title: "Scan a signal",
    body: "Open the workspace overview and pick an emerging AD signal.",
    href: "/workspace",
    cta: "Open workspace",
  },
  {
    title: "Inspect evidence",
    body: "Follow provenance fields and lifecycle status on an evidence record.",
    href: "/evidence",
    cta: "Evidence explorer",
  },
  {
    title: "Review a brief",
    body: "Open a draft brief; note unsupported-claim gating before approve.",
    href: "/briefs/brief-jak",
    cta: "Sample brief",
  },
  {
    title: "Ask Signal",
    body: "Try a corpus question and an out-of-scope query to see abstention.",
    href: "/ask",
    cta: "Ask Signal",
  },
];

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="meta-label text-teal">Guided demo</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        A short path through SignalForge
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Illustrative demo data · moderate-to-severe atopic dermatitis. Timing is
        for onboarding — not a measured KPI.
      </p>

      <ol className="mt-14 space-y-0">
        {steps.map((step, i) => (
          <li key={step.href} className="border-t border-border py-8">
            <p className="meta-label">Step {i + 1}</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
            <Link
              href={step.href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-signal hover:underline"
            >
              {step.cta}
              <ArrowRight className="size-3.5" />
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-lg border border-border bg-mint/40 p-6">
        <p className="font-display text-lg font-semibold text-ink">
          Prefer a personalised start?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The onboarding wizard stores demo preferences (server when available,
          otherwise labelled localStorage).
        </p>
        <Link
          href="/onboarding"
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--primary),black_12%)]"
        >
          Open onboarding
        </Link>
      </div>
    </div>
  );
}
