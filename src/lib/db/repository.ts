import { prisma } from "@/lib/db";
import { createInitialState } from "@/lib/data";
import type {
  Asset, AuditEvent, BacklogItem, Brief, ChangeRequest, Claim,
  ClaimEvidenceLink, EvaluationCase, EvidenceRecord, Milestone,
  SafetyFlag, Signal, Source, StoreState, UsageEvent,
} from "@/lib/types";
import { j, parseJson } from "./serialize";

async function clearAll() {
  await prisma.$transaction([
    prisma.claimEvidenceLink.deleteMany(),
    prisma.claim.deleteMany(),
    prisma.brief.deleteMany(),
    prisma.signal.deleteMany(),
    prisma.evidenceRecord.deleteMany(),
    prisma.source.deleteMany(),
    prisma.asset.deleteMany(),
    prisma.evaluationCase.deleteMany(),
    prisma.auditEvent.deleteMany(),
    prisma.usageEvent.deleteMany(),
    prisma.backlogItem.deleteMany(),
    prisma.milestone.deleteMany(),
    prisma.changeRequest.deleteMany(),
    prisma.safetyFlag.deleteMany(),
    prisma.appMeta.deleteMany(),
  ]);
}

export async function seedDatabase(state: StoreState = createInitialState()) {
  await clearAll();
  await prisma.$transaction(async (tx) => {
    for (const s of state.sources) {
      await tx.source.create({ data: { id: s.id, type: s.type, title: s.title, url: s.url ?? null, identifier: s.identifier ?? null, publisher: s.publisher ?? null, publicationDate: s.publicationDate ?? null, retrievalDate: s.retrievalDate, verification: s.verification } });
    }
    for (const a of state.assets) {
      await tx.asset.create({ data: { id: a.id, name: a.name, organization: a.organization, mechanismOfAction: a.mechanismOfAction, indication: a.indication, therapeuticArea: a.therapeuticArea, phase: a.phase, sourceDate: a.sourceDate, verification: a.verification, notes: a.notes, linkedEvidenceIds: j(a.linkedEvidenceIds), isPipelineFictional: !!a.isPipelineFictional } });
    }
    for (const e of state.evidence) {
      await tx.evidenceRecord.create({ data: { id: e.id, sourceId: e.sourceId, assetIds: j(e.assetIds), title: e.title, summary: e.summary, studyCharacteristics: e.studyCharacteristics, limitations: e.limitations, supports: e.supports, doesNotEstablish: e.doesNotEstablish, reviewState: e.reviewState, therapeuticArea: e.therapeuticArea, tags: j(e.tags), excerpt: e.excerpt, keywords: j(e.keywords) } });
    }
    for (const s of state.signals) {
      await tx.signal.create({ data: { id: s.id, title: s.title, summary: s.summary, assetIds: j(s.assetIds), evidenceIds: j(s.evidenceIds), therapeuticArea: s.therapeuticArea, urgency: s.urgency, reviewNeeded: s.reviewNeeded, emerging: s.emerging, updatedAt: s.updatedAt, implications: s.implications, uncertainty: s.uncertainty, gaps: j(s.gaps), followUpQuestions: j(s.followUpQuestions) } });
    }
    for (const b of state.briefs) {
      await tx.brief.create({ data: { id: b.id, title: b.title, signalId: b.signalId, state: b.state, evidenceIds: j(b.evidenceIds), claimIds: j(b.claimIds), signalSummary: b.signalSummary, evidenceSummary: b.evidenceSummary, implications: b.implications, uncertainty: b.uncertainty, gaps: j(b.gaps), followUpQuestions: j(b.followUpQuestions), contradictions: j(b.contradictions), limitations: j(b.limitations), createdAt: b.createdAt, updatedAt: b.updatedAt, approvedAt: b.approvedAt ?? null, approvedBy: b.approvedBy ?? null } });
    }
    for (const c of state.claims) {
      await tx.claim.create({ data: { id: c.id, briefId: c.briefId, text: c.text, kind: c.kind, supported: c.supported, confidence: c.confidence, quality: c.confidenceRationale.quality, relevance: c.confidenceRationale.relevance, consistency: c.confidenceRationale.consistency, completeness: c.confidenceRationale.completeness, evidenceLinkIds: j(c.evidenceLinkIds), unsupportedReason: c.unsupportedReason ?? null } });
    }
    for (const l of state.claimEvidenceLinks) {
      await tx.claimEvidenceLink.create({ data: { id: l.id, claimId: l.claimId, evidenceId: l.evidenceId, citationNote: l.citationNote, excerpt: l.excerpt } });
    }
    for (const e of state.evaluationCases) {
      await tx.evaluationCase.create({ data: { id: e.id, category: e.category, title: e.title, description: e.description, expected: e.expected, observed: e.observed, result: e.result, severity: e.severity, nextAction: e.nextAction, failureReason: e.failureReason ?? null, remediation: e.remediation ?? null, lastRunAt: e.lastRunAt ?? null } });
    }
    for (const a of state.auditEvents) {
      await tx.auditEvent.create({ data: { id: a.id, timestamp: a.timestamp, actor: a.actor, action: a.action, entityType: a.entityType, entityId: a.entityId, detail: a.detail } });
    }
    for (const u of state.usageEvents) {
      await tx.usageEvent.create({ data: { id: u.id, type: u.type, timestamp: u.timestamp, detail: u.detail, entityId: u.entityId ?? null } });
    }
    for (const b of state.backlog) {
      await tx.backlogItem.create({ data: { id: b.id, storyId: b.storyId, description: b.description, priority: b.priority, acceptanceCriteria: j(b.acceptanceCriteria), estimate: b.estimate, dependency: b.dependency ?? null, owner: b.owner, status: b.status, createdAt: b.createdAt } });
    }
    for (const m of state.milestones) {
      await tx.milestone.create({ data: { id: m.id, name: m.name, description: m.description, targetDate: m.targetDate, status: m.status, dependencies: j(m.dependencies), notes: m.notes } });
    }
    for (const c of state.changeRequests) {
      await tx.changeRequest.create({ data: { id: c.id, title: c.title, scope: c.scope, costImpact: c.costImpact, timelineImpact: c.timelineImpact, risk: c.risk, classification: c.classification, decision: c.decision, decisionNotes: c.decisionNotes ?? null, createdAt: c.createdAt, decidedAt: c.decidedAt ?? null } });
    }
    for (const s of state.safetyFlags) {
      await tx.safetyFlag.create({ data: { id: s.id, label: s.label, fictional: true, narrative: s.narrative, extractedFields: j(s.extractedFields), missingFields: j(s.missingFields), uncertaintyNotes: j(s.uncertaintyNotes), routedToQueue: s.routedToQueue, queueStatus: s.queueStatus, createdAt: s.createdAt } });
    }
    await tx.appMeta.create({ data: { id: "default", draftBriefEvidenceIds: j(state.draftBriefEvidenceIds), activeDraftBriefId: state.activeDraftBriefId, evaluationTargets: j(state.evaluationTargets), lastEvaluationRunAt: state.lastEvaluationRunAt, walkthroughDismissed: state.walkthroughDismissed, seededAt: new Date().toISOString() } });
  });
}

