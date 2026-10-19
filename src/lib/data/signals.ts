import type { Signal } from "@/lib/types";

export const signals: Signal[] = [
  {
    id: "sig-il13-crowding",
    title: "IL-13 biologic crowding intensifies maintenance narratives",
    summary:
      "Tralokinumab and lebrikizumab public materials increasingly compete on selectivity and maintenance dosing against the IL-4Rα benchmark.",
    assetIds: [
      "asset-tralokinumab",
      "asset-lebrikizumab",
      "asset-dupilumab",
    ],
    evidenceIds: [
      "ev-tralo-ecztend",
      "ev-lebri-advocate",
      "ev-dupi-liberty",
      "ev-tralo-press",
    ],
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    urgency: "elevated",
    reviewNeeded: true,
    emerging: true,
    updatedAt: "2026-02-08",
    implications:
      "Competitive messaging may shift share-of-voice toward dosing convenience and pathway selectivity; head-to-head evidence remains limited.",
    uncertainty:
      "Cross-trial comparisons are interpretive hypotheses, not established superiority claims.",
    gaps: [
      "No direct tralokinumab vs lebrikizumab pivotal head-to-head in corpus",
      "Limited payer outcome evidence in seed set",
    ],
    followUpQuestions: [
      "Which maintenance dosing claims are label-supported versus promotional?",
      "Where do HTA bodies treat IL-13 agents as interchangeable with dupilumab?",
    ],
  },
  {
    id: "sig-jak-safety-context",
    title: "Oral JAK efficacy must be read with class safety context",
    summary:
      "Upadacitinib and abrocitinib retain strong efficacy narratives, but regulatory class communications constrain how aggressively oral options can be positioned.",
    assetIds: ["asset-upadacitinib", "asset-abrocitinib"],
    evidenceIds: [
      "ev-upa-measureup",
      "ev-abro-jade",
      "ev-jak-safety-label",
    ],
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    urgency: "high",
    reviewNeeded: true,
    emerging: false,
    updatedAt: "2026-02-06",
    implications:
      "Strategic questions should separate placebo-controlled efficacy facts from class-level safety interpretations.",
    uncertainty:
      "AD-specific absolute risk differentials versus biologics are not fully resolved in this demo corpus.",
    gaps: [
      "No long-term comparative safety meta-analysis in seed set",
      "Region-specific label nuances only partially represented",
    ],
    followUpQuestions: [
      "Which safety statements are class-level versus product-label-specific?",
      "How are oral JAKs sequenced after biologic inadequate response in major guidelines?",
    ],
  },
  {
    id: "sig-itch-pathway",
    title: "IL-31 itch pathway creates a distinct competitive axis",
    summary:
      "Nemolizumab’s pruritus-focused positioning challenges Th2-cytokine biologics on symptom hierarchy rather than pure EASI competition.",
    assetIds: ["asset-nemolizumab", "asset-dupilumab"],
    evidenceIds: ["ev-nemo-arise", "ev-nemo-press", "ev-dupi-label"],
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    urgency: "elevated",
    reviewNeeded: false,
    emerging: true,
    updatedAt: "2026-02-09",
    implications:
      "Portfolio planning should track itch-endpoint prominence in labelling and medical education.",
    uncertainty:
      "Whether itch-first positioning translates to durable share versus established IL-pathway agents remains interpretive.",
    gaps: [
      "Limited head-to-head vs dupilumab in seed corpus",
      "Real-world persistence data sparse in demo set",
    ],
    followUpQuestions: [
      "Which claims about itch are endpoint-supported versus narrative?",
      "How do guidelines weight pruritus versus skin clearance for systemic choice?",
    ],
  },
  {
    id: "sig-fictional-pipeline",
    title: "Unverified OX40-pathway pipeline claim enters monitoring",
    summary:
      "A clearly fictional SIGFOR-101 disclosure appears in the demo corpus without a source URL and must remain unverified.",
    assetIds: ["asset-sigfor-101"],
    evidenceIds: ["ev-sigfor-fictional"],
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    urgency: "routine",
    reviewNeeded: true,
    emerging: true,
    updatedAt: "2026-02-10",
    implications:
      "Useful for testing abstention, unverified labelling, and brief claim gating — not for real competitive decisions.",
    uncertainty:
      "Record is fictional by design; confidence for any clinical claim should be withheld.",
    gaps: [
      "No registry identifier",
      "No independent publication",
      "No regulatory filing",
    ],
    followUpQuestions: [
      "What minimum source package would move a pipeline asset from unverified to verified?",
      "Should Ask Signal abstain on efficacy questions for fictional pipeline assets?",
    ],
  },
];
