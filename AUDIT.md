# SignalForge audit & production-readiness checklist

**Portfolio prototype language.** This document records evidence for what was
implemented, mocked, and remaining. It does **not** claim regulatory compliance
or production readiness.

Last updated: 2026-10-19 (public site + onboarding + role-adaptive workspace).

## Phase status

| Phase | Status | Evidence |
| --- | --- | --- |
| 1. Stabilisation | **Met** for local build | `npm run build` green; `npm run lint` green; `npm test` 52/52 |
| 2. Frontend completion | **Met** (demo scope) | Public marketing site + nine workbench areas; onboarding; role-adaptive `/workspace` |
| 3. Backend | **Partial** | Prisma 6 + Neon; `/api/health`; `/api/prefs`; CSRF + rate limits; SESSION_SECRET fail-closed |
| 4. Evidence & AI quality | **Partial** | Six provenance statuses; Ask `/api/ask` deterministic + abstention |
| 5. Audit & QA | **Partial** | Unit tests incl. onboarding prefs validation + route architecture; no Playwright e2e CI |
| 6. Controlled release prep | **Not ready to publish** | Gates A–G below; live URL is portfolio demo only |

## Controlled release gates A–G

| Gate | Intent | Status | Notes |
| --- | --- | --- | --- |
| A | Build & typecheck green | **Pass (local)** | `npm run build` + lint + 52 tests |
| B | Seeded corpus + migrations | **Pass (Neon Postgres)** | Incl. `UserPreference` migration |
| C | Authz on mutations | **Partial** | Session + role checks; onboarding persona ≠ auth Role |
| D | Provenance & unsupported claims | **Pass (demo)** | Six statuses; unsupported claim gating on approve |
| E | Ask Signal honesty & abstention | **Pass (demo)** | Deterministic matcher; never claims live LLM |
| F | Safety labelling | **Pass (demo)** | Fictional AE only; mock queue |
| G | Observability / ops / compliance | **Fail / not started** | No production logging stack, pen-test, or regulatory validation |

## Public site + onboarding (this iteration)

| Item | Status |
| --- | --- |
| `/` public homepage | **Met** — hero copy, live product preview (not fake screenshot), honest CTAs |
| `/platform`, `/solutions`, `/methodology`, `/about`, `/demo` | **Met** — marketing shell |
| `/onboarding` wizard | **Met** — 7 roles, skip, optional name; server prefs + localStorage fallback |
| `/workspace` role-adaptive | **Met** — personalised welcome/CTAs; edit onboarding; guided tour |
| Deep links preserved | **Met** — landscape/evidence/briefs/ask/safety/governance/evaluation/delivery |
| Fake logos/testimonials/stats | **Avoided** |
| Persona grants permissions | **No** — documented + schema rejects fake roles like `admin` |

## Automated tests

```bash
npm test
```

Covers prior suites plus:

- Onboarding prefs Zod validation (incl. rejecting unknown persona roles)
- Role profile coverage (7 personas)
- Route architecture (homepage vs `/workspace`; no `/` redirect away from marketing)

**Not covered yet:** Playwright e2e, full a11y axe CI, load testing, penetration testing.

## Defects / known limitations

1. Full-document state sync remains a primary write path (auth-gated).
2. Demo passwords are public by design.
3. Durable store is Neon Postgres — rotate password if ever pasted into chat.
4. Evaluation targets are illustrative.
5. In-memory Ask rate limiter is per-process only.
6. No GitHub Actions CI wired in this repo snapshot.
7. CSP allows `'unsafe-inline'` / `'unsafe-eval'` for Next.js demo pragmatism.
8. Prefs may fall back to localStorage when `/api/prefs` is unavailable — UI labels this honestly.

## Readiness verdict

| Level | Verdict | Evidence |
| --- | --- | --- |
| Portfolio demo-ready | **Yes** | Public journey + workbench + Neon + tests green |
| Pilot-ready (shared team) | **No** | Demo credentials, incomplete authz matrix, no ops |
| Production-ready | **No** | Gate G fail; no IdP; no pen-test |

## Live deploy

| Item | Value |
| --- | --- |
| Production URL | https://signalforge-4gob.vercel.app/ |
| Persistence | Neon PostgreSQL (`UserPreference` migration applied from this environment) |

**Note:** Vercel production tracks GitHub `main`. If GitHub write credentials are missing in the agent environment, Origin may be ahead of GitHub/live until a human pushes or syncs.

**Security:** rotate Neon DB password if it was pasted in chat.
