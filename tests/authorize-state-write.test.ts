import { describe, expect, it } from "vitest";
import { createInitialState } from "../src/lib/data";
import { authorizeStateWrite } from "../src/lib/api/authorize-state-write";

describe("authorizeStateWrite (A1)", () => {
  it("rejects unauthenticated writes", () => {
    const state = createInitialState();
    const r = authorizeStateWrite(state, state, undefined);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(401);
  });

  it("blocks analyst from approving a brief via whole-document write", () => {
    const current = createInitialState();
    const incoming = structuredClone(current);
    const brief = incoming.briefs[0];
    expect(brief).toBeTruthy();
    brief.state = "approved-for-internal-discussion";
    brief.evidenceIds = brief.evidenceIds.length
      ? brief.evidenceIds
      : ["ev-dupi-liberty"];
    // Clear unsupported material claims for this brief so gate is not the reason
    incoming.claims = incoming.claims.map((c) =>
      c.briefId === brief.id &&
      (c.kind === "fact" || c.kind === "interpretation")
        ? { ...c, supported: true }
        : c,
    );

    const r = authorizeStateWrite(current, incoming, "analyst");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.status).toBe(403);
      expect(r.error).toMatch(/briefs:approve/);
    }
  });

  it("allows reviewer to approve when unsupported gate passes", () => {
    const current = createInitialState();
    const incoming = structuredClone(current);
    const brief =
      incoming.briefs.find((b) => b.id === "brief-il13") ?? incoming.briefs[0];
    brief.state = "approved-for-internal-discussion";
    if (brief.evidenceIds.length === 0) {
      brief.evidenceIds = ["ev-dupi-liberty"];
    }
    incoming.claims = incoming.claims.map((c) =>
      c.briefId === brief.id &&
      (c.kind === "fact" || c.kind === "interpretation")
        ? { ...c, supported: true }
        : c,
    );

    const r = authorizeStateWrite(current, incoming, "reviewer");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.permissionsUsed).toContain("briefs:approve");
    }
  });

  it("blocks approval when material claims are unsupported", () => {
    const current = createInitialState();
    const incoming = structuredClone(current);
    const brief =
      incoming.briefs.find((b) => b.id === "brief-jak") ?? incoming.briefs[0];
    brief.state = "approved-for-internal-discussion";
    if (brief.evidenceIds.length === 0) {
      brief.evidenceIds = ["ev-upa-measureup"];
    }
    incoming.claims = incoming.claims.map((c) =>
      c.briefId === brief.id &&
      (c.kind === "fact" || c.kind === "interpretation")
        ? { ...c, supported: false }
        : c,
    );

    const r = authorizeStateWrite(current, incoming, "reviewer");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(409);
  });

  it("allows analyst evidence review without elevating brief state", () => {
    const current = createInitialState();
    const incoming = structuredClone(current);
    const ev = incoming.evidence[0];
    ev.reviewState =
      ev.reviewState === "reviewed" ? "needs_review" : "reviewed";

    const r = authorizeStateWrite(current, incoming, "analyst");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.permissionsUsed).toContain("evidence:review");
      expect(r.permissionsUsed).not.toContain("briefs:approve");
    }
  });
});
