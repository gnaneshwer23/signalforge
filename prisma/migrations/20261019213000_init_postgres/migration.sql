-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "identifier" TEXT,
    "publisher" TEXT,
    "publicationDate" TEXT,
    "retrievalDate" TEXT NOT NULL,
    "verification" TEXT NOT NULL,
    "provenanceKind" TEXT NOT NULL DEFAULT 'discovery_url',

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "mechanismOfAction" TEXT NOT NULL,
    "indication" TEXT NOT NULL,
    "therapeuticArea" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "sourceDate" TEXT NOT NULL,
    "verification" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "linkedEvidenceIds" TEXT NOT NULL,
    "isPipelineFictional" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceRecord" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "assetIds" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "studyCharacteristics" TEXT NOT NULL,
    "limitations" TEXT NOT NULL,
    "supports" TEXT NOT NULL,
    "doesNotEstablish" TEXT NOT NULL,
    "reviewState" TEXT NOT NULL,
    "therapeuticArea" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,

    CONSTRAINT "EvidenceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "assetIds" TEXT NOT NULL,
    "evidenceIds" TEXT NOT NULL,
    "therapeuticArea" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "reviewNeeded" BOOLEAN NOT NULL,
    "emerging" BOOLEAN NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "implications" TEXT NOT NULL,
    "uncertainty" TEXT NOT NULL,
    "gaps" TEXT NOT NULL,
    "followUpQuestions" TEXT NOT NULL,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brief" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "evidenceIds" TEXT NOT NULL,
    "claimIds" TEXT NOT NULL,
    "signalSummary" TEXT NOT NULL,
    "evidenceSummary" TEXT NOT NULL,
    "implications" TEXT NOT NULL,
    "uncertainty" TEXT NOT NULL,
    "gaps" TEXT NOT NULL,
    "followUpQuestions" TEXT NOT NULL,
    "contradictions" TEXT NOT NULL,
    "limitations" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "approvedAt" TEXT,
    "approvedBy" TEXT,

    CONSTRAINT "Brief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "briefId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "supported" BOOLEAN NOT NULL,
    "confidence" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "relevance" TEXT NOT NULL,
    "consistency" TEXT NOT NULL,
    "completeness" TEXT NOT NULL,
    "evidenceLinkIds" TEXT NOT NULL,
    "unsupportedReason" TEXT,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimEvidenceLink" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "citationNote" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,

    CONSTRAINT "ClaimEvidenceLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationCase" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "observed" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "nextAction" TEXT NOT NULL,
    "failureReason" TEXT,
    "remediation" TEXT,
    "lastRunAt" TEXT,

    CONSTRAINT "EvaluationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationRun" (
    "id" TEXT NOT NULL,
    "startedAt" TEXT NOT NULL,
    "completedAt" TEXT NOT NULL,
    "caseResults" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "illustrative" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EvaluationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BriefReview" (
    "id" TEXT NOT NULL,
    "briefId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "fromState" TEXT NOT NULL,
    "toState" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "BriefReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "entityId" TEXT,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BacklogItem" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "acceptanceCriteria" TEXT NOT NULL,
    "estimate" TEXT NOT NULL,
    "dependency" TEXT,
    "owner" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "BacklogItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dependencies" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "costImpact" TEXT NOT NULL,
    "timelineImpact" TEXT NOT NULL,
    "risk" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "decisionNotes" TEXT,
    "createdAt" TEXT NOT NULL,
    "decidedAt" TEXT,

    CONSTRAINT "ChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyFlag" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fictional" BOOLEAN NOT NULL DEFAULT true,
    "narrative" TEXT NOT NULL,
    "extractedFields" TEXT NOT NULL,
    "missingFields" TEXT NOT NULL,
    "uncertaintyNotes" TEXT NOT NULL,
    "routedToQueue" BOOLEAN NOT NULL DEFAULT false,
    "queueStatus" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "SafetyFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppMeta" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "draftBriefEvidenceIds" TEXT NOT NULL,
    "activeDraftBriefId" TEXT,
    "evaluationTargets" TEXT NOT NULL,
    "lastEvaluationRunAt" TEXT,
    "walkthroughDismissed" BOOLEAN NOT NULL DEFAULT false,
    "seededAt" TEXT NOT NULL,

    CONSTRAINT "AppMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "EvidenceRecord" ADD CONSTRAINT "EvidenceRecord_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brief" ADD CONSTRAINT "Brief_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "Brief"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimEvidenceLink" ADD CONSTRAINT "ClaimEvidenceLink_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimEvidenceLink" ADD CONSTRAINT "ClaimEvidenceLink_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "EvidenceRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