export async function ensureSeeded(): Promise<void> {
  const meta = await prisma.appMeta.findUnique({ where: { id: "default" } });
  if (!meta) await seedDatabase();
}

export async function loadState(): Promise<StoreState> {
  await ensureSeeded();
  const [sources, assets, evidence, signals, briefs, claims, links, evaluationCases, auditEvents, usageEvents, backlog, milestones, changeRequests, safetyFlags, meta] = await Promise.all([
    prisma.source.findMany(), prisma.asset.findMany(), prisma.evidenceRecord.findMany(), prisma.signal.findMany(), prisma.brief.findMany(), prisma.claim.findMany(), prisma.claimEvidenceLink.findMany(), prisma.evaluationCase.findMany(),
    prisma.auditEvent.findMany({ orderBy: { timestamp: "desc" } }), prisma.usageEvent.findMany({ orderBy: { timestamp: "desc" } }), prisma.backlogItem.findMany({ orderBy: { createdAt: "desc" } }), prisma.milestone.findMany(), prisma.changeRequest.findMany({ orderBy: { createdAt: "desc" } }), prisma.safetyFlag.findMany(), prisma.appMeta.findUniqueOrThrow({ where: { id: "default" } }),
  ]);
  return {
    sources: sources.map((s): Source => ({ id: s.id, type: s.type as Source["type"], title: s.title, url: s.url ?? undefined, identifier: s.identifier ?? undefined, publisher: s.publisher ?? undefined, publicationDate: s.publicationDate ?? undefined, retrievalDate: s.retrievalDate, verification: s.verification as Source["verification"] })),
    assets: assets.map((a): Asset => ({ id: a.id, name: a.name, organization: a.organization, mechanismOfAction: a.mechanismOfAction, indication: a.indication, therapeuticArea: a.therapeuticArea, phase: a.phase as Asset["phase"], sourceDate: a.sourceDate, verification: a.verification as Asset["verification"], notes: a.notes, linkedEvidenceIds: parseJson(a.linkedEvidenceIds, []), isPipelineFictional: a.isPipelineFictional })),
    evidence: evidence.map((e): EvidenceRecord => ({ id: e.id, sourceId: e.sourceId, assetIds: parseJson(e.assetIds, []), title: e.title, summary: e.summary, studyCharacteristics: e.studyCharacteristics, limitations: e.limitations, supports: e.supports, doesNotEstablish: e.doesNotEstablish, reviewState: e.reviewState as EvidenceRecord["reviewState"], therapeuticArea: e.therapeuticArea, tags: parseJson(e.tags, []), excerpt: e.excerpt, keywords: parseJson(e.keywords, []) })),
    signals: signals.map((s): Signal => ({ id: s.id, title: s.title, summary: s.summary, assetIds: parseJson(s.assetIds, []), evidenceIds: parseJson(s.evidenceIds, []), therapeuticArea: s.therapeuticArea, urgency: s.urgency as Signal["urgency"], reviewNeeded: s.reviewNeeded, emerging: s.emerging, updatedAt: s.updatedAt, implications: s.implications, uncertainty: s.uncertainty, gaps: parseJson(s.gaps, []), followUpQuestions: parseJson(s.followUpQuestions, []) })),
    briefs: briefs.map((b): Brief => ({ id: b.id, title: b.title, signalId: b.signalId, state: b.state as Brief["state"], evidenceIds: parseJson(b.evidenceIds, []), claimIds: parseJson(b.claimIds, []), signalSummary: b.signalSummary, evidenceSummary: b.evidenceSummary, implications: b.implications, uncertainty: b.uncertainty, gaps: parseJson(b.gaps, []), followUpQuestions: parseJson(b.followUpQuestions, []), contradictions: parseJson(b.contradictions, []), limitations: parseJson(b.limitations, []), createdAt: b.createdAt, updatedAt: b.updatedAt, approvedAt: b.approvedAt ?? undefined, approvedBy: b.approvedBy ?? undefined })),
    claims: claims.map((c): Claim => ({ id: c.id, briefId: c.briefId, text: c.text, kind: c.kind as Claim["kind"], supported: c.supported, confidence: c.confidence as Claim["confidence"], confidenceRationale: { quality: c.quality, relevance: c.relevance, consistency: c.consistency, completeness: c.completeness }, evidenceLinkIds: parseJson(c.evidenceLinkIds, []), unsupportedReason: c.unsupportedReason ?? undefined })),
    claimEvidenceLinks: links.map((l): ClaimEvidenceLink => ({ id: l.id, claimId: l.claimId, evidenceId: l.evidenceId, citationNote: l.citationNote, excerpt: l.excerpt })),
    evaluationCases: evaluationCases.map((e): EvaluationCase => ({ id: e.id, category: e.category as EvaluationCase["category"], title: e.title, description: e.description, expected: e.expected, observed: e.observed, result: e.result as EvaluationCase["result"], severity: e.severity as EvaluationCase["severity"], nextAction: e.nextAction, failureReason: e.failureReason ?? undefined, remediation: e.remediation ?? undefined, lastRunAt: e.lastRunAt ?? undefined })),
    auditEvents: auditEvents.map((a): AuditEvent => ({ id: a.id, timestamp: a.timestamp, actor: a.actor, action: a.action, entityType: a.entityType, entityId: a.entityId, detail: a.detail })),
    usageEvents: usageEvents.map((u): UsageEvent => ({ id: u.id, type: u.type as UsageEvent["type"], timestamp: u.timestamp, detail: u.detail, entityId: u.entityId ?? undefined })),
    backlog: backlog.map((b): BacklogItem => ({ id: b.id, storyId: b.storyId, description: b.description, priority: b.priority as BacklogItem["priority"], acceptanceCriteria: parseJson(b.acceptanceCriteria, []), estimate: b.estimate, dependency: b.dependency ?? undefined, owner: b.owner, status: b.status as BacklogItem["status"], createdAt: b.createdAt })),
    milestones: milestones.map((m): Milestone => ({ id: m.id, name: m.name, description: m.description, targetDate: m.targetDate, status: m.status as Milestone["status"], dependencies: parseJson(m.dependencies, []), notes: m.notes })),
    changeRequests: changeRequests.map((c): ChangeRequest => ({ id: c.id, title: c.title, scope: c.scope, costImpact: c.costImpact, timelineImpact: c.timelineImpact, risk: c.risk, classification: c.classification as ChangeRequest["classification"], decision: c.decision as ChangeRequest["decision"], decisionNotes: c.decisionNotes ?? undefined, createdAt: c.createdAt, decidedAt: c.decidedAt ?? undefined })),
    safetyFlags: safetyFlags.map((s): SafetyFlag => ({ id: s.id, label: s.label, fictional: true, narrative: s.narrative, extractedFields: parseJson(s.extractedFields, {}), missingFields: parseJson(s.missingFields, []), uncertaintyNotes: parseJson(s.uncertaintyNotes, []), routedToQueue: s.routedToQueue, queueStatus: s.queueStatus as SafetyFlag["queueStatus"], createdAt: s.createdAt })),
    draftBriefEvidenceIds: parseJson(meta.draftBriefEvidenceIds, []),
    activeDraftBriefId: meta.activeDraftBriefId,
    evaluationTargets: parseJson(meta.evaluationTargets, { citationCorrectness: "≥90%", unsupportedClaims: "0 critical", retrievalRelevance: "≥80%", contradictionHandling: "surfaced", abstention: "required when insufficient" }),
    lastEvaluationRunAt: meta.lastEvaluationRunAt,
    walkthroughDismissed: meta.walkthroughDismissed,
  };
}

export async function saveState(state: StoreState): Promise<void> {
  await seedDatabase(state);
}

export async function resetDatabase(): Promise<StoreState> {
  const fresh = createInitialState();
  await seedDatabase(fresh);
  return fresh;
}
