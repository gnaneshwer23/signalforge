# SignalForge audit & production-readiness checklist

**Portfolio prototype language.** This document records evidence for what was
implemented, mocked, and remaining. It does **not** claim regulatory compliance
or production readiness.

Last updated: 2026-10-19 (agent audit pass on `main`).

## Phase status

| Phase | Status | Evidence |
| --- | --- | --- |
| 1. Stabilisation | **Met** for local build | `npm run build` succeeds (Next.js 16 + Prisma generate + tsc) |
| 2. Frontend completion | **Mostly met** | Nine nav areas + About; Bionil-inspired tokens in `DESIGN.md` / `globals.css` |
| 3. Backend | **Partial** | Prisma 6 + SQLite migrations/seed; demo session auth + server authz on PUT/reset; no managed Postgres |
| 4. Evidence & AI quality | **Partial** | Claim–evidence links, abstention, injection fixtures + unit tests; not a live model eval harness |
| 5. Audit & QA | **Partial** | Unit tests for matcher/permissions; no full e2e/a11y CI suite yet |
| 6. Controlled release prep | **Not ready to publish** | Gates A–G below are mostly partial; do not auto-deploy |

## Controlled release gates A–G

| Gate | Intent | Status | Notes |
| --- | --- | --- | --- |
| A | Build & typecheck green | **Pass (local)** | `npm run build` |
| B | Seeded corpus + migrations | **Pass (local SQLite)** | `prisma/migrations`, `npm run db:seed` |
| C | Authz on mutations | **Partial** | Cookie session + role checks on `/api/state` PUT and reset; fine-grained per-action API matrix not fully split |
| D | Provenance & unsupported claims | **Pass (demo)** | `provenanceKind`, unsupported claim gating on brief approve |
| E | Ask Signal honesty & abstention | **Pass (demo)** | Deterministic matcher; injection abstention tests |
| F | Safety labelling | **Pass (demo)** | Fictional AE only; mock queue; governance as requirements-to-validate |
| G | Observability / ops / compliance | **Fail / not started** | No production logging, secrets management, pen-test, or regulatory validation |

## Automated tests

```bash
npm test
```

Covers:

- Ask Signal abstention (fictional efficacy, patient advice)
- Prompt-injection detection / abstention
- Role permission matrix (analyst cannot approve/reset; admin can reset)

**Not covered yet:** Playwright e2e, full a11y audit, load testing, penetration testing.

## Defects / known limitations

1. Full-document state sync remains the primary write path (auth-gated) — prefer finer mutation APIs before production.
2. Demo passwords are public by design — replace with real IdP before any shared environment.
3. SQLite file DB is local-demo only — not multi-instance safe.
4. Evaluation centre results are fixture-driven and labelled illustrative.
5. No GitHub Actions CI wired in this repo snapshot.
6. Keyboard/a11y: basic labels and focusable controls exist; no automated axe run recorded.

## What remains for production

- Managed Postgres (Supabase/Neon) with encrypted credentials and backups
- Real identity provider, CSRF hardening, rate limits, audit immutability store
- Live retrieval / model stack with human-in-the-loop evaluation SLAs (if in scope)
- Validated PV integrations (explicitly out of scope for this portfolio)
- Penetration test, DPIA, and jurisdiction-specific review
- CI/CD with gated promotions — **do not publish until gates A–G are met with evidence**
