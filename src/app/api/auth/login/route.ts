import { NextResponse } from "next/server";
import {
  authenticateDemoUser,
  toPublicUser,
} from "@/lib/auth/users";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { appendAuditEvent } from "@/lib/db/repository";
import { resolveSessionSecret } from "@/lib/security/session-secret";
import {
  clientKeyFromRequest,
  rateLimit,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const limited = rateLimit(`login:${clientKeyFromRequest(request)}`, {
      limit: 20,
      windowMs: 60_000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many login attempts. Retry shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000) || 1),
          },
        },
      );
    }

    const secret = resolveSessionSecret();
    if (!secret.ok) {
      return NextResponse.json(
        { error: secret.error, code: "session_misconfigured" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";
    const user = authenticateDemoUser(email, password);
    if (!user) {
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
