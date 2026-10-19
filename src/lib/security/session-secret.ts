const WEAK_DEFAULTS = new Set([
  "signalforge-demo-session-secret-change-me",
  "signalforge-demo-session-secret-not-for-production",
]);

/** True when running on a shared host (Vercel or NODE_ENV=production). */
export function isSharedDeploy(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

/**
 * Resolve the HMAC secret for demo sessions.
 * Shared deployments require a strong unique SESSION_SECRET (≥32 chars).
 * Local/dev may fall back to a labelled demo default.
 */
export function resolveSessionSecret():
  | { ok: true; secret: string }
  | { ok: false; error: string } {
  const secret = process.env.SESSION_SECRET?.trim() || "";
  if (isSharedDeploy()) {
    if (!secret || secret.length < 32 || WEAK_DEFAULTS.has(secret)) {
      return {
        ok: false,
        error:
          "SESSION_SECRET must be a unique value of at least 32 characters on shared deployments. Set it in Vercel project env.",
      };
    }
    return { ok: true, secret };
  }
  if (secret && !WEAK_DEFAULTS.has(secret) && secret.length >= 16) {
    return { ok: true, secret };
  }
  // Local-only fallback — never used when VERCEL=1 / production.
  return {
    ok: true,
    secret: "signalforge-demo-session-secret-not-for-production",
  };
}

export function requireSessionSecret(): string {
  const resolved = resolveSessionSecret();
  if (!resolved.ok) {
    throw new Error(resolved.error);
  }
  return resolved.secret;
}
