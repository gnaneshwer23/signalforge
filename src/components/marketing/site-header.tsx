"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-1", className)} aria-label="Marketing">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group shrink-0">
          <p className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-signal">
            SignalForge
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Pharma intelligence
          </p>
        </Link>

        <div className="hidden lg:block">
          <NavLinks />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden h-9 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
          >
            Guided demo
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--primary),black_12%)]"
          >
            Start
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-paper">
              <SheetHeader>
                <SheetTitle className="font-display text-left text-ink">
                  SignalForge
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 px-2">
                <NavLinks onNavigate={() => setOpen(false)} />
                <Link
                  href="/demo"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium"
                >
                  Guided demo
                </Link>
                <Link
                  href="/workspace"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Open workspace
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
