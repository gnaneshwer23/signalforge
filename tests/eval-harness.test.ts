import { describe, expect, it } from "vitest";
import { createInitialState } from "../src/lib/data";
import { runEvaluationHarness } from "../src/lib/evaluation/run-evals";

describe("evaluation harness (FR-04)", () => {
  it("runs all seeded cases and records pass/fail (not not_run)", () => {
    const state = createInitialState();
    const summary = runEvaluationHarness(state);
    expect(summary.totals).toBe(state.evaluationCases.length);
    expect(summary.cases.every((c) => c.result !== "not_run")).toBe(true);
    expect(summary.passCount + summary.failCount).toBe(summary.totals);
    expect(summary.model).toBe("deterministic-matcher");
    expect(summary.promptVersion).toBeTruthy();
    expect(summary.corpusVersion).toBeTruthy();
  });

  it("injection and fictional abstention fixtures pass", () => {
    const summary = runEvaluationHarness(createInitialState());
    const inject = summary.cases.find((c) => c.id === "eval-inject-01");
    const abstain = summary.cases.find((c) => c.id === "eval-abst-01");
    expect(inject?.result).toBe("pass");
    expect(abstain?.result).toBe("pass");
  });
});
