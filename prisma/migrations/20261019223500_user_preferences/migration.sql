-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "userId" TEXT,
    "displayName" TEXT,
    "personaRole" TEXT,
    "objective" TEXT,
    "therapeuticArea" TEXT,
    "experienceLevel" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "tourCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_sessionKey_key" ON "UserPreference"("sessionKey");
