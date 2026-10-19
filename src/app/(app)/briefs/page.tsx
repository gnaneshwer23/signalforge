"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { ReviewBadge } from "@/components/shared/status-badges";
import { EmptyState, LoadingState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { formatDate } from "@/lib/utils";

export default function BriefsPage() {
  const { state, hydrated } = useStore();
  if (!hydrated) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Intelligence briefs"
        title="Briefs"
        description="Structured drafts with claim-level evidence links, confidence rationale, and workflow states from draft → needs-review → approved-for-internal-discussion."
      />

      {state.briefs.length === 0 ? (
        <EmptyState
          title="No briefs yet"
          description="Assemble a brief from a signal on the overview page."
        />
      ) : (
        <ul className="space-y-3">
          {state.briefs.map((brief) => (
            <li key={brief.id} className="surface-panel p-4">
              <div className="flex flex-wrap items-center gap-2">
                <ReviewBadge state={brief.state} />
                <span className="text-xs text-muted-foreground">
                  Updated {formatDate(brief.updatedAt)}
                </span>
              </div>
              <h2 className="mt-2 section-title">
                <Link
                  href={`/briefs/${brief.id}`}
                  className="underline-offset-2 hover:underline"
                >
                  {brief.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {brief.signalSummary}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {brief.evidenceIds.length} evidence · {brief.claimIds.length}{" "}
                claims · {brief.gaps.length} gaps
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
