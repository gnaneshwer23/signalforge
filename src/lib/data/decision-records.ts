export type DecisionRecord = {
  id: string;
  title: string;
  date: string;
  context: string;
  options: string[];
  decision: string;
  consequences: string[];
  /** Links to evaluation case ids that justified the decision (FR-08). */
  evalCaseIds: string[];
  status: "accepted" | "superseded" | "proposed";
};

/**
 * Architecture Decision Records — self-directed learning that changed a decision.
 * Each ADR links to eval cases the harness can re-run (FR-08).
 */
export const decisionRecords: DecisionRecord[] = [
  {
    id: "ADR-001",
    title: "Deterministic matcher before hosted LLM",
    date: "2026-02-10",
    context:
      "Ask Signal needed grounded answers with abstention, but a hosted LLM without retrieval would invent citations on the demo corpus.",
    options: [
      "Ship a live LLM with prompt-only grounding",
      "Ship a deterministic corpus matcher with honest labelling",
      "Block Ask Signal until hybrid RAG + evals pass",
    ],
    decision:
      "Ship the deterministic matcher with explicit “not a live LLM” labelling, and gate any LLM behind hybrid retrieval + CI evals (FR-01–FR-05).",
    consequences: [
      "Hiring reviewers see working abstention/citation behaviour today",
      "AI claim remains partial until embeddings + model key land",
      "Eval harness can already fail closed on injection fixtures",
    ],
    evalCaseIds: ["eval-ground-01", "eval-abst-01", "eval-inject-01"],
    status: "accepted",
  },
  {
    id: "ADR-002",
    title: "Server-side permission merge on whole-state PUT",
    date: "2026-10-20",
    context:
      "PUT /api/state checked only prefs:write, so an analyst session could overwrite brief approval state and bypass briefs:approve.",
    options: [
      "Remove PUT entirely and rewrite the client to per-entity routes in one pass",
      "Keep PUT but authorize each mutation class against the existing permission matrix",
      "Rely on UI role chips alone",
    ],
    decision:
      "Authorize PUT with a server-side diff (authorizeStateWrite): approval, safety, evaluation, backlog, and change-control each require their own permission; unsupported-claim gate stays server-enforced.",
    consequences: [
      "Critical A1 closed without a full client rewrite",
      "Per-entity routes remain the longer-term NFR",
      "Analyst can no longer approve via document overwrite",
    ],
    evalCaseIds: ["eval-unsup-01"],
    status: "accepted",
  },
  {
    id: "ADR-003",
    title: "Admin reset password from environment only",
    date: "2026-10-20",
    context:
      "Published admin-demo credentials let any visitor wipe the shared Neon demo a hiring panel would open.",
    options: [
      "Remove admin account entirely",
      "Keep published password but rate-limit harder",
      "Require ADMIN_DEMO_PASSWORD from env; disable admin login when unset",
    ],
    decision:
      "Admin login succeeds only when ADMIN_DEMO_PASSWORD is set in the deploy environment. README publishes analyst/reviewer/PO only.",
    consequences: [
      "Shared demo is safe by default (A2)",
      "Operators must set the env var to reseed",
      "Guest browse remains read-only until a demo login",
    ],
    evalCaseIds: ["eval-safety-01"],
    status: "accepted",
  },
  {
    id: "ADR-004",
    title: "Record-level deep links required for verified sources",
    date: "2026-10-20",
    context:
      "Eleven of twelve sources pointed at site homepages while assets were marked verified — a false provenance signal.",
    options: [
      "Keep homepage URLs and soften “verified” language in UI only",
      "Require PMID/NCT/EPAR/label identifiers for verified_source rows + CI lint",
      "Drop verification badges entirely",
    ],
    decision:
      "Replace homepage URLs with record-level deep links; add amlitelimab and rocatinlimab; fail data lint when verified rows lack identifiers (FR-06).",
    consequences: [
      "Provenance badges become inspectable",
      "Corpus refresh needed when identifiers age out",
      "Fictional SIGFOR rows stay unverified without URLs",
    ],
    evalCaseIds: ["eval-meta-01", "eval-cite-02"],
    status: "accepted",
  },
  {
    id: "ADR-005",
    title: "Measured fixture evals separate from illustrative targets",
    date: "2026-03-01",
    context:
      "Evaluation centre showed all cases as “not run”, undermining the claim that SignalForge owns evaluation strategy.",
    options: [
      "Leave cases as documentation only",
      "Run deterministic fixtures and store measured pass/fail with model/prompt/corpus labels",
      "Claim ≥90% citation correctness without running anything",
    ],
    decision:
      "RunEvaluationHarness executes fixtures in UI and CI; targets remain labelled illustrative; measured runs never claim production SLAs (FR-04/FR-05).",
    consequences: [
      "Reviewers see real pass/fail against the seeded corpus",
      "Misses get root-cause nextAction strings",
      "Live LLM evals still pending provider choice",
    ],
    evalCaseIds: [
      "eval-cite-01",
      "eval-ground-01",
      "eval-retr-01",
      "eval-abst-01",
      "eval-inject-01",
    ],
    status: "accepted",
  },
  {
    id: "ADR-006",
    title: "Neon Postgres over SQLite for the shared demo",
    date: "2026-10-19",
    context:
      "Vercel serverless cannot keep a durable SQLite file; live /api/state returned 500 with missing DATABASE_URL.",
    options: [
      "In-memory only demo mode",
      "Neon PostgreSQL via Prisma with pooled + unpooled URLs",
      "Turso / libsql",
    ],
    decision:
      "Prisma 6 + Neon PostgreSQL; seed refuses to wipe populated data; health probe reports DB readiness.",
    consequences: [
      "Refresh persistence works for signed-in demo sessions",
      "Secrets must stay in Vercel env (rotate if pasted)",
      "Migrations required before new entity shapes",
    ],
    evalCaseIds: ["eval-meta-01"],
    status: "accepted",
  },
];
