import type { BacklogItem, ChangeRequest, Milestone } from "@/lib/types";

export const backlog: BacklogItem[] = [
  {
    id: "bl-001",
    storyId: "SF-101",
    description:
      "As an analyst, I can assemble a draft brief from a signal and selected evidence without losing provenance.",
    priority: "P0",
    acceptanceCriteria: [
      "Evidence can be added/removed from draft brief",
      "Claim–evidence links retain citations",
      "Usage event evidence_added_to_brief is logged",
    ],
    estimate: "5",
    dependency: "Seed evidence corpus",
    owner: "Product Owner",
    status: "done",
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "bl-002",
    storyId: "SF-118",
    description:
      "As a reviewer, I must confirm before marking a brief approved-for-internal-discussion.",
    priority: "P0",
    acceptanceCriteria: [
      "Confirmation dialog required",
      "Unsupported material claims block full evidence-supported labelling",
      "Audit event recorded",
    ],
    estimate: "3",
    owner: "Engineering",
    status: "in_progress",
    createdAt: "2026-01-18T10:00:00.000Z",
  },
  {
    id: "bl-003",
    storyId: "SF-140",
    description:
      "As a PO, I can record a change request with scope, cost, timeline, and risk impacts.",
    priority: "P0",
    acceptanceCriteria: [
      "Required fields validated",
      "Classification distinguishes in-scope refinement vs material change",
      "Decision log entry created",
    ],
    estimate: "3",
    owner: "Product Owner",
    status: "ready",
    createdAt: "2026-01-22T10:00:00.000Z",
  },
  {
    id: "bl-004",
    storyId: "SF-155",
    description:
      "As a stakeholder, I can view AI evaluation cases with expected vs observed mock results.",
    priority: "P1",
    acceptanceCriteria: [
      "Categories cover citation, unsupported claims, retrieval, contradiction, abstention",
      "Illustrative targets shown separately from mock results",
      "Never claims production benchmark status",
    ],
    estimate: "5",
    dependency: "SF-118",
    owner: "QA / Evaluation",
    status: "backlog",
    createdAt: "2026-01-28T10:00:00.000Z",
  },
  {
    id: "bl-005",
    storyId: "SF-162",
    description:
      "Explore live literature ingestion connectors (Citeline / AlphaSense) — explicitly out of MVP scope.",
    priority: "P2",
    acceptanceCriteria: [],
    estimate: "13",
    owner: "Unassigned",
    status: "backlog",
    createdAt: "2026-02-01T10:00:00.000Z",
  },
];

export const milestones: Milestone[] = [
  {
    id: "ms-discovery",
    name: "Discovery",
    description: "Problem framing, corpus bounds, and journey mapping for AD CI workbench.",
    targetDate: "2026-01-15",
    status: "complete",
    dependencies: [],
    notes: "Complete for portfolio prototype.",
  },
  {
    id: "ms-prototype",
    name: "Prototype",
    description: "Clickable MVP covering journeys A–D with seeded corpus and local persistence.",
    targetDate: "2026-02-20",
    status: "in_progress",
    dependencies: ["ms-discovery"],
    notes: "This repository deliverable.",
  },
  {
    id: "ms-security",
    name: "Security review",
    description: "Threat model and access-control requirements validation (not certification).",
    targetDate: "2026-03-15",
    status: "planned",
    dependencies: ["ms-prototype"],
    notes: "Governance checklist items remain requirements-to-validate.",
  },
  {
    id: "ms-uat",
    name: "UAT",
    description: "Structured user acceptance on brief review and Ask Signal abstention behaviours.",
    targetDate: "2026-04-01",
    status: "planned",
    dependencies: ["ms-prototype", "ms-security"],
    notes: "Depends on security review entry criteria.",
  },
  {
    id: "ms-rollout",
    name: "Restricted rollout",
    description: "Limited internal pilot — contractual delivery is distinct from this prototype.",
    targetDate: "2026-05-01",
    status: "planned",
    dependencies: ["ms-uat"],
    notes: "Prototype ≠ contractual delivery commitment.",
  },
];

export const changeRequests: ChangeRequest[] = [
  {
    id: "cr-001",
    title: "Add print-friendly brief export retaining citations",
    scope: "Brief detail view print stylesheet and export summary panel",
    costImpact: "Low — frontend only",
    timelineImpact: "Absorbed in prototype milestone",
    risk: "Low — demo warnings must remain visible in print",
    classification: "in_scope_refinement",
    decision: "accepted",
    decisionNotes: "Required for FR-027; accepted as in-scope refinement.",
    createdAt: "2026-02-02T11:00:00.000Z",
    decidedAt: "2026-02-03T09:00:00.000Z",
  },
  {
    id: "cr-002",
    title: "Integrate live LLM answer generation",
    scope: "Replace deterministic Ask Signal matcher with hosted model calls",
    costImpact: "High — vendor, privacy, evaluation redesign",
    timelineImpact: "Pushes restricted rollout; new security workstream",
    risk: "High — patient-advice leakage and citation drift",
    classification: "material_change",
    decision: "rejected",
    decisionNotes:
      "Explicitly out of MVP scope. Deterministic seeded responses retained.",
    createdAt: "2026-02-04T15:00:00.000Z",
    decidedAt: "2026-02-05T10:00:00.000Z",
  },
];
