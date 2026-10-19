import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-paper/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/">
            <p className="font-display text-xl font-semibold tracking-tight text-ink">
              SignalForge
            </p>
          </Link>
          <Link
            href="/workspace"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip to workspace
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        Portfolio demo preferences only — persona selection does not grant server
        permissions. Illustrative data · not regulatory-compliant.
      </footer>
    </div>
  );
}
