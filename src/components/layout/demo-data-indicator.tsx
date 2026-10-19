"use client";

import { useStore } from "@/lib/store";
import type { PersistenceStatus } from "@/lib/types";

const STATUS_LABEL: Record<PersistenceStatus, string> = {
  loading: "Checking persistence…",
  connected: "Connected",
  demo_mode: "Demo mode",
  auth_required: "Authentication required",
  persistence_error: "Persistence error",
};

export function DemoDataIndicator() {
  const { persistenceStatus } = useStore();
  const label = STATUS_LABEL[persistenceStatus];

  return (
    <p
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-mint/60 px-2 py-0.5 text-[11px] text-ink"
      role="status"
      aria-label={`Persistence status: ${label}`}
    >
      <span
        className={
          persistenceStatus === "connected"
            ? "size-1.5 rounded-sm bg-primary"
            : persistenceStatus === "loading"
              ? "size-1.5 rounded-sm bg-muted-foreground"
              : "size-1.5 rounded-sm bg-amber-review"
        }
        aria-hidden="true"
      />
      Illustrative demo data · {label}
    </p>
  );
}
