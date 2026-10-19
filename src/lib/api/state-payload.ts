import type { StoreState } from "@/lib/types";

const REQUIRED_ARRAYS: (keyof StoreState)[] = [
  "assets",
  "evidence",
  "sources",
  "signals",
  "briefs",
  "claims",
  "claimEvidenceLinks",
  "auditEvents",
];

/**
 * Validate a full-document workbench state payload for PUT /api/state.
 * Returns a non-sensitive error message suitable for clients.
 */
export function validateStatePayload(
  body: unknown,
): { ok: true; state: StoreState } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid workbench state payload." };
  }
  const state = body as StoreState;
  for (const key of REQUIRED_ARRAYS) {
    if (!Array.isArray(state[key])) {
      return {
        ok: false,
        error: `Invalid workbench state payload: '${String(key)}' must be an array.`,
      };
    }
  }
  return { ok: true, state };
}
