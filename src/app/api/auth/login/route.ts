import { NextResponse } from "next/server";
import {
  findDemoUserByEmail,
  toPublicUser,
} from "@/lib/auth/users";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { appendAuditEvent } from "@/lib/db/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";
    const user = findDemoUserByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid demo credentials." },
        { status: 401 },
      );
    }
    const token = createSessionToken(user.id, user.role);
    const res = NextResponse.json({ user: toPublicUser(user) });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    try {
      await appendAuditEvent({
        id: `audit-login-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        actor: user.email,
        action: "session_login",
        entityType: "user",
        entityId: user.id,
        detail: `Demo session established for role ${user.role}`,
      });
    } catch {
      // Audit best-effort if DB not ready
    }
    return res;
  } catch (error) {
    console.error("POST /api/auth/login failed", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
