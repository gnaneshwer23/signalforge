"use client";

import { useStore } from "@/lib/store";

export function DemoModeBanner() {
  const { state, persistError } = useStore();
  if (state.persistenceMode !== "local_demonstration" && !persistError) {
    return null;
  }
  return (
    <div
      className="no-print border-b border-amber-review bg-amber-review px-4 py-2 text-sm text-amber-review"
      role="status"
    >
      <strong className="font-medium">Local demonstration mode.</strong>{" "}
      {persistError ||
        "Changes are held in this browser session only — successful production database writes are not claimed."}{" "}
      Sign in with a demo account (admin for reset) to persist to SQLite when the
      API is available.
    </div>
  );
}
