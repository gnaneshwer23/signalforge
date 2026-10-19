# SignalForge audit & production-readiness checklist

**Portfolio prototype language.** This document records evidence for what was
implemented, mocked, and remaining. It does **not** claim regulatory compliance
or production readiness.

Last updated: 2026-10-20 (PRD audit remediation: A1–A6, A9–A11, FR-04/06/08).

## Phase status

| Phase | Status | Evidence |
| --- | --- | --- |
| 1. Stabilisation | **Met** for local build | `npm ci` + `npm run build` + lint + **66** tests |
| 2. Frontend completion | **Met** (demo scope) | Public site + workbench + onboarding + `/decisions` |
| 3. Backend | **Partial** | Neon + per-action authz on `PUT /api/state`; admin reset env-gated |
| 4. Evidence & AI quality | **Partial** | Record-level corpus deep links; Ask = deterministic matcher; evals **run** |
| 5. Audit & QA | **Partial** | Unit + data-lint + eval harness; GitHub Actions CI added; no Playwright |
| 6. Controlled release prep | **Not ready to publish as product** | Gates below; live URL is portfolio demo only |

## Controlled release gates A–G

| Gate | Intent | Status | Notes |
| --- | --- | --- | --- |
| A | Build & typecheck green | **Pass (local)** | `npm ci`, lint, build, 66 tests |
| B | Seeded corpus + migrations | **Pass (Neon Postgres)** | Record-level identifiers; amlitelimab/rocatinlimab |
| C | Authz on mutations | **Pass (demo)** | Permission-aware state merge; brief approve gated; admin password from env |
| D | Provenance & unsupported claims | **Pass (demo)** | Six statuses; data lint; unsupported claim gating |
| E | Ask Signal honesty & abstention | **Pass (demo)** | Deterministic matcher; never claims live LLM |
| F | Safety labelling | **Pass (demo)** | Fictional AE only; mock queue |
| G | Observability / ops / compliance | **Fail / not started** | No production logging stack, pen-test, or regulatory validation |

## PRD production-audit findings (status)

| ID | Severity | Finding | Status after this iteration |
| --- | --- | --- | --- |
| A1 | Critical | Whole-state PUT only checked `prefs:write` | **Fixed** — `authorizeStateWrite` per-action merge |
| A2 | Critical | Public admin + reset vandalises shared demo | **Fixed** — `ADMIN_DEMO_PASSWORD` required; not published |
| A3 | High | No LLM / embeddings; evals “not run” | **Partial** — evals **run**; live LLM / hybrid RAG **not** shipped |
| A4 | High | Homepage URLs marked verified | **Fixed** — PMID/NCT/EPAR/label deep links + data lint |
| A5 | High | `npm ci` lockfile out of sync | **Fixed** |
| A6 | High | shadcn + prisma advisories in prod deps | **Fixed** — shadcn → devDeps; `deepmerge-ts` override; `npm audit --omit=dev` = 0 |
| A7 | Medium | In-memory rate limit | **Open** — still per-instance |
| A8 | Medium | Last-write-wins | **Open** — no version column yet |
| A9 | Medium | CSP `unsafe-eval` / no HSTS | **Fixed** — prod CSP drops unsafe-eval; HSTS added |
| A10 | Low | Plaintext demo passwords | **Fixed** — scrypt hashes |
| A11 | Low | Repo hygiene / stale release notes | **Addressed** — docs rewritten to verified reality |
| A12 | Low | Deprecated `package.json#prisma` | **Open** — Prisma 6 still works; migrate before Prisma 7 |

## Public site + onboarding

| Item | Status |
| --- | --- |
| `/` public homepage | **Met** |
| Marketing routes | **Met** |
| `/onboarding` | **Met** |
| `/workspace` role-adaptive | **Met** |
| `/decisions` ADRs | **Met** (FR-08) |
| Persona grants permissions | **No** |

## Automated tests

```bash
npm ci && npm test
```

Includes authz merge, data lint, password/admin env, eval harness, onboarding, CSRF, rate limit, Neon persistence (when `DATABASE_URL` set).

**Not covered yet:** Playwright e2e, full a11y axe CI, load testing, penetration testing, multi-instance rate-limit proof.

## Defects / known limitations

1. Ask Signal is still a deterministic matcher — not hybrid RAG / live LLM (P0 remainder).
2. No nightly PubMed / ClinicalTrials.gov ingestion (FR-07).
3. In-memory rate limiter is per-process only (A7).
4. No optimistic concurrency / version column (A8).
5. Durable store is Neon Postgres — **rotate password if ever pasted into chat**.
6. Shared demo corpus refresh requires operator-set `ADMIN_DEMO_PASSWORD` + reset.
7. Vercel production tracks **GitHub** `main`; Origin may be ahead until GitHub is synced.

## Readiness verdict

| Level | Verdict | Evidence |
| --- | --- | --- |
| Portfolio demo-ready | **Yes** | Public journey + workbench + Neon + authz hardening + measured evals + green local CI |
| Pilot-ready (shared team) | **No** | Demo credentials, in-memory rate limits, no IdP, no ops |
| Production-ready | **No** | Gate G fail; no RAG LLM; no pen-test; no multi-tenant SSO |

## Live deploy

| Item | Value |
| --- | --- |
| Production URL | https://signalforge-4gob.vercel.app/ |
| Health | `/api/health` — reports `persistence: postgresql`, optional `commitSha`, `adminResetConfigured` |
| Persistence | Neon PostgreSQL |

**Security:** rotate Neon DB password if it was pasted in chat. Set `ADMIN_DEMO_PASSWORD` only in Vercel env if admin reset is needed; leave unset for safer public demos.
