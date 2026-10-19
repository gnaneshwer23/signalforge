"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { DemoMetric } from "@/components/shared/status-badges";
import { EmptyState, LoadingState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function OverviewPage() {
  const router = useRouter();
  const { state, hydrated, assembleBriefFromSignal } = useStore();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("Moderate-to-severe atopic dermatitis");
  const [since, setSince] = useState("");

  const filteredSignals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.signals.filter((s) => {
      const areaOk = !area || s.therapeuticArea === area;
      if (!areaOk) return false;
      if (since && s.updatedAt.slice(0, 10) < since) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q)
      );
    });
  }, [state.signals, query, area, since]);

  const needingReview = state.signals.filter((s) => s.reviewNeeded);
  const emerging = state.signals.filter((s) => s.emerging);
  const recentEvidence = [...state.evidence].sort((a, b) => {
    const sa = state.sources.find((x) => x.id === a.sourceId);
    const sb = state.sources.find((x) => x.id === b.sourceId);
    return (sb?.retrievalDate || "").localeCompare(sa?.retrievalDate || "");
  });

  const sourceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of state.sources) {
      const key = s.provenanceKind;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [state.sources]);

  const highImpact = state.signals.filter(
    (s) => s.urgency === "high" || s.urgency === "elevated",
  );

  if (!hydrated) return <LoadingState />;

  return (
    <div className="space-y-8">
      <section className="animate-rise">
        <p className="font-display text-[1.65rem] font-semibold tracking-tight text-ink sm:text-3xl">
          SignalForge
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Evidence-grounded competitive intelligence
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          Transform fragmented biomedical, clinical-trial, and regulatory
          information into traceable competitive signals, reviewable insights,
          and actionable strategic questions.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/landscape"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--primary),black_18%)]"
          >
            Open Landscape
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/ask"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--secondary),var(--foreground)_6%)]"
          >
            Ask Signal
          </Link>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter signals…"
            className="sm:max-w-md"
            aria-label="Search signals"
          />
          <select
            className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-label="Therapeutic area filter"
          >
            <option value="">All therapeutic areas</option>
            <option value="Moderate-to-severe atopic dermatitis">
              Moderate-to-severe atopic dermatitis
            </option>
          </select>
          <Input
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            aria-label="Updated since date"
            className="sm:max-w-[11rem]"
          />
        </div>
      </section>

      <section className="animate-fade-delay grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DemoMetric label="Monitored assets" value={state.assets.length} />
        <DemoMetric label="Evidence records" value={state.evidence.length} />
        <DemoMetric label="Needs review" value={needingReview.length} />
        <DemoMetric label="Elevated / high impact" value={highImpact.length} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-end justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-ink">
              Emerging signals
            </h2>
            <Link
              href="/briefs"
              className="text-sm text-accent-signal hover:underline"
            >
              Open briefs
            </Link>
          </div>
          {filteredSignals.length === 0 ? (
            <EmptyState
              title="No signals match"
              description="Adjust the therapeutic-area filter, date, or search terms. The demo corpus is bounded to moderate-to-severe atopic dermatitis."
            />
          ) : (
            <ul className="space-y-3">
              {filteredSignals.map((signal, idx) => (
                <li
                  key={signal.id}
                  className="surface-panel animate-rise p-4 transition-colors hover:bg-[color-mix(in_oklab,var(--accent)_35%,white)]"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Updated {formatDate(signal.updatedAt)}</span>
                    <span>·</span>
                    <span className="capitalize">{signal.urgency} urgency</span>
                    <span>·</span>
                    <span>
                      Confidence framing: human review
                      {signal.reviewNeeded ? " required" : " recommended"}
                    </span>
                    {signal.reviewNeeded && (
                      <span className="text-amber-review">Needs review</span>
                    )}
                  </div>
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">
                    {signal.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {signal.summary}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Insight → action:{" "}
                    {signal.followUpQuestions[0] || signal.implications}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/evidence?signal=${signal.id}`}
                      className="inline-flex h-7 items-center gap-1 rounded-lg border border-transparent bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground hover:bg-[color-mix(in_oklab,var(--primary),black_18%)]"
                    >
                      View evidence
                      <ArrowRight className="size-3.5" />
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const id = assembleBriefFromSignal(signal.id);
                        router.push(`/briefs/${id}`);
                      }}
                    >
                      Assemble brief
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Source distribution
            </h2>
            <p className="mt-1 text-xs text-amber-review">
              Illustrative demo counts
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {Object.entries(sourceDistribution).map(([k, v]) => (
                <li
                  key={k}
                  className="flex justify-between rounded-lg border border-border bg-card/80 px-3 py-2"
                >
                  <span className="capitalize text-muted-foreground">
                    {k.replaceAll("_", " ")}
                  </span>
                  <span className="font-medium text-ink">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Activity
            </h2>
            <ul className="mt-3 space-y-2">
              {state.usageEvents.slice(0, 5).map((u) => (
                <li key={u.id} className="text-sm">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(u.timestamp)}
                  </span>
                  <span className="mt-0.5 block text-ink">{u.detail}</span>
                </li>
              ))}
              {state.usageEvents.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  No activity yet in this session.
                </li>
              )}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Monitored assets
            </h2>
            <ul className="mt-3 space-y-2">
              {state.assets.map((asset) => (
                <li key={asset.id}>
                  <Link
                    href={`/landscape/${asset.id}`}
                    className="block rounded-lg border border-transparent px-2 py-1.5 text-sm hover:border-border hover:bg-card"
                  >
                    <span className="text-ink">{asset.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {asset.organization} · {asset.phase}
                      {asset.isPipelineFictional ? " · fictional" : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Recent updates
            </h2>
            <ul className="mt-3 space-y-2">
              {recentEvidence.slice(0, 5).map((ev) => {
                const source = state.sources.find((s) => s.id === ev.sourceId);
                return (
                  <li key={ev.id}>
                    <Link
                      href={`/evidence/${ev.id}`}
                      className="block rounded-lg border border-transparent px-2 py-1.5 text-sm hover:border-border hover:bg-card"
                    >
                      <span className="text-ink">{ev.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        Retrieved {formatDate(source?.retrievalDate)} ·{" "}
                        {source?.provenanceKind.replaceAll("_", " ")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            Emerging signals this filter: {emerging.length} · illustrative
          </p>
        </div>
      </section>
    </div>
  );
}
