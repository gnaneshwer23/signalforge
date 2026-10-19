import type { AuditEvent, UsageEvent } from "@/lib/types";

export const seedAuditEvents: AuditEvent[] = [
  {
    id: "audit-001",
    timestamp: "2026-02-07T10:05:00.000Z",
    actor: "demo.analyst",
    action: "brief_created",
    entityType: "brief",
    entityId: "brief-il13",
    detail: "Draft brief assembled from signal sig-il13-crowding.",
  },
  {
    id: "audit-002",
    timestamp: "2026-02-08T16:05:00.000Z",
    actor: "demo.reviewer",
    action: "brief_marked_needs_review",
    entityType: "brief",
    entityId: "brief-jak",
    detail: "Oral JAK brief moved to needs-review due to unsupported comparative safety claim.",
  },
  {
    id: "audit-003",
    timestamp: "2026-02-09T11:00:00.000Z",
    actor: "demo.reviewer",
    action: "evidence_review_updated",
    entityType: "evidence",
    entityId: "ev-tralo-ecztend",
    detail: "Review state set to needs_review pending durability claim check.",
  },
];

export const seedUsageEvents: UsageEvent[] = [
  {
    id: "usage-001",
    type: "brief_generated",
    timestamp: "2026-02-07T10:05:00.000Z",
    detail: "Generated draft brief-il13",
    entityId: "brief-il13",
  },
  {
    id: "usage-002",
    type: "brief_marked_needs_review",
    timestamp: "2026-02-08T16:05:00.000Z",
    detail: "Marked brief-jak needs-review",
    entityId: "brief-jak",
  },
];
