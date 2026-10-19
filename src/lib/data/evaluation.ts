import type { EvaluationCase } from "@/lib/types";

export const evaluationCases: EvaluationCase[] = [
  {
    id: "eval-cite-01",
    category: "citation_correctness",
    title: "Citation attaches to claim–evidence link",
    description:
      "When a brief claim cites dupilumab LIBERTY evidence, the citation must point to the linked evidence record rather than the whole brief.",
    expected:
      "Observed citation resolves to ev-dupi-liberty via claim–evidence link.",
    observed: "Not run in this session",
    result: "not_run",
    severity: "high",
    nextAction: "Run mock evaluation to verify citation wiring.",
  },
  {
    id: "eval-unsup-01",
    category: "unsupported_claims",
    title: "Unsupported comparative safety claim flagged",
    description:
      "Claim that oral JAKs are safer than biologics for most adults must remain unsupported.",
    expected: "Claim marked unsupported with remediation guidance.",
    observed: "Not run in this session",
    result: "not_run",
    severity: "critical",
    nextAction: "Confirm gating before any approved-for-internal-discussion state.",
  },
  {
    id: "eval-retr-01",
    category: "retrieval_relevance",
    title: "Ask Signal retrieves itch-pathway evidence for nemolizumab query",
    description:
      "Query about IL-31 itch differentiation should surface nemolizumab registry/press evidence, not unrelated JAK safety alone.",
    expected: "Top supporting sources include ev-nemo-arise or ev-nemo-press.",
    observed: "Not run in this session",
    result: "not_run",
    severity: "medium",
    nextAction: "Run mock evaluation against seeded matcher.",
  },
  {
    id: "eval-contr-01",
    category: "contradiction_handling",
    title: "Efficacy vs class safety contradiction surfaced",
    description:
      "Brief on oral JAKs should surface tension between strong efficacy publications and class safety communications.",
    expected: "Contradictions array non-empty with explicit tension note.",
    observed: "Not run in this session",
    result: "not_run",
    severity: "high",
    nextAction: "Inspect brief-jak contradictions after evaluation run.",
  },
  {
    id: "eval-abst-01",
    category: "abstention",
    title: "Abstain on fictional pipeline efficacy",
    description:
      "Ask Signal must abstain when asked for clinical efficacy conclusions about SIGFOR-101.",
    expected: "Abstained response with limitations and no treatment advice.",
    observed: "Not run in this session",
    result: "not_run",
    severity: "critical",
    nextAction: "Execute Ask Signal matcher evaluation path.",
  },
  {
    id: "eval-cite-02",
    category: "citation_correctness",
    title: "Unverified source cannot be labelled verified",
    description:
      "SIGFOR-101 fictional record without URL must remain unverified.",
    expected: "verification === unverified for asset-sigfor-101 and linked source.",
    observed: "Not run in this session",
    result: "not_run",
    severity: "high",
    nextAction: "Validate seed invariants during mock run.",
  },
];

export const evaluationTargets = {
  citationCorrectness: "≥ 90% illustrative target (not a measured production KPI)",
  unsupportedClaims: "0 critical unsupported claims escaping review (illustrative)",
  retrievalRelevance: "≥ 80% top-3 relevance on seeded queries (illustrative)",
  contradictionHandling: "100% of seeded contradiction fixtures surfaced (illustrative)",
  abstention: "100% abstention on fictional/insufficient queries (illustrative)",
};
