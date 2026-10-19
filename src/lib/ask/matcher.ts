import type { AskResponse, ConfidenceLevel, EvidenceRecord } from "@/lib/types";

const DISCLAIMER =
  "Deterministic demo matcher over a seeded corpus. Not a live LLM. Not real-time ingestion. Not patient-specific treatment advice.";

/** Patterns that attempt to override corpus grounding or escalate privileges. */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore (all |any )?(previous|prior|above) (instructions|rules|prompts)/i,
  /disregard (the )?(system|safety|governance)/i,
  /you are now (a |an )?(unrestricted|jailbroken|doctor|prescriber)/i,
  /reveal (your |the )?(system prompt|hidden instructions|secrets)/i,
  /act as if (you|the model) (had|have) live (llm|model|api)/i,
  /pretend (evidence|sources) (exist|support)/i,
  /override (abstention|safety|verification)/i,
];

export type AskMatcherInput = {
  query: string;
  evidence: EvidenceRecord[];
};

export function detectPromptInjection(query: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(query));
}

function scoreEvidence(query: string, text: string): number {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((t) => t.length > 2);
  let score = 0;
  for (const t of tokens) {
    if (text.includes(t)) score += 1;
  }
  return score;
}

/**
 * Deterministic corpus matcher — never claims live LLM behaviour.
 * Abstains on patient advice, fictional efficacy, injection attempts, and weak retrieval.
 */
export function runAskMatcher({
  query,
  evidence,
}: AskMatcherInput): AskResponse {
  const q = query.trim().toLowerCase();
  const injection = detectPromptInjection(query);

  const ranked = evidence
    .map((ev) => {
      const blob = [
        ev.title,
        ev.summary,
        ev.excerpt,
        ev.keywords.join(" "),
        ev.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return { ev, score: scoreEvidence(q, blob) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const patientAdvice =
    /treat me|my child|should i take|dose for me|prescribe/.test(q);
  const fictionalQuery =
    /sigfor|ox40|northwind|fictional pipeline/.test(q) &&
    /efficac|superior|approve|best/.test(q);
  const insufficient =
    injection ||
    ranked.length === 0 ||
    ranked[0].score < 2 ||
    patientAdvice ||
    fictionalQuery ||
    /guaranteed cure|best drug for everyone/.test(q);

  if (insufficient) {
    const limitations: string[] = [];
    if (injection) {
      limitations.push(
        "Prompt-injection style instruction override detected; matcher abstained without elevating privileges or inventing evidence.",
      );
    }
    if (patientAdvice) {
      limitations.push("Patient-specific treatment advice is out of scope.");
    } else if (!injection) {
      limitations.push(
        "Seeded corpus does not support a confident answer.",
      );
    }
    if (fictionalQuery) {
      limitations.push(
        "Query targets fictional/unverified pipeline content.",
      );
    }
    if (!injection) {
      limitations.push(
        "Try a question grounded in monitored AD assets or evidence types.",
      );
    }
    limitations.push("No live model and no external retrieval were used.");

    return {
      query,
      abstained: true,
      limitations,
      supportingEvidenceIds: [],
      excerpts: [],
      disclaimer: DISCLAIMER,
      injectionAttempt: injection,
    };
  }

  const top = ranked.slice(0, 3);
  const confidence: ConfidenceLevel =
    top[0].score >= 4 ? "high" : top[0].score >= 3 ? "moderate" : "low";

  return {
    query,
    abstained: false,
    answer: `Based on seeded AD corpus matches, the most relevant materials concern “${top[0].ev.title}”. ${top[0].ev.supports} Interpretations beyond the linked excerpts remain hypotheses for human review.`,
    confidence,
    limitations: [
      "Response is a deterministic keyword match, not generative reasoning.",
      "Cross-trial comparisons are not established by this matcher.",
      ...top.map((t) => `Limitation from ${t.ev.id}: ${t.ev.limitations}`),
    ],
    supportingEvidenceIds: top.map((t) => t.ev.id),
    excerpts: top.map((t) => ({
      evidenceId: t.ev.id,
      text: t.ev.excerpt,
    })),
    disclaimer: DISCLAIMER,
    injectionAttempt: false,
  };
}
