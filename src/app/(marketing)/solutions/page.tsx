import Link from "next/link";
import { ROLE_PROFILES } from "@/lib/onboarding/role-profiles";
import { PERSONA_OPTIONS } from "@/lib/onboarding/types";

export default function SolutionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="meta-label text-teal">Solutions</p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Role-shaped entry. Shared evidence underneath.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Onboarding persona changes welcome copy and suggested CTAs only. It does
        not change authentication roles or server permissions.
      </p>

      <ul className="mt-14 space-y-10">
        {PERSONA_OPTIONS.map((persona) => {
          const profile = ROLE_PROFILES[persona.id];
          return (
            <li key={persona.id} className="border-t border-border pt-8">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {persona.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {profile.welcomeBody}
              </p>
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-ink">
                {profile.priorities.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <Link
                href={`/onboarding?role=${persona.id}`}
                className="mt-5 inline-block text-sm font-medium text-accent-signal hover:underline"
              >
                Start as {persona.title} →
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
