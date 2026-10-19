import type { StoreState } from "@/lib/types";
import { assets } from "./assets";
import { sources } from "./sources";
import { evidence } from "./evidence";
import { signals } from "./signals";
import { briefs, claims, claimEvidenceLinks } from "./briefs";
import { evaluationCases, evaluationTargets } from "./evaluation";
import { backlog, milestones, changeRequests } from "./backlog";
import { safetyFlags } from "./safety";
import { seedAuditEvents, seedUsageEvents } from "./audit";

export const THERAPEUTIC_AREA = "Moderate-to-severe atopic dermatitis";

export function createInitialState(): StoreState {
  return {
    assets: structuredClone(assets),
    evidence: structuredClone(evidence),
    sources: structuredClone(sources),
    signals: structuredClone(signals),
    briefs: structuredClone(briefs),
    claims: structuredClone(claims),
    claimEvidenceLinks: structuredClone(claimEvidenceLinks),
    evaluationCases: structuredClone(evaluationCases),
    auditEvents: structuredClone(seedAuditEvents),
    usageEvents: structuredClone(seedUsageEvents),
    backlog: structuredClone(backlog),
    milestones: structuredClone(milestones),
    changeRequests: structuredClone(changeRequests),
    safetyFlags: structuredClone(safetyFlags),
    draftBriefEvidenceIds: ["ev-tralo-ecztend", "ev-lebri-advocate"],
    activeDraftBriefId: "brief-il13",
    evaluationTargets: { ...evaluationTargets },
    lastEvaluationRunAt: null,
    walkthroughDismissed: false,
  };
}

export {
  assets,
  sources,
  evidence,
  signals,
  briefs,
  claims,
  claimEvidenceLinks,
  evaluationCases,
  evaluationTargets,
  backlog,
  milestones,
  changeRequests,
  safetyFlags,
};
