import { NextResponse } from "next/server";
import { resetDatabase, appendAuditEvent, loadState } from "@/lib/db/repository";
import { getSessionUser } from "@/lib/auth/session";
import { assertPermission } from "@/lib/auth/permissions";
import { assertSameOrigin } from "@/lib/security/csrf";
import {
  clientKeyFromRequest,
  rateLimit,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const origin = assertSameOrigin(request);
    if (!origin.ok) {
      return NextResponse.json(
        { error: origin.error, code: "csrf" },
        { status: origin.status },
      );
    }

    const limited = rateLimit(`state-reset:${clientKeyFromRequest(request)}`, {
      limit: 10,
      windowMs: 60_000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many reset requests. Retry shortly.", code: "rate_limited" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000) || 1),
          },
        },
      );
    }

    const user = await getSessionUser();
    const authz = assertPermission(user?.role, "demo:reset");
    if (!authz.ok) {
      return NextResponse.json(
        { error: authz.error, code: "auth_required" },
        { status: authz.status },
      );
    }
    await resetDatabase();
    await appendAuditEvent({
      id: `audit-reset-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      actor: user!.email,
      action: "demo_reset",
      entityType: "app",
      entityId: "default",
      detail: "Demo corpus re-seeded by authenticated admin.",
    });
    const state = await loadState();
    return NextResponse.json(state);
  } catch (error) {
    console.error("POST /api/state/reset failed", error);
    return NextResponse.json(
      {
        error: "Failed to reset demo database.",
        code: "persistence_error",
      },
      { status: 500 },
    );
  }
}
