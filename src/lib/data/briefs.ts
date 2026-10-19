import type { Brief, Claim, ClaimEvidenceLink } from "@/lib/types";

export const briefs: Brief[] = [
  {
    id: "brief-il13",
    title: "IL-13 crowding — draft competitive brief",
    signalId: "sig-il13-crowding",
    state: "draft",
    evidenceIds: [
      "ev-tralo-ecztend",
      "ev-lebri-advocate",
      "ev-dupi-liberty",
    ],
    claimIds: ["claim-il13-1", "claim-il13-2", "claim-il13-3"],
    signalSummary:
      "IL-13-selective biologics are intensifying maintenance and selectivity narratives against the IL-4Rα benchmark.",
    evidenceSummary:
      "Seeded Phase 3 and extension materials support placebo-controlled efficacy for lebrikizumab and durability signals for tralokinumab, while dupilumab remains the historical benchmark.",
    implications:
      "Commercial teams should track which dosing claims are label-backed versus promotional, and avoid unsupported head-to-head superiority language.",
    uncertainty:
      "Absence of direct IL-13 vs IL-13 pivotal comparisons means relative ranking remains an interpretation.",
    gaps: [
      "No head-to-head IL-13 pivotal trial in corpus",
      "Payer evidence limited",
    ],
    followUpQuestions: [
      "Which maintenance intervals are explicitly labelled?",
      "Where do medical affairs need stronger comparative evidence?",
    ],
    contradictions: [
      "Press positioning implies clearer differentiation than peer-reviewed comparative data currently support.",
    ],
    limitations: [
      "Demo corpus is bounded and illustrative",
      "Cross-trial inference is hypothesis-grade",
    ],
    createdAt: "2026-02-07T10:00:00.000Z",
    updatedAt: "2026-02-09T14:30:00.000Z",
  },
  {
    id: "brief-jak",
    title: "Oral JAK efficacy vs safety context — needs review",
    signalId: "sig-jak-safety-context",
    state: "needs-review",
    evidenceIds: [
      "ev-upa-measureup",
      "ev-abro-jade",
      "ev-jak-safety-label",
    ],
    claimIds: ["claim-jak-1", "claim-jak-2", "claim-jak-3"],
    signalSummary:
      "Oral JAK options show strong placebo-controlled efficacy but must be framed with regulatory class safety context.",
    evidenceSummary:
      "Measure Up and JADE programme summaries support efficacy; FDA class communications constrain promotional latitude.",
    implications:
      "Internal strategy discussions should keep efficacy facts, safety class interpretations, and sequencing hypotheses in separate claim layers.",
    uncertainty:
      "AD-specific absolute risk differentials versus biologics are incomplete in this corpus.",
    gaps: [
      "Limited long-term comparative safety synthesis",
      "Region-specific label nuances incomplete",
    ],
    followUpQuestions: [
      "Which statements are product-label vs class-level?",
      "What monitoring expectations affect primary care vs specialist use?",
    ],
    contradictions: [
      "Efficacy-focused publications and class safety communications can be selectively quoted to imply opposing strategic conclusions.",
    ],
    limitations: [
      "Not a pharmacovigilance determination",
      "Illustrative demo metrics only",
    ],
    createdAt: "2026-02-05T09:00:00.000Z",
    updatedAt: "2026-02-08T16:00:00.000Z",
  },
];

