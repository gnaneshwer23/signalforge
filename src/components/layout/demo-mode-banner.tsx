"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const STATUS_COPY: Record<
  "demo_mode" | "auth_required" | "persistence_error",
  { title: string; fallback: string }
> = {
  demo_mode: {
    title: "Demo mode",
    fallback:
      "Changes stay in this browser session only — successful production database writes are not claimed.",
  },
  auth_required: {
    title: "Authentication required",
    fallback:
      "Sign in with a labelled demo account to persist. Your unsaved edits are kept.",
  },
  persistence_error: {
    title: "Persistence error",
    fallback:
      "Server save failed. Your unsaved edits are kept — use Retry after the database is available.",
  },
};

export function DemoModeBanner() {
  const { persistenceStatus, persistError, retryPersist } = useStore();
  if (
    persistenceStatus !== "demo_mode" &&
    persistenceStatus !== "auth_required" &&
    persistenceStatus !== "persistence_error"
  ) {
    return null;
  }
  const copy = STATUS_COPY[persistenceStatus];
  const showRetry =
    persistenceStatus === "persistence_error" ||
    persistenceStatus === "auth_required";

  return (
    <div
      className="no-print border-b border-amber-review/50 bg-amber-review px-4 py-2 text-sm text-amber-review"
      role="status"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong className="font-medium">{copy.title}.</strong>{" "}
          {persistError || copy.fallback}
        </p>
        {showRetry && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-ink/20 bg-card/80"
            onClick={() => {
              void retryPersist();
            }}
          >
            Retry save
          </Button>
        )}
      </div>
    </div>
  );
}
