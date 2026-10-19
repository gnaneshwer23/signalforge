import { describe, expect, it } from "vitest";
import type { AuditEvent } from "../src/lib/types";

/**
 * Mirrors the append-merge rule used by saveState: clients cannot wipe prior
 * audit rows by syncing a reduced array.
 */
function mergeAudit(
  existing: AuditEvent[],
  incoming: AuditEvent[],
): AuditEvent[] {
  const existingIds = new Set(existing.map((a) => a.id));
  const merged = [
    ...incoming.filter((a) => !existingIds.has(a.id)),
    ...existing,
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const seen = new Set<string>();
  return merged.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}

describe("audit append-merge", () => {
  it("preserves server history when client sends empty audit", () => {
    const existing: AuditEvent[] = [
      {
        id: "audit-1",
        timestamp: "2026-01-02T00:00:00.000Z",
        actor: "admin",
        action: "seed",
        entityType: "system",
        entityId: "root",
        detail: "seeded",
      },
    ];
    const merged = mergeAudit(existing, []);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe("audit-1");
  });

  it("appends new client events without dropping old ones", () => {
    const existing: AuditEvent[] = [
      {
        id: "audit-1",
        timestamp: "2026-01-01T00:00:00.000Z",
        actor: "admin",
        action: "seed",
        entityType: "system",
        entityId: "root",
        detail: "seeded",
      },
    ];
    const incoming: AuditEvent[] = [
      {
        id: "audit-2",
        timestamp: "2026-01-03T00:00:00.000Z",
        actor: "reviewer",
        action: "brief_approved_for_internal_discussion",
        entityType: "brief",
        entityId: "brief-1",
        detail: "approved",
      },
      {
        id: "audit-1",
        timestamp: "2026-01-01T00:00:00.000Z",
        actor: "attacker",
        action: "tamper",
        entityType: "system",
        entityId: "root",
        detail: "should not rewrite",
      },
    ];
    const merged = mergeAudit(existing, incoming);
    expect(merged.map((a) => a.id).sort()).toEqual(["audit-1", "audit-2"]);
    expect(merged.find((a) => a.id === "audit-1")?.detail).toBe("seeded");
  });
});
