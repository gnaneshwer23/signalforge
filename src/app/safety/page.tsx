"use client";

import { useStore } from "@/lib/store";
import { LoadingState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function SafetyPage() {
  const { state, hydrated, routeSafetyToQueue } = useStore();
  if (!hydrated) return <LoadingState />;

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[11px] uppercase tracking-[0.16em] text-amber-review">
          Synthetic AE triage · fictional
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink">Safety workbench</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Explicitly fictional adverse-event cases for workflow demonstration
          only. SignalForge does not contact FAERS, EudraVigilance, or any
          sponsor safety database. This is not a validated pharmacovigilance
          system.
        </p>
      </header>

      {state.safetyFlags.map((flag) => (
        <article key={flag.id} className="surface-panel border-amber-review p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-amber-review bg-amber-review px-2 py-0.5 text-xs font-medium text-amber-review">
              FICTIONAL CASE
            </span>
            <span className="text-xs text-muted-foreground">
              Created {formatDate(flag.createdAt)}
            </span>
            <span className="text-xs capitalize text-muted-foreground">
              Queue: {flag.queueStatus.replaceAll("_", " ")}
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl text-ink">{flag.label}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{flag.narrative}</p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-lg text-ink">Extracted fields</h3>
              <dl className="mt-2 space-y-2 text-sm">
                {Object.entries(flag.extractedFields).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[140px_1fr] gap-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className={v ? "text-ink" : "text-amber-review"}>
                      {v ?? "Missing"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-lg text-ink">Missing fields</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {flag.missingFields.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-lg text-ink">Uncertainty</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {flag.uncertaintyNotes.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Human-review routing uses a mock queue only. No external safety
              system is contacted.
            </p>
            <Button
              disabled={flag.routedToQueue}
              onClick={() => routeSafetyToQueue(flag.id)}
            >
              {flag.routedToQueue
                ? "Queued for human review (mock)"
                : "Route to human-review queue"}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
