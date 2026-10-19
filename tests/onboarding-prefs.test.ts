import { describe, expect, it } from "vitest";
import { onboardingPrefsWriteSchema } from "../src/lib/onboarding/schema";
import { profileFor } from "../src/lib/onboarding/role-profiles";
import { PERSONA_OPTIONS } from "../src/lib/onboarding/types";

describe("onboarding prefs validation", () => {
  it("accepts a complete persona prefs payload", () => {
    const parsed = onboardingPrefsWriteSchema.safeParse({
      displayName: "Alex",
      personaRole: "competitive_intelligence",
      objective: "Monitor competitive signals in AD",
      therapeuticArea: "Moderate-to-severe atopic dermatitis",
      experienceLevel: "guided",
      onboardingCompleted: true,
      tourCompleted: false,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.personaRole).toBe("competitive_intelligence");
      expect(parsed.data.displayName).toBe("Alex");
    }
  });

  it("rejects unknown persona roles (no silent privilege escalation)", () => {
    const parsed = onboardingPrefsWriteSchema.safeParse({
      personaRole: "admin",
    });
    expect(parsed.success).toBe(false);
  });

  it("normalises empty display name to null", () => {
    const parsed = onboardingPrefsWriteSchema.safeParse({
      displayName: "   ",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.displayName).toBeNull();
  });

  it("rejects oversized objective strings", () => {
    const parsed = onboardingPrefsWriteSchema.safeParse({
      objective: "x".repeat(300),
    });
    expect(parsed.success).toBe(false);
  });
});

describe("role profiles (UX only)", () => {
  it("covers all seven persona cards", () => {
    expect(PERSONA_OPTIONS).toHaveLength(7);
    for (const opt of PERSONA_OPTIONS) {
      const profile = profileFor(opt.id);
      expect(profile.primaryCta.href.startsWith("/")).toBe(true);
      expect(profile.priorities.length).toBeGreaterThan(0);
    }
  });

  it("falls back to explorer when persona missing", () => {
    expect(profileFor(null).welcomeTitle).toContain("Explorer");
  });

  it("product owner primary CTA stays on delivery (not a permission grant)", () => {
    expect(profileFor("product_owner").primaryCta.href).toBe("/delivery");
  });
});
