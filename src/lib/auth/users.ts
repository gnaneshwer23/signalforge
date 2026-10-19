import { verifyPassword } from "./password";

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
  /**
   * scrypt$salt$hash credential. Never log or expose.
   * Admin password may be overridden via ADMIN_DEMO_PASSWORD (plaintext env →
   * verified at login without publishing the value in README).
   */
  passwordHash: string;
  /** When true, login requires ADMIN_DEMO_PASSWORD from env (A2). */
  requiresEnvPassword?: boolean;
};

/**
 * Seeded demo accounts for the portfolio prototype.
 * Analyst / reviewer / PO passwords are intentionally public for walkthroughs.
 * Admin is not published — set ADMIN_DEMO_PASSWORD in the deploy env.
 */
export const DEMO_USERS: DemoUser[] = [
  {
    id: "user-analyst",
    email: "analyst@signalforge.demo",
    name: "Demo Analyst",
    role: "analyst",
    passwordHash:
      "scrypt$a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1$c2b5fdccb50a0b9c0ba83510490948d8c1fb952427a71292e4ceb9f5964c07c1262cc57474e3328d0ee7aa9ff35a285b509a84c6270b0545fe0d4a6488f110c4",
  },
  {
    id: "user-reviewer",
    email: "reviewer@signalforge.demo",
    name: "Demo Reviewer",
    role: "reviewer",
    passwordHash:
      "scrypt$b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2$82944c76308895c912a217722c2eb21df959a12ac9846debb90253193f41c19407867bddae9e69d49f9ae62263b00ce51a3e7c46bb9bc4e70ced1ea8f358d9ca",
  },
  {
    id: "user-po",
    email: "po@signalforge.demo",
    name: "Demo Product Owner",
    role: "product_owner",
    passwordHash:
      "scrypt$c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3$1dff9393976be6c47deff314e3f930337992890241e430de6ba3a2edf7442539e2c835feefcf3e34afc17b697e8ded390a75c90398d547f4edba3495362edc6f",
  },
  {
    id: "user-admin",
    email: "admin@signalforge.demo",
    name: "Demo Admin",
    role: "admin",
    // Fallback hash of a non-published placeholder; login only succeeds when
    // ADMIN_DEMO_PASSWORD is set in the environment (see authenticateDemoUser).
    passwordHash:
      "scrypt$d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4$3a1ff84b82d87c979a5c4609184504d5ead0d725cf489d1d291c5282af7f6dde2ddaacb02133a4002e8fe35a1e3f82b0999c6d840865a88fb6aa34d5f09a5bb3",
    requiresEnvPassword: true,
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

export type PublicUser = Omit<DemoUser, "passwordHash" | "requiresEnvPassword">;

export function toPublicUser(user: DemoUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

/**
 * Authenticate a demo user. Admin requires ADMIN_DEMO_PASSWORD from env (A2);
 * when unset, admin login is disabled so public reset credentials cannot vandalise the shared demo.
 */
export function authenticateDemoUser(
  email: string,
  password: string,
): DemoUser | null {
  const user = findDemoUserByEmail(email);
  if (!user) return null;

  if (user.requiresEnvPassword) {
    const envPassword = process.env.ADMIN_DEMO_PASSWORD?.trim();
    if (!envPassword) {
      return null;
    }
    if (password !== envPassword) {
      return null;
    }
    return user;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}
