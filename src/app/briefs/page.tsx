"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { ReviewBadge } from "@/components/shared/status-badges";
import { EmptyState, LoadingState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export default function BriefsPage() {
  const { state, hydrated } = useStore();
  if (!hydrated) return <LoadingState />;

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Intelligence briefs
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink">Briefs</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Structured drafts with claim-level evidence links, confidence
          rationale, and workflow states from draft → needs-review →
          approved-for-internal-discussion.
        </p>
      </header>

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
              <h2 className="mt-2 font-display text-2xl text-ink">
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
