"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  workspace: "Workspace",
  landscape: "Landscape",
  evidence: "Evidence",
  briefs: "Briefs",
  ask: "Ask Signal",
  governance: "Safety & governance",
  safety: "Safety triage",
  evaluation: "Evaluation",
  delivery: "Product Owner",
  about: "About",
  onboarding: "Onboarding",
  platform: "Platform",
  solutions: "Solutions",
  methodology: "Methodology",
  demo: "Demo",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0 || (parts.length === 1 && parts[0] === "workspace")) {
    return (
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li aria-current="page">Workspace</li>
        </ol>
      </nav>
    );
  }

  const crumbs: { href: string; label: string; current: boolean }[] = [
    { href: "/workspace", label: "Workspace", current: false },
  ];

  let acc = "";
  parts.forEach((part, idx) => {
    acc += `/${part}`;
    if (part === "workspace") return;
    const isLast = idx === parts.length - 1;
    const label =
      LABELS[part] ||
      (part.startsWith("brief-") ||
      part.startsWith("ev-") ||
      part.startsWith("asset-")
        ? part
        : part);
    crumbs.push({ href: acc, label, current: isLast });
  });

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.current ? (
              <span aria-current="page" className="text-ink">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="hover:text-foreground hover:underline">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
