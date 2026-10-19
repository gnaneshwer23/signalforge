import type { Source } from "@/lib/types";

/** Record-level identifiers required for verified / verified_source rows (FR-06). */
export const RECORD_LEVEL_ID =
  /^(PMID:\d+|NCT\d+|EPAR:[A-Za-z0-9_-]+|FDA-label:[A-Za-z0-9_-]+|FDA-safety:[A-Za-z0-9_-]+)$/i;

export type SourceLintIssue = {
  sourceId: string;
  reason: string;
};

export function lintSources(sources: Source[]): SourceLintIssue[] {
  const issues: SourceLintIssue[] = [];
  for (const src of sources) {
    if (src.provenanceKind === "fictional_demo") {
      if (src.verification === "verified") {
        issues.push({
          sourceId: src.id,
          reason: "Fictional demo source must not be marked verified.",
        });
      }
      continue;
    }

    const id = src.identifier?.trim() ?? "";
    if (!id || !RECORD_LEVEL_ID.test(id)) {
      issues.push({
        sourceId: src.id,
        reason:
          "Missing record-level identifier (PMID / NCT / EPAR / FDA-label / FDA-safety).",
      });
    }

    if (
      (src.verification === "verified" ||
        src.provenanceKind === "verified_source") &&
      (!id || !RECORD_LEVEL_ID.test(id))
    ) {
      issues.push({
        sourceId: src.id,
        reason: "Verified source requires a valid record-level identifier.",
      });
    }

    if (src.url) {
      const homepageOnly =
        /^https?:\/\/(www\.)?(pubmed\.ncbi\.nlm\.nih\.gov|clinicaltrials\.gov|ema\.europa\.eu|fda\.gov|leo-pharma\.com|galderma\.com)\/?$/i.test(
          src.url,
        );
      if (homepageOnly) {
        issues.push({
          sourceId: src.id,
          reason: "URL is a site homepage, not a record-level deep link.",
        });
      }
    }
  }
  return issues;
}
