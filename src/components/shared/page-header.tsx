import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  tone?: "default" | "caution";
}) {
  return (
    <header className={cn("animate-rise space-y-2.5", className)}>
      <p
        className={cn(
          "meta-label",
          tone === "caution" ? "text-amber-review" : "text-muted-foreground",
        )}
      >
        {eyebrow}
      </p>
      <h1 className="page-title">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          {description}
        </p>
      ) : null}
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 pt-1">{actions}</div>
      ) : null}
    </header>
  );
}
