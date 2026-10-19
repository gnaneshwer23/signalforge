import { NextResponse } from "next/server";
import { resetDatabase } from "@/lib/db/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const state = await resetDatabase();
    return NextResponse.json(state);
  } catch (error) {
    console.error("POST /api/state/reset failed", error);
    return NextResponse.json({ error: "Failed to reset demo database." }, { status: 500 });
  }
}
