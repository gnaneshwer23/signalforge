"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";

type Hit = {
  href: string;
  label: string;
  kind: "asset" | "evidence" | "signal" | "brief";
};

export function GlobalSearch() {
  const { state, hydrated } = useStore();
  const [q, setQ] = useState("");

  const hits = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query || query.length < 2) return [] as Hit[];
    const out: Hit[] = [];
    for (const a of state.assets) {
      if (
        a.name.toLowerCase().includes(query) ||
        a.organization.toLowerCase().includes(query) ||
        a.mechanismOfAction.toLowerCase().includes(query)
      ) {
        out.push({
          href: `/landscape/${a.id}`,
          label: a.name,
          kind: "asset",
        });
      }
    }
    for (const e of state.evidence) {
      if (
        e.title.toLowerCase().includes(query) ||
        e.summary.toLowerCase().includes(query) ||
        e.tags.some((t) => t.includes(query))
      ) {
        out.push({
          href: `/evidence/${e.id}`,
          label: e.title,
          kind: "evidence",
        });
      }
    }
    for (const s of state.signals) {
      if (
        s.title.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query)
      ) {
        out.push({
          href: `/evidence?signal=${s.id}`,
          label: s.title,
          kind: "signal",
        });
      }
    }
    for (const b of state.briefs) {
      if (b.title.toLowerCase().includes(query)) {
        out.push({ href: `/briefs/${b.id}`, label: b.title, kind: "brief" });
      }
    }
    return out.slice(0, 8);
  }, [q, state.assets, state.evidence, state.signals, state.briefs]);

  if (!hydrated) return null;

  return (
    <div className="relative w-full max-w-sm">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search assets, evidence, signals…"
        aria-label="Global workbench search"
        aria-expanded={hits.length > 0}
        aria-controls="global-search-results"
      />
      {q.trim().length >= 2 && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute z-20 mt-1 w-full border border-border bg-card shadow-sm"
        >
          {hits.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              No matches in the seeded corpus.
            </p>
          ) : (
            <ul>
              {hits.map((h) => (
                <li key={`${h.kind}-${h.href}`}>
                  <Link
                    href={h.href}
                    className="block px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setQ("")}
                  >
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {h.kind}
                    </span>
                    <span className="mt-0.5 block text-ink">{h.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
