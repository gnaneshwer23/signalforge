"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const links = [
  { href: "/workspace", label: "Workspace" },
  { href: "/landscape", label: "Landscape" },
  { href: "/evidence", label: "Evidence" },
  { href: "/briefs", label: "Briefs" },
  { href: "/ask", label: "Ask Signal" },
  { href: "/governance", label: "Safety & governance" },
  { href: "/evaluation", label: "Evaluation" },
  { href: "/decisions", label: "Decisions" },
  { href: "/delivery", label: "Product Owner" },
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
    <nav className={cn("flex flex-col gap-0.5", className)} aria-label="Primary">
      {links.map((link, i) => {
        const active =
          link.href === "/workspace"
            ? pathname === "/workspace" || pathname === "/"
            : link.href === "/governance"
              ? pathname.startsWith("/governance") ||
                pathname.startsWith("/safety")
              : link.href === "/about"
                ? pathname === "/about"
                : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "animate-slide-nav rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
            style={{ animationDelay: `${i * 25}ms` }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="no-print hidden w-[15.5rem] shrink-0 border-r border-sidebar-border bg-sidebar/95 p-5 lg:block">
        <div className="mb-7">
          <Link href="/" className="group block">
            <p className="font-display text-[1.55rem] font-semibold leading-none tracking-tight text-ink transition-colors group-hover:text-accent-signal">
              SignalForge
            </p>
            <p className="meta-label mt-2.5">Pharma intelligence</p>
          </Link>
          <Link
            href="/"
            className="mt-3 inline-block text-xs font-medium text-accent-signal hover:underline"
          >
            ← Public site
          </Link>
        </div>
        <NavLinks />
      </aside>

      <div className="no-print flex items-center justify-between border-b border-sidebar-border bg-sidebar/95 px-4 py-3 lg:hidden">
        <Link href="/workspace">
          <p className="font-display text-xl font-semibold tracking-tight text-ink">
            SignalForge
          </p>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card hover:bg-muted"
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-sidebar">
            <SheetHeader>
              <SheetTitle className="font-display text-left text-ink">
                SignalForge
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 px-2">
              <NavLinks onNavigate={() => setOpen(false)} />
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="mt-4 block px-3 text-sm font-medium text-accent-signal"
              >
                Public site
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
