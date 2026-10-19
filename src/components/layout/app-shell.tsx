"use client";

import { useState } from "react";
import { StoreProvider, useStore } from "@/lib/store";
import { AuthProvider } from "@/lib/auth/auth-context";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";
import { DemoModeBanner } from "@/components/layout/demo-mode-banner";
import { AppNav } from "@/components/layout/app-nav";
import { DemoWalkthrough } from "@/components/layout/demo-walkthrough";
import { AuthBar } from "@/components/layout/auth-bar";
import { Button } from "@/components/ui/button";

function ShellChrome({ children }: { children: React.ReactNode }) {
  const { resetDemo, hydrated } = useStore();
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col">
      <DisclaimerBanner />
      <DemoModeBanner />
      <div className="flex flex-1 flex-col lg:flex-row">
        <AppNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print flex flex-col gap-3 border-b border-border bg-card/70 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Therapeutic area
              </p>
              <p className="text-sm text-ink">
                Moderate-to-severe atopic dermatitis
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <AuthBar />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hydrated}
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
          </header>
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <ShellChrome>{children}</ShellChrome>
      </StoreProvider>
    </AuthProvider>
  );
}
