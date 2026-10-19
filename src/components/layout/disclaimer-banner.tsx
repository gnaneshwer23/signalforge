"use client";

import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="no-print border-b border-border bg-[color-mix(in_oklab,var(--sage)_35%,white)] text-ink">
      <div className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2.5 text-xs leading-relaxed sm:text-[13px]">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-review" />
        <p>
          <strong className="font-medium">SignalForge</strong> is an independent
          portfolio prototype with illustrative / demo data — not a validated
          pharmacovigilance system, and not for clinical decision support. All
          sample metrics are labelled as illustrative demo data. Interpretations
          are hypotheses for human review.
        </p>
      </div>
    </div>
  );
}
