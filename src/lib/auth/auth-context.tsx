"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PublicUser } from "@/lib/auth/users";

type AuthContextValue = {
  user: PublicUser | null;
  demoAccounts: PublicUser[];
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<{
  user: PublicUser | null;
  demoAccounts: PublicUser[];
}> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) {
    return { user: null, demoAccounts: [] };
  }
  const body = (await res.json()) as {
    user: PublicUser | null;
    demoAccounts: PublicUser[];
  };
  return {
    user: body.user,
    demoAccounts: body.demoAccounts ?? [],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [demoAccounts, setDemoAccounts] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const session = await fetchSession();
      setUser(session.user);
      setDemoAccounts(session.demoAccounts);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Defer session hydration so the effect body does not synchronously setState.
    const handle = window.setTimeout(() => {
      void (async () => {
        try {
          const session = await fetchSession();
          if (cancelled) return;
          setUser(session.user);
          setDemoAccounts(session.demoAccounts);
        } catch {
          if (!cancelled) setUser(null);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        return { ok: false, error: body?.error || "Login failed." };
      }
      const body = (await res.json()) as { user: PublicUser };
      setUser(body.user);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, demoAccounts, loading, login, logout, refresh }),
    [user, demoAccounts, loading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
