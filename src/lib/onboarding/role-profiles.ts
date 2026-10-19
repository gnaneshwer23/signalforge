import type { PersonaRole } from "./types";

export type RoleProfile = {
  welcomeTitle: string;
  welcomeBody: string;
  priorities: string[];
  primaryCta: { href: string; label: string };
  secondaryCtas: { href: string; label: string }[];
};

/**
 * UX prioritisation only — same underlying corpus and APIs for every persona.
 * Does not change auth Role or server permissions.
 */
export const ROLE_PROFILES: Record<PersonaRole, RoleProfile> = {
  competitive_intelligence: {
    welcomeTitle: "Competitive intelligence workspace",
    welcomeBody:
      "Scan emerging signals, open the landscape, and assemble reviewable briefs from the seeded AD corpus.",
    priorities: [
      "Emerging signals needing review",
      "Competitive landscape by MoA / phase",
      "Draft and discussion-ready briefs",
    ],
    primaryCta: { href: "/landscape", label: "Open landscape" },
    secondaryCtas: [
      { href: "/briefs", label: "Signal briefs" },
      { href: "/ask", label: "Ask Signal" },
    ],
  },
  medical_affairs: {
    welcomeTitle: "Medical affairs workspace",
    welcomeBody:
      "Inspect provenance, link claims to evidence, and prepare briefs labelled for internal discussion only.",
    priorities: [
      "Evidence explorer with lifecycle statuses",
      "Claim ↔ evidence links",
      "Ask Signal with abstention honesty",
    ],
    primaryCta: { href: "/evidence", label: "Open evidence" },
    secondaryCtas: [
      { href: "/briefs", label: "Review briefs" },
      { href: "/ask", label: "Ask Signal" },
    ],
  },
  clinical_development: {
    welcomeTitle: "Clinical development workspace",
    welcomeBody:
      "Compare assets and trial-linked evidence in the AD demo corpus — hypotheses for human review, not clinical advice.",
    priorities: [
      "Asset landscape and study characteristics",
      "Evidence limitations and gaps",
      "Signals with follow-up questions",
    ],
    primaryCta: { href: "/landscape", label: "View landscape" },
    secondaryCtas: [
      { href: "/evidence", label: "Evidence explorer" },
      { href: "/briefs", label: "Briefs" },
    ],
  },
  research: {
    welcomeTitle: "Research workspace",
    welcomeBody:
      "Deep-dive evidence records and query the deterministic Ask Signal matcher over the seeded corpus.",
    priorities: [
      "Full provenance fields",
      "Deterministic Ask Signal retrieve-then-cite",
      "Gap and contradiction surfaces in briefs",
    ],
    primaryCta: { href: "/ask", label: "Ask Signal" },
    secondaryCtas: [
      { href: "/evidence", label: "Evidence" },
      { href: "/briefs", label: "Briefs" },
    ],
  },
  product_owner: {
    welcomeTitle: "Product owner workspace",
    welcomeBody:
      "Validate backlog acceptance criteria, evaluation fixtures, and change-control decisions in the delivery area.",
    priorities: [
      "Delivery backlog and milestones",
      "Evaluation centre (fixture runs vs illustrative targets)",
      "Change requests and decision log",
    ],
    primaryCta: { href: "/delivery", label: "Product Owner area" },
    secondaryCtas: [
      { href: "/evaluation", label: "Evaluation" },
      { href: "/governance", label: "Governance" },
    ],
  },
  safety: {
    welcomeTitle: "Safety awareness workspace",
    welcomeBody:
      "Walk the synthetic AE triage path and governance checklist. Fiction-only cases — not a validated PV system.",
    priorities: [
      "Synthetic safety flags (fictional AE)",
      "Mock human-review queue",
      "Governance requirements-to-validate",
    ],
    primaryCta: { href: "/safety", label: "Safety triage" },
    secondaryCtas: [
      { href: "/governance", label: "Governance" },
      { href: "/evaluation", label: "Evaluation" },
    ],
  },
  explorer: {
    welcomeTitle: "Explorer workspace",
    welcomeBody:
      "Start with the guided tour, then visit any of the nine workbench areas. Same data everywhere.",
    priorities: [
      "Guided path: signal → evidence → brief → Ask Signal",
      "All nine areas available in the sidebar",
      "Honest About / limitations on the public site",
    ],
    primaryCta: { href: "/workspace", label: "Start on workspace" },
    secondaryCtas: [
      { href: "/landscape", label: "Landscape" },
      { href: "/ask", label: "Ask Signal" },
    ],
  },
};

export function profileFor(
  persona: PersonaRole | null | undefined,
): RoleProfile {
  if (persona && persona in ROLE_PROFILES) {
    return ROLE_PROFILES[persona];
  }
  return ROLE_PROFILES.explorer;
}
