import type { Role } from "@/lib/auth/users";
import {
  assertPermission,
  type Permission,
} from "@/lib/auth/permissions";
import type { Brief, StoreState } from "@/lib/types";

export type AuthzResult =
  | { ok: true; state: StoreState; permissionsUsed: Permission[] }
  | { ok: false; status: number; error: string };

function briefById(briefs: Brief[], id: string): Brief | undefined {
  return briefs.find((b) => b.id === id);
}

function materialUnsupportedCount(state: StoreState, briefId: string): number {
  return state.claims.filter(
    (c) =>
      c.briefId === briefId &&
      (c.kind === "fact" || c.kind === "interpretation") &&
      !c.supported,
  ).length;
}

/**
 * Permission-aware merge for workbench writes.
 *
 * Rejects privilege escalation via whole-document PUT: brief approval,
 * safety routing, evaluation runs, backlog/change-control mutations each
 * require their own permission — prefs:write alone is never enough for those.
 */
export function authorizeStateWrite(
  current: StoreState,
  incoming: StoreState,
  role: Role | undefined,
): AuthzResult {
  if (!role) {
    return {
      ok: false,
      status: 401,
      error: "Authentication required. Sign in with a demo account.",
    };
  }

  const used = new Set<Permission>();
  const require = (permission: Permission): AuthzResult | null => {
    const authz = assertPermission(role, permission);
    if (!authz.ok) {
      return { ok: false, status: authz.status, error: authz.error };
    }
    used.add(permission);
    return null;
  };

  // Evidence review-state changes
  for (const ev of incoming.evidence) {
    const prev = current.evidence.find((e) => e.id === ev.id);
    if (prev && prev.reviewState !== ev.reviewState) {
      const deny = require("evidence:review");
      if (deny) return deny;
    }
  }

  // New briefs or draft assembly fields
  const currentBriefIds = new Set(current.briefs.map((b) => b.id));
  for (const brief of incoming.briefs) {
    if (!currentBriefIds.has(brief.id)) {
      const deny = require("briefs:assemble");
      if (deny) return deny;
    }
  }
  if (
    JSON.stringify(current.draftBriefEvidenceIds) !==
      JSON.stringify(incoming.draftBriefEvidenceIds) ||
    current.activeDraftBriefId !== incoming.activeDraftBriefId
  ) {
    const deny = require("evidence:add_to_brief");
    if (deny) return deny;
  }

  // Brief state transitions (the critical A1 vector)
  for (const brief of incoming.briefs) {
    const prev = briefById(current.briefs, brief.id);
    if (!prev || prev.state === brief.state) continue;

    if (brief.state === "approved-for-internal-discussion") {
      const deny = require("briefs:approve");
      if (deny) return deny;
      const unsupported = materialUnsupportedCount(incoming, brief.id);
      if (unsupported > 0) {
        return {
          ok: false,
          status: 409,
          error: `${unsupported} material claim(s) lack supporting sources. Approval blocked.`,
        };
      }
      if (brief.evidenceIds.length === 0) {
        return {
          ok: false,
          status: 409,
          error: "Brief has no linked evidence.",
        };
      }
    } else if (brief.state === "needs-review") {
      const deny = require("briefs:mark_needs_review");
      if (deny) return deny;
    } else if (brief.state === "draft") {
      const deny = require("briefs:assemble");
      if (deny) return deny;
    }
  }

  // Safety routing
  for (const flag of incoming.safetyFlags) {
    const prev = current.safetyFlags.find((s) => s.id === flag.id);
    if (
      prev &&
      (prev.routedToQueue !== flag.routedToQueue ||
        prev.queueStatus !== flag.queueStatus)
    ) {
      const deny = require("safety:route");
      if (deny) return deny;
    }
  }

  // Evaluation runs
  if (current.lastEvaluationRunAt !== incoming.lastEvaluationRunAt) {
    const deny = require("evaluation:run");
    if (deny) return deny;
  }
  const evalChanged = incoming.evaluationCases.some((c) => {
    const prev = current.evaluationCases.find((p) => p.id === c.id);
    return (
      !prev ||
      prev.result !== c.result ||
      prev.observed !== c.observed ||
      prev.lastRunAt !== c.lastRunAt
    );
  });
  if (evalChanged) {
    const deny = require("evaluation:run");
    if (deny) return deny;
  }

  // Backlog mutations
  if (JSON.stringify(current.backlog) !== JSON.stringify(incoming.backlog)) {
    const deny = require("backlog:write");
    if (deny) return deny;
  }

  // Change requests
  for (const cr of incoming.changeRequests) {
    const prev = current.changeRequests.find((c) => c.id === cr.id);
    if (!prev) {
      const deny = require("change_request:create");
      if (deny) return deny;
    } else if (
      prev.decision !== cr.decision ||
      prev.decisionNotes !== cr.decisionNotes
    ) {
      const deny = require("change_request:decide");
      if (deny) return deny;
    }
  }

  // Usage / walkthrough / prefs-adjacent meta — allowed with prefs:write
  const denyPrefs = require("prefs:write");
  if (denyPrefs) return denyPrefs;

  // Preserve server authority over persistenceMode; never trust client wipe of audit
  const merged: StoreState = {
    ...incoming,
    persistenceMode: "server",
  };

  return {
    ok: true,
    state: merged,
    permissionsUsed: [...used],
  };
}
