import { prisma } from "@/lib/db";
import type { OnboardingPreferences, PersonaRole, ExperienceLevel } from "./types";
import { DEFAULT_PREFERENCES } from "./types";
import type { OnboardingPrefsWrite } from "./schema";

function mapRow(row: {
  displayName: string | null;
  personaRole: string | null;
  objective: string | null;
  therapeuticArea: string | null;
  experienceLevel: string | null;
  onboardingCompleted: boolean;
  tourCompleted: boolean;
  updatedAt: string;
}): OnboardingPreferences {
  return {
    displayName: row.displayName,
    personaRole: (row.personaRole as PersonaRole | null) ?? null,
    objective: row.objective,
    therapeuticArea: row.therapeuticArea,
    experienceLevel: (row.experienceLevel as ExperienceLevel | null) ?? null,
    onboardingCompleted: row.onboardingCompleted,
    tourCompleted: row.tourCompleted,
    updatedAt: row.updatedAt,
    persistence: "server",
  };
}

export async function getPreferences(
  sessionKey: string,
): Promise<OnboardingPreferences> {
  const row = await prisma.userPreference.findUnique({
    where: { sessionKey },
  });
  if (!row) return { ...DEFAULT_PREFERENCES };
  return mapRow(row);
}

export async function upsertPreferences(
  sessionKey: string,
  patch: OnboardingPrefsWrite,
  userId?: string | null,
): Promise<OnboardingPreferences> {
  const now = new Date().toISOString();
  const existing = await prisma.userPreference.findUnique({
    where: { sessionKey },
  });

  const data = {
    userId: userId ?? existing?.userId ?? null,
    displayName:
      patch.displayName !== undefined
        ? patch.displayName
        : (existing?.displayName ?? null),
    personaRole:
      patch.personaRole !== undefined
        ? patch.personaRole
        : (existing?.personaRole ?? null),
    objective:
      patch.objective !== undefined
        ? patch.objective
        : (existing?.objective ?? null),
    therapeuticArea:
      patch.therapeuticArea !== undefined
        ? patch.therapeuticArea
        : (existing?.therapeuticArea ?? null),
    experienceLevel:
      patch.experienceLevel !== undefined
        ? patch.experienceLevel
        : (existing?.experienceLevel ?? null),
    onboardingCompleted:
      patch.onboardingCompleted !== undefined
        ? patch.onboardingCompleted
        : (existing?.onboardingCompleted ?? false),
    tourCompleted:
      patch.tourCompleted !== undefined
        ? patch.tourCompleted
        : (existing?.tourCompleted ?? false),
    updatedAt: now,
  };

  const row = existing
    ? await prisma.userPreference.update({
        where: { sessionKey },
        data,
      })
    : await prisma.userPreference.create({
        data: {
          sessionKey,
          createdAt: now,
          ...data,
        },
      });

  return mapRow(row);
}
