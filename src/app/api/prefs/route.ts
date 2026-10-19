import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getSessionUser } from "@/lib/auth/session";
import { onboardingPrefsWriteSchema } from "@/lib/onboarding/schema";
import {
  getPreferences,
  upsertPreferences,
} from "@/lib/onboarding/prefs-repository";
import { PREFS_COOKIE } from "@/lib/onboarding/types";
import { DEFAULT_PREFERENCES } from "@/lib/onboarding/types";

export const runtime = "nodejs";

async function resolveSessionKey(): Promise<{
  key: string;
  setCookie: boolean;
}> {
  const jar = await cookies();
  const existing = jar.get(PREFS_COOKIE)?.value;
  if (existing && /^[a-zA-Z0-9_-]{8,64}$/.test(existing)) {
    return { key: existing, setCookie: false };
  }
  const user = await getSessionUser();
  if (user) {
    return { key: `user:${user.id}`, setCookie: true };
  }
  return { key: `anon:${randomUUID().replace(/-/g, "").slice(0, 24)}`, setCookie: true };
}

function withPrefsCookie(res: NextResponse, key: string, setCookie: boolean) {
  if (setCookie) {
    res.cookies.set(PREFS_COOKIE, key, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

export async function GET() {
  try {
    const { key, setCookie } = await resolveSessionKey();
    const prefs = await getPreferences(key);
    const res = NextResponse.json({ ok: true, prefs, sessionKeyHint: "cookie" });
    return withPrefsCookie(res, key, setCookie);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Prefs unavailable";
    return NextResponse.json(
      {
        ok: false,
        error: message,
        prefs: { ...DEFAULT_PREFERENCES, persistence: "none" },
      },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = onboardingPrefsWriteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid preferences payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { key, setCookie } = await resolveSessionKey();
    const user = await getSessionUser();
    const prefs = await upsertPreferences(key, parsed.data, user?.id ?? null);
    const res = NextResponse.json({
      ok: true,
      prefs,
      note: "Persona role is a UX preference only and does not grant server permissions.",
    });
    return withPrefsCookie(res, key, setCookie);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save preferences";
    return NextResponse.json(
      {
        ok: false,
        error: message,
        prefs: { ...DEFAULT_PREFERENCES, persistence: "none" },
        note: "Server persist failed — client may fall back to localStorage (labelled).",
      },
      { status: 503 },
    );
  }
}
