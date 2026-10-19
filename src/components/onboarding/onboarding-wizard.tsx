"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePrefs } from "@/lib/onboarding/prefs-context";
import { profileFor } from "@/lib/onboarding/role-profiles";
import {
  EXPERIENCE_OPTIONS,
  OBJECTIVE_OPTIONS,
  PERSONA_OPTIONS,
  SEEDED_THERAPEUTIC_AREA,
  type ExperienceLevel,
  type PersonaRole,
} from "@/lib/onboarding/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STEPS = [
  "welcome",
  "role",
  "objective",
  "therapeutic",
  "experience",
  "name",
  "confirm",
] as const;

type Step = (typeof STEPS)[number];

export function OnboardingWizard() {
  const router = useRouter();
  const search = useSearchParams();
  const presetRole = search.get("role") as PersonaRole | null;
  const { prefs, savePrefs } = usePrefs();

  const [stepIndex, setStepIndex] = useState(() =>
    presetRole && PERSONA_OPTIONS.some((p) => p.id === presetRole) ? 1 : 0,
  );
  const [personaRole, setPersonaRole] = useState<PersonaRole | null>(
    presetRole && PERSONA_OPTIONS.some((p) => p.id === presetRole)
      ? presetRole
      : prefs.personaRole,
  );
  const [objective, setObjective] = useState<string | null>(prefs.objective);
  const [therapeuticArea, setTherapeuticArea] = useState<string | null>(
    prefs.therapeuticArea ?? SEEDED_THERAPEUTIC_AREA,
  );
  const [unsupportedTa, setUnsupportedTa] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(
    prefs.experienceLevel ?? "guided",
  );
  const [displayName, setDisplayName] = useState(prefs.displayName ?? "");
  const [persistNote, setPersistNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const step: Step = STEPS[stepIndex] ?? "welcome";
  const profile = profileFor(personaRole);

  const progressLabel = useMemo(
    () => `Step ${stepIndex + 1} of ${STEPS.length}`,
    [stepIndex],
  );

  async function finish(andOpen: boolean) {
    setSaving(true);
    setPersistNote(null);
    const result = await savePrefs({
      displayName: displayName.trim() || null,
      personaRole,
      objective,
      therapeuticArea: therapeuticArea || SEEDED_THERAPEUTIC_AREA,
      experienceLevel,
      onboardingCompleted: true,
      tourCompleted: experienceLevel === "guided" ? false : prefs.tourCompleted,
    });
    if (result.persistence === "local") {
      setPersistNote(
        result.error ||
          "Saved as demo preferences in localStorage only (server persist unavailable).",
      );
    } else {
      setPersistNote("Preferences saved on the server for this demo session.");
    }
    setSaving(false);
    if (andOpen) {
      const dest =
        experienceLevel === "task"
          ? profile.primaryCta.href
          : "/workspace";
      router.push(dest);
    }
  }

  async function skipAll() {
    setSaving(true);
    await savePrefs({
      onboardingCompleted: true,
      experienceLevel: experienceLevel ?? "explore",
      therapeuticArea: SEEDED_THERAPEUTIC_AREA,
      personaRole: personaRole ?? "explorer",
    });
    setSaving(false);
    router.push("/workspace");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <p className="meta-label">
          {progressLabel}
        </p>
        <button
          type="button"
          onClick={() => void skipAll()}
          className="text-sm text-muted-foreground hover:text-foreground"
          disabled={saving}
        >
          Skip
        </button>
      </div>

      {step === "welcome" && (
        <section className="animate-rise space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Welcome to SignalForge
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A few optional questions shape your workspace priorities. Persona
            selection is a UX preference only — it does not grant server
            permissions. You can skip or edit later.
          </p>
          <p className="text-xs text-amber-review">
            Portfolio demo · illustrative AD corpus · not regulatory-compliant
          </p>
        </section>
      )}

      {step === "role" && (
        <section className="animate-rise space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Your role
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose how we prioritise entry points. Same data for everyone.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PERSONA_OPTIONS.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => setPersonaRole(opt.id)}
                  className={cn(
                    "h-full w-full rounded-md border px-4 py-3 text-left transition-colors",
                    personaRole === opt.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  <span className="block font-medium">{opt.title}</span>
                  <span
                    className={cn(
                      "mt-1 block text-xs",
                      personaRole === opt.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {opt.summary}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {step === "objective" && (
        <section className="animate-rise space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Primary objective
          </h1>
          <ul className="space-y-2">
            {OBJECTIVE_OPTIONS.map((obj) => (
              <li key={obj}>
                <button
                  type="button"
                  onClick={() => setObjective(obj)}
                  className={cn(
                    "w-full rounded-md border px-4 py-3 text-left text-sm transition-colors",
                    objective === obj
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  {obj}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {step === "therapeutic" && (
        <section className="animate-rise space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Therapeutic area
          </h1>
          <p className="text-sm text-muted-foreground">
            This demo is seeded for moderate-to-severe atopic dermatitis.
          </p>
          <button
            type="button"
            onClick={() => {
              setTherapeuticArea(SEEDED_THERAPEUTIC_AREA);
              setUnsupportedTa(false);
            }}
            className={cn(
              "w-full rounded-md border px-4 py-3 text-left text-sm",
              therapeuticArea === SEEDED_THERAPEUTIC_AREA && !unsupportedTa
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card",
            )}
          >
            {SEEDED_THERAPEUTIC_AREA} (seeded)
          </button>
          <button
            type="button"
            onClick={() => {
              setUnsupportedTa(true);
              setTherapeuticArea(null);
            }}
            className={cn(
              "w-full rounded-md border px-4 py-3 text-left text-sm",
              unsupportedTa
                ? "border-amber-review bg-amber-review/10"
                : "border-border bg-card",
            )}
          >
            Another therapeutic area…
          </button>
          {unsupportedTa && (
            <div className="rounded-lg border border-amber-review/40 bg-amber-review/10 p-4 text-sm text-ink">
              <p>
                Other therapeutic areas are not seeded in this portfolio demo.
                You can continue with atopic dermatitis, or open the workspace
                knowing filters will be empty outside AD.
              </p>
              <Button
                className="mt-3"
                size="sm"
                onClick={() => {
                  setTherapeuticArea(SEEDED_THERAPEUTIC_AREA);
                  setUnsupportedTa(false);
                }}
              >
                Use atopic dermatitis corpus
              </Button>
            </div>
          )}
        </section>
      )}

      {step === "experience" && (
        <section className="animate-rise space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Experience level
          </h1>
          <ul className="space-y-3">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => setExperienceLevel(opt.id)}
                  className={cn(
                    "w-full rounded-md border px-4 py-3 text-left transition-colors",
                    experienceLevel === opt.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  <span className="font-medium">{opt.title}</span>
                  <span
                    className={cn(
                      "mt-1 block text-xs",
                      experienceLevel === opt.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {opt.summary}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {step === "name" && (
        <section className="animate-rise space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Display name
          </h1>
          <p className="text-sm text-muted-foreground">
            Optional. No email required for onboarding preferences.
          </p>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How should we greet you?"
            aria-label="Display name"
            maxLength={80}
          />
        </section>
      )}

      {step === "confirm" && (
        <section className="animate-rise space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Confirm
          </h1>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium text-ink">
                {displayName.trim() || "Guest"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role (UX only)</dt>
              <dd className="font-medium text-ink">
                {PERSONA_OPTIONS.find((p) => p.id === personaRole)?.title ||
                  "Explorer"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Objective</dt>
              <dd className="font-medium text-ink">
                {objective || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Therapeutic area</dt>
              <dd className="font-medium text-ink">
                {therapeuticArea || SEEDED_THERAPEUTIC_AREA}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Experience</dt>
              <dd className="font-medium text-ink">
                {EXPERIENCE_OPTIONS.find((e) => e.id === experienceLevel)
                  ?.title || "Explore"}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            Suggested start: {profile.primaryCta.label} ({profile.primaryCta.href}
            ). Auth login remains separate if you need write permissions.
          </p>
          {persistNote && (
            <p className="text-xs text-amber-review" role="status">
              {persistNote}
            </p>
          )}
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          variant="outline"
          disabled={stepIndex === 0 || saving}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
        >
          Back
        </Button>
        <div className="flex flex-wrap gap-2">
          {step !== "confirm" ? (
            <Button
              disabled={saving}
              onClick={() =>
                setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))
              }
            >
              Continue
            </Button>
          ) : (
            <Button disabled={saving} onClick={() => void finish(true)}>
              {saving ? "Saving…" : "Open workspace"}
            </Button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Or{" "}
        <Link href="/workspace" className="text-accent-signal hover:underline">
          open workspace without saving
        </Link>
      </p>
    </div>
  );
}
