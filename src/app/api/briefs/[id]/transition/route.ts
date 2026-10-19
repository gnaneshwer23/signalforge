import { NextResponse } from "next/server";
import { loadState, saveState } from "@/lib/db/repository";
import { getSessionUser } from "@/lib/auth/session";
import { assertPermission } from "@/lib/auth/permissions";
import type { BriefState, StoreState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: BriefState[] = [
  "draft",
  "needs-review",
  "approved-for-internal-discussion",
];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

/**
 * Explicit brief state transition with server authz + durable audit.
 * Approval requires briefs:approve and records actor/time.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const user = await getSessionUser();

  let next: BriefState | undefined;
  let notes = "";
  try {
    const body = (await request.json()) as {
      nextState?: BriefState;
      notes?: string;
    };
    next = body.nextState;
    notes = typeof body.notes === "string" ? body.notes : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!next || !ALLOWED.includes(next)) {
    return NextResponse.json(
      { error: "Invalid nextState." },
      { status: 400 },
    );
  }

  const permission =
    next === "approved-for-internal-discussion"
      ? "briefs:approve"
      : next === "needs-review"
        ? "briefs:mark_needs_review"
        : "briefs:assemble";
  const authz = assertPermission(user?.role, permission);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  try {
    const state = await loadState();
    const brief = state.briefs.find((b) => b.id === id);
    if (!brief) {
      return NextResponse.json({ error: "Brief not found." }, { status: 404 });
    }

    if (next === "approved-for-internal-discussion") {
      const claims = state.claims.filter((c) => c.briefId === id);
      const materialUnsupported = claims.filter(
        (c) =>
          (c.kind === "fact" || c.kind === "interpretation") && !c.supported,
      );
      if (materialUnsupported.length > 0) {
        return NextResponse.json(
          {
            error: `${materialUnsupported.length} material claim(s) lack supporting sources. Approval blocked.`,
          },
          { status: 409 },
        );
      }
      if (brief.evidenceIds.length === 0) {
        return NextResponse.json(
          { error: "Brief has no linked evidence." },
          { status: 409 },
        );
      }
    }

    const fromState = brief.state;
    const now = new Date().toISOString();
    const actor = user!.email;
    const draft: StoreState = structuredClone(state);
    const target = draft.briefs.find((b) => b.id === id)!;
    target.state = next;
    target.updatedAt = now;
    if (next === "approved-for-internal-discussion") {
      target.approvedAt = now;
      target.approvedBy = actor;
    }
    draft.briefReviews = [
      {
        id: uid("brv"),
        briefId: id,
        actor,
        fromState,
        toState: next,
        notes:
          notes ||
          (next === "approved-for-internal-discussion"
            ? "Approved for internal discussion only — not regulatory validation."
            : `State transition ${fromState} → ${next}`),
        createdAt: now,
      },
      ...draft.briefReviews,
    ];
    draft.auditEvents = [
      {
        id: uid("audit"),
        timestamp: now,
        actor,
        action:
          next === "approved-for-internal-discussion"
            ? "brief_approved_for_internal_discussion"
            : next === "needs-review"
              ? "brief_marked_needs_review"
              : "brief_state_changed",
        entityType: "brief",
        entityId: id,
        detail: `Explicit transition ${fromState} → ${next} by ${actor}`,
      },
      ...draft.auditEvents,
    ];

    await saveState(draft);
    return NextResponse.json({
      ok: true,
      briefId: id,
      fromState,
      toState: next,
      actor,
      at: now,
    });
  } catch (error) {
    console.error("POST /api/briefs/[id]/transition failed", error);
    return NextResponse.json(
      { error: "Failed to transition brief." },
      { status: 500 },
    );
  }
}
