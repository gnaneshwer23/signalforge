"use client";

import { useStore } from "@/lib/store";
import { LoadingState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function EvaluationPage() {
  const { state, hydrated, runEvaluation } = useStore();
  if (!hydrated) return <LoadingState />;

  const latestRun = state.evaluationRuns[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI evaluation centre"
        title="Evaluation suite"
        description={
          <>
            Fixture checks for citation, groundedness, unsupported claims,
            retrieval, contradiction handling, abstention, metadata integrity,
            prompt-injection resistance, and safety routing.{" "}
            <strong>Run results are measured</strong> against the current seeded
            corpus with deterministic fixtures.{" "}
            <strong>Targets remain illustrative</strong> and are not production
            SLAs.
          </>
        }
      />

      <section className="surface-panel p-4">
        <h2 className="text-base font-semibold tracking-tight text-ink">
          Illustrative targets (not measured)
        </h2>
        <p className="mt-1 text-xs text-amber-review">
          These target strings are demo placeholders only. Do not treat them as
          observed KPIs.
        </p>
        <ul className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {Object.entries(state.evaluationTargets).map(([k, v]) => (
            <li key={k} className="rounded-md border border-border bg-card/80 px-3 py-2">
              <span className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {k} · illustrative
              </span>
              {v}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={runEvaluation}>Run measured fixture evaluation</Button>
          <p className="text-xs text-muted-foreground">
            Last run:{" "}
            {state.lastEvaluationRunAt
              ? formatDate(state.lastEvaluationRunAt)
              : "never"}
          </p>
        </div>
        {latestRun && (
          <p className="mt-3 text-xs text-muted-foreground" role="status">
            Latest run ·{" "}
            {latestRun.illustrative ? "illustrative" : "measured fixtures"} ·{" "}
            {latestRun.measuredLabel} · actor {latestRun.actor}
          </p>
        )}
      </section>

      <div className="overflow-x-auto surface-panel">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Case</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Expected</th>
              <th className="px-3 py-2">Observed (measured)</th>
              <th className="px-3 py-2">Result</th>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Next action</th>
            </tr>
          </thead>
          <tbody>
            {state.evaluationCases.map((c) => (
              <tr key={c.id} className="border-b border-border/70 align-top last:border-0">
                <td className="px-3 py-3">
                  <p className="font-medium text-ink">{c.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.description}
                  </p>
                  {c.result === "fail" && (
                    <p className="mt-2 text-xs text-destructive">
                      Reason: {c.failureReason}
                      <br />
                      Remediation: {c.remediation}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3 capitalize text-muted-foreground">
                  {c.category.replaceAll("_", " ")}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{c.expected}</td>
                <td className="px-3 py-3 text-muted-foreground">{c.observed}</td>
                <td className="px-3 py-3">
                  <span
                    className={
                      c.result === "pass"
                        ? "text-verified"
                        : c.result === "fail"
                          ? "text-destructive"
                          : "text-amber-review"
                    }
                  >
                    {c.result.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-3 py-3 capitalize">{c.severity}</td>
                <td className="px-3 py-3 text-muted-foreground">{c.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
