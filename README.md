# SignalForge — Pharma Intelligence Workbench

Evidence-grounded pharmaceutical competitive intelligence workbench (**portfolio prototype**). SignalForge turns fragmented biomedical, clinical-trial, and regulatory information into **traceable competitive signals**, **reviewable insights**, and **actionable strategic questions**.

**Independent portfolio prototype — not affiliated with Atacana Group.**

Therapeutic focus for this demo: **moderate-to-severe atopic dermatitis**.

Illustrative / demo data only. Not a validated pharmacovigilance system. Not for clinical decision support. Interpretations are hypotheses for human review. **Do not treat this build as production-ready or regulatory-compliant** — see [AUDIT.md](./AUDIT.md).

## Journey

| Surface | Route | Notes |
| --- | --- | --- |
| Public homepage | `/` | Marketing hero + honest CTAs |
| Platform / Solutions / Methodology / About | `/platform`, `/solutions`, `/methodology`, `/about` | Public marketing shell |
| Guided demo | `/demo` | Short path into the workbench |
| Onboarding | `/onboarding` | Role → objective → TA → experience → optional name |
| Intelligence workspace | `/workspace` | Former `/` dashboard; role-adaptive welcome |
| Workbench areas | `/landscape`, `/evidence`, `/briefs`, `/ask`, `/safety`, `/governance`, `/evaluation`, `/delivery` | Unchanged deep links |

Public marketing shell ≠ authenticated app shell. Onboarding **persona** is a UX preference only — it does **not** grant server permissions (auth Role remains separate).

## What is implemented

| Area | Status |
| --- | --- |
| Public site | Homepage, platform, solutions, methodology, about, demo |
| Onboarding | Multi-step wizard; Prisma `UserPreference` + labelled localStorage fallback |
| Intelligence workspace (`/workspace`) | Personalised welcome, role priorities/CTAs, guided tour |
| Competitive landscape (`/landscape`) | Search/filter/sort, MoA/indication/status, evidence links |
| Evidence explorer (`/evidence`) | Provenance fields, six lifecycle statuses, claim↔evidence links |
| Signal briefs (`/briefs`) | Structure, unsupported gating, server transition API, audit |
| Ask Signal (`/ask`) | `/api/ask` deterministic matcher — **not a live LLM** |
| Safety & governance | Synthetic AE + mock queue; checklist as requirements-to-validate |
| Evaluation centre | Measured fixture runs vs illustrative targets |
| Product Owner workspace | Backlog + AC validation, milestones, change control |
| Persistence | **Neon PostgreSQL via Prisma** |
| Auth | Demo session cookies + **server-side** role checks on mutations |

## Provenance statuses

| Status | Meaning |
| --- | --- |
| Unverified | No usable locator, or fictional demo only |
| Source located | URL/identifier found; review incomplete. Discovery URLs ≠ verified claim support |
| Evidence reviewed | Human review recorded; support not yet established |
| Supported | Linked to ≥1 supported fact/interpretation via `verified_source` |
| Conflicting | Brief contradictions or mixed supported/unsupported material links |
| Insufficient | Located/reviewed but cannot establish verified claim support |

## Database & auth

**Prisma 6 + Neon PostgreSQL** (durable store). Set `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) in `.env` — never commit real credentials.

Entities include: users (demo), sources, assets, evidence, claims, signals, briefs, evaluation, backlog, milestones, change requests, audit, safety flags, **user preferences** (onboarding / tour).

**Auth:** HTTP-only signed session cookie. Demo users:

| Email | Password | Role |
| --- | --- | --- |
| `analyst@signalforge.demo` | `analyst-demo` | analyst |
| `reviewer@signalforge.demo` | `reviewer-demo` | reviewer |
| `po@signalforge.demo` | `po-demo` | product_owner |
| `admin@signalforge.demo` | `admin-demo` | admin |

UI role chips and onboarding persona alone are **not** the security boundary — `PUT /api/state`, `POST /api/state/reset`, and `POST /api/briefs/[id]/transition` enforce permissions server-side.

Onboarding prefs: `GET/PUT /api/prefs` with Zod validation. On server failure the client may fall back to **labelled localStorage** — the UI does not claim server persist when that happens.

## What is mocked / incomplete

- **No live LLM** — Ask Signal is a deterministic keyword matcher
- **No live proprietary APIs** or real-time ingestion
- **No production pharmacovigilance** — safety cases are synthetic and labelled fictional
- Demo credentials are intentionally public
- Evaluation **targets** are illustrative; **fixture runs** are measured against the seed corpus only
- Controlled release gates A–G: see [AUDIT.md](./AUDIT.md) — **most are partial; do not publish as production until met**

## Design

See [DESIGN.md](./DESIGN.md) and `design-tokens.json`. Visual language: **forest green** + **scientific teal**, warm white / pale mint, amber for attention; **Source Serif 4** for marketing headings, **Plus Jakarta Sans** for app UI. Inspired by medical-research biotech homepage UI (Dribbble shot `27696621` — inspiration only; no third-party assets copied). No fake logos, testimonials, or invented stats.

## Run locally

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed         # optional if migrate already seeded
npm run dev             # http://localhost:3847
```

```bash
npm run build
npm start               # also port 3847
npm test
npm run lint
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon Postgres pooled URL |
| `DATABASE_URL_UNPOOLED` | Yes | Neon direct URL for migrations |
| `SESSION_SECRET` | Required on shared deploy | HMAC secret for demo session cookies (≥32 chars) |

## Live deploy

Production: https://signalforge-4gob.vercel.app/

**Readiness:** portfolio demo-ready — **not** pilot-ready or production-ready (see [AUDIT.md](./AUDIT.md)).
