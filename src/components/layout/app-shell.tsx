"use client";

import { StoreProvider } from "@/lib/store";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";
import { AppNav } from "@/components/layout/app-nav";
import { DemoWalkthrough } from "@/components/layout/demo-walkthrough";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

function ShellChrome({ children }: { children: React.ReactNode }) {
  const { resetDemo, hydrated } = useStore();
  return (
    <div className="flex min-h-screen flex-col">
      <DisclaimerBanner />
      <div className="flex flex-1 flex-col lg:flex-row">
        <AppNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print flex items-center justify-between gap-3 border-b border-border bg-card/70 px-4 py-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Therapeutic area
              </p>
              <p className="text-sm text-ink">
                Moderate-to-severe atopic dermatitis
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!hydrated}
              onClick={resetDemo}
            >
              Reset demo state
            </Button>
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
    <StoreProvider>
      <ShellChrome>{children}</ShellChrome>
    </StoreProvider>
  );
}
