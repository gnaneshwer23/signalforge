import { describe, expect, it, beforeEach } from "vitest";
import {
  rateLimit,
  resetRateLimitBuckets,
} from "../src/lib/security/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  it("allows requests under the limit", () => {
    for (let i = 0; i < 5; i++) {
      const r = rateLimit("test-key", { limit: 5, windowMs: 60_000 });
      expect(r.ok).toBe(true);
    }
  });

  it("blocks when limit exceeded", () => {
    for (let i = 0; i < 3; i++) {
      rateLimit("block-key", { limit: 3, windowMs: 60_000 });
    }
    const blocked = rateLimit("block-key", { limit: 3, windowMs: 60_000 });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterMs).toBeGreaterThan(0);
    }
  });
});
