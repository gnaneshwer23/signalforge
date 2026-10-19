import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  BriefState,
  ProvenanceKind,
  ProvenanceStatus,
  ReviewState,
  VerificationStatus,
} from "@/lib/types";
import {
  PROVENANCE_STATUS_DEFINITIONS,
} from "@/lib/provenance/status";
import {
  BadgeCheck,
  CircleAlert,
  CircleHelp,
  Link2,
  Scale,
  Sparkles,
} from "lucide-react";

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  if (status === "verified") {
    return (
      <Badge variant="verified" className={cn("gap-1", className)}>
        <BadgeCheck className="size-3.5" />
        Verified source
      </Badge>
    );
  }
  return (
    <Badge variant="muted" className={cn("gap-1", className)}>
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
      variant={needs ? "caution" : approved ? "verified" : reviewed ? "secondary" : "muted"}
      className={cn("capitalize", className)}
    >
      {needs && <CircleAlert className="size-3.5" />}
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
    <div className="surface-panel px-4 py-3.5">
      <p className="meta-label">
        {label}
        <span className="ml-1 normal-case tracking-normal text-amber-review">
          · illustrative demo data
        </span>
      </p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
        {value}
      </p>
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
      <Badge variant="verified" className={cn("gap-1", className)}>
        <BadgeCheck className="size-3.5" />
        Verified source
      </Badge>
    );
  }
  if (kind === "discovery_url") {
    return (
      <Badge variant="muted" className={cn("gap-1", className)}>
        <Link2 className="size-3.5" />
        Discovery URL ≠ claim support
      </Badge>
    );
  }
  return (
    <Badge variant="caution" className={cn("gap-1", className)}>
      <Sparkles className="size-3.5" />
      Fictional demo record
    </Badge>
  );
}

export function ProvenanceStatusBadge({
  status,
  className,
}: {
  status: ProvenanceStatus;
  className?: string;
}) {
  const meta = PROVENANCE_STATUS_DEFINITIONS[status];
  const variant =
    status === "supported"
      ? "verified"
      : status === "conflicting" || status === "insufficient"
        ? "caution"
        : status === "unverified"
          ? "muted"
          : "secondary";

  return (
    <Badge
      variant={variant}
      title={meta.definition}
      className={cn("gap-1", className)}
    >
      {status === "supported" && <BadgeCheck className="size-3.5" />}
      {status === "conflicting" && <Scale className="size-3.5" />}
      {(status === "unverified" || status === "insufficient") && (
        <CircleHelp className="size-3.5" />
      )}
      {(status === "source_located" || status === "evidence_reviewed") && (
        <Link2 className="size-3.5" />
      )}
      {meta.label}
    </Badge>
  );
}
