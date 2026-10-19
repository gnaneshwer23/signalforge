/**
 * Live illustrative product preview — real UI chrome using demo labels,
 * not a static fake screenshot or stock photo.
 */
export function ProductPreview({ className }: { className?: string }) {
  return (
    <div
      className={className}
      role="img"
      aria-label="Illustrative SignalForge workspace preview showing signals, evidence status, and a draft brief panel"
    >
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-sheet)]">
        <div className="flex items-center gap-2 border-b border-border bg-mint/70 px-3 py-1.5">
          <span className="size-1.5 rounded-sm bg-border" aria-hidden />
          <span className="size-1.5 rounded-sm bg-border" aria-hidden />
          <span className="size-1.5 rounded-sm bg-border" aria-hidden />
          <span className="meta-label ml-2">Illustrative preview · demo corpus</span>
        </div>
        <div className="grid gap-0 lg:grid-cols-[132px_1fr]">
          <aside className="hidden border-r border-border bg-sidebar p-2.5 lg:block">
            <p className="font-display text-sm font-semibold text-ink">
              SignalForge
            </p>
            <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
              <li className="rounded-md bg-primary px-2 py-1 font-medium text-primary-foreground">
                Workspace
              </li>
              <li className="rounded-md px-2 py-1">Landscape</li>
              <li className="rounded-md px-2 py-1">Evidence</li>
              <li className="rounded-md px-2 py-1">Briefs</li>
              <li className="rounded-md px-2 py-1">Ask Signal</li>
            </ul>
          </aside>
          <div className="space-y-2.5 p-3 sm:p-3.5">
            <div>
              <p className="meta-label">Emerging signal</p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-ink sm:text-[0.9375rem]">
                JAK inhibitor access framing in moderate-to-severe AD
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Hypothesis for human review · needs evidence inspection
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-md border border-border bg-paper px-2.5 py-1.5">
                <p className="meta-label">Status</p>
                <p className="mt-0.5 text-sm font-medium text-amber-review">
                  Needs review
                </p>
              </div>
              <div className="rounded-md border border-border bg-paper px-2.5 py-1.5">
                <p className="meta-label">Evidence</p>
                <p className="mt-0.5 text-sm font-medium text-verified">
                  Source located
                </p>
              </div>
              <div className="rounded-md border border-border bg-paper px-2.5 py-1.5">
                <p className="meta-label">Brief</p>
                <p className="mt-0.5 text-sm font-medium text-ink">Draft</p>
              </div>
            </div>
            <div className="rounded-md border border-dashed border-border bg-mint/35 px-2.5 py-2 text-xs leading-relaxed text-muted-foreground">
              Ask Signal (deterministic): abstains on out-of-corpus or
              treatment-advice queries — not a live LLM.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
