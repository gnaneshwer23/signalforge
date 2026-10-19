"use client";

import { useStore } from "@/lib/store";

export function DemoDataIndicator() {
  const { state } = useStore();
  const mode =
    state.persistenceMode === "server"
      ? "SQLite persistence · demo corpus"
      : "Local demonstration · demo corpus";

  return (
    <p
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-mint/60 px-2 py-0.5 text-[11px] text-ink"
      role="status"
      aria-label="Demo data indicator"
    >
      <span
        className="size-1.5 rounded-sm bg-primary"
        aria-hidden="true"
      />
      Illustrative demo data · {mode}
    </p>
  );
}
