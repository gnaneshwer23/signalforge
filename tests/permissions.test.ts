import { describe, expect, it } from "vitest";
import {
  assertPermission,
  roleHasPermission,
} from "../src/lib/auth/permissions";

describe("role permissions", () => {
  it("analyst cannot approve briefs or reset demo", () => {
    expect(roleHasPermission("analyst", "briefs:approve")).toBe(false);
    expect(roleHasPermission("analyst", "demo:reset")).toBe(false);
    expect(assertPermission("analyst", "briefs:approve").ok).toBe(false);
  });

  it("reviewer can approve and route safety", () => {
    expect(roleHasPermission("reviewer", "briefs:approve")).toBe(true);
    expect(roleHasPermission("reviewer", "safety:route")).toBe(true);
  });

  it("only admin can reset demo", () => {
    expect(roleHasPermission("admin", "demo:reset")).toBe(true);
    expect(roleHasPermission("product_owner", "demo:reset")).toBe(false);
  });

  it("unauthenticated requests are rejected", () => {
    const r = assertPermission(undefined, "prefs:write");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(401);
  });
});
