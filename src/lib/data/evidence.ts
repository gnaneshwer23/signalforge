import type { EvidenceRecord } from "@/lib/types";

export const evidence: EvidenceRecord[] = [
  {
    id: "ev-dupi-liberty",
    sourceId: "src-dupi-liberty",
    assetIds: ["asset-dupilumab"],
    title: "LIBERTY AD SOLO Phase 3 efficacy vs placebo",
    summary:
      "Phase 3 trials reported higher rates of clear/almost clear skin and EASI-75 with dupilumab versus placebo in moderate-to-severe AD.",
    studyCharacteristics:
      "Randomised, double-blind, placebo-controlled Phase 3; adult moderate-to-severe AD; primary endpoints around week 16.",
    limitations:
      "Historical pivotal design; does not establish comparative effectiveness versus later IL-13 or JAK options.",
    supports:
      "Supports that IL-4Rα blockade improved short-term disease severity measures versus placebo in the studied populations.",
    doesNotEstablish:
      "Does not establish superiority to tralokinumab, lebrikizumab, or oral JAKs; does not define long-term comparative safety.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["phase-3", "biologic", "il4-il13"],
    excerpt:
      "Dupilumab met co-primary endpoints for Investigator’s Global Assessment and EASI-75 versus placebo at week 16 in pivotal AD trials.",
    keywords: [
      "dupilumab",
      "liberty",
      "easi-75",
      "il-4",
      "biologic",
      "phase 3",
    ],
  },
  {
    id: "ev-dupi-label",
    sourceId: "src-dupi-label",
    assetIds: ["asset-dupilumab"],
    title: "Dupilumab US label — AD indication framing",
    summary:
      "Regulatory labelling describes approved AD populations, dosing, and selected warnings relevant to competitive positioning.",
    studyCharacteristics:
      "Prescribing information synthesising pivotal and supportive evidence; not a head-to-head trial.",
    limitations:
      "Label language is jurisdiction-specific and updated over time; retrieval date may lag latest revision.",
    supports:
      "Supports verified approved status and labelled use parameters for competitive landscape tables.",
    doesNotEstablish:
      "Does not establish real-world share, payer preference, or comparative effectiveness.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["regulatory", "label"],
    excerpt:
      "Dupilumab is labelled for moderate-to-severe atopic dermatitis with systemic-therapy-appropriate disease activity.",
    keywords: ["dupilumab", "label", "fda", "approved", "dosing"],
  },
  {
    id: "ev-tralo-ecztend",
    sourceId: "src-tralo-ecztend",
    assetIds: ["asset-tralokinumab"],
    title: "Tralokinumab long-term extension signals",
    summary:
      "Open-label extension materials describe sustained response patterns for IL-13-selective blockade in AD.",
    studyCharacteristics:
      "Open-label extension; selected responders/continuers; observational durability framing.",
    limitations:
      "Extension bias; limited comparative inference; publication vs retrieval dates differ.",
    supports:
      "Supports that some patients maintain clinical response with continued IL-13 blockade.",
    doesNotEstablish:
      "Does not establish superiority to dupilumab or oral JAKs.",
    reviewState: "needs_review",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["il-13", "long-term"],
    excerpt:
      "Long-term tralokinumab exposure was associated with maintained EASI responses in extension cohorts (illustrative demo summary).",
    keywords: ["tralokinumab", "ecztend", "il-13", "durability"],
  },
  {
    id: "ev-tralo-press",
    sourceId: "src-tralo-press",
    assetIds: ["asset-tralokinumab"],
    title: "Company press framing for tralokinumab AD",
    summary:
      "Corporate communications emphasise IL-13 selectivity and dosing convenience narratives.",
    studyCharacteristics:
      "Press release; promotional/strategic framing rather than peer-reviewed primary analysis.",
    limitations:
      "Not peer-reviewed; selective disclosure; should not be treated as efficacy proof alone.",
    supports:
      "Supports competitive messaging themes used in public positioning.",
    doesNotEstablish:
      "Does not establish clinical superiority or safety differentiation versus peers.",
    reviewState: "unreviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["press", "positioning"],
    excerpt:
      "LEO Pharma materials highlight IL-13-selective inhibition as a distinct biologic option in AD.",
    keywords: ["tralokinumab", "press", "positioning", "il-13"],
  },
  {
    id: "ev-lebri-advocate",
    sourceId: "src-lebri-advocate",
    assetIds: ["asset-lebrikizumab"],
    title: "Lebrikizumab ADvocate efficacy package",
    summary:
      "Phase 3 programme reports skin clearance and itch improvements with lebrikizumab, including maintenance dosing narratives.",
    studyCharacteristics:
      "Randomised Phase 3 with induction and maintenance periods; adult moderate-to-severe AD.",
    limitations:
      "Cross-trial comparison to other IL-13 agents is methodologically fragile.",
    supports:
      "Supports that lebrikizumab improves AD severity measures versus placebo in pivotal settings.",
    doesNotEstablish:
      "Does not establish head-to-head superiority to tralokinumab or dupilumab.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["phase-3", "il-13"],
    excerpt:
      "Lebrikizumab met key skin and itch endpoints in ADvocate-style Phase 3 reporting (illustrative demo summary).",
    keywords: [
      "lebrikizumab",
      "advocate",
      "il-13",
      "maintenance",
      "phase 3",
    ],
  },
  {
    id: "ev-lebri-ema",
    sourceId: "src-lebri-ema",
    assetIds: ["asset-lebrikizumab"],
    title: "EMA framing for lebrikizumab AD authorisation",
    summary:
      "European regulatory materials describe indication and benefit–risk conclusions for lebrikizumab in AD.",
    studyCharacteristics:
      "Regulatory assessment summary; multi-study synthesis.",
    limitations:
      "Region-specific; wording evolves with variations and PSUR cycles.",
    supports:
      "Supports verified European authorisation status for landscape tables.",
    doesNotEstablish:
      "Does not quantify commercial uptake or comparative HTA outcomes.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["regulatory", "ema"],
    excerpt:
      "EMA materials support authorised use of lebrikizumab in moderate-to-severe atopic dermatitis.",
    keywords: ["lebrikizumab", "ema", "authorisation", "regulatory"],
  },
  {
    id: "ev-nemo-arise",
    sourceId: "src-nemo-arise",
    assetIds: ["asset-nemolizumab"],
    title: "Nemolizumab registry / Phase 3 itch-pathway programme",
    summary:
      "Registry-linked Phase 3 materials emphasise pruritus reduction via IL-31 pathway targeting.",
    studyCharacteristics:
      "Phase 3 randomised programme with itch-focused endpoints alongside skin measures.",
    limitations:
      "Differentiation vs Th2 biologics depends on endpoint hierarchy and population; cross-trial caution required.",
    supports:
      "Supports that IL-31RA blockade can reduce itch burden in moderate-to-severe AD populations studied.",
    doesNotEstablish:
      "Does not establish that itch pathway targeting replaces IL-4/IL-13 blockade for all patients.",
    reviewState: "in_review",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["il-31", "itch", "registry"],
    excerpt:
      "Nemolizumab programmes report clinically meaningful itch improvements versus control in AD Phase 3 settings.",
    keywords: ["nemolizumab", "il-31", "itch", "phase 3", "pruritus"],
  },
  {
    id: "ev-nemo-press",
    sourceId: "src-nemo-press",
    assetIds: ["asset-nemolizumab"],
    title: "Galderma press updates on nemolizumab AD milestones",
    summary:
      "Press communications announce regulatory milestones and itch-differentiation messaging.",
    studyCharacteristics: "Corporate press; milestone disclosure.",
    limitations:
      "Press alone is insufficient for clinical claim substantiation.",
    supports:
      "Supports timing of public regulatory milestone communication.",
    doesNotEstablish:
      "Does not establish comparative effectiveness versus dupilumab or JAKs.",
    reviewState: "unreviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["press", "milestones"],
    excerpt:
      "Galderma communications describe nemolizumab advancing through AD regulatory milestones with itch-focused positioning.",
    keywords: ["nemolizumab", "galderma", "press", "regulatory"],
  },
  {
    id: "ev-upa-measureup",
    sourceId: "src-upa-measureup",
    assetIds: ["asset-upadacitinib"],
    title: "Upadacitinib Measure Up AD efficacy",
    summary:
      "Oral JAK1 inhibition showed rapid and substantial skin responses versus placebo in pivotal AD trials.",
    studyCharacteristics:
      "Randomised Phase 3 oral systemic therapy; dose arms; week-16 primary analyses.",
    limitations:
      "Class safety labelling and monitoring requirements are central to interpretation.",
    supports:
      "Supports oral systemic efficacy in moderate-to-severe AD versus placebo.",
    doesNotEstablish:
      "Does not establish long-term safety equivalence to biologics; does not prove superiority in all subgroups.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["jak", "oral", "phase-3"],
    excerpt:
      "Upadacitinib achieved higher EASI-75 and IGA response rates than placebo in Measure Up AD trials.",
    keywords: ["upadacitinib", "jak", "measure up", "oral", "easi"],
  },
  {
    id: "ev-abro-jade",
    sourceId: "src-abro-jade",
    assetIds: ["asset-abrocitinib"],
    title: "Abrocitinib JADE programme efficacy",
    summary:
      "Abrocitinib Phase 3 programme demonstrated dose-dependent efficacy in moderate-to-severe AD.",
    studyCharacteristics:
      "Randomised Phase 3 oral JAK1 inhibitor programme with multiple JADE studies.",
    limitations:
      "Cross-trial biologic comparisons remain interpretive; safety class context required.",
    supports:
      "Supports approved oral option with measurable short-term efficacy versus placebo.",
    doesNotEstablish:
      "Does not establish preferred sequencing versus biologics for all patients.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["jak", "oral", "phase-3"],
    excerpt:
      "Abrocitinib improved skin clearance endpoints versus placebo across JADE programme analyses.",
    keywords: ["abrocitinib", "jade", "jak", "oral", "phase 3"],
  },
  {
    id: "ev-jak-safety-label",
    sourceId: "src-jak-safety",
    assetIds: ["asset-upadacitinib", "asset-abrocitinib"],
    title: "JAK class safety communications relevant to AD orals",
    summary:
      "Regulatory communications describe serious adverse event class considerations for JAK inhibitors in inflammatory disease.",
    studyCharacteristics:
      "Regulatory safety communication synthesising broader JAK evidence; not AD-only.",
    limitations:
      "Class-level; indication- and population-specific absolute risks differ; requires careful claim scoping.",
    supports:
      "Supports that oral JAK competitive narratives must include labelled safety and monitoring context.",
    doesNotEstablish:
      "Does not establish that biologics are universally safer for every patient, nor quantify AD-specific absolute risk differentials here.",
    reviewState: "needs_review",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["safety", "jak", "regulatory"],
    excerpt:
      "FDA JAK safety communications emphasise boxed warnings and risk considerations that shape oral systemic positioning in AD.",
    keywords: [
      "jak",
      "safety",
      "boxed warning",
      "upadacitinib",
      "abrocitinib",
    ],
  },
  {
    id: "ev-ema-ad-class",
    sourceId: "src-ema-ad-class",
    assetIds: [
      "asset-dupilumab",
      "asset-tralokinumab",
      "asset-lebrikizumab",
      "asset-nemolizumab",
      "asset-upadacitinib",
      "asset-abrocitinib",
    ],
    title: "EMA systemic AD therapy class overview (illustrative)",
    summary:
      "High-level European materials situate systemic biologics and JAKs within AD treatment pathways.",
    studyCharacteristics:
      "Regulatory/educational overview; not a single trial.",
    limitations:
      "Not a comparative effectiveness analysis; illustrative for landscape orientation.",
    supports:
      "Supports multi-asset landscape framing across approved systemic modalities.",
    doesNotEstablish:
      "Does not establish treatment algorithm preferences for individual patients.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["landscape", "regulatory"],
    excerpt:
      "European materials describe multiple systemic options spanning IL-pathway biologics and oral JAK inhibitors for AD.",
    keywords: [
      "ema",
      "systemic",
      "atopic dermatitis",
      "biologic",
      "jak",
    ],
  },
  {
    id: "ev-amlitelimab-stream",
    sourceId: "src-amlitelimab-stream",
    assetIds: ["asset-amlitelimab"],
    title: "Amlitelimab STREAM-AD / Phase 3 registry footprint",
    summary:
      "ClinicalTrials.gov record for amlitelimab in moderate-to-severe AD; OX40L non-depleting pathway.",
    studyCharacteristics:
      "Interventional Phase 2/3 registry entry; endpoints and arms as listed on ClinicalTrials.gov.",
    limitations:
      "Registry listing is not a peer-reviewed efficacy conclusion; status and endpoints change over time.",
    supports:
      "Supports that an OX40L programme (amlitelimab) is under active late-stage AD investigation with a public NCT.",
    doesNotEstablish:
      "Does not establish superiority to IL-4Rα / IL-13 biologics or oral JAKs.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["ox40l", "phase-3", "pipeline"],
    excerpt:
      "Amlitelimab (anti-OX40L) is registered for moderate-to-severe atopic dermatitis studies including STREAM-AD (NCT05717907).",
    keywords: [
      "amlitelimab",
      "ox40l",
      "stream-ad",
      "nct05717907",
      "pipeline",
      "phase 3",
    ],
  },
  {
    id: "ev-rocatinlimab-rocket",
    sourceId: "src-rocatinlimab-rocket",
    assetIds: ["asset-rocatinlimab"],
    title: "Rocatinlimab ROCKET Phase 3 registry footprint",
    summary:
      "ClinicalTrials.gov record for rocatinlimab (anti-OX40) Phase 3 AD programme (ROCKET).",
    studyCharacteristics:
      "Interventional Phase 3 registry entry; multi-study ROCKET programme identifiers.",
    limitations:
      "Registry metadata alone cannot support comparative efficacy claims.",
    supports:
      "Supports that rocatinlimab is a late-stage OX40-pathway AD asset with a public NCT deep link.",
    doesNotEstablish:
      "Does not establish itch-specific superiority versus nemolizumab or other biologics.",
    reviewState: "reviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["ox40", "phase-3", "pipeline"],
    excerpt:
      "Rocatinlimab (OX40 receptor mAb) Phase 3 ROCKET programme includes NCT05398445 for moderate-to-severe atopic dermatitis.",
    keywords: [
      "rocatinlimab",
      "ox40",
      "rocket",
      "nct05398445",
      "itch",
      "mechanism",
      "pipeline",
      "phase 3",
    ],
  },
  {
    id: "ev-sigfor-fictional",
    sourceId: "src-sigfor-fictional",
    assetIds: ["asset-sigfor-101"],
    title: "[FICTIONAL] SIGFOR-101 Phase 2 concept note",
    summary:
      "Fictional pipeline disclosure claiming OX40-pathway activity in AD without a public source URL.",
    studyCharacteristics:
      "Demo-only narrative; no registry ID; intentionally unverified.",
    limitations:
      "Entirely fictional; must never be treated as real clinical evidence.",
    supports:
      "Supports demo workflows for unverified pipeline handling and abstention.",
    doesNotEstablish:
      "Does not establish any real-world clinical, regulatory, or commercial fact.",
    reviewState: "unreviewed",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["fictional", "pipeline", "unverified"],
    excerpt:
      "Northwind Therapeutics (fictional) claims SIGFOR-101 showed exploratory EASI signals in a simulated Phase 2 concept note.",
    keywords: ["sigfor-101", "ox40", "pipeline", "fictional", "unverified"],
  },
  {
    id: "ev-safety-fictional",
    sourceId: "src-safety-fictional",
    assetIds: ["asset-upadacitinib"],
    title: "[FICTIONAL SAFETY CASE] Synthetic hepatic AE narrative",
    summary:
      "Explicitly fictional adverse-event narrative used only to exercise synthetic triage fields and human-review routing.",
    studyCharacteristics:
      "Synthetic case; not from FAERS, EudraVigilance, or any sponsor safety database.",
    limitations:
      "No external PV system contact; incomplete fields by design for demo.",
    supports:
      "Supports demonstration of missing-field extraction and review-queue routing.",
    doesNotEstablish:
      "Does not establish a real safety signal for any product.",
    reviewState: "needs_review",
    therapeuticArea: "Moderate-to-severe atopic dermatitis",
    tags: ["fictional", "safety", "ae"],
    excerpt:
      "Fictional case: adult on an oral JAK developed unexplained transaminase elevation; dechallenge incomplete; concomitant meds unclear.",
    keywords: [
      "safety",
      "ae",
      "hepatic",
      "fictional",
      "jak",
      "triage",
    ],
  },
];
