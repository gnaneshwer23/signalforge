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
        "surface-panel flex flex-col items-start gap-2 px-5 py-10 text-left",
        className,
      )}
      role="status"
    >
      <h3 className="section-title">{title}</h3>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

export function LoadingState({
  label = "Loading workbench…",
}: {
  label?: string;
}) {
  return (
    <div
      className="surface-panel px-5 py-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <span
          className="size-4 shrink-0 rounded-full border-2 border-border border-t-teal animate-spin"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
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
    <div
      className="surface-panel border-destructive/35 px-5 py-8"
      role="alert"
    >
      <h3 className="section-title text-destructive">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
