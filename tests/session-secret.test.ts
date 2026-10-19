import { afterEach, describe, expect, it } from "vitest";
import {
  isSharedDeploy,
  resolveSessionSecret,
} from "../src/lib/security/session-secret";

const ORIGINAL = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe("session secret posture", () => {
  it("fails closed on shared deploy without SESSION_SECRET", () => {
    process.env.VERCEL = "1";
    process.env.NODE_ENV = "production";
    delete process.env.SESSION_SECRET;
    const r = resolveSessionSecret();
    expect(r.ok).toBe(false);
    expect(isSharedDeploy()).toBe(true);
  });

  it("rejects weak default secrets on shared deploy", () => {
    process.env.VERCEL = "1";
    process.env.SESSION_SECRET =
      "signalforge-demo-session-secret-not-for-production";
    const r = resolveSessionSecret();
    expect(r.ok).toBe(false);
  });

  it("accepts a strong secret on shared deploy", () => {
    process.env.VERCEL = "1";
    process.env.SESSION_SECRET = "a".repeat(40);
    const r = resolveSessionSecret();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.secret).toHaveLength(40);
  });

  it("allows local fallback when not on shared deploy", () => {
    delete process.env.VERCEL;
    process.env.NODE_ENV = "test";
    delete process.env.SESSION_SECRET;
    const r = resolveSessionSecret();
    expect(r.ok).toBe(true);
  });
});
