import { NextResponse } from "next/server";
import { loadState } from "@/lib/db/repository";
import { runAskMatcher } from "@/lib/ask/matcher";
import {
  clientKeyFromRequest,
  rateLimit,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Retrieve-then-answer over the seeded corpus.
 * Deterministic matcher only — never claims a live LLM.
 * Rate-limited per client IP for demo abuse resistance.
 */
export async function POST(request: Request) {
  const key = `ask:${clientKeyFromRequest(request)}`;
  const limited = rateLimit(key, { limit: 30, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded for Ask Signal. Retry shortly.",
        retryAfterMs: limited.retryAfterMs,
        mode: "deterministic_demo",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)),
        },
      },
    );
  }

  let query = "";
  try {
    const body = (await request.json()) as { query?: string };
    query = typeof body.query === "string" ? body.query : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Query is required." },
      { status: 400 },
    );
  }
  if (query.length > 2000) {
    return NextResponse.json(
      { error: "Query too long (max 2000 characters)." },
      { status: 400 },
    );
  }

  try {
    const state = await loadState();
    const response = runAskMatcher({
      query,
      evidence: state.evidence,
    });
    return NextResponse.json({
      ...response,
      mode: "deterministic_demo",
      liveLlm: false,
      remaining: limited.remaining,
    });
  } catch (error) {
    console.error("POST /api/ask failed", error);
    return NextResponse.json(
      {
        error: "Ask Signal backend unavailable.",
        mode: "deterministic_demo",
        liveLlm: false,
      },
      { status: 500 },
    );
  }
}
