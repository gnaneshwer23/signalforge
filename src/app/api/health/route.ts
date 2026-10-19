import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveSessionSecret } from "@/lib/security/session-secret";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight readiness probe: DB reachable + session secret posture.
 * Does not expose secrets or connection strings.
 */
export async function GET() {
  const session = resolveSessionSecret();
  let db: "ok" | "error" = "error";
  let detail: string | undefined;
  try {
    await prisma.$queryRaw`SELECT 1`;
    const meta = await prisma.appMeta.findUnique({ where: { id: "default" } });
    db = "ok";
    if (!meta) {
      detail = "Database reachable but not seeded.";
    }
  } catch (error) {
    console.error("GET /api/health db check failed", error);
    detail = "Database unreachable or misconfigured.";
  }

  const ok = db === "ok" && session.ok;
  return NextResponse.json(
    {
      ok,
      db,
      sessionSecretConfigured: session.ok,
      ...(detail ? { detail } : {}),
      persistence: "postgresql",
    },
    { status: ok ? 200 : 503 },
  );
}
