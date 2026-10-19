import type { SafetyFlag } from "@/lib/types";

export const safetyFlags: SafetyFlag[] = [
  {
    id: "safety-fictional-001",
    label: "FICTIONAL — Synthetic hepatic AE triage case",
    fictional: true,
    narrative:
      "Fictional narrative for demo only: A 42-year-old adult with moderate-to-severe atopic dermatitis reportedly started an oral JAK inhibitor. After several weeks, unexplained fatigue and dark urine were described. Limited lab notes mention ALT ~3× ULN. Dechallenge timing is unclear. Concomitant medications and alcohol history are missing. This case is synthetic and must not be treated as a real safety report.",
    extractedFields: {
      product: "Oral JAK inhibitor (unspecified in narrative — demo)",
      indication: "Moderate-to-severe atopic dermatitis",
      event: "Hepatic enzyme elevation / possible drug-induced liver injury concern",
      onset: "Several weeks after initiation (imprecise)",
      seriousness: "Not fully established — lab abnormality reported",
      dechallenge: null,
      rechallenge: null,
      concomitantMeds: null,
      medicalHistory: null,
      reporterType: "Synthetic demo narrator",
    },
    missingFields: [
      "Exact product and dose",
      "Dechallenge / rechallenge outcome",
      "Concomitant medications",
      "Baseline liver history",
      "Reporter identifiability / case ID from real system",
    ],
    uncertaintyNotes: [
      "Onset window is qualitative only",
      "Cannot distinguish product-specific vs class-level concern from narrative",
      "No contact with FAERS, EudraVigilance, or sponsor safety databases",
    ],
    routedToQueue: false,
    queueStatus: "not_routed",
    createdAt: "2026-02-08T12:00:00.000Z",
  },
];
