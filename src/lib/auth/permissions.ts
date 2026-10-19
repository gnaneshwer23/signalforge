import type { Role } from "./users";

export type Permission =
  | "briefs:read"
  | "briefs:assemble"
  | "briefs:mark_needs_review"
  | "briefs:approve"
  | "evidence:review"
  | "evidence:add_to_brief"
  | "ask:query"
  | "safety:route"
  | "evaluation:run"
  | "backlog:write"
  | "change_request:create"
  | "change_request:decide"
  | "demo:reset"
  | "audit:read"
  | "prefs:write";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  analyst: [
    "briefs:read",
    "briefs:assemble",
    "evidence:review",
    "evidence:add_to_brief",
    "ask:query",
    "audit:read",
    "prefs:write",
  ],
  reviewer: [
    "briefs:read",
    "briefs:assemble",
    "briefs:mark_needs_review",
    "briefs:approve",
    "evidence:review",
    "evidence:add_to_brief",
    "ask:query",
    "safety:route",
    "evaluation:run",
    "audit:read",
    "prefs:write",
  ],
  product_owner: [
    "briefs:read",
    "briefs:assemble",
    "evidence:review",
    "evidence:add_to_brief",
    "ask:query",
    "evaluation:run",
    "backlog:write",
    "change_request:create",
    "change_request:decide",
    "audit:read",
    "prefs:write",
  ],
  admin: [
    "briefs:read",
    "briefs:assemble",
    "briefs:mark_needs_review",
    "briefs:approve",
    "evidence:review",
    "evidence:add_to_brief",
    "ask:query",
    "safety:route",
    "evaluation:run",
    "backlog:write",
    "change_request:create",
    "change_request:decide",
    "demo:reset",
    "audit:read",
    "prefs:write",
  ],
};

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function assertPermission(
  role: Role | undefined,
  permission: Permission,
): { ok: true } | { ok: false; status: number; error: string } {
  if (!role) {
    return {
      ok: false,
      status: 401,
      error: "Authentication required. Sign in with a demo account.",
    };
  }
  if (!roleHasPermission(role, permission)) {
    return {
      ok: false,
      status: 403,
      error: `Role “${role}” lacks permission “${permission}”. Server-side authz rejected this mutation.`,
    };
  }
  return { ok: true };
}
