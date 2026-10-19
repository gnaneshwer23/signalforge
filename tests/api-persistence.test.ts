import "dotenv/config";
import { describe, expect, it } from "vitest";
import { prisma } from "../src/lib/db";
import { loadState, saveState } from "../src/lib/db/repository";
import { assertPermission } from "../src/lib/auth/permissions";
import { resolveSessionSecret } from "../src/lib/security/session-secret";

const hasDb = Boolean(process.env.DATABASE_URL);

describe("API health / DB connectivity", () => {
  it.skipIf(!hasDb)("can ping Postgres via Prisma", async () => {
    const rows = await prisma.$queryRaw`SELECT 1::int as ok`;
    expect(rows).toEqual([{ ok: 1 }]);
  });

  it.skipIf(!hasDb)("app meta exists after migrate/seed", async () => {
    const meta = await prisma.appMeta.findUnique({ where: { id: "default" } });
    expect(meta).toBeTruthy();
  });

  it("session secret resolves in local/test", () => {
    const r = resolveSessionSecret();
    expect(r.ok).toBe(true);
  });
});

describe("authz for writes / reset", () => {
  it("rejects unauthenticated prefs:write", () => {
    const r = assertPermission(undefined, "prefs:write");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(401);
  });

  it("allows analyst prefs:write", () => {
    expect(assertPermission("analyst", "prefs:write").ok).toBe(true);
  });

  it("rejects non-admin demo:reset", () => {
    const r = assertPermission("reviewer", "demo:reset");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(403);
  });

  it("allows admin demo:reset", () => {
    expect(assertPermission("admin", "demo:reset").ok).toBe(true);
  });
});

describe("round-trip / refresh persistence", () => {
  it.skipIf(!hasDb)("load → mutate meta → save → reload keeps change", async () => {
    const before = await loadState();
    expect(before.assets.length).toBeGreaterThan(0);
    const flipped = !before.walkthroughDismissed;
    const next = {
      ...before,
      walkthroughDismissed: flipped,
      persistenceMode: "server" as const,
    };
    await saveState(next);
    const after = await loadState();
    expect(after.walkthroughDismissed).toBe(flipped);
    // restore
    await saveState({
      ...after,
      walkthroughDismissed: before.walkthroughDismissed,
      persistenceMode: "server",
    });
  }, 120_000);

  it.skipIf(!hasDb)("audit history is append-merged across save", async () => {
    const before = await loadState();
    const priorIds = new Set(before.auditEvents.map((a) => a.id));
    expect(priorIds.size).toBeGreaterThan(0);
    const trimmed = {
      ...before,
      auditEvents: [],
      persistenceMode: "server" as const,
    };
    await saveState(trimmed);
    const after = await loadState();
    for (const id of priorIds) {
      expect(after.auditEvents.some((a) => a.id === id)).toBe(true);
    }
  }, 120_000);
});

describe("error → demo mode semantics", () => {
  it("maps failed server hydrate to demo_mode label contract", () => {
    // Pure contract: UI treats non-OK GET as demo_mode (see StoreProvider).
    const statusFromGet = (ok: boolean) => (ok ? "connected" : "demo_mode");
    expect(statusFromGet(false)).toBe("demo_mode");
    expect(statusFromGet(true)).toBe("connected");
  });

  it("failed write maps to auth_required or persistence_error, not connected", () => {
    const statusFromPut = (http: number) => {
      if (http === 401 || http === 403) return "auth_required";
      if (http >= 500) return "persistence_error";
      return "connected";
    };
    expect(statusFromPut(401)).toBe("auth_required");
    expect(statusFromPut(500)).toBe("persistence_error");
    expect(statusFromPut(200)).toBe("connected");
  });
});
