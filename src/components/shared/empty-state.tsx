import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-panel flex flex-col items-start gap-2 px-4 py-8 text-left",
        className,
      )}
    >
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Loading workbench…" }: { label?: string }) {
  return (
    <div className="surface-panel animate-pulse px-4 py-8 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
}: {
  title?: string;
  description: string;
}) {
  return (
    <div className="surface-panel border-destructive/40 px-4 py-6">
      <h3 className="font-display text-lg text-destructive">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
