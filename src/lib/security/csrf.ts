/**
 * Lightweight Origin/Referer check for cookie-authenticated mutations.
 * SameSite=lax already limits classic CSRF; this adds an explicit host match.
 */

export function assertSameOrigin(request: Request): {
  ok: true;
} | { ok: false; status: number; error: string } {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  if (!host) {
    return { ok: false, status: 403, error: "Missing Host header." };
  }

  const allowed = new Set<string>();
  allowed.add(`https://${host}`);
  allowed.add(`http://${host}`);
  // Local / preview convenience
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    allowed.add(`http://${host}`);
  }

  const check = (value: string | null) => {
    if (!value) return null;
    try {
      return new URL(value).origin;
    } catch {
      return null;
    }
  };

  const originUrl = check(origin);
  if (originUrl) {
    if (allowed.has(originUrl)) return { ok: true };
    return {
      ok: false,
      status: 403,
      error: "Cross-origin request blocked.",
    };
  }

  const refererOrigin = check(referer);
  if (refererOrigin) {
    if (allowed.has(refererOrigin)) return { ok: true };
    return {
      ok: false,
      status: 403,
      error: "Cross-origin request blocked.",
    };
  }

  // Non-browser clients (curl, tests) often omit Origin/Referer — allow only
  // when neither is present (same posture as many APIs for machine clients).
  return { ok: true };
}
