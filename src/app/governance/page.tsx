"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { LoadingState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const checklist = [
  {
    id: "data-min",
    title: "Data minimisation",
    detail:
      "Collect only evidence fields required for competitive intelligence review; exclude unnecessary personal data.",
  },
  {
    id: "access",
    title: "Access control",
    detail:
      "Server-enforced demo roles exist for mutations; enterprise SSO/RBAC remains a requirement to validate before production.",
  },
  {
    id: "retention",
    title: "Retention",
    detail:
      "Define retention windows for audit logs, draft briefs, and synthetic AE narratives.",
  },
  {
    id: "auditability",
    title: "Auditability",
    detail:
      "Evidence review decisions and brief state transitions must leave an append-oriented audit trail (clients cannot erase history via state sync).",
  },
  {
    id: "regional",
    title: "Regional review",
    detail:
      "Jurisdiction-specific labelling and privacy review before any restricted rollout.",
  },
];

export default function GovernancePage() {
  const { state, hydrated, routeSafetyToQueue } = useStore();
  if (!hydrated) return <LoadingState />;

  const relevantAudit = state.auditEvents.filter((a) =>
    [
      "evidence_review_updated",
      "brief_marked_needs_review",
      "brief_approved_for_internal_discussion",
      "brief_generated",
      "safety_routed_to_review",
      "session_login",
      "demo_reset",
    ].includes(a.action),
  );

  return (
    <div className="space-y-8">
      <header className="animate-rise">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Safety & governance
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink">
          Synthetic AE triage & requirements checklist
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Safety cases are explicitly fictional. Governance items are{" "}
          <strong>requirements to validate</strong>, not certifications or
          attestations of production readiness.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <h2 className="font-display text-2xl text-ink">
            Synthetic AE queue
          </h2>
          <Link
            href="/safety"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Safety-only view
          </Link>
        </div>
        {state.safetyFlags.map((flag) => (
          <article
            key={flag.id}
            className="surface-panel border-amber-review p-4"
          >
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
            <h3 className="mt-3 font-display text-xl text-ink">{flag.label}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{flag.narrative}</p>
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
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
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-ink">
          Governance checklist
        </h2>
        {checklist.map((item) => (
          <div key={item.id} className="surface-panel flex gap-3 p-4">
            <Checkbox id={item.id} disabled className="mt-1" />
            <div>
              <label htmlFor={item.id} className="font-display text-lg text-ink">
                {item.title}
              </label>
              <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-amber-review">
                Requirement to validate · not certified
              </p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">
          Audit log — reviews, approvals, safety routing
        </h2>
        <ul className="mt-3 space-y-2">
          {relevantAudit.length === 0 ? (
            <li className="text-sm text-muted-foreground">No events yet.</li>
          ) : (
            relevantAudit.map((event) => (
              <li key={event.id} className="surface-panel p-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  {formatDate(event.timestamp)} · {event.actor} ·{" "}
                  {event.entityType}/{event.entityId}
                </p>
                <p className="mt-1 text-ink">
                  <span className="font-medium">{event.action}</span> —{" "}
                  {event.detail}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
