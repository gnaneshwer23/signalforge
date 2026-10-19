import { NextResponse } from "next/server";
import { resetDatabase, appendAuditEvent, loadState } from "@/lib/db/repository";
import { getSessionUser } from "@/lib/auth/session";
import { assertPermission } from "@/lib/auth/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getSessionUser();
    const authz = assertPermission(user?.role, "demo:reset");
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
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
      { error: "Failed to reset demo database." },
      { status: 500 },
    );
  }
}
