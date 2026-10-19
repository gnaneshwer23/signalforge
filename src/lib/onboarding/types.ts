/**
 * Persona roles from onboarding — preference / UX only.
 * They do NOT grant server permissions (auth Role remains separate).
 */
export type PersonaRole =
  | "competitive_intelligence"
  | "medical_affairs"
  | "clinical_development"
  | "research"
  | "product_owner"
  | "safety"
  | "explorer";

export type ExperienceLevel = "guided" | "explore" | "task";

export type OnboardingPreferences = {
  displayName: string | null;
  personaRole: PersonaRole | null;
  objective: string | null;
  therapeuticArea: string | null;
  experienceLevel: ExperienceLevel | null;
  onboardingCompleted: boolean;
  tourCompleted: boolean;
  updatedAt: string | null;
  /** Where preferences were last written */
  persistence: "server" | "local" | "none";
};

export const SEEDED_THERAPEUTIC_AREA =
  "Moderate-to-severe atopic dermatitis" as const;

export const PERSONA_OPTIONS: {
  id: PersonaRole;
  title: string;
  summary: string;
}[] = [
  {
    id: "competitive_intelligence",
    title: "Competitive intelligence",
    summary: "Track rivals, MoA shifts, and briefing cycles.",
  },
  {
    id: "medical_affairs",
    title: "Medical affairs",
    summary: "Evidence narratives and discussion-ready briefs.",
  },
  {
    id: "clinical_development",
    title: "Clinical development",
    summary: "Trial landscape, endpoints, and evidence gaps.",
  },
  {
    id: "research",
    title: "Research / R&D",
    summary: "Deep evidence exploration and Ask Signal.",
  },
  {
    id: "product_owner",
    title: "Product owner",
    summary: "Delivery backlog, evaluation, and change control.",
  },
  {
    id: "safety",
    title: "Safety / PV awareness",
    summary: "Synthetic AE triage and governance checklist.",
  },
  {
    id: "explorer",
    title: "Explorer",
    summary: "Guided tour across the full workbench.",
  },
];

export const OBJECTIVE_OPTIONS = [
  "Monitor competitive signals in AD",
  "Assemble an evidence-backed brief",
  "Explore provenance and review states",
  "Try Ask Signal (deterministic demo)",
  "Review safety / governance demo paths",
  "Validate product / evaluation fixtures",
] as const;

export const EXPERIENCE_OPTIONS: {
  id: ExperienceLevel;
  title: string;
  summary: string;
}[] = [
  {
    id: "guided",
    title: "Guided first use",
    summary: "Short tour: signal → evidence → brief → Ask Signal.",
  },
  {
    id: "explore",
    title: "Explore freely",
    summary: "Open the workspace with role priorities highlighted.",
  },
  {
    id: "task",
    title: "Jump to a task",
    summary: "Land on the primary CTA for your selected role.",
  },
];

export const DEFAULT_PREFERENCES: OnboardingPreferences = {
  displayName: null,
  personaRole: null,
  objective: null,
  therapeuticArea: null,
  experienceLevel: null,
  onboardingCompleted: false,
  tourCompleted: false,
  updatedAt: null,
  persistence: "none",
};

export const PREFS_COOKIE = "sf_prefs_key";
export const PREFS_LOCAL_KEY = "signalforge.onboarding.v1";
