import { describe, expect, it } from "vitest";
import { deriveProvenanceStatus } from "../src/lib/provenance/status";
import { createInitialState } from "../src/lib/data";

describe("deriveProvenanceStatus", () => {
  const state = createInitialState();

  it("marks fictional pipeline evidence as unverified or insufficient", () => {
    const ev = state.evidence.find((e) => e.id === "ev-sigfor-fictional");
    const source = state.sources.find((s) => s.id === ev?.sourceId);
    expect(ev && source).toBeTruthy();
    if (!ev || !source) return;
    const status = deriveProvenanceStatus({
      evidence: ev,
      source,
      claims: state.claims,
      links: state.claimEvidenceLinks,
      briefs: state.briefs,
    });
    expect(["unverified", "insufficient"]).toContain(status);
  });

  it("can mark verified linked evidence as supported", () => {
    const link = state.claimEvidenceLinks[0];
    const ev = state.evidence.find((e) => e.id === link.evidenceId)!;
    const source = state.sources.find((s) => s.id === ev.sourceId)!;
    const claim = state.claims.find((c) => c.id === link.claimId)!;
    // Isolated fixture: no contradictions on the brief graph.
    const status = deriveProvenanceStatus({
      evidence: { ...ev, reviewState: "reviewed" },
      source: {
        ...source,
        provenanceKind: "verified_source",
        verification: "verified",
        url: source.url || "https://example.org/record",
      },
      claims: [{ ...claim, kind: "fact", supported: true }],
      links: [link],
      briefs: [
        {
          ...state.briefs[0],
          id: claim.briefId,
          contradictions: [],
        },
      ],
    });
    expect(status).toBe("supported");
  });

  it("marks discovery-only reviewed evidence as insufficient", () => {
    const ev = state.evidence[0];
    const status = deriveProvenanceStatus({
      evidence: { ...ev, reviewState: "reviewed" },
      source: {
        id: "src-test",
        type: "press_release",
        title: "Landing",
        url: "https://example.org/search",
        retrievalDate: "2026-01-01",
        verification: "unverified",
        provenanceKind: "discovery_url",
      },
      claims: [],
      links: [],
      briefs: [],
    });
    expect(status).toBe("insufficient");
  });

  it("marks conflicting when contradictions exist on linked brief", () => {
    const brief = state.briefs.find((b) => b.contradictions.length > 0);
    expect(brief).toBeTruthy();
    if (!brief) return;
    const claim = state.claims.find((c) => c.briefId === brief.id);
    expect(claim).toBeTruthy();
    if (!claim) return;
    const link = state.claimEvidenceLinks.find((l) => l.claimId === claim.id);
    expect(link).toBeTruthy();
    if (!link) return;
    const ev = state.evidence.find((e) => e.id === link.evidenceId)!;
    const source = state.sources.find((s) => s.id === ev.sourceId)!;
    const status = deriveProvenanceStatus({
      evidence: ev,
      source,
      claims: state.claims,
      links: state.claimEvidenceLinks,
      briefs: state.briefs,
    });
    expect(status).toBe("conflicting");
  });
});
