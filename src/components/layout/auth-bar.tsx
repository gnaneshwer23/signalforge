"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthBar() {
  const { user, demoAccounts, loading, login, logout } = useAuth();
  const [email, setEmail] = useState("reviewer@signalforge.demo");
  const [password, setPassword] = useState("reviewer-demo");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Checking session…
      </p>
    );
  }

  if (user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-muted-foreground">
          Signed in as <span className="text-ink">{user.name}</span> · role{" "}
          <span className="font-medium text-ink">{user.role}</span>
        </p>
        <Button size="sm" variant="outline" onClick={() => void logout()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex max-w-xl flex-col gap-2">
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        Demo credentials (public, labelled) · server-enforced roles
      </p>
      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={(e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          void login(email, password).then((r) => {
            setBusy(false);
            if (!r.ok) setError(r.error || "Login failed");
          });
        }}
      >
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Demo email"
          placeholder="email"
          className="sm:w-52"
          autoComplete="username"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Demo password"
          placeholder="password"
          className="sm:w-36"
          autoComplete="current-password"
        />
        <Button size="sm" type="submit" disabled={busy}>
          Sign in
        </Button>
      </form>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {demoAccounts.map((a) => (
          <button
            key={a.id}
            type="button"
            className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => {
              setEmail(a.email);
              const passwords: Record<string, string> = {
                analyst: "analyst-demo",
                reviewer: "reviewer-demo",
                product_owner: "po-demo",
                admin: "admin-demo",
              };
              setPassword(passwords[a.role] || "");
            }}
          >
            {a.role}
          </button>
        ))}
      </div>
    </div>
  );
}
