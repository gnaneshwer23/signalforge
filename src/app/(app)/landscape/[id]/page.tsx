"use client";

import Link from "next/link";
import { use, useEffect } from "react";
import { useStore } from "@/lib/store";
import { VerificationBadge } from "@/components/shared/status-badges";
import { ErrorState, LoadingState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getAsset, getEvidence, state, hydrated, logUsage } = useStore();
  const asset = getAsset(id);

  useEffect(() => {
    if (asset) logUsage("asset_opened", `Opened asset ${asset.name}`, asset.id);
  }, [asset, logUsage]);

  if (!hydrated) return <LoadingState />;
  if (!asset) {
    return (
      <ErrorState
        title="Asset not found"
        description="This asset id is not in the seeded competitive landscape."
      />
    );
  }

  const linked = asset.linkedEvidenceIds
    .map((eid) => getEvidence(eid))
    .filter(Boolean);

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <Link href="/landscape" className="text-sm text-accent-signal hover:underline">
          ← Landscape
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{asset.name}</h1>
        <p className="mt-1 text-muted-foreground">{asset.organization}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <VerificationBadge status={asset.verification} />
          {asset.isPipelineFictional && (
            <span className="rounded-md border border-amber-review bg-amber-review px-2 py-0.5 text-xs text-amber-review">
              Clearly labelled pipeline / fictional record
            </span>
          )}
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        {[
          ["Mechanism of action", asset.mechanismOfAction],
          ["Indication", asset.indication],
          ["Therapeutic area", asset.therapeuticArea],
          ["Development phase", asset.phase],
          ["Source date", formatDate(asset.sourceDate)],
          ["Verification", asset.verification],
        ].map(([k, v]) => (
          <div key={k} className="surface-panel px-3 py-2">
            <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {k}
            </dt>
            <dd className="mt-1 text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="surface-panel p-4">
        <h2 className="font-display text-2xl text-ink">Notes</h2>
        <p className="mt-2 text-sm text-muted-foreground">{asset.notes}</p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Linked evidence</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Attribute statements should be traced to these records.
        </p>
        <ul className="mt-3 space-y-2">
          {linked.map((ev) => {
            if (!ev) return null;
            const source = state.sources.find((s) => s.id === ev.sourceId);
            return (
              <li key={ev.id} className="surface-panel p-3">
                <Link
                  href={`/evidence/${ev.id}`}
                  className="font-medium text-ink underline-offset-2 hover:underline"
                >
                  {ev.title}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {source?.type.replace("_", " ")} · pub{" "}
                  {formatDate(source?.publicationDate)} · retrieved{" "}
                  {formatDate(source?.retrievalDate)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
