import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { DEMO_USERS, toPublicUser } from "@/lib/auth/users";
import { roleHasPermission, type Permission } from "@/lib/auth/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAMPLE_PERMISSIONS: Permission[] = [
  "briefs:approve",
  "safety:route",
  "evaluation:run",
  "backlog:write",
  "change_request:decide",
  "demo:reset",
];

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({
    user,
    // Exclude admin from public demo chips — password is env-only (A2).
    demoAccounts: DEMO_USERS.filter((u) => !u.requiresEnvPassword).map(
      toPublicUser,
    ),
    permissions: user
      ? Object.fromEntries(
          SAMPLE_PERMISSIONS.map((p) => [p, roleHasPermission(user.role, p)]),
        )
      : null,
  });
}
