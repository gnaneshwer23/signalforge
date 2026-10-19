import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
  findDemoUserById,
  toPublicUser,
  type PublicUser,
  type Role,
} from "./users";
import {
  requireSessionSecret,
  resolveSessionSecret,
} from "@/lib/security/session-secret";

export const SESSION_COOKIE = "sf_session";

type SessionPayload = {
  userId: string;
  role: Role;
  exp: number;
};

function sessionSecret(): string {
  return requireSessionSecret();
}

function b64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

function sign(payloadB64: string): string {
  return b64url(
    createHmac("sha256", sessionSecret()).update(payloadB64).digest(),
  );
}

export function createSessionToken(
  userId: string,
  role: Role,
  ttlSeconds = 60 * 60 * 12,
): string {
  const payload: SessionPayload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  // Fail closed on shared deploy if SESSION_SECRET is missing/weak.
  if (!resolveSessionSecret().ok) return null;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  const expected = sign(payloadB64);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(
      fromB64url(payloadB64).toString("utf8"),
    ) as SessionPayload;
    if (!payload.userId || !payload.role || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const user = findDemoUserById(payload.userId);
  if (!user || user.role !== payload.role) return null;
  return toPublicUser(user);
}

export function sessionCookieOptions(maxAgeSeconds = 60 * 60 * 12) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
