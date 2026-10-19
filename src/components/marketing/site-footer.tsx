import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold text-ink">SignalForge</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Evidence-grounded pharmaceutical competitive intelligence workbench.
            Independent portfolio prototype — not affiliated with any consultancy.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/platform" className="text-ink hover:text-accent-signal">
                Platform
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="text-ink hover:text-accent-signal">
                Solutions by role
              </Link>
            </li>
            <li>
              <Link href="/methodology" className="text-ink hover:text-accent-signal">
                Methodology
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-ink hover:text-accent-signal">
                About & limitations
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Demo
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/demo" className="text-ink hover:text-accent-signal">
                Guided demo
              </Link>
            </li>
            <li>
              <Link href="/onboarding" className="text-ink hover:text-accent-signal">
                Personalised onboarding
              </Link>
            </li>
            <li>
              <Link href="/workspace" className="text-ink hover:text-accent-signal">
                Intelligence workspace
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs leading-relaxed text-muted-foreground sm:px-6 lg:px-8">
          Illustrative / demo data only. Not a validated pharmacovigilance system.
          Not for clinical decision support. Interpretations are hypotheses for human
          review. Not production-ready or regulatory-compliant.
        </div>
      </div>
    </footer>
  );
}
