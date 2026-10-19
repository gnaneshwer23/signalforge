"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import { PrefsProvider } from "@/lib/onboarding/prefs-context";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PrefsProvider>{children}</PrefsProvider>
    </AuthProvider>
  );
}
