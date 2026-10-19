import { describe, expect, it } from "vitest";
import { validateStatePayload } from "../src/lib/api/state-payload";
import { createInitialState } from "../src/lib/data";

describe("state payload validation", () => {
  it("accepts a full initial state", () => {
    const r = validateStatePayload(createInitialState());
    expect(r.ok).toBe(true);
  });

  it("rejects null / non-object", () => {
    expect(validateStatePayload(null).ok).toBe(false);
    expect(validateStatePayload("x").ok).toBe(false);
  });

  it("rejects missing required arrays", () => {
    const r = validateStatePayload({ assets: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/evidence/i);
  });

  it("rejects assets that are not an array", () => {
    const base = createInitialState();
    const r = validateStatePayload({ ...base, assets: "nope" });
    expect(r.ok).toBe(false);
  });
});
