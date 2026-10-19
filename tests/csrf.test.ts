import { describe, expect, it } from "vitest";
import { assertSameOrigin } from "../src/lib/security/csrf";

describe("same-origin check", () => {
  it("allows matching Origin", () => {
    const req = new Request("https://signalforge.example/api/state", {
      method: "PUT",
      headers: {
        host: "signalforge.example",
        origin: "https://signalforge.example",
      },
    });
    expect(assertSameOrigin(req).ok).toBe(true);
  });

  it("blocks mismatched Origin", () => {
    const req = new Request("https://signalforge.example/api/state", {
      method: "PUT",
      headers: {
        host: "signalforge.example",
        origin: "https://evil.example",
      },
    });
    const r = assertSameOrigin(req);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(403);
  });

  it("allows machine clients with no Origin/Referer", () => {
    const req = new Request("https://signalforge.example/api/state", {
      method: "PUT",
      headers: { host: "signalforge.example" },
    });
    expect(assertSameOrigin(req).ok).toBe(true);
  });
});
