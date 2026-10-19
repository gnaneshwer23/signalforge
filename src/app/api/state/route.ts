import { NextResponse } from "next/server";
import { loadState, saveState } from "@/lib/db/repository";
import { getSessionUser } from "@/lib/auth/session";
import { validateStatePayload } from "@/lib/api/state-payload";
import { authorizeStateWrite } from "@/lib/api/authorize-state-write";
import { assertSameOrigin } from "@/lib/security/csrf";
import {
  clientKeyFromRequest,
  rateLimit,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function dbErrorMessage(error: unknown, fallback: string): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/DATABASE_URL|Environment variable not found|P1001|P1012|Can't reach/i.test(msg)) {
    return "Persistence unavailable: database is not configured or unreachable.";
  }
  if (/P2021|does not exist|relation/i.test(msg)) {
    return "Persistence unavailable: database schema is missing. Run migrations.";
  }
  return fallback;
}

export async function GET() {
  try {
    const state = await loadState();
    return NextResponse.json(state);
  } catch (error) {
    console.error("GET /api/state failed", error);
    return NextResponse.json(
      {
        error: dbErrorMessage(
          error,
          "Failed to load workbench state from the database.",
        ),
        code: "persistence_error",
      },
      { status: 500 },
    );
  }
}

/**
 * Persist workbench mutations with per-action authz (A1).
 * prefs:write alone cannot approve briefs, route safety, or rewrite privileged fields.
 * Audit history is append-merged server-side — clients cannot erase prior events.
 */
export async function PUT(request: Request) {
  try {
    const origin = assertSameOrigin(request);
    if (!origin.ok) {
      return NextResponse.json(
        { error: origin.error, code: "csrf" },
        { status: origin.status },
      );
    }

    const limited = rateLimit(`state-put:${clientKeyFromRequest(request)}`, {
      limit: 60,
      windowMs: 60_000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many persist requests. Retry shortly.", code: "rate_limited" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000) || 1),
          },
        },
      );
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required. Sign in with a demo account.",
          code: "auth_required",
        },
        { status: 401 },
      );
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body.", code: "invalid_payload" },
        { status: 400 },
      );
    }

    const validated = validateStatePayload(raw);
    if (!validated.ok) {
      return NextResponse.json(
        { error: validated.error, code: "invalid_payload" },
        { status: 400 },
      );
    }

    const current = await loadState();
    const authorized = authorizeStateWrite(
      current,
      validated.state,
      user.role,
    );
    if (!authorized.ok) {
      return NextResponse.json(
        {
          error: authorized.error,
          code:
            authorized.status === 409
              ? "approval_blocked"
              : authorized.status === 403
                ? "forbidden"
                : "auth_required",
        },
        { status: authorized.status },
      );
    }

    await saveState(authorized.state);
    return NextResponse.json({
      ok: true,
      actor: user.email,
      permissionsUsed: authorized.permissionsUsed,
    });
  } catch (error) {
    console.error("PUT /api/state failed", error);
    return NextResponse.json(
      {
        error: dbErrorMessage(error, "Failed to persist workbench state."),
        code: "persistence_error",
      },
      { status: 500 },
    );
  }
}
