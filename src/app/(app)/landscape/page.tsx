"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { VerificationBadge } from "@/components/shared/status-badges";
import { EmptyState, LoadingState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { DevelopmentPhase, VerificationStatus } from "@/lib/types";

type SortKey = "name" | "phase" | "sourceDate" | "organization";

export default function LandscapePage() {
  const { state, hydrated } = useStore();
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState<DevelopmentPhase | "">("");
  const [verification, setVerification] = useState<VerificationStatus | "">("");
  const [sort, setSort] = useState<SortKey>("name");

  const rows = useMemo(() => {
    let list = [...state.assets];
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.organization.toLowerCase().includes(query) ||
          a.mechanismOfAction.toLowerCase().includes(query),
      );
    }
    if (phase) list = list.filter((a) => a.phase === phase);
    if (verification) list = list.filter((a) => a.verification === verification);
    list.sort((a, b) => String(a[sort]).localeCompare(String(b[sort])));
    return list;
  }, [state.assets, q, phase, verification, sort]);

  if (!hydrated) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Competitive assets"
        title="Landscape"
        description="Monitored assets in moderate-to-severe atopic dermatitis. Attributes link to evidence; verified and unverified sources are distinguished."
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, org, MoA…"
          className="sm:max-w-xs"
        />
        <select
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
          value={phase}
          onChange={(e) => setPhase(e.target.value as DevelopmentPhase | "")}
        >
          <option value="">All phases</option>
          {[
            "Approved",
            "Phase 3",
            "Phase 2",
            "Phase 1",
            "Pipeline (fictional)",
          ].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
          value={verification}
          onChange={(e) =>
            setVerification(e.target.value as VerificationStatus | "")
          }
        >
          <option value="">All verification</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <select
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="name">Sort: name</option>
          <option value="organization">Sort: organization</option>
          <option value="phase">Sort: phase</option>
          <option value="sourceDate">Sort: source date</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No assets match"
          description="Clear filters to see the full AD competitive set, including the labelled fictional pipeline record."
        />
      ) : (
        <div className="overflow-x-auto surface-panel">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Asset</th>
                <th className="px-3 py-2 font-medium">Organization</th>
                <th className="px-3 py-2 font-medium">MoA</th>
                <th className="px-3 py-2 font-medium">Phase</th>
                <th className="px-3 py-2 font-medium">Source date</th>
                <th className="px-3 py-2 font-medium">Verification</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((asset) => (
                <tr key={asset.id} className="border-b border-border/70 last:border-0">
                  <td className="px-3 py-3">
                    <Link
                      href={`/landscape/${asset.id}`}
                      className="font-medium text-ink underline-offset-2 hover:underline"
                    >
                      {asset.name}
                    </Link>
                    {asset.isPipelineFictional && (
                      <span className="mt-1 block text-xs text-amber-review">
                        Pipeline / fictional demo record
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {asset.organization}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {asset.mechanismOfAction}
                  </td>
                  <td className="px-3 py-3">{asset.phase}</td>
                  <td className="px-3 py-3">{formatDate(asset.sourceDate)}</td>
                  <td className="px-3 py-3">
                    <VerificationBadge status={asset.verification} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
