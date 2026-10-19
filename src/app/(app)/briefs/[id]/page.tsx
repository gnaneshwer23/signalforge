"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/auth-context";
import { roleHasPermission } from "@/lib/auth/permissions";
import { ReviewBadge } from "@/components/shared/status-badges";
import { ErrorState, LoadingState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import type { BriefState } from "@/lib/types";

export default function BriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    getBrief,
    getClaimsForBrief,
    getLinksForClaim,
    getEvidence,
    getSignal,
    hydrated,
    setBriefState,
    canApproveBrief,
    state,
  } = useStore();
  const { user } = useAuth();
  const brief = getBrief(id);
  const claims = getClaimsForBrief(id);
  const [approveOpen, setApproveOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canMarkReview =
    !!user && roleHasPermission(user.role, "briefs:mark_needs_review");
  const canApprove =
    !!user && roleHasPermission(user.role, "briefs:approve");
  const actor = user?.email || "demo.reviewer";

  async function transitionBrief(nextState: BriefState) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/briefs/${id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextState }),
      });
      const body = (await res.json().catch(() => null)) as {
        error?: string;
        actor?: string;
        at?: string;
      } | null;
      if (res.ok) {
        // Mirror into client store for immediate UI + local audit continuity.
        const local = setBriefState(id, nextState, body?.actor || actor);
        setMessage(
          local.ok
            ? `Transition recorded · actor ${body?.actor || actor}${
                body?.at ? ` · ${body.at}` : ""
              }`
            : local.reason || "Local mirror failed after server success.",
        );
        return;
      }
      if (res.status === 401 || res.status === 403) {
        setMessage(
          body?.error ||
            "Server authz rejected this transition. Sign in with a role that has permission.",
        );
        return;
      }
      if (res.status === 409) {
        setMessage(body?.error || "Transition blocked by evidence gates.");
        return;
      }
      // Offline / unauthenticated demo: local transition only, labelled.
      const local = setBriefState(id, nextState, actor);
      setMessage(
        local.ok
          ? `Local demonstration transition only (${actor}). Server write unavailable.`
          : local.reason || "Transition blocked.",
      );
    } catch {
      const local = setBriefState(id, nextState, actor);
      setMessage(
        local.ok
          ? `Local demonstration transition only (${actor}).`
          : local.reason || "Transition blocked.",
      );
    } finally {
      setBusy(false);
    }
  }

  const gate = useMemo(
    () => (brief ? canApproveBrief(brief.id) : { ok: false, reason: "Missing" }),
    [brief, canApproveBrief],
  );

  if (!hydrated) return <LoadingState />;
  if (!brief) {
    return (
      <ErrorState
        title="Brief not found"
        description="This brief id is not in the local workbench state."
      />
    );
  }

  const signal = getSignal(brief.signalId);
  const auditForBrief = state.auditEvents.filter((a) => a.entityId === brief.id);

  return (
    <div className="space-y-6 animate-rise">
      <div className="print-only surface-panel mb-4 p-3 text-xs">
        Demo warning: SignalForge portfolio prototype with illustrative data. Not
        a validated PV system. Independent portfolio prototype. Review state:{" "}
        {brief.state}.
      </div>

      <div className="no-print">
        <Link href="/briefs" className="text-sm text-accent-signal hover:underline">
          ← Briefs
        </Link>
      </div>

      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <ReviewBadge state={brief.state} />
            {!gate.ok && (
              <span className="rounded-md border border-amber-review bg-amber-review px-2 py-0.5 text-xs text-amber-review">
                Not fully evidence-supported
              </span>
            )}
          </div>
          <h1 className="mt-2 page-title">
            {brief.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            From signal: {signal?.title || brief.signalId}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={busy || !canMarkReview}
            title={
              canMarkReview
                ? "Mark needs-review (server authz)"
                : "Sign in as reviewer or admin"
            }
            onClick={() => void transitionBrief("needs-review")}
          >
            Mark needs-review
          </Button>
          <Button
            size="sm"
            disabled={busy || !canApprove}
            title={
              canApprove
                ? "Approve for internal discussion (server authz)"
                : "Sign in as reviewer or admin"
            }
            onClick={() => setApproveOpen(true)}
          >
            Approve for internal discussion
          </Button>
          <Button size="sm" variant="secondary" onClick={() => window.print()}>
            Print / export
          </Button>
        </div>
      </header>

      {brief.approvedAt && (
        <p className="no-print text-xs text-muted-foreground">
          Last approval: {formatDate(brief.approvedAt)} by{" "}
          {brief.approvedBy || "unknown"}
        </p>
      )}

      {message && (
        <p className="no-print text-sm text-verified" role="status">
          {message}
        </p>
      )}

      <section className="grid gap-3 print-break md:grid-cols-2">
        {[
          ["Signal summary", brief.signalSummary],
          ["Evidence summary", brief.evidenceSummary],
          ["Implications", brief.implications],
          ["Uncertainty", brief.uncertainty],
        ].map(([title, body]) => (
          <div key={title} className="surface-panel p-4">
            <h2 className="section-title">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="surface-panel p-4">
          <h2 className="section-title">Gaps</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {brief.gaps.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="surface-panel p-4">
          <h2 className="section-title">Follow-up questions</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {brief.followUpQuestions.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="surface-panel p-4">
          <h2 className="section-title">Contradictions</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {brief.contradictions.length === 0 ? (
              <li>None recorded</li>
            ) : (
              brief.contradictions.map((g) => <li key={g}>{g}</li>)
            )}
          </ul>
        </div>
      </section>

      <section className="print-break">
        <h2 className="section-title text-xl">Claims</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Facts, interpretations, hypotheses, and actions are distinguished.
          Citations attach to claim–evidence links.
        </p>
        <ul className="mt-3 space-y-3">
          {claims.length === 0 ? (
            <li className="surface-panel p-4 text-sm text-muted-foreground">
              No structured claims on this assembled draft yet. Seeded briefs
              include claim-level links.
            </li>
          ) : (
            claims.map((claim) => {
              const links = getLinksForClaim(claim.id);
              return (
                <li key={claim.id} className="surface-panel p-4">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="border border-border px-2 py-0.5 capitalize">
                      {claim.kind}
                    </span>
                    <span className="border border-border px-2 py-0.5">
                      Confidence: {claim.confidence}
                    </span>
                    {claim.supported ? (
                      <span className="border border-[color-mix(in_oklab,var(--verified)_40%,var(--border))] bg-verified px-2 py-0.5 text-verified">
                        Supported
                      </span>
                    ) : (
                      <span className="border border-amber-review bg-amber-review px-2 py-0.5 text-amber-review">
                        Unsupported
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink">{claim.text}</p>
                  {!claim.supported && claim.unsupportedReason && (
                    <p className="mt-2 text-xs text-amber-review">
                      {claim.unsupportedReason}
                    </p>
                  )}
                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <p>
                      <strong className="text-foreground">Quality:</strong>{" "}
                      {claim.confidenceRationale.quality}
                    </p>
                    <p>
                      <strong className="text-foreground">Relevance:</strong>{" "}
                      {claim.confidenceRationale.relevance}
                    </p>
                    <p>
                      <strong className="text-foreground">Consistency:</strong>{" "}
                      {claim.confidenceRationale.consistency}
                    </p>
                    <p>
                      <strong className="text-foreground">Completeness:</strong>{" "}
                      {claim.confidenceRationale.completeness}
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Evidence links / citations
                    </p>
                    {links.length === 0 ? (
                      <p className="mt-1 text-xs text-amber-review">
                        No citation links — claim cannot be treated as
                        evidence-supported.
                      </p>
                    ) : (
                      <ul className="mt-1 space-y-1">
                        {links.map((link) => {
                          const ev = getEvidence(link.evidenceId);
                          return (
                            <li key={link.id} className="text-sm">
                              <Link
                                href={`/evidence/${link.evidenceId}`}
                                className="text-ink underline-offset-2 hover:underline"
                              >
                                {ev?.title || link.evidenceId}
                              </Link>
                              <span className="block text-xs text-muted-foreground">
                                {link.citationNote}: “{link.excerpt}”
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>

      <section className="print-break">
        <h2 className="section-title text-xl">Linked evidence</h2>
        <ul className="mt-2 space-y-1">
          {brief.evidenceIds.map((eid) => {
            const ev = getEvidence(eid);
            return (
              <li key={eid}>
                <Link
                  href={`/evidence/${eid}`}
                  className="text-sm underline-offset-2 hover:underline"
                >
                  {ev?.title || eid}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="no-print surface-panel p-4">
        <h2 className="section-title">Audit log</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {auditForBrief.length === 0 ? (
            <li className="text-muted-foreground">No audit events yet.</li>
          ) : (
            auditForBrief.map((a) => (
              <li key={a.id} className="border-b border-border/60 pb-2">
                <span className="text-xs text-muted-foreground">
                  {formatDate(a.timestamp)} · {a.actor}
                </span>
                <p>
                  {a.action}: {a.detail}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Approve for internal discussion?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {gate.ok
                ? "This confirms the brief is suitable for internal discussion only — not external publication. An audit event will be recorded."
                : gate.reason}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!gate.ok || !canApprove || busy}
              onClick={() => {
                setApproveOpen(false);
                void transitionBrief("approved-for-internal-discussion");
              }}
            >
              Confirm approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
