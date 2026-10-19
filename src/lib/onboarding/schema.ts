import { z } from "zod";

export const personaRoleSchema = z.enum([
  "competitive_intelligence",
  "medical_affairs",
  "clinical_development",
  "research",
  "product_owner",
  "safety",
  "explorer",
]);

export const experienceLevelSchema = z.enum(["guided", "explore", "task"]);

const emptyToNull = (v: string | null | undefined) => {
  if (v === undefined) return undefined;
  if (v === null || v.trim() === "") return null;
  return v.trim();
};

export const onboardingPrefsWriteSchema = z.object({
  displayName: z
    .string()
    .max(80)
    .nullable()
    .optional()
    .transform(emptyToNull),
  personaRole: personaRoleSchema.nullable().optional(),
  objective: z
    .string()
    .max(240)
    .nullable()
    .optional()
    .transform(emptyToNull),
  therapeuticArea: z
    .string()
    .max(160)
    .nullable()
    .optional()
    .transform(emptyToNull),
  experienceLevel: experienceLevelSchema.nullable().optional(),
  onboardingCompleted: z.boolean().optional(),
  tourCompleted: z.boolean().optional(),
});

/** Partial write patch — all fields optional for client/API callers. */
export type OnboardingPrefsWrite = {
  displayName?: string | null;
  personaRole?: z.infer<typeof personaRoleSchema> | null;
  objective?: string | null;
  therapeuticArea?: string | null;
  experienceLevel?: z.infer<typeof experienceLevelSchema> | null;
  onboardingCompleted?: boolean;
  tourCompleted?: boolean;
};
