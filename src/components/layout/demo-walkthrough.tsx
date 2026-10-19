"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const steps = [
  { href: "/", label: "Scan overview signals" },
  { href: "/evidence", label: "Inspect evidence provenance" },
  { href: "/briefs/brief-jak", label: "Review a draft brief" },
  { href: "/ask", label: "Try Ask Signal abstention" },
];

export function DemoWalkthrough() {
  const { state, dismissWalkthrough, hydrated } = useStore();
  if (!hydrated || state.walkthroughDismissed) return null;

  return (
    <div className="no-print animate-rise mb-4 border border-border bg-card/95 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg text-ink">Guided demo</p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            A short path through journeys A–D: identify a signal, inspect
            evidence, review a brief, then ask a deterministic corpus question.
            Timing is illustrative for onboarding — not a measured KPI.
          </p>
          <ol className="mt-3 flex flex-wrap gap-2">
            {steps.map((step, i) => (
              <li key={step.href}>
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-2 border border-border bg-background px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
                >
                  <span className="text-muted-foreground">{i + 1}.</span>
                  {step.label}
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <Button variant="outline" size="sm" onClick={dismissWalkthrough}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
