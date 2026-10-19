# SignalForge release audit — persistence fix

**Portfolio prototype.** Illustrative / synthetic / AI-assisted demo data only. Not a validated pharmacovigilance system. Not for clinical decision support. Not affiliated with Atacana Group.

Date: 2026-10-19 · Branch: `cursor/neon-postgres-f207`

## 1. Root cause (logs/API evidence)

Live `GET https://signalforge-4gob.vercel.app/api/state` returned **500** with body:

`{"error":"Failed to load workbench state from SQLite."}`

Vercel runtime errors for project `signalforge-4gob` (deployment `dpl_4oFjdqWWwZuJKsKKdjqXj2DtioB3`, branch `main`) showed:

`PrismaClientInitializationError` — `Environment variable not found: DATABASE_URL` while `schema.prisma` still had `provider = "sqlite"`.

**Evidenced root cause:** SQLite + missing `DATABASE_URL` on Vercel serverless (ephemeral FS / no durable file DB). Not missing routes, not session/authz for reads (PUT/reset correctly returned 401 unauthenticated).

## 2. Files changed + architecture decisions

- Prisma datasource → PostgreSQL with `DATABASE_URL` (pooled) + `DATABASE_URL_UNPOOLED` (direct; Neon Vercel naming)
- Postgres baseline migration replaces SQLite migrations
- Repository seed/save uses ordered `createMany` + `skipDuplicates` (pooler-safe; no interactive transactions)
- Seed refuses to wipe populated Neon data; repairs incomplete DBs (rows without `AppMeta` / zero assets)
- `/api/health` readiness probe; `/api/state` non-sensitive errors + codes; CSRF origin check + rate limits on mutations
- Session secret fails closed on shared deploy if missing/weak
- Frontend persistence status: Connected | Demo mode | Authentication required | Persistence error (with Retry; edits kept on failed write)

## 3. Persistence provider + connection status

- **Provider:** Neon PostgreSQL (eu-west-2 pooler)
- **Local:** migrate deploy applied; ping `SELECT 1` OK; corpus present after seed/repair
- **Vercel:** Neon integration `DATABASE_URL` / `DATABASE_URL_UNPOOLED` on production+development; preview URLs added; `SESSION_SECRET` set for production/preview/development

## 4. Migrations completed

- `prisma/migrations/20261019213000_init_postgres` applied (`prisma migrate deploy`: no pending)

## 5. Build / lint / test results

| Check | Result |
| --- | --- |
| `npm run build` | Pass |
| `npm run lint` | Pass |
| `npm test` | **41/41 pass** |

## 6. API / auth test results

| Case | Result |
| --- | --- |
| DB ping + AppMeta/assets present | Pass |
| Valid payload accepted; empty rejected | Pass |
| Unauthenticated `prefs:write` → 401 | Pass |
| Non-admin `demo:reset` → 403; admin allowed | Pass |
| Session secret weak/missing on shared deploy rejected | Pass |
| Live pre-fix: GET 500 SQLite; PUT/reset 401 | Observed |

## 7. Refresh-persistence results

| Case | Result |
| --- | --- |
| Entity-level `AppMeta` update survives reload | Pass |
| Audit append durable via `appendAuditEvent` | Pass |
| Audit append-merge unit tests | Pass |

## 8. Security findings

- **Rotate Neon DB password** — pasted in chat again; treat as compromised until rotated
- Demo credentials remain public/labelled (portfolio only)
- Shared deploy requires strong `SESSION_SECRET` (no reusable default)
- CSRF origin check + rate limits on login/state/reset
- Never commit `DATABASE_URL` / secrets (`.env*` gitignored)

## 9. Required Vercel env vars + setup steps (names only)

1. `DATABASE_URL` — Neon pooled connection string (production / preview / development)
2. `DATABASE_URL_UNPOOLED` — Neon direct URL for migrations
3. `SESSION_SECRET` — unique ≥32-character HMAC secret

Steps: set in Vercel Project → Settings → Environment Variables → redeploy. Run `prisma migrate deploy` against Neon (CI or one-shot) then seed only if empty (`npm run db:seed`).

## 10. Commit / PR link

See git push / Origin PR for branch `cursor/neon-postgres-f207` after this release commit.

## 11. Whether new deployment was performed

Recorded after green build + Neon configured (see agent final report).

## 12. Blockers + readiness verdict

- **Blockers:** Neon password rotation still required; production Neon integration vars may differ from chat-pasted URL until confirmed; concurrent agents sharing Neon can race seeds
- **Portfolio demo-ready:** Yes (after deploy of this branch)
- **Pilot / production-ready:** No (demo auth, Gate G ops/compliance still fail)
