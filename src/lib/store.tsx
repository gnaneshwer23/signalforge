"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createInitialState } from "@/lib/data";
import { runAskMatcher } from "@/lib/ask/matcher";
import { runEvaluationHarness } from "@/lib/evaluation/run-evals";
import type {
  AskResponse,
  BacklogItem,
  BacklogStatus,
  Brief,
  BriefState,
  ChangeDecision,
  ChangeRequest,
  PersistenceStatus,
  Priority,
  ReviewState,
  StoreState,
  UsageEventType,
} from "@/lib/types";

type StoreContextValue = {
  state: StoreState;
  hydrated: boolean;
  persistError: string | null;
  persistenceStatus: PersistenceStatus;
  retryPersist: () => Promise<{ ok: boolean; reason?: string }>;
  resetDemo: () => Promise<{ ok: boolean; reason?: string }>;
  dismissWalkthrough: () => void;
  logUsage: (type: UsageEventType, detail: string, entityId?: string) => void;
  getAsset: (id: string) => StoreState["assets"][number] | undefined;
  getEvidence: (id: string) => StoreState["evidence"][number] | undefined;
  getSource: (id: string) => StoreState["sources"][number] | undefined;
  getSignal: (id: string) => StoreState["signals"][number] | undefined;
  getBrief: (id: string) => Brief | undefined;
  getClaimsForBrief: (briefId: string) => StoreState["claims"];
  getLinksForClaim: (claimId: string) => StoreState["claimEvidenceLinks"];
  setEvidenceReviewState: (evidenceId: string, reviewState: ReviewState) => void;
  toggleDraftEvidence: (evidenceId: string) => void;
  assembleBriefFromSignal: (signalId: string) => string;
  setBriefState: (
    briefId: string,
    next: BriefState,
    actor?: string,
  ) => { ok: boolean; reason?: string };
  canApproveBrief: (briefId: string) => { ok: boolean; reason?: string };
  askSignal: (query: string) => AskResponse;
  routeSafetyToQueue: (safetyId: string) => void;
  runEvaluation: () => void;
  createBacklogItem: (input: {
    storyId: string;
    description: string;
    priority: Priority;
    acceptanceCriteria: string[];
    estimate: string;
    dependency?: string;
    owner: string;
    status: BacklogStatus;
  }) => { ok: boolean; reason?: string; id?: string };
  updateBacklogStatus: (id: string, status: BacklogStatus) => { ok: boolean; reason?: string };
  createChangeRequest: (input: {
    title: string;
    scope: string;
    costImpact: string;
    timelineImpact: string;
    risk: string;
    classification: ChangeRequest["classification"];
  }) => { ok: boolean; id?: string; reason?: string };
  decideChangeRequest: (
    id: string,
    decision: ChangeDecision,
    decisionNotes: string,
  ) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [persistReady, setPersistReady] = useState(false);
  const [persistError, setPersistError] = useState<string | null>(null);
  const [persistenceStatus, setPersistenceStatus] =
    useState<PersistenceStatus>("loading");
  const skipNextPersistRef = useRef(true);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const persistToServer = useCallback(async (payload: StoreState) => {
    try {
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as {
        error?: string;
        code?: string;
      } | null;
      if (res.status === 401 || res.status === 403) {
        // Keep unsaved edits; surface auth requirement + allow retry after sign-in.
        setPersistenceStatus("auth_required");
        setPersistError(
          body?.error ||
            "Authentication required. Sign in with a labelled demo account to persist.",
        );
        return { ok: false as const, reason: body?.error || "Authentication required." };
      }
      if (!res.ok) {
        setPersistenceStatus("persistence_error");
        setPersistError(
          body?.error ||
            "Persistence error — your edits are kept locally. Use Retry to save again.",
        );
        return { ok: false as const, reason: body?.error || "Persist failed." };
      }
      setPersistenceStatus("connected");
      setPersistError(null);
      return { ok: true as const };
    } catch {
      setPersistenceStatus("persistence_error");
      setPersistError(
        "Persistence error — backend unreachable. Edits kept; use Retry.",
      );
      return { ok: false as const, reason: "Backend unreachable." };
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/state", { cache: "no-store" });
        if (res.ok) {
          const remote = (await res.json()) as StoreState;
          if (!cancelled) {
            setState({ ...remote, persistenceMode: "server" });
            setPersistenceStatus("connected");
            setPersistError(null);
          }
        } else if (!cancelled) {
          const body = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          setState((prev) => ({
            ...prev,
            persistenceMode: "local_demonstration",
          }));
          setPersistenceStatus("demo_mode");
          setPersistError(
            body?.error ||
              "Server state unavailable — Demo mode. Changes stay in this browser only.",
          );
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            persistenceMode: "local_demonstration",
          }));
          setPersistenceStatus("demo_mode");
          setPersistError(
            "Backend unreachable — Demo mode. No production writes are claimed.",
          );
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
          setPersistReady(true);
          skipNextPersistRef.current = true;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !persistReady) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }
    // Only auto-persist when connected to server persistence.
    if (state.persistenceMode !== "server") return;
    if (
      persistenceStatus === "auth_required" ||
      persistenceStatus === "persistence_error"
    ) {
      // Wait for explicit retry after auth/DB failure — do not discard edits.
      return;
    }
    const timer = window.setTimeout(() => {
      void persistToServer(state);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [state, hydrated, persistReady, persistenceStatus, persistToServer]);

  const retryPersist = useCallback(async () => {
    if (stateRef.current.persistenceMode !== "server") {
      return {
        ok: false,
        reason: "Currently in Demo mode — server writes are not active.",
      };
    }
    // Clear blocking status so the effect path can also resume after success.
    setPersistenceStatus("connected");
    return persistToServer(stateRef.current);
  }, [persistToServer]);

  const appendAudit = useCallback(
    (
      draft: StoreState,
      action: string,
      entityType: string,
      entityId: string,
      detail: string,
      actor = "demo.user",
    ) => {
      draft.auditEvents = [
        {
          id: uid("audit"),
          timestamp: nowIso(),
          actor,
          action,
          entityType,
          entityId,
          detail,
        },
        ...draft.auditEvents,
      ];
    },
    [],
  );

  const appendUsage = useCallback(
    (
      draft: StoreState,
      type: UsageEventType,
      detail: string,
      entityId?: string,
    ) => {
      draft.usageEvents = [
        {
          id: uid("usage"),
          type,
          timestamp: nowIso(),
          detail,
          entityId,
        },
        ...draft.usageEvents,
      ];
    },
    [],
  );

  const logUsage = useCallback(
    (type: UsageEventType, detail: string, entityId?: string) => {
      setState((prev) => {
        const draft = structuredClone(prev);
        appendUsage(draft, type, detail, entityId);
        return draft;
      });
    },
    [appendUsage],
  );

  const resetDemo = useCallback(async () => {
    try {
      const res = await fetch("/api/state/reset", { method: "POST" });
      if (res.ok) {
        const fresh = (await res.json()) as StoreState;
        skipNextPersistRef.current = true;
        setState({ ...fresh, persistenceMode: "server" });
        setPersistenceStatus("connected");
        setPersistError(null);
        return { ok: true };
      }
      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (res.status === 401 || res.status === 403) {
        setPersistenceStatus("auth_required");
        return {
          ok: false,
          reason:
            body?.error ||
            "Reset requires an authenticated admin demo session.",
        };
      }
      setPersistenceStatus("persistence_error");
      return {
        ok: false,
        reason: body?.error || "Server reset failed.",
      };
    } catch {
      setPersistenceStatus("persistence_error");
      return {
        ok: false,
        reason: "Server reset unavailable — local state was not discarded.",
      };
    }
  }, []);

  const dismissWalkthrough = useCallback(() => {
    setState((prev) => ({ ...prev, walkthroughDismissed: true }));
  }, []);

  const getAsset = useCallback(
    (id: string) => state.assets.find((a) => a.id === id),
    [state.assets],
  );
  const getEvidence = useCallback(
    (id: string) => state.evidence.find((e) => e.id === id),
    [state.evidence],
  );
  const getSource = useCallback(
    (id: string) => state.sources.find((s) => s.id === id),
    [state.sources],
  );
  const getSignal = useCallback(
    (id: string) => state.signals.find((s) => s.id === id),
    [state.signals],
  );
  const getBrief = useCallback(
    (id: string) => state.briefs.find((b) => b.id === id),
    [state.briefs],
  );
  const getClaimsForBrief = useCallback(
    (briefId: string) => state.claims.filter((c) => c.briefId === briefId),
    [state.claims],
  );
  const getLinksForClaim = useCallback(
    (claimId: string) =>
      state.claimEvidenceLinks.filter((l) => l.claimId === claimId),
    [state.claimEvidenceLinks],
  );

  const setEvidenceReviewState = useCallback(
    (evidenceId: string, reviewState: ReviewState) => {
      setState((prev) => {
        const draft = structuredClone(prev);
        const item = draft.evidence.find((e) => e.id === evidenceId);
        if (!item) return prev;
        item.reviewState = reviewState;
        appendAudit(
          draft,
          "evidence_review_updated",
          "evidence",
          evidenceId,
          `Review state → ${reviewState}`,
        );
        appendUsage(
          draft,
          "evidence_review_updated",
          `Evidence ${evidenceId} → ${reviewState}`,
          evidenceId,
        );
        return draft;
      });
    },
    [appendAudit, appendUsage],
  );

  const toggleDraftEvidence = useCallback(
    (evidenceId: string) => {
      setState((prev) => {
        const draft = structuredClone(prev);
        const exists = draft.draftBriefEvidenceIds.includes(evidenceId);
        if (exists) {
          draft.draftBriefEvidenceIds = draft.draftBriefEvidenceIds.filter(
            (id) => id !== evidenceId,
          );
        } else {
          draft.draftBriefEvidenceIds = [
            ...draft.draftBriefEvidenceIds,
            evidenceId,
          ];
          appendUsage(
            draft,
            "evidence_added_to_brief",
            `Added ${evidenceId} to draft brief selection`,
            evidenceId,
          );
        }
        if (draft.activeDraftBriefId) {
          const brief = draft.briefs.find(
            (b) => b.id === draft.activeDraftBriefId,
          );
          if (brief && brief.state === "draft") {
            brief.evidenceIds = [...draft.draftBriefEvidenceIds];
            brief.updatedAt = nowIso();
          }
        }
        return draft;
      });
    },
    [appendUsage],
  );

  const assembleBriefFromSignal = useCallback(
    (signalId: string) => {
      let newId = "";
      setState((prev) => {
        const draft = structuredClone(prev);
        const signal = draft.signals.find((s) => s.id === signalId);
        if (!signal) return prev;
        newId = uid("brief");
        const evidenceIds =
          draft.draftBriefEvidenceIds.length > 0
            ? [...draft.draftBriefEvidenceIds]
            : [...signal.evidenceIds];
        const brief: Brief = {
          id: newId,
          title: `${signal.title} — draft brief`,
          signalId,
          state: "draft",
          evidenceIds,
          claimIds: [],
          signalSummary: signal.summary,
          evidenceSummary: `Assembled from ${evidenceIds.length} selected evidence records with provenance retained.`,
          implications: signal.implications,
          uncertainty: signal.uncertainty,
          gaps: [...signal.gaps],
          followUpQuestions: [...signal.followUpQuestions],
          contradictions: [],
          limitations: [
            "Interpretations are hypotheses pending human review",
            "Demo corpus only — illustrative metrics",
          ],
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        draft.briefs = [brief, ...draft.briefs];
        draft.activeDraftBriefId = newId;
        draft.draftBriefEvidenceIds = evidenceIds;
        appendAudit(
          draft,
          "brief_generated",
          "brief",
          newId,
          `Brief assembled from signal ${signalId}`,
        );
        appendUsage(
          draft,
          "brief_generated",
          `Generated ${newId} from ${signalId}`,
          newId,
        );
        return draft;
      });
      return newId;
    },
    [appendAudit, appendUsage],
  );

  const canApproveBrief = useCallback(
    (briefId: string) => {
      const brief = state.briefs.find((b) => b.id === briefId);
      if (!brief) return { ok: false, reason: "Brief not found." };
      const claims = state.claims.filter((c) => c.briefId === briefId);
      const materialUnsupported = claims.filter(
        (c) =>
          (c.kind === "fact" || c.kind === "interpretation") && !c.supported,
      );
      if (materialUnsupported.length > 0) {
        return {
          ok: false,
          reason: `${materialUnsupported.length} material claim(s) lack supporting sources. Cannot label as fully evidence-supported; resolve or reclassify before approval.`,
        };
      }
      if (brief.evidenceIds.length === 0) {
        return { ok: false, reason: "Brief has no linked evidence." };
      }
      return { ok: true };
    },
    [state.briefs, state.claims],
  );

  const setBriefState = useCallback(
    (briefId: string, next: BriefState, actor = "demo.reviewer") => {
      if (next === "approved-for-internal-discussion") {
        const gate = canApproveBrief(briefId);
        if (!gate.ok) return gate;
      }
      setState((prev) => {
        const draft = structuredClone(prev);
        const brief = draft.briefs.find((b) => b.id === briefId);
        if (!brief) return prev;
        const fromState = brief.state;
        brief.state = next;
        brief.updatedAt = nowIso();
        draft.briefReviews = [
          {
            id: uid("brv"),
            briefId,
            actor,
            fromState,
            toState: next,
            notes:
              next === "approved-for-internal-discussion"
                ? "Approved for internal discussion only — not regulatory validation."
                : `State transition ${fromState} → ${next}`,
            createdAt: nowIso(),
          },
          ...draft.briefReviews,
        ];
        if (next === "approved-for-internal-discussion") {
          brief.approvedAt = nowIso();
          brief.approvedBy = actor;
          appendAudit(
            draft,
            "brief_approved_for_internal_discussion",
            "brief",
            briefId,
            "Approved for internal discussion after confirmation — not regulatory validation.",
            actor,
          );
          appendUsage(
            draft,
            "brief_approved_for_internal_discussion",
            `Approved ${briefId}`,
            briefId,
          );
        } else if (next === "needs-review") {
          appendAudit(
            draft,
            "brief_marked_needs_review",
            "brief",
            briefId,
            "Brief marked needs-review.",
            actor,
          );
          appendUsage(
            draft,
            "brief_marked_needs_review",
            `Needs review ${briefId}`,
            briefId,
          );
        }
        return draft;
      });
      return { ok: true };
    },
    [appendAudit, appendUsage, canApproveBrief],
  );

  const askSignal = useCallback(
    (query: string): AskResponse => {
      const response = runAskMatcher({ query, evidence: state.evidence });

      setState((prev) => {
        const draft = structuredClone(prev);
        appendUsage(
          draft,
          "query_submitted",
          `Ask Signal: ${query.slice(0, 120)}`,
        );
        if (response.abstained) {
          appendUsage(
            draft,
            "query_abstained",
            `Abstained: ${query.slice(0, 120)}`,
          );
        }
        return draft;
      });

      return response;
    },
    [appendUsage, state.evidence],
  );

  const routeSafetyToQueue = useCallback(
    (safetyId: string) => {
      setState((prev) => {
        const draft = structuredClone(prev);
        const item = draft.safetyFlags.find((s) => s.id === safetyId);
        if (!item) return prev;
        item.routedToQueue = true;
        item.queueStatus = "queued_for_human_review";
        appendAudit(
          draft,
          "safety_routed_to_review",
          "safety",
          safetyId,
          "Fictional AE case routed to mock human-review queue. No external safety system contacted.",
        );
        appendUsage(
          draft,
          "safety_routed_to_review",
          `Routed ${safetyId} to mock queue`,
          safetyId,
        );
        return draft;
      });
    },
    [appendAudit, appendUsage],
  );

  const runEvaluation = useCallback(() => {
    setState((prev) => {
      const draft = structuredClone(prev);
      const summary = runEvaluationHarness(draft);
      const runAt = summary.ranAt;
      draft.lastEvaluationRunAt = runAt;
      draft.evaluationCases = summary.cases.map((c) => {
        if (c.result === "fail" && c.severity === "low") {
          return { ...c, severity: "medium" as const };
        }
        return c;
      });

      draft.evaluationRuns = [
        {
          id: uid("evalrun"),
          startedAt: runAt,
          completedAt: runAt,
          caseResults: draft.evaluationCases.map((c) => ({
            caseId: c.id,
            result: c.result,
          })),
          actor: "demo.reviewer",
          illustrative: false,
          measuredLabel: `${summary.model} · ${summary.promptVersion} · ${summary.corpusVersion} · ${summary.passCount}/${summary.totals} pass. Measured against seeded corpus only — not a production SLA. Targets below remain illustrative.`,
        },
        ...draft.evaluationRuns,
      ];

      appendAudit(
        draft,
        "evaluation_run_completed",
        "evaluation",
        "evaluation-centre",
        "Deterministic fixture evaluation run completed against current corpus. Measured results are separate from illustrative targets; not production benchmarks.",
      );
      appendUsage(
        draft,
        "evaluation_run_completed",
        "Measured fixture evaluation run completed",
        "evaluation-centre",
      );
      return draft;
    });
  }, [appendAudit, appendUsage]);

  const createBacklogItem = useCallback(
    (input: {
      storyId: string;
      description: string;
      priority: Priority;
      acceptanceCriteria: string[];
      estimate: string;
      dependency?: string;
      owner: string;
      status: BacklogStatus;
    }) => {
      if (!input.storyId.trim() || !input.description.trim() || !input.owner.trim()) {
        return { ok: false, reason: "Story ID, description, and owner are required." };
      }
      if (input.status === "ready" && input.acceptanceCriteria.filter(Boolean).length === 0) {
        return {
          ok: false,
          reason: "Cannot mark ready without acceptance criteria.",
        };
      }
      const id = uid("bl");
      setState((prev) => {
        const draft = structuredClone(prev);
        const item: BacklogItem = {
          id,
          storyId: input.storyId.trim(),
          description: input.description.trim(),
          priority: input.priority,
          acceptanceCriteria: input.acceptanceCriteria.filter(Boolean),
          estimate: input.estimate.trim() || "TBD",
          dependency: input.dependency?.trim() || undefined,
          owner: input.owner.trim(),
          status: input.status,
          createdAt: nowIso(),
        };
        draft.backlog = [item, ...draft.backlog];
        appendAudit(
          draft,
          "backlog_story_created",
          "backlog",
          id,
          `Created ${item.storyId}`,
        );
        appendUsage(
          draft,
          "backlog_story_created",
          `Created story ${item.storyId}`,
          id,
        );
        return draft;
      });
      return { ok: true, id };
    },
    [appendAudit, appendUsage],
  );

  const updateBacklogStatus = useCallback(
    (id: string, status: BacklogStatus) => {
      const item = state.backlog.find((b) => b.id === id);
      if (!item) return { ok: false, reason: "Story not found." };
      if (status === "ready" && item.acceptanceCriteria.length === 0) {
        return { ok: false, reason: "Cannot mark ready without acceptance criteria." };
      }
      setState((prev) => {
        const draft = structuredClone(prev);
        const target = draft.backlog.find((b) => b.id === id);
        if (!target) return prev;
        target.status = status;
        return draft;
      });
      return { ok: true };
    },
    [state.backlog],
  );

  const createChangeRequest = useCallback(
    (input: {
      title: string;
      scope: string;
      costImpact: string;
      timelineImpact: string;
      risk: string;
      classification: ChangeRequest["classification"];
    }) => {
      if (
        !input.title.trim() ||
        !input.scope.trim() ||
        !input.costImpact.trim() ||
        !input.timelineImpact.trim() ||
        !input.risk.trim()
      ) {
        return { ok: false, reason: "All change-request fields are required." };
      }
      const id = uid("cr");
      setState((prev) => {
        const draft = structuredClone(prev);
        draft.changeRequests = [
          {
            id,
            title: input.title.trim(),
            scope: input.scope.trim(),
            costImpact: input.costImpact.trim(),
            timelineImpact: input.timelineImpact.trim(),
            risk: input.risk.trim(),
            classification: input.classification,
            decision: "pending",
            createdAt: nowIso(),
          },
          ...draft.changeRequests,
        ];
        appendAudit(
          draft,
          "scope_change_recorded",
          "change_request",
          id,
          `Recorded ${input.classification}: ${input.title}`,
        );
        appendUsage(
          draft,
          "scope_change_recorded",
          `Scope change recorded: ${input.title}`,
          id,
        );
        return draft;
      });
      return { ok: true, id };
    },
    [appendAudit, appendUsage],
  );

  const decideChangeRequest = useCallback(
    (id: string, decision: ChangeDecision, decisionNotes: string) => {
      setState((prev) => {
        const draft = structuredClone(prev);
        const cr = draft.changeRequests.find((c) => c.id === id);
        if (!cr) return prev;
        cr.decision = decision;
        cr.decisionNotes = decisionNotes;
        cr.decidedAt = nowIso();
        appendAudit(
          draft,
          "scope_change_recorded",
          "change_request",
          id,
          `Decision ${decision}: ${decisionNotes}`,
        );
        return draft;
      });
    },
    [appendAudit],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      hydrated,
      persistError,
      persistenceStatus,
      retryPersist,
      resetDemo,
      dismissWalkthrough,
      logUsage,
      getAsset,
      getEvidence,
      getSource,
      getSignal,
      getBrief,
      getClaimsForBrief,
      getLinksForClaim,
      setEvidenceReviewState,
      toggleDraftEvidence,
      assembleBriefFromSignal,
      setBriefState,
      canApproveBrief,
      askSignal,
      routeSafetyToQueue,
      runEvaluation,
      createBacklogItem,
      updateBacklogStatus,
      createChangeRequest,
      decideChangeRequest,
    }),
    [
      state,
      hydrated,
      persistError,
      persistenceStatus,
      retryPersist,
      resetDemo,
      dismissWalkthrough,
      logUsage,
      getAsset,
      getEvidence,
      getSource,
      getSignal,
      getBrief,
      getClaimsForBrief,
      getLinksForClaim,
      setEvidenceReviewState,
      toggleDraftEvidence,
      assembleBriefFromSignal,
      setBriefState,
      canApproveBrief,
      askSignal,
      routeSafetyToQueue,
      runEvaluation,
      createBacklogItem,
      updateBacklogStatus,
      createChangeRequest,
      decideChangeRequest,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
