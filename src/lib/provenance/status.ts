import type {
  Brief,
  Claim,
  ClaimEvidenceLink,
  EvidenceRecord,
  ProvenanceStatus,
  Source,
} from "@/lib/types";

export const PROVENANCE_STATUS_DEFINITIONS: Record<
  ProvenanceStatus,
  { label: string; definition: string }
> = {
  unverified: {
    label: "Unverified",
    definition:
      "No usable direct source locator, or the record is a fictional demo artifact. Must not be treated as claim support.",
  },
  source_located: {
    label: "Source located",
    definition:
      "A discovery URL, registry id, or verified source locator exists. Human evidence review is not complete. Discovery URLs alone ≠ verified claim support.",
  },
  evidence_reviewed: {
    label: "Evidence reviewed",
    definition:
      "A human review state of “reviewed” is recorded. Claim support is not yet established from this status alone.",
  },
  supported: {
    label: "Supported",
    definition:
      "At least one fact or interpretation claim links this evidence, the claim is marked supported, and the source provenanceKind is verified_source.",
  },
  conflicting: {
    label: "Conflicting",
    definition:
      "The evidence participates in a brief with recorded contradictions, or is linked to both supported and unsupported material claims.",
  },
  insufficient: {
    label: "Insufficient",
    definition:
      "A source is located and/or reviewed, but provenance is discovery-only, fictional, or otherwise cannot establish verified claim support.",
  },
};

export type ProvenanceContext = {
  evidence: EvidenceRecord;
  source: Source | undefined;
  claims: Claim[];
  links: ClaimEvidenceLink[];
  briefs: Brief[];
};

/**
 * Derive a precise provenance lifecycle status for an evidence record.
 * Pure function — safe for UI and tests.
 */
export function deriveProvenanceStatus(ctx: ProvenanceContext): ProvenanceStatus {
  const { evidence, source, claims, links, briefs } = ctx;
  const linkClaimIds = new Set(
    links.filter((l) => l.evidenceId === evidence.id).map((l) => l.claimId),
  );
  const linkedClaims = claims.filter((c) => linkClaimIds.has(c.id));
  const material = linkedClaims.filter(
    (c) => c.kind === "fact" || c.kind === "interpretation",
  );
  const supportedMaterial = material.filter((c) => c.supported);
  const unsupportedMaterial = material.filter((c) => !c.supported);

  const briefIds = new Set(linkedClaims.map((c) => c.briefId));
  const hasContradiction = briefs.some(
    (b) => briefIds.has(b.id) && b.contradictions.length > 0,
  );

  if (hasContradiction || (supportedMaterial.length > 0 && unsupportedMaterial.length > 0)) {
    return "conflicting";
  }

  const fictional = source?.provenanceKind === "fictional_demo";
  const discoveryOnly = source?.provenanceKind === "discovery_url";
  const verifiedSource = source?.provenanceKind === "verified_source";
  const hasLocator = Boolean(source?.url || source?.identifier);
  const reviewed = evidence.reviewState === "reviewed";

  if (
    supportedMaterial.length > 0 &&
    verifiedSource &&
    source?.verification === "verified"
  ) {
    return "supported";
  }

  if (fictional || (!hasLocator && source?.verification !== "verified")) {
    if (reviewed || hasLocator) return "insufficient";
    return "unverified";
  }

  if (discoveryOnly) {
    if (reviewed) return "insufficient";
    if (hasLocator) return "source_located";
    return "unverified";
  }

  if (reviewed) {
    if (supportedMaterial.length === 0) return "evidence_reviewed";
    // Linked but not verified_source path → insufficient for claim support
    return "insufficient";
  }

  if (hasLocator || verifiedSource) {
    return "source_located";
  }

  return "unverified";
}

export function provenanceStatusLabel(status: ProvenanceStatus): string {
  return PROVENANCE_STATUS_DEFINITIONS[status].label;
}
