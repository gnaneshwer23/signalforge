import { describe, expect, it } from "vitest";
import { sources } from "../src/lib/data/sources";
import { lintSources } from "../src/lib/data/lint";
import { assets } from "../src/lib/data/assets";

describe("corpus data lint (FR-06 / A4)", () => {
  it("flags no issues on the seeded sources", () => {
    const issues = lintSources(sources);
    expect(issues).toEqual([]);
  });

  it("requires record-level ids on every verified source", () => {
    for (const src of sources) {
      if (src.verification !== "verified") continue;
      expect(src.identifier).toBeTruthy();
      expect(src.identifier).toMatch(
        /^(PMID:\d+|NCT\d+|EPAR:[A-Za-z0-9_-]+|FDA-label:[A-Za-z0-9_-]+|FDA-safety:[A-Za-z0-9_-]+)$/i,
      );
    }
  });

  it("includes amlitelimab and rocatinlimab assets", () => {
    expect(assets.some((a) => /amlitelimab/i.test(a.name))).toBe(true);
    expect(assets.some((a) => /rocatinlimab/i.test(a.name))).toBe(true);
  });

  it("keeps fictional SIGFOR unverified without inventing a URL", () => {
    const src = sources.find((s) => s.id === "src-sigfor-fictional");
    expect(src?.verification).toBe("unverified");
    expect(src?.url).toBeUndefined();
    expect(src?.provenanceKind).toBe("fictional_demo");
  });
});
