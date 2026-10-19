import { NextResponse } from "next/server";
import { loadState, saveState } from "@/lib/db/repository";
import type { StoreState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await loadState();
    return NextResponse.json(state);
  } catch (error) {
    console.error("GET /api/state failed", error);
    return NextResponse.json({ error: "Failed to load workbench state from SQLite." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as StoreState;
    if (!body || !Array.isArray(body.assets) || !Array.isArray(body.evidence)) {
      return NextResponse.json({ error: "Invalid workbench state payload." }, { status: 400 });
    }
    await saveState(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/state failed", error);
    return NextResponse.json({ error: "Failed to persist workbench state." }, { status: 500 });
  }
}
