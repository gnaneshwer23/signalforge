# SignalForge audit & production-readiness checklist

**Portfolio prototype language.** This document records evidence for what was
implemented, mocked, and remaining. It does **not** claim regulatory compliance
or production readiness.

Last updated: 2026-10-19 (end-to-end mission pass on `main`).

## Phase status

| Phase | Status | Evidence |
| --- | --- | --- |
| 1. Stabilisation | **Met** for local build | `npm run build` green; `npm run lint` green; `npm test` 17/17 |
| 2. Frontend completion | **Met** (demo scope) | Nine areas + About; breadcrumbs; global search; demo-data indicator; Bionil-inspired tokens |
| 3. Backend | **Partial** | Prisma 6 + Neon PostgreSQL (`DATABASE_URL` / `DATABASE_URL_UNPOOLED`); demo session auth; PUT `/api/state` + reset authz; brief transition API with actor/time; audit append-merge |
| 4. Evidence & AI quality | **Partial** | Six provenance statuses; claim–evidence links; Ask `/api/ask` retrieve-then-cite with abstention + rate limit; labelled deterministic demo (no live LLM) |
| 5. Audit & QA | **Partial** | Unit tests: matcher, permissions, provenance, rate-limit, audit-merge; no Playwright e2e CI |
| 6. Controlled release prep | **Not ready to publish** | Gates A–G below; live URL exists as portfolio demo only |

## Controlled release gates A–G

| Gate | Intent | Status | Notes |
| --- | --- | --- | --- |
| A | Build & typecheck green | **Pass (local)** | `npm run build` + lint |
| B | Seeded corpus + migrations | **Pass (Neon Postgres)** | `prisma/migrations` (postgresql), seed against Neon |
| C | Authz on mutations | **Partial** | Session + role checks on state PUT/reset and brief transitions; full-document sync remains primary write path |
| D | Provenance & unsupported claims | **Pass (demo)** | Six statuses defined; unsupported claim gating on approve |
| E | Ask Signal honesty & abstention | **Pass (demo)** | Deterministic matcher + `/api/ask`; injection abstention tests; never claims live LLM |
| F | Safety labelling | **Pass (demo)** | Fictional AE only; mock queue |
| G | Observability / ops / compliance | **Fail / not started** | No production logging stack, secrets manager, pen-test, or regulatory validation |

## Automated tests

```bash
npm test
```

Covers:

- Ask Signal abstention (fictional efficacy, patient advice)
- Prompt-injection detection / abstention
- Role permission matrix
- Provenance status derivation (supported / conflicting / insufficient / unverified)
- Rate-limit bucket behaviour
- Audit append-merge (clients cannot wipe history)

**Not covered yet:** Playwright e2e, full a11y axe CI, load testing, penetration testing.

## Defects / known limitations

1. Full-document state sync remains a primary write path (auth-gated) — finer mutation APIs exist for brief transitions only.
2. Demo passwords are public by design — replace with real IdP before any shared environment.
3. Durable store is Neon Postgres — Vercel project already has Neon `DATABASE_URL` / `DATABASE_URL_UNPOOLED` (prod+dev); rotate credentials if ever pasted into chat.
4. Evaluation **targets** are illustrative; **run results** are measured against the seeded corpus with deterministic fixtures — still not production SLAs.
5. In-memory Ask rate limiter is per-process only.
6. No GitHub Actions CI wired in this repo snapshot.
7. CSP allows `'unsafe-inline'` / `'unsafe-eval'` for Next.js demo pragmatism — tighten before production.

## What remains for production

- Neon backups / branching policy and production secret rotation
- Real identity provider, CSRF tokens, durable distributed rate limits, immutable audit store
- Live retrieval / model stack with human-in-the-loop evaluation SLAs (only if explicitly in scope)
- Validated PV integrations (explicitly out of scope for this portfolio)
- Penetration test, DPIA, and jurisdiction-specific review
- CI/CD with gated promotions — **do not publish as production until gates A–G are met with evidence**

## Readiness verdict

| Level | Verdict | Evidence |
| --- | --- | --- |
| Portfolio demo-ready | **Yes** | Build/lint/tests green; nine areas; honest labelling; Neon Postgres persistence |
| Pilot-ready (shared team) | **No** | Demo credentials, incomplete authz matrix, no ops |
| Production-ready | **No** | Gate G fail; no IdP; no pen-test |

Live portfolio deploy (verify independently): https://signalforge-4gob.vercel.app/
