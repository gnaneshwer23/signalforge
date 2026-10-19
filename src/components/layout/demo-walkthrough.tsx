"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { usePrefs } from "@/lib/onboarding/prefs-context";
import { Button } from "@/components/ui/button";

const steps = [
  { href: "/workspace", label: "Scan workspace signals" },
  { href: "/evidence", label: "Inspect evidence provenance" },
  { href: "/briefs/brief-jak", label: "Review a draft brief" },
  { href: "/ask", label: "Try Ask Signal abstention" },
  { href: "/landscape", label: "Next: open landscape" },
];

export function DemoWalkthrough() {
  const { state, dismissWalkthrough, hydrated } = useStore();
  const { prefs, savePrefs } = usePrefs();

  const tourDone = prefs.tourCompleted || state.walkthroughDismissed;
  const showGuided =
    hydrated &&
    !tourDone &&
    (prefs.experienceLevel === "guided" ||
      prefs.experienceLevel === null ||
      !prefs.onboardingCompleted);

  if (!showGuided) return null;

  return (
    <div className="no-print animate-rise mb-4 border border-border bg-card/95 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-semibold tracking-tight text-ink">Guided first use</p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Signal → evidence → brief → Ask Signal → next action. Illustrative
            path for onboarding — not a measured KPI.
          </p>
          <ol className="mt-3 flex flex-wrap gap-2">
            {steps.map((step, i) => (
              <li key={step.href}>
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
                >
                  <span className="text-muted-foreground">{i + 1}.</span>
                  {step.label}
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            dismissWalkthrough();
            void savePrefs({ tourCompleted: true }).then((r) => {
              if (r.persistence === "local") {
                /* local fallback already labelled in prefs */
              }
            });
          }}
        >
          Mark tour complete
        </Button>
      </div>
    </div>
  );
}
