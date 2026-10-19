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
import {
  DEFAULT_PREFERENCES,
  PREFS_LOCAL_KEY,
  type OnboardingPreferences,
} from "./types";
import type { OnboardingPrefsWrite } from "./schema";

type PrefsContextValue = {
  prefs: OnboardingPreferences;
  loading: boolean;
  savePrefs: (
    patch: OnboardingPrefsWrite,
  ) => Promise<{ ok: boolean; persistence: "server" | "local"; error?: string }>;
  refresh: () => Promise<void>;
  clearLocalFallback: () => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

function readLocal(): OnboardingPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFS_LOCAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingPreferences;
    return { ...DEFAULT_PREFERENCES, ...parsed, persistence: "local" };
  } catch {
    return null;
  }
}

function writeLocal(prefs: OnboardingPreferences) {
  try {
    window.localStorage.setItem(
      PREFS_LOCAL_KEY,
      JSON.stringify({ ...prefs, persistence: "local" }),
    );
  } catch {
    /* ignore quota */
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<OnboardingPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/prefs", { cache: "no-store" });
      const body = (await res.json()) as {
        ok?: boolean;
        prefs?: OnboardingPreferences;
      };
      if (res.ok && body.prefs) {
        setPrefs({ ...body.prefs, persistence: "server" });
        return;
      }
      const local = readLocal();
      if (local) setPrefs(local);
      else setPrefs({ ...DEFAULT_PREFERENCES, persistence: "none" });
    } catch {
      const local = readLocal();
      setPrefs(local ?? { ...DEFAULT_PREFERENCES, persistence: "none" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(handle);
  }, [refresh]);

  const savePrefs = useCallback(async (patch: OnboardingPrefsWrite) => {
    const optimistic: OnboardingPreferences = {
      ...prefs,
      ...patch,
      displayName:
        patch.displayName !== undefined ? patch.displayName : prefs.displayName,
      personaRole:
        patch.personaRole !== undefined ? patch.personaRole : prefs.personaRole,
      objective:
        patch.objective !== undefined ? patch.objective : prefs.objective,
      therapeuticArea:
        patch.therapeuticArea !== undefined
          ? patch.therapeuticArea
          : prefs.therapeuticArea,
      experienceLevel:
        patch.experienceLevel !== undefined
          ? patch.experienceLevel
          : prefs.experienceLevel,
      onboardingCompleted:
        patch.onboardingCompleted !== undefined
          ? patch.onboardingCompleted
          : prefs.onboardingCompleted,
      tourCompleted:
        patch.tourCompleted !== undefined
          ? patch.tourCompleted
          : prefs.tourCompleted,
      updatedAt: new Date().toISOString(),
      persistence: "server",
    };

    try {
      const res = await fetch("/api/prefs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = (await res.json()) as {
        ok?: boolean;
        prefs?: OnboardingPreferences;
        error?: string;
      };
      if (res.ok && body.prefs) {
        setPrefs({ ...body.prefs, persistence: "server" });
        writeLocal({ ...body.prefs, persistence: "local" });
        return { ok: true, persistence: "server" as const };
      }
      const localPrefs = { ...optimistic, persistence: "local" as const };
      writeLocal(localPrefs);
      setPrefs(localPrefs);
      return {
        ok: true,
        persistence: "local" as const,
        error:
          body.error ||
          "Server persist unavailable — saved as demo prefs in localStorage only.",
      };
    } catch {
      const localPrefs = { ...optimistic, persistence: "local" as const };
      writeLocal(localPrefs);
      setPrefs(localPrefs);
      return {
        ok: true,
        persistence: "local" as const,
        error: "Network error — saved as demo prefs in localStorage only.",
      };
    }
  }, [prefs]);

  const clearLocalFallback = useCallback(() => {
    try {
      window.localStorage.removeItem(PREFS_LOCAL_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ prefs, loading, savePrefs, refresh, clearLocalFallback }),
    [prefs, loading, savePrefs, refresh, clearLocalFallback],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
  return ctx;
}
