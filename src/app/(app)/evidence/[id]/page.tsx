"use client";

import Link from "next/link";
import { use, useEffect } from "react";
import { useStore } from "@/lib/store";
import {
  ProvenanceBadge,
  ProvenanceStatusBadge,
  ReviewBadge,
  VerificationBadge,
} from "@/components/shared/status-badges";
import { ErrorState, LoadingState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ReviewState } from "@/lib/types";
import {
  deriveProvenanceStatus,
  PROVENANCE_STATUS_DEFINITIONS,
} from "@/lib/provenance/status";

export default function EvidenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    getEvidence,
    getSource,
    getAsset,
    hydrated,
    logUsage,
    toggleDraftEvidence,
    setEvidenceReviewState,
    state,
  } = useStore();
  const evidence = getEvidence(id);
  const source = evidence ? getSource(evidence.sourceId) : undefined;

  useEffect(() => {
    if (evidence)
      logUsage("evidence_opened", `Opened evidence ${evidence.title}`, evidence.id);
  }, [evidence, logUsage]);

  if (!hydrated) return <LoadingState />;
  if (!evidence || !source) {
    return (
      <ErrorState
        title="Evidence not found"
        description="This evidence id is not present in the seeded corpus."
      />
    );
  }

  const inDraft = state.draftBriefEvidenceIds.includes(evidence.id);
  const provenanceStatus = deriveProvenanceStatus({
    evidence,
    source,
    claims: state.claims,
    links: state.claimEvidenceLinks,
    briefs: state.briefs,
  });

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <Link href="/evidence" className="text-sm text-accent-signal hover:underline">
          ← Evidence
        </Link>
        <div className="mt-2 flex flex-wrap gap-2">
          <VerificationBadge status={source.verification} />
          <ProvenanceBadge kind={source.provenanceKind} />
          <ProvenanceStatusBadge status={provenanceStatus} />
          <ReviewBadge state={evidence.reviewState} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {PROVENANCE_STATUS_DEFINITIONS[provenanceStatus].definition}
        </p>
        <h1 className="mt-2 page-title">
          {evidence.title}
        </h1>
        {(source.provenanceKind === "discovery_url" ||
          source.provenanceKind === "fictional_demo" ||
          !source.url) && (
          <p
            className="mt-3 border border-amber-review bg-amber-review px-3 py-2 text-sm text-amber-review"
            role="status"
          >
            {source.provenanceKind === "fictional_demo"
              ? "Missing / fictional provenance — this record is demo-only and must not support regulatory or medical claims."
              : source.provenanceKind === "discovery_url"
                ? "Discovery URL only — search or landing links are not verified claim support."
                : "Missing provenance URL — treat as unverified until a direct source is attached."}
          </p>
        )}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="surface-panel px-3 py-2">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Publisher
          </dt>
          <dd>{source.publisher || "—"}</dd>
        </div>
        <div className="surface-panel px-3 py-2">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Provenance kind
          </dt>
          <dd className="capitalize">
            {source.provenanceKind.replaceAll("_", " ")}
          </dd>
        </div>
        <div className="surface-panel px-3 py-2">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Source type
          </dt>
          <dd className="capitalize">{source.type.replace("_", " ")}</dd>
        </div>
        <div className="surface-panel px-3 py-2">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Identifier
          </dt>
          <dd>{source.identifier || "—"}</dd>
        </div>
        <div className="surface-panel px-3 py-2">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Publication date
          </dt>
          <dd>{formatDate(source.publicationDate)}</dd>
        </div>
        <div className="surface-panel px-3 py-2">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Retrieval date
          </dt>
          <dd>{formatDate(source.retrievalDate)}</dd>
        </div>
        <div className="surface-panel px-3 py-2 sm:col-span-2">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Source URL
          </dt>
          <dd>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline underline-offset-2"
              >
                {source.url}
              </a>
            ) : (
              <span className="text-sm text-amber-review">
                No direct source URL — remains unverified
              </span>
            )}
          </dd>
        </div>
      </dl>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="surface-panel p-4">
          <h2 className="section-title">Summary</h2>
          <p className="mt-2 text-sm text-muted-foreground">{evidence.summary}</p>
        </div>
        <div className="surface-panel p-4">
          <h2 className="section-title">Study characteristics</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {evidence.studyCharacteristics}
          </p>
        </div>
        <div className="surface-panel p-4">
          <h2 className="section-title">What this supports</h2>
          <p className="mt-2 text-sm text-muted-foreground">{evidence.supports}</p>
        </div>
        <div className="surface-panel p-4">
          <h2 className="section-title">Does not establish</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {evidence.doesNotEstablish}
          </p>
        </div>
        <div className="surface-panel p-4 md:col-span-2">
          <h2 className="section-title">Limitations</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {evidence.limitations}
          </p>
        </div>
      </section>

      <section className="surface-panel p-4">
        <h2 className="section-title">Associated assets</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {evidence.assetIds.map((aid) => {
            const asset = getAsset(aid);
            if (!asset) return null;
            return (
              <li key={aid}>
                <Link
                  href={`/landscape/${aid}`}
                  className="border border-border bg-background px-2 py-1 text-sm hover:bg-accent"
                >
                  {asset.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-3 border border-border bg-card/80 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="section-title">Draft brief & review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add or remove without losing provenance. Review state updates are
            audited.
          </p>
          <label className="mt-3 block text-xs text-muted-foreground">
            Review state
            <select
              className="mt-1 block h-8 rounded-md border border-border bg-background px-2.5 text-sm text-foreground"
              value={evidence.reviewState}
              onChange={(e) =>
                setEvidenceReviewState(evidence.id, e.target.value as ReviewState)
              }
            >
              <option value="unreviewed">Unreviewed</option>
              <option value="in_review">In review</option>
              <option value="needs_review">Needs review</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </label>
        </div>
        <Button
          variant={inDraft ? "secondary" : "default"}
          onClick={() => toggleDraftEvidence(evidence.id)}
        >
          {inDraft ? "Remove from draft brief" : "Add to draft brief"}
        </Button>
      </section>
    </div>
  );
}
