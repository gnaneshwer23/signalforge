import { NextResponse } from "next/server";
import { loadState, saveState } from "@/lib/db/repository";
import { getSessionUser } from "@/lib/auth/session";
import { assertPermission } from "@/lib/auth/permissions";
import { validateStatePayload } from "@/lib/api/state-payload";
import { assertSameOrigin } from "@/lib/security/csrf";
import {
  clientKeyFromRequest,
  rateLimit,
} from "@/lib/security/rate-limit";
import type { StoreState } from "@/lib/types";

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
 * Persist workbench mutations. Requires an authenticated demo session with
 * prefs:write. Audit history is append-merged server-side — clients cannot
 * erase prior audit events by sending a reduced array.
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
    const authz = assertPermission(user?.role, "prefs:write");
    if (!authz.ok) {
      return NextResponse.json(
        { error: authz.error, code: "auth_required" },
        { status: authz.status },
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

    // Strip client ability to invent persistenceMode; never trust client audit wipe
    const sanitized: StoreState = {
      ...validated.state,
      persistenceMode: "server",
    };
    await saveState(sanitized);
    return NextResponse.json({ ok: true, actor: user!.email });
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
