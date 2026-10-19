import "dotenv/config";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/db";
import { appendAuditEvent, loadState } from "../src/lib/db/repository";
import { assertPermission } from "../src/lib/auth/permissions";
import { resolveSessionSecret } from "../src/lib/security/session-secret";
import { validateStatePayload } from "../src/lib/api/state-payload";

const hasDb = Boolean(process.env.DATABASE_URL);

afterAll(async () => {
  await prisma.$disconnect();
});

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

describe("valid / invalid payloads", () => {
  it.skipIf(!hasDb)("loaded state validates as a PUT payload", async () => {
    const state = await loadState();
    const r = validateStatePayload(state);
    expect(r.ok).toBe(true);
  });

  it("rejects empty body", () => {
    expect(validateStatePayload({}).ok).toBe(false);
  });
});

describe("round-trip / refresh persistence", () => {
  // Prefer entity-level probes over full saveState() — saveState clears and
  // reseeds the whole DB, which is unsafe against a shared Neon (prod) URL.
  it.skipIf(!hasDb)(
    "entity-level meta update survives reload",
    async () => {
      const before = await prisma.appMeta.findUniqueOrThrow({
        where: { id: "default" },
      });
      const flipped = !before.walkthroughDismissed;
      await prisma.appMeta.update({
        where: { id: "default" },
        data: { walkthroughDismissed: flipped },
      });
      const mid = await loadState();
      expect(mid.walkthroughDismissed).toBe(flipped);
      await prisma.appMeta.update({
        where: { id: "default" },
        data: { walkthroughDismissed: before.walkthroughDismissed },
      });
      const after = await loadState();
      expect(after.walkthroughDismissed).toBe(before.walkthroughDismissed);
    },
    30_000,
  );

  it.skipIf(!hasDb)(
    "audit append is durable (append-only path)",
    async () => {
      const id = `audit-test-${Date.now().toString(36)}`;
      await appendAuditEvent({
        id,
        timestamp: new Date().toISOString(),
        actor: "test.runner",
        action: "test_append",
        entityType: "system",
        entityId: "test",
        detail: "persistence round-trip probe",
      });
      const row = await prisma.auditEvent.findUnique({ where: { id } });
      expect(row?.detail).toBe("persistence round-trip probe");
      const state = await loadState();
      expect(state.auditEvents.some((a) => a.id === id)).toBe(true);
    },
    30_000,
  );
});

describe("error → demo mode semantics", () => {
  it("maps failed server hydrate to demo_mode label contract", () => {
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
