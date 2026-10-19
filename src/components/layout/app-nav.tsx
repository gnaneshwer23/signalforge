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
  { href: "/", label: "Overview" },
  { href: "/landscape", label: "Landscape" },
  { href: "/evidence", label: "Evidence" },
  { href: "/briefs", label: "Briefs" },
  { href: "/ask", label: "Ask Signal" },
  { href: "/safety", label: "Safety" },
  { href: "/governance", label: "Governance" },
  { href: "/evaluation", label: "Evaluation" },
  { href: "/delivery", label: "Delivery" },
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
    <nav className={cn("flex flex-col gap-1", className)}>
      {links.map((link, i) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "animate-slide-nav rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            style={{ animationDelay: `${i * 30}ms` }}
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
      <aside className="no-print hidden w-56 shrink-0 border-r border-border bg-sidebar/80 p-4 lg:block">
        <div className="mb-6">
          <Link href="/" className="block">
            <p className="font-display text-2xl text-ink">SignalForge</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pharma Intelligence Workbench
            </p>
          </Link>
        </div>
        <NavLinks />
      </aside>

      <div className="no-print flex items-center justify-between border-b border-border bg-sidebar/90 px-4 py-3 lg:hidden">
        <Link href="/">
          <p className="font-display text-xl text-ink">SignalForge</p>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted"
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
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