export const claims: Claim[] = [
  {
    id: "claim-il13-1",
    briefId: "brief-il13",
    text: "Lebrikizumab demonstrated placebo-controlled efficacy on skin endpoints in Phase 3 AD studies.",
    kind: "fact",
    supported: true,
    confidence: "high",
    confidenceRationale: {
      quality: "Phase 3 peer-reviewed / programme summaries in seed set",
      relevance: "Directly addresses moderate-to-severe AD efficacy",
      consistency: "Aligned with regulatory authorisation framing",
      completeness: "Endpoint details summarised; full CSR not in corpus",
    },
    evidenceLinkIds: ["cel-il13-1"],
  },
  {
    id: "claim-il13-2",
    briefId: "brief-il13",
    text: "IL-13 selectivity may offer a clinically meaningful advantage over IL-4Rα blockade for maintenance convenience.",
    kind: "hypothesis",
    supported: false,
    confidence: "low",
    confidenceRationale: {
      quality: "Primarily press and cross-trial narrative",
      relevance: "Strategically relevant but weakly evidenced comparatively",
      consistency: "Not consistently established across independent sources",
      completeness: "No head-to-head pivotal evidence in corpus",
    },
    evidenceLinkIds: ["cel-il13-2"],
    unsupportedReason:
      "Material comparative advantage is not established by linked sources; treat as hypothesis.",
  },
  {
    id: "claim-il13-3",
    briefId: "brief-il13",
    text: "Medical review should verify which Q4W maintenance statements are label-supported before external use.",
    kind: "action",
    supported: true,
    confidence: "moderate",
    confidenceRationale: {
      quality: "Process recommendation grounded in evidence gaps",
      relevance: "Directly tied to observed promotional vs label risk",
      consistency: "Consistent with governance checklist expectations",
      completeness: "Actionable within demo workflow",
    },
    evidenceLinkIds: ["cel-il13-3"],
  },
  {
    id: "claim-jak-1",
    briefId: "brief-jak",
    text: "Upadacitinib and abrocitinib showed higher short-term skin response rates than placebo in pivotal AD programmes.",
    kind: "fact",
    supported: true,
    confidence: "high",
    confidenceRationale: {
      quality: "Phase 3 programme evidence in seed set",
      relevance: "Core efficacy claim for oral segment",
      consistency: "Consistent across JADE / Measure Up summaries",
      completeness: "Dose and population nuances summarised at high level",
    },
    evidenceLinkIds: ["cel-jak-1a", "cel-jak-1b"],
  },
  {
    id: "claim-jak-2",
    briefId: "brief-jak",
    text: "Regulatory class communications require oral JAK competitive narratives to include serious risk context.",
    kind: "interpretation",
    supported: true,
    confidence: "moderate",
    confidenceRationale: {
      quality: "Regulatory communication present",
      relevance: "Directly shapes positioning constraints",
      consistency: "Aligned with labelled risk framing",
      completeness: "AD-specific absolute risk quantification limited",
    },
    evidenceLinkIds: ["cel-jak-2"],
  },
  {
    id: "claim-jak-3",
    briefId: "brief-jak",
    text: "Oral JAKs are safer than biologics for long-term AD management in most adults.",
    kind: "hypothesis",
    supported: false,
    confidence: "low",
    confidenceRationale: {
      quality: "Contradicted by class safety communications in corpus",
      relevance: "High-stakes comparative safety claim",
      consistency: "Inconsistent with available regulatory context",
      completeness: "Lacks supporting comparative long-term evidence",
    },
    evidenceLinkIds: [],
    unsupportedReason:
      "No supporting evidence link; conflicts with JAK class safety context in corpus.",
  },
];

export const claimEvidenceLinks: ClaimEvidenceLink[] = [
  {
    id: "cel-il13-1",
    claimId: "claim-il13-1",
    evidenceId: "ev-lebri-advocate",
    citationNote: "Phase 3 skin endpoint package",
    excerpt:
      "Lebrikizumab met key skin and itch endpoints in ADvocate-style Phase 3 reporting.",
  },
  {
    id: "cel-il13-2",
    claimId: "claim-il13-2",
    evidenceId: "ev-tralo-press",
    citationNote: "Press positioning only — insufficient for comparative advantage",
    excerpt:
      "Corporate materials highlight IL-13-selective inhibition as a distinct biologic option.",
  },
  {
    id: "cel-il13-3",
    claimId: "claim-il13-3",
    evidenceId: "ev-lebri-ema",
    citationNote: "Regulatory framing as checkpoint for claim hygiene",
    excerpt:
      "EMA materials support authorised use; dosing convenience claims still require label check.",
  },
  {
    id: "cel-jak-1a",
    claimId: "claim-jak-1",
    evidenceId: "ev-upa-measureup",
    citationNote: "Upadacitinib pivotal efficacy",
    excerpt:
      "Upadacitinib achieved higher EASI-75 and IGA response rates than placebo.",
  },
  {
    id: "cel-jak-1b",
    claimId: "claim-jak-1",
    evidenceId: "ev-abro-jade",
    citationNote: "Abrocitinib pivotal efficacy",
    excerpt:
      "Abrocitinib improved skin clearance endpoints versus placebo across JADE analyses.",
  },
  {
    id: "cel-jak-2",
    claimId: "claim-jak-2",
    evidenceId: "ev-jak-safety-label",
    citationNote: "Class safety communication",
    excerpt:
      "FDA JAK safety communications emphasise boxed warnings and monitoring considerations.",
  },
];
