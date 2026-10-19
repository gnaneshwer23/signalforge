"use client";

import { StoreProvider } from "@/lib/store";
import { AppShellChrome } from "@/components/layout/app-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AppShellChrome>{children}</AppShellChrome>
    </StoreProvider>
  );
}
