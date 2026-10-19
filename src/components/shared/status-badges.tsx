import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  BriefState,
  ProvenanceKind,
  ReviewState,
  VerificationStatus,
} from "@/lib/types";
import { BadgeCheck, CircleAlert, CircleHelp, Link2, Sparkles } from "lucide-react";

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  if (status === "verified") {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "gap-1 rounded-md border border-[color-mix(in_oklab,var(--verified)_40%,var(--border))] bg-verified text-verified",
          className,
        )}
      >
        <BadgeCheck className="size-3.5" />
        Verified source
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1 rounded-md border border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      <CircleHelp className="size-3.5" />
      Unverified
    </Badge>
  );
}

export function ReviewBadge({
  state,
  className,
}: {
  state: ReviewState | BriefState | string;
  className?: string;
}) {
  const needs =
    state === "needs_review" ||
    state === "needs-review" ||
    state === "in_review";
  const approved = state === "approved-for-internal-discussion";
  const reviewed = state === "reviewed";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md capitalize",
        needs && "border-amber-review bg-amber-review text-amber-review",
        approved && "border-[color-mix(in_oklab,var(--verified)_40%,var(--border))] bg-verified text-verified",
        reviewed && "border-border bg-secondary text-foreground",
        !needs && !approved && !reviewed && "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {needs && <CircleAlert className="mr-1 size-3.5" />}
      {String(state).replaceAll("_", " ").replaceAll("-", " ")}
    </Badge>
  );
}

export function DemoMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="surface-panel px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
        <span className="ml-1 normal-case tracking-normal text-amber-review">
          · illustrative demo data
        </span>
      </p>
      <p className="font-display text-2xl text-ink">{value}</p>
    </div>
  );
}

export function ProvenanceBadge({
  kind,
  className,
}: {
  kind: ProvenanceKind;
  className?: string;
}) {
  if (kind === "verified_source") {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "gap-1 rounded-md border border-[color-mix(in_oklab,var(--verified)_40%,var(--border))] bg-verified text-verified",
          className,
        )}
      >
        <BadgeCheck className="size-3.5" />
        Verified source
      </Badge>
    );
  }
  if (kind === "discovery_url") {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "gap-1 rounded-md border border-border bg-muted text-muted-foreground",
          className,
        )}
      >
        <Link2 className="size-3.5" />
        Discovery URL ≠ claim support
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1 rounded-md border border-amber-review bg-amber-review text-amber-review",
        className,
      )}
    >
      <Sparkles className="size-3.5" />
      Fictional demo record
    </Badge>
  );
}
