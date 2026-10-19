export type SourceType =
  | "publication"
  | "registry"
  | "regulatory"
  | "press_release";

export type VerificationStatus = "verified" | "unverified";

/** How a source should be treated in UI and claim support. */
export type ProvenanceKind =
  | "verified_source"
  | "discovery_url"
  | "fictional_demo";

export type RoleName =
  | "analyst"
  | "reviewer"
  | "product_owner"
  | "admin";

export type ReviewState =
  | "unreviewed"
  | "in_review"
  | "needs_review"
  | "reviewed";

export type BriefState =
  | "draft"
  | "needs-review"
  | "approved-for-internal-discussion";

export type ClaimKind = "fact" | "interpretation" | "hypothesis" | "action";

export type ConfidenceLevel = "low" | "moderate" | "high";

export type DevelopmentPhase =
  | "Approved"
  | "Phase 3"
  | "Phase 2"
  | "Phase 1"
  | "Preclinical"
  | "Pipeline (fictional)";

export type UsageEventType =
  | "asset_opened"
  | "evidence_opened"
  | "evidence_added_to_brief"
  | "query_submitted"
  | "query_abstained"
  | "brief_generated"
  | "brief_marked_needs_review"
  | "brief_approved_for_internal_discussion"
  | "evaluation_run_completed"
  | "backlog_story_created"
  | "scope_change_recorded"
  | "safety_routed_to_review"
  | "evidence_review_updated";

export type BacklogStatus =
  | "backlog"
  | "ready"
  | "in_progress"
  | "blocked"
  | "done";

export type Priority = "P0" | "P1" | "P2";

export type ChangeDecision =
  | "pending"
  | "accepted"
  | "deferred"
  | "rejected"
  | "needs_clarification";

export type EvaluationResult = "pass" | "fail" | "partial" | "not_run";

export type Severity = "low" | "medium" | "high" | "critical";

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  url?: string;
  identifier?: string;
  publisher?: string;
  publicationDate?: string;
  retrievalDate: string;
  verification: VerificationStatus;
  /**
   * verified_source — public record used as claim support.
   * discovery_url — search/landing URL for discovery only (≠ verified claim support).
   * fictional_demo — synthetic demo record, never claim support.
   */
  provenanceKind: ProvenanceKind;
}

export interface EvidenceRecord {
  id: string;
  sourceId: string;
  assetIds: string[];
  title: string;
  summary: string;
  studyCharacteristics: string;
  limitations: string;
  supports: string;
  doesNotEstablish: string;
  reviewState: ReviewState;
  therapeuticArea: string;
  tags: string[];
  excerpt: string;
  keywords: string[];
}

export interface Asset {
  id: string;
  name: string;
  organization: string;
  mechanismOfAction: string;
  indication: string;
  therapeuticArea: string;
  phase: DevelopmentPhase;
  sourceDate: string;
  verification: VerificationStatus;
  notes: string;
  linkedEvidenceIds: string[];
  isPipelineFictional?: boolean;
}

export interface Claim {
  id: string;
  briefId: string;
  text: string;
  kind: ClaimKind;
  supported: boolean;
  confidence: ConfidenceLevel;
  confidenceRationale: {
    quality: string;
    relevance: string;
    consistency: string;
    completeness: string;
  };
  evidenceLinkIds: string[];
  unsupportedReason?: string;
}

export interface ClaimEvidenceLink {
  id: string;
  claimId: string;
  evidenceId: string;
  citationNote: string;
  excerpt: string;
}

export interface Signal {
  id: string;
  title: string;
  summary: string;
  assetIds: string[];
  evidenceIds: string[];
  therapeuticArea: string;
  urgency: "routine" | "elevated" | "high";
  reviewNeeded: boolean;
  emerging: boolean;
  updatedAt: string;
  implications: string;
  uncertainty: string;
  gaps: string[];
  followUpQuestions: string[];
}

export interface Brief {
  id: string;
  title: string;
  signalId: string;
  state: BriefState;
  evidenceIds: string[];
  claimIds: string[];
  signalSummary: string;
  evidenceSummary: string;
  implications: string;
  uncertainty: string;
  gaps: string[];
  followUpQuestions: string[];
  contradictions: string[];
  limitations: string[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface EvaluationCase {
  id: string;
  category:
    | "citation_correctness"
    | "groundedness"
    | "unsupported_claims"
    | "retrieval_relevance"
    | "contradiction_handling"
    | "abstention"
    | "metadata_integrity"
    | "prompt_injection_resistance"
    | "safety_routing";
  title: string;
  description: string;
  expected: string;
  observed: string;
  result: EvaluationResult;
  severity: Severity;
  nextAction: string;
  failureReason?: string;
  remediation?: string;
  lastRunAt?: string;
}

export interface EvaluationRun {
  id: string;
  startedAt: string;
  completedAt: string;
  caseResults: { caseId: string; result: EvaluationResult }[];
  actor: string;
  illustrative: true;
}

export interface BriefReview {
  id: string;
  briefId: string;
  actor: string;
  fromState: BriefState;
  toState: BriefState;
  notes: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: string;
}

export interface UsageEvent {
  id: string;
  type: UsageEventType;
  timestamp: string;
  detail: string;
  entityId?: string;
}

export interface BacklogItem {
  id: string;
  storyId: string;
  description: string;
  priority: Priority;
  acceptanceCriteria: string[];
  estimate: string;
  dependency?: string;
  owner: string;
  status: BacklogStatus;
  createdAt: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  status: "planned" | "in_progress" | "complete" | "blocked";
  dependencies: string[];
  notes: string;
}

export interface ChangeRequest {
  id: string;
  title: string;
  scope: string;
  costImpact: string;
  timelineImpact: string;
  risk: string;
  classification: "in_scope_refinement" | "material_change";
  decision: ChangeDecision;
  decisionNotes?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface SafetyFlag {
  id: string;
  label: string;
  fictional: true;
  narrative: string;
  extractedFields: Record<string, string | null>;
  missingFields: string[];
  uncertaintyNotes: string[];
  routedToQueue: boolean;
  queueStatus: "not_routed" | "queued_for_human_review" | "reviewed_mock";
  createdAt: string;
}

export interface AskResponse {
  query: string;
  abstained: boolean;
  answer?: string;
  confidence?: ConfidenceLevel;
  limitations: string[];
  supportingEvidenceIds: string[];
  excerpts: { evidenceId: string; text: string }[];
  disclaimer: string;
  injectionAttempt?: boolean;
}

export interface StoreState {
  assets: Asset[];
  evidence: EvidenceRecord[];
  sources: Source[];
  signals: Signal[];
  briefs: Brief[];
  claims: Claim[];
  claimEvidenceLinks: ClaimEvidenceLink[];
  evaluationCases: EvaluationCase[];
  evaluationRuns: EvaluationRun[];
  briefReviews: BriefReview[];
  auditEvents: AuditEvent[];
  usageEvents: UsageEvent[];
  backlog: BacklogItem[];
  milestones: Milestone[];
  changeRequests: ChangeRequest[];
  safetyFlags: SafetyFlag[];
  draftBriefEvidenceIds: string[];
  activeDraftBriefId: string | null;
  evaluationTargets: {
    citationCorrectness: string;
    groundedness: string;
    unsupportedClaims: string;
    retrievalRelevance: string;
    contradictionHandling: string;
    abstention: string;
    metadataIntegrity: string;
    promptInjectionResistance: string;
    safetyRouting: string;
  };
  lastEvaluationRunAt: string | null;
  walkthroughDismissed: boolean;
  persistenceMode: "server" | "local_demonstration";
}
