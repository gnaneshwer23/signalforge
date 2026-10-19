import { scryptSync, timingSafeEqual, randomBytes } from "node:crypto";

const KEYLEN = 64;

/** Hash a demo password with scrypt. Format: scrypt$<saltHex>$<hashHex> */
export function hashPassword(password: string, saltHex?: string): string {
  const salt = saltHex
    ? Buffer.from(saltHex, "hex")
    : randomBytes(16);
  const hash = scryptSync(password, salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

/** Timing-safe compare of plaintext against a scrypt$salt$hash credential. */
export function verifyPassword(
  password: string,
  stored: string,
): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    // Legacy plaintext demo passwords (should not ship) — constant-time-ish reject path
    if (!stored) return false;
    const a = Buffer.from(password);
    const b = Buffer.from(stored);
    if (a.length !== b.length) {
      timingSafeEqual(a, a);
      return false;
    }
    return timingSafeEqual(a, b);
  }
  const [, saltHex, hashHex] = parts;
  const candidate = hashPassword(password, saltHex);
  const a = Buffer.from(candidate);
  const b = Buffer.from(`scrypt$${saltHex}$${hashHex}`);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
