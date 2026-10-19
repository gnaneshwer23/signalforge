-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EvaluationRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startedAt" TEXT NOT NULL,
    "completedAt" TEXT NOT NULL,
    "caseResults" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "illustrative" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "BriefReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "briefId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "fromState" TEXT NOT NULL,
    "toState" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "identifier" TEXT,
    "publisher" TEXT,
    "publicationDate" TEXT,
    "retrievalDate" TEXT NOT NULL,
    "verification" TEXT NOT NULL,
    "provenanceKind" TEXT NOT NULL DEFAULT 'discovery_url'
);
INSERT INTO "new_Source" ("id", "identifier", "publicationDate", "publisher", "retrievalDate", "title", "type", "url", "verification") SELECT "id", "identifier", "publicationDate", "publisher", "retrievalDate", "title", "type", "url", "verification" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
