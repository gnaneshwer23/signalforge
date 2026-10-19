"use client";

import { useStore } from "@/lib/store";
import { LoadingState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

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
      "Role-appropriate access to briefs and safety triage queues (requirement to validate — not implemented as enterprise RBAC in this prototype).",
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
      "Evidence review decisions and brief state transitions must leave an immutable audit trail.",
  },
  {
    id: "regional",
    title: "Regional review",
    detail:
      "Jurisdiction-specific labelling and privacy review before any restricted rollout.",
  },
];

export default function GovernancePage() {
  const { state, hydrated } = useStore();
  if (!hydrated) return <LoadingState />;

  const relevantAudit = state.auditEvents.filter((a) =>
    [
      "evidence_review_updated",
      "brief_marked_needs_review",
      "brief_approved_for_internal_discussion",
      "brief_generated",
      "safety_routed_to_review",
    ].includes(a.action),
  );

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Governance
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink">
          Checklist & audit
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Items below are <strong>requirements to validate</strong>, not
          certifications or attestations of production readiness.
        </p>
      </header>

      <section className="space-y-3">
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
          Audit log — evidence review & brief decisions
        </h2>
        <ul className="mt-3 space-y-2">
          {relevantAudit.map((event) => (
            <li key={event.id} className="surface-panel p-3 text-sm">
              <p className="text-xs text-muted-foreground">
                {formatDate(event.timestamp)} · {event.actor} · {event.entityType}/
                {event.entityId}
              </p>
              <p className="mt-1 text-ink">
                <span className="font-medium">{event.action}</span> — {event.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
