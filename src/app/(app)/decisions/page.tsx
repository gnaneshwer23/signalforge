"use client";

import Link from "next/link";
import { decisionRecords } from "@/lib/data/decision-records";
import { useStore } from "@/lib/store";

export default function DecisionRecordsPage() {
  const { state } = useStore();
  const lastRun = state.evaluationRuns[0];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-6">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Decision Records
        </p>
        <h1 className="page-title">
          Architecture decisions that changed the product
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Each ADR records context, options, the decision, and the eval cases that
          justify it. Re-run fixtures from the{" "}
          <Link href="/evaluation" className="text-accent-signal hover:underline">
            Evaluation centre
          </Link>
          .
        </p>
        {lastRun && (
          <p className="text-xs text-muted-foreground">
            Latest measured run: {lastRun.measuredLabel}
          </p>
        )}
      </header>

      <ol className="space-y-8">
        {decisionRecords.map((adr) => (
          <li
            key={adr.id}
            id={adr.id}
            className="border-t border-border pt-6 first:border-t-0 first:pt-0"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs text-muted-foreground">
                {adr.id}
              </span>
              <h2 className="section-title">
                {adr.title}
              </h2>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {adr.status} · {adr.date}
              </span>
            </div>
            <dl className="mt-4 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="font-medium text-ink">Context</dt>
                <dd className="text-muted-foreground">{adr.context}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Options</dt>
                <dd>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {adr.options.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Decision</dt>
                <dd className="text-muted-foreground">{adr.decision}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Consequences</dt>
                <dd>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {adr.consequences.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Eval evidence</dt>
                <dd className="flex flex-wrap gap-2 pt-1">
                  {adr.evalCaseIds.map((id) => {
                    const result = state.evaluationCases.find((c) => c.id === id);
                    return (
                      <Link
                        key={id}
                        href="/evaluation"
                        className="rounded border border-border px-2 py-0.5 font-mono text-xs text-accent-signal hover:bg-muted"
                      >
                        {id}
                        {result?.result && result.result !== "not_run"
                          ? ` · ${result.result}`
                          : ""}
                      </Link>
                    );
                  })}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}
