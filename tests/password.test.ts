import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";
import { authenticateDemoUser } from "../src/lib/auth/users";

describe("demo password hashing (A10)", () => {
  it("round-trips scrypt hashes", () => {
    const stored = hashPassword("analyst-demo", "a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1");
    expect(verifyPassword("analyst-demo", stored)).toBe(true);
    expect(verifyPassword("wrong", stored)).toBe(false);
  });

  it("authenticates published analyst credentials", () => {
    expect(authenticateDemoUser("analyst@signalforge.demo", "analyst-demo")).toBeTruthy();
    expect(authenticateDemoUser("analyst@signalforge.demo", "nope")).toBeNull();
  });

  it("disables admin login when ADMIN_DEMO_PASSWORD is unset (A2)", () => {
    const prev = process.env.ADMIN_DEMO_PASSWORD;
    delete process.env.ADMIN_DEMO_PASSWORD;
    expect(
      authenticateDemoUser("admin@signalforge.demo", "admin-demo"),
    ).toBeNull();
    process.env.ADMIN_DEMO_PASSWORD = "env-only-secret";
    expect(
      authenticateDemoUser("admin@signalforge.demo", "env-only-secret"),
    ).toBeTruthy();
    expect(
      authenticateDemoUser("admin@signalforge.demo", "admin-demo"),
    ).toBeNull();
    if (prev === undefined) delete process.env.ADMIN_DEMO_PASSWORD;
    else process.env.ADMIN_DEMO_PASSWORD = prev;
  });
});
