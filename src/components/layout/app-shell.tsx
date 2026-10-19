"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/auth-context";
import { usePrefs } from "@/lib/onboarding/prefs-context";
import { roleHasPermission } from "@/lib/auth/permissions";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";
import { DemoModeBanner } from "@/components/layout/demo-mode-banner";
import { DemoDataIndicator } from "@/components/layout/demo-data-indicator";
import { AppNav } from "@/components/layout/app-nav";
import { DemoWalkthrough } from "@/components/layout/demo-walkthrough";
import { AuthBar } from "@/components/layout/auth-bar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GlobalSearch } from "@/components/layout/global-search";
import { Button } from "@/components/ui/button";

export function AppShellChrome({ children }: { children: React.ReactNode }) {
  const { resetDemo, hydrated } = useStore();
  const { user } = useAuth();
  const { prefs } = usePrefs();
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const canReset = !!user && roleHasPermission(user.role, "demo:reset");

  return (
    <div className="flex min-h-screen flex-col">
      <DisclaimerBanner />
      <DemoModeBanner />
      <div className="flex flex-1 flex-col lg:flex-row">
        <AppNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print flex flex-col gap-3 border-b border-border bg-card/80 px-4 py-3.5 backdrop-blur-[2px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2.5">
                <Breadcrumbs />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Therapeutic area
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {prefs.therapeuticArea ||
                      "Moderate-to-severe atopic dermatitis"}
                  </p>
                </div>
                <DemoDataIndicator />
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <AuthBar />
                <GlobalSearch />
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/onboarding"
                    className="inline-flex h-8 items-center rounded-lg border border-border bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-[color-mix(in_oklab,var(--secondary),var(--foreground)_6%)]"
                  >
                    Edit onboarding
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hydrated || !canReset}
                    title={
                      canReset
                        ? "Reset Neon demo corpus (admin)"
                        : "Sign in as admin to reset demo state"
                    }
                    onClick={() => {
                      setResetMsg(null);
                      void resetDemo().then((r) => {
                        if (!r.ok) setResetMsg(r.reason || "Reset denied");
                        else if (r.reason) setResetMsg(r.reason);
                      });
                    }}
                  >
                    Reset demo state
                  </Button>
                  {resetMsg && (
                    <p className="text-xs text-amber-review" role="status">
                      {resetMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <DemoWalkthrough />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use AppShellChrome inside (app) layout with StoreProvider */
export function AppShell({ children }: { children: React.ReactNode }) {
  return <AppShellChrome>{children}</AppShellChrome>;
}
