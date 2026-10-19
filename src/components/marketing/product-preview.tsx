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
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_40px_rgb(15_61_46_/_0.1)]">
        <div className="flex items-center gap-2 border-b border-border bg-mint/80 px-3 py-2">
          <span className="size-2 rounded-full bg-border" aria-hidden />
          <span className="size-2 rounded-full bg-border" aria-hidden />
          <span className="size-2 rounded-full bg-border" aria-hidden />
          <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Illustrative preview · demo corpus
          </span>
        </div>
        <div className="grid gap-0 lg:grid-cols-[140px_1fr]">
          <aside className="hidden border-r border-border bg-sidebar p-3 lg:block">
            <p className="font-display text-sm font-semibold text-ink">SignalForge</p>
            <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
              <li className="rounded-md bg-primary px-2 py-1 text-primary-foreground">
                Workspace
              </li>
              <li className="px-2 py-1">Landscape</li>
              <li className="px-2 py-1">Evidence</li>
              <li className="px-2 py-1">Briefs</li>
              <li className="px-2 py-1">Ask Signal</li>
            </ul>
          </aside>
          <div className="space-y-3 p-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Emerging signal
              </p>
              <p className="mt-1 font-display text-base font-semibold text-ink">
                JAK inhibitor access framing in moderate-to-severe AD
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Hypothesis for human review · needs evidence inspection
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-paper px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <p className="text-sm font-medium text-amber-review">Needs review</p>
              </div>
              <div className="rounded-lg border border-border bg-paper px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Evidence
                </p>
                <p className="text-sm font-medium text-verified">Source located</p>
              </div>
              <div className="rounded-lg border border-border bg-paper px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Brief
                </p>
                <p className="text-sm font-medium text-ink">Draft</p>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-mint/40 px-3 py-2.5 text-xs text-muted-foreground">
              Ask Signal (deterministic): abstains on out-of-corpus or
              treatment-advice queries — not a live LLM.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
