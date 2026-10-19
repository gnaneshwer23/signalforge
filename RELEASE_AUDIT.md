# SignalForge release notes

**Portfolio prototype.** Illustrative / synthetic demo data only. Not a validated pharmacovigilance system. Not for clinical decision support.

## Current verified state (2026-10-20)

| Check | Result |
| --- | --- |
| Origin `main` | See latest commit on this branch |
| Live URL | https://signalforge-4gob.vercel.app/ |
| Live `/api/health` | 200 · `persistence: postgresql` · `sessionSecretConfigured: true` |
| Local `npm ci` | Pass |
| Local `npm run lint` | Pass (re-verify on each release) |
| Local `npm test` | **66** tests |
| `npm audit --omit=dev` | **0** vulnerabilities |
| Portfolio demo-ready | **Yes** |
| Pilot / production-ready | **No** |

## Persistence architecture

- Prisma 6 + Neon PostgreSQL (`DATABASE_URL` pooled + `DATABASE_URL_UNPOOLED` direct)
- Seed refuses to wipe populated Neon data; repairs incomplete DBs
- Audit append-merge; CSRF origin check; session secret fails closed on shared deploys
- `PUT /api/state` uses **permission-aware merge** (A1) — analysts cannot approve briefs via document overwrite
- Admin reset requires `ADMIN_DEMO_PASSWORD` (A2) — not published in README

## Required Vercel env vars (names only)

1. `DATABASE_URL`
2. `DATABASE_URL_UNPOOLED`
3. `SESSION_SECRET` (≥32 chars, unique)
4. `ADMIN_DEMO_PASSWORD` — optional; omit to disable public admin reset

## Deploy sync note

Vercel production typically tracks **GitHub** `main`. This agent environment may push **Origin** successfully while GitHub write credentials are missing. If live `commitSha` lags Origin, sync GitHub `main` then confirm `/api/health`.

## Security

- **Rotate Neon DB password** if it was pasted into chat — treat as compromised until rotated.
- Never commit `.env` / secrets.
- Demo analyst/reviewer/PO passwords are intentionally public and hashed at rest; admin is env-only.

## Historical root cause (resolved on Neon path)

Earlier production returned `GET /api/state` 500 with SQLite / missing `DATABASE_URL`. Root cause: SQLite on Vercel serverless. Remediation: Neon Postgres + env vars. Live health now reports PostgreSQL.
