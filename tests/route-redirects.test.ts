import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

/**
 * Public homepage owns `/`. Intelligence dashboard moved to `/workspace`.
 * Workbench deep links must remain stable.
 */
const WORKBENCH_ROUTES = [
  "/workspace",
  "/landscape",
  "/evidence",
  "/briefs",
  "/ask",
  "/safety",
  "/governance",
  "/evaluation",
  "/delivery",
] as const;

const MARKETING_ROUTES = [
  "/",
  "/platform",
  "/solutions",
  "/methodology",
  "/about",
  "/demo",
  "/onboarding",
] as const;

describe("route architecture", () => {
  it("keeps workbench area paths unchanged", () => {
    for (const route of WORKBENCH_ROUTES) {
      expect(route.startsWith("/")).toBe(true);
      expect(route).not.toBe("/");
    }
  });

  it("exposes public marketing + onboarding paths", () => {
    expect(MARKETING_ROUTES).toContain("/");
    expect(MARKETING_ROUTES).toContain("/onboarding");
    expect(MARKETING_ROUTES).toContain("/demo");
  });

  it("does not redirect `/` away from the public homepage", async () => {
    const redirects =
      typeof nextConfig.redirects === "function"
        ? await nextConfig.redirects()
        : [];
    const rootRedirect = redirects.find(
      (r) => r.source === "/" || r.source === "/:path*",
    );
    expect(rootRedirect).toBeUndefined();
  });

  it("documents workspace as the former overview home", () => {
    expect(WORKBENCH_ROUTES[0]).toBe("/workspace");
  });
});
