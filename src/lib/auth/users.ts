export type Role =
  | "analyst"
  | "reviewer"
  | "product_owner"
  | "admin";

export type DemoUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Demo-only plaintext password — never use this pattern in production. */
  password: string;
};

/**
 * Seeded demo accounts for the portfolio prototype.
 * Credentials are intentionally public for walkthroughs — not a production IdP.
 */
export const DEMO_USERS: DemoUser[] = [
  {
    id: "user-analyst",
    email: "analyst@signalforge.demo",
    name: "Demo Analyst",
    role: "analyst",
    password: "analyst-demo",
  },
  {
    id: "user-reviewer",
    email: "reviewer@signalforge.demo",
    name: "Demo Reviewer",
    role: "reviewer",
    password: "reviewer-demo",
  },
  {
    id: "user-po",
    email: "po@signalforge.demo",
    name: "Demo Product Owner",
    role: "product_owner",
    password: "po-demo",
  },
  {
    id: "user-admin",
    email: "admin@signalforge.demo",
    name: "Demo Admin",
    role: "admin",
    password: "admin-demo",
  },
];

export function findDemoUserByEmail(email: string): DemoUser | undefined {
  return DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
}

export function findDemoUserById(id: string): DemoUser | undefined {
  return DEMO_USERS.find((u) => u.id === id);
}

export type PublicUser = Omit<DemoUser, "password">;

export function toPublicUser(user: DemoUser): PublicUser {
  const { password: _pw, ...rest } = user;
  return rest;
}
