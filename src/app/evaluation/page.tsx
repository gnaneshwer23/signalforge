"use client";

import { useStore } from "@/lib/store";
import { LoadingState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function EvaluationPage() {
  const { state, hydrated, runEvaluation } = useStore();
  if (!hydrated) return <LoadingState />;

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          AI evaluation centre
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink">
          Mock evaluation suite
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Deterministic fixture checks for citation, groundedness, unsupported
          claims, retrieval, contradiction handling, abstention, metadata
          integrity, prompt-injection resistance, and safety routing. Results
          are illustrative demo outputs —{" "}
          <strong>not production benchmarks</strong>.
        </p>
      </header>

      <section className="surface-panel p-4">
        <h2 className="font-display text-xl text-ink">
          Illustrative targets (separate from mock results)
        </h2>
        <ul className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {Object.entries(state.evaluationTargets).map(([k, v]) => (
            <li key={k} className="border border-border px-3 py-2">
              <span className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {k}
              </span>
              {v}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={runEvaluation}>Run mock evaluation</Button>
          <p className="text-xs text-muted-foreground">
            Last run:{" "}
            {state.lastEvaluationRunAt
              ? formatDate(state.lastEvaluationRunAt)
              : "never"}
          </p>
        </div>
      </section>

      <div className="overflow-x-auto surface-panel">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Case</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Expected</th>
              <th className="px-3 py-2">Observed</th>
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
