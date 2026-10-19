import { NextResponse } from "next/server";
import { loadState, saveState } from "@/lib/db/repository";
import { getSessionUser } from "@/lib/auth/session";
import { assertPermission } from "@/lib/auth/permissions";
import type { StoreState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await loadState();
    return NextResponse.json(state);
  } catch (error) {
    console.error("GET /api/state failed", error);
    return NextResponse.json(
      { error: "Failed to load workbench state from SQLite." },
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
    const user = await getSessionUser();
    const authz = assertPermission(user?.role, "prefs:write");
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }
    const body = (await request.json()) as StoreState;
    if (!body || !Array.isArray(body.assets) || !Array.isArray(body.evidence)) {
      return NextResponse.json(
        { error: "Invalid workbench state payload." },
        { status: 400 },
      );
    }
    // Strip client ability to invent persistenceMode; never trust client audit wipe
    const sanitized: StoreState = {
      ...body,
      persistenceMode: "server",
    };
    await saveState(sanitized);
    return NextResponse.json({ ok: true, actor: user!.email });
  } catch (error) {
    console.error("PUT /api/state failed", error);
    return NextResponse.json(
      { error: "Failed to persist workbench state." },
      { status: 500 },
    );
  }
}
