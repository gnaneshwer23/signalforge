"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  ProvenanceStatusBadge,
  ReviewBadge,
  VerificationBadge,
} from "@/components/shared/status-badges";
import { EmptyState, LoadingState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ProvenanceStatus, ReviewState, SourceType } from "@/lib/types";
import { deriveProvenanceStatus } from "@/lib/provenance/status";
import { Suspense } from "react";

function EvidenceExplorer() {
  const { state, hydrated, toggleDraftEvidence } = useStore();
  const searchParams = useSearchParams();
  const signalFilter = searchParams.get("signal");
  const [q, setQ] = useState("");
  const [type, setType] = useState<SourceType | "">("");
  const [review, setReview] = useState<ReviewState | "">("");
  const [provStatus, setProvStatus] = useState<ProvenanceStatus | "">("");

  const signalEvidenceIds = useMemo(() => {
    if (!signalFilter) return null;
    const signal = state.signals.find((s) => s.id === signalFilter);
    return new Set(signal?.evidenceIds || []);
  }, [signalFilter, state.signals]);

  const rows = useMemo(() => {
    return state.evidence.filter((ev) => {
      if (signalEvidenceIds && !signalEvidenceIds.has(ev.id)) return false;
      const source = state.sources.find((s) => s.id === ev.sourceId);
      if (type && source?.type !== type) return false;
      if (review && ev.reviewState !== review) return false;
      if (provStatus) {
        const status = deriveProvenanceStatus({
          evidence: ev,
          source,
          claims: state.claims,
          links: state.claimEvidenceLinks,
          briefs: state.briefs,
        });
        if (status !== provStatus) return false;
      }
      const query = q.trim().toLowerCase();
      if (!query) return true;
      return (
        ev.title.toLowerCase().includes(query) ||
        ev.summary.toLowerCase().includes(query) ||
        ev.tags.some((t) => t.includes(query))
      );
    });
  }, [
    state.evidence,
    state.sources,
    state.claims,
    state.claimEvidenceLinks,
    state.briefs,
    q,
    type,
    review,
    provStatus,
    signalEvidenceIds,
  ]);

  if (!hydrated) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Evidence explorer"
        title="Evidence"
        description={
          <>
            Structured records with source type, dates, identifiers, asset
            association, and review state. Publication date and retrieval date
            are shown separately.
            {signalFilter ? (
              <span className="mt-2 block text-xs text-amber-review">
                Filtered to evidence linked from signal {signalFilter}.{" "}
                <Link href="/evidence" className="underline">
                  Clear filter
                </Link>
              </span>
            ) : null}
          </>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search evidence…"
          className="sm:max-w-xs"
        />
        <select
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value as SourceType | "")}
        >
          <option value="">All source types</option>
          <option value="publication">Publication</option>
          <option value="registry">Registry</option>
          <option value="regulatory">Regulatory</option>
          <option value="press_release">Press release</option>
        </select>
        <select
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
          value={review}
          onChange={(e) => setReview(e.target.value as ReviewState | "")}
        >
          <option value="">All review states</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="in_review">In review</option>
          <option value="needs_review">Needs review</option>
          <option value="reviewed">Reviewed</option>
        </select>
        <select
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
          value={provStatus}
          onChange={(e) =>
            setProvStatus(e.target.value as ProvenanceStatus | "")
          }
          aria-label="Provenance status filter"
        >
          <option value="">All provenance statuses</option>
          <option value="unverified">Unverified</option>
          <option value="source_located">Source located</option>
          <option value="evidence_reviewed">Evidence reviewed</option>
          <option value="supported">Supported</option>
          <option value="conflicting">Conflicting</option>
          <option value="insufficient">Insufficient</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No evidence matches"
          description="Try clearing filters. Fictional and unverified records remain visible when relevant."
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((ev) => {
            const source = state.sources.find((s) => s.id === ev.sourceId);
            const inDraft = state.draftBriefEvidenceIds.includes(ev.id);
            const status = deriveProvenanceStatus({
              evidence: ev,
              source,
              claims: state.claims,
              links: state.claimEvidenceLinks,
              briefs: state.briefs,
            });
            return (
              <li key={ev.id} className="surface-panel p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <VerificationBadge
                    status={source?.verification || "unverified"}
                  />
                  <ProvenanceStatusBadge status={status} />
                  <ReviewBadge state={ev.reviewState} />
                  <span className="text-xs capitalize text-muted-foreground">
                    {source?.type.replace("_", " ")}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-xl text-ink">
                  <Link
                    href={`/evidence/${ev.id}`}
                    className="underline-offset-2 hover:underline"
                  >
                    {ev.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{ev.summary}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Published {formatDate(source?.publicationDate)} · Retrieved{" "}
                  {formatDate(source?.retrievalDate)}
                  {source?.identifier ? ` · ${source.identifier}` : ""}
                  {!source?.url ? " · no direct source URL (unverified)" : ""}
                </p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant={inDraft ? "secondary" : "outline"}
                    onClick={() => toggleDraftEvidence(ev.id)}
                  >
                    {inDraft ? "Remove from draft brief" : "Add to draft brief"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function EvidencePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EvidenceExplorer />
    </Suspense>
  );
}
