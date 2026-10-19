# SignalForge — Pharma Intelligence Workbench

Evidence-grounded pharmaceutical competitive intelligence workbench (**portfolio prototype**). SignalForge turns fragmented biomedical, clinical-trial, and regulatory information into **traceable competitive signals**, **reviewable insights**, and **actionable strategic questions**.

**Independent portfolio prototype** — not affiliated with any consultancy named in prior drafts.

Therapeutic focus for this demo: **moderate-to-severe atopic dermatitis**.

Illustrative / demo data only. Not a validated pharmacovigilance system. Not for clinical decision support. Interpretations are hypotheses for human review. **Do not treat this build as production-ready** — see [AUDIT.md](./AUDIT.md).

## Requirements map (job-ad → screen)

| Responsibility | Screen | Status |
| --- | --- | --- |
| Define AI: retrieval, summarisation, evidence linking | [`/ask`](./src/app/(app)/ask) + [`/evidence`](./src/app/(app)/evidence) | Deterministic hybrid-style matcher + corpus; **no live LLM yet** |
| Own evaluation + root cause on misses | [`/evaluation`](./src/app/(app)/evaluation) | Fixture harness **runs** (measured vs illustrative targets) |
| Familiarity with PubMed, CT.gov, FDA, EMA | [`/landscape`](./src/app/(app)/landscape) + sources | Record-level PMID/NCT/EPAR/label deep links; live ingestion **not** shipped |
| Self-directed learning that changed a decision | [`/decisions`](./src/app/(app)/decisions) | 6 ADRs linked to eval cases |
| Protect scope / change orders | [`/delivery`](./src/app/(app)/delivery) | Change control list (triage UX partial) |
| Client dependencies | `/delivery` | Basic dependency fields on backlog — **no** critical-path tracker yet |
| Milestone acceptance packages | `/delivery` | Milestones list — **no** PDF export yet |
| Regional compliance matrix | `/governance` | Checklist as requirements-to-validate — **not** GDPR/APPI/PIPL matrix |
| PV: AE detection → mock ICSR → queue | `/governance` / `/safety` | Synthetic AE + mock queue only |
| Adoption: UAT / feedback / usage | — | Usage events exist; UAT tracker / feedback widget **not** shipped |
| Exec readout | — | **Not** shipped |

## Journey

| Surface | Route | Notes |
| --- | --- | --- |
| Public homepage | `/` | Marketing hero + honest CTAs |
| Platform / Solutions / Methodology / About | `/platform`, `/solutions`, `/methodology`, `/about` | Public marketing shell |
| Guided demo | `/demo` | Short path into the workbench |
| Onboarding | `/onboarding` | Role → objective → TA → experience → optional name |
| Intelligence workspace | `/workspace` | Role-adaptive welcome |
| Workbench | `/landscape`, `/evidence`, `/briefs`, `/ask`, `/safety`, `/governance`, `/evaluation`, `/decisions`, `/delivery` | Deep links |

Public marketing shell ≠ authenticated app shell. Onboarding **persona** is a UX preference only — it does **not** grant server permissions.

## What is implemented

| Area | Status |
| --- | --- |
| Public site | Homepage, platform, solutions, methodology, about, demo |
| Onboarding | Multi-step wizard; Prisma `UserPreference` + labelled localStorage fallback |
| Competitive landscape | Search/filter/sort; includes amlitelimab + rocatinlimab |
| Evidence explorer | Provenance fields, six lifecycle statuses, claim↔evidence links |
| Signal briefs | Structure, unsupported gating, server transition API, audit |
| Ask Signal | `/api/ask` **deterministic matcher** — not a live LLM |
| Decision Records | `/decisions` — 6 ADRs with eval links |
| Evaluation centre | **Measured** fixture runs (model/prompt/corpus labelled) vs illustrative targets |
| Safety & governance | Synthetic AE + mock queue; checklist as requirements-to-validate |
| Product Owner workspace | Backlog + AC validation, milestones, change control |
| Persistence | **Neon PostgreSQL via Prisma** |
| Auth | Demo session cookies + **server-side** per-action authz on `PUT /api/state` |

## Provenance statuses

| Status | Meaning |
| --- | --- |
| Unverified | No usable locator, or fictional demo only |
| Source located | URL/identifier found; review incomplete. Discovery URLs ≠ verified claim support |
| Evidence reviewed | Human review recorded; support not yet established |
| Supported | Linked to ≥1 supported fact/interpretation via `verified_source` |
| Conflicting | Brief contradictions or mixed supported/unsupported material links |
| Insufficient | Located/reviewed but cannot establish verified claim support |

**Verified sources require a record-level identifier** (PMID, NCT, EPAR, FDA-label, or FDA-safety). Homepages alone are not sufficient — enforced by `tests/data-lint.test.ts`.

## Database & auth

**Prisma 6 + Neon PostgreSQL**. Set `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) in `.env` — never commit real credentials.

**Auth:** HTTP-only signed session cookie. Public demo users:

| Email | Password | Role |
| --- | --- | --- |
| `analyst@signalforge.demo` | `analyst-demo` | analyst |
| `reviewer@signalforge.demo` | `reviewer-demo` | reviewer |
| `po@signalforge.demo` | `po-demo` | product_owner |

Admin (`admin@signalforge.demo`) is **not** published. Set `ADMIN_DEMO_PASSWORD` in the deploy environment to enable admin login and `POST /api/state/reset`. When unset, admin login is disabled (shared-demo safety).

Passwords are stored as scrypt hashes. UI persona chips alone are **not** the security boundary — `PUT /api/state` runs a permission-aware merge (brief approval requires `briefs:approve`, etc.).

## What is mocked / incomplete

- **No live LLM** — Ask Signal is a deterministic keyword matcher (hybrid RAG / embeddings not shipped)
- **No live proprietary APIs** or nightly PubMed/CT.gov ingestion
- **No production pharmacovigilance** — safety cases are synthetic and labelled fictional
- Evaluation **targets** are illustrative; **fixture runs** are measured against the seed corpus only
- In-memory rate limits are per-instance (not multi-region safe)
- Controlled release: see [AUDIT.md](./AUDIT.md) — **portfolio demo-ready; not pilot/production**

## Design

See [DESIGN.md](./DESIGN.md) and [design-tokens.json](./design-tokens.json). Forest-green / teal system; no copied logos, testimonials, or invented metrics.

## Scripts

```bash
npm ci
npm run dev      # http://localhost:3847
npm run build
npm run lint
npm test
npm run db:seed
```

## Security note

If a database URL or other secret was pasted into chat, **rotate it** in Neon/Vercel and never commit `.env` files.
