# SignalForge — Pharma Intelligence Workbench

Evidence-grounded pharmaceutical competitive intelligence workbench (**portfolio prototype**). SignalForge turns fragmented biomedical, clinical-trial, and regulatory information into **traceable competitive signals**, **reviewable insights**, and **actionable strategic questions**.

**Independent portfolio prototype — not affiliated with Atacana Group.**

Therapeutic focus for this demo: **moderate-to-severe atopic dermatitis**.

Illustrative / demo data only. Not a validated pharmacovigilance system. Not for clinical decision support. Interpretations are hypotheses for human review. **Do not treat this build as production-ready or regulatory-compliant** — see [AUDIT.md](./AUDIT.md).

## What is implemented

| Area | Status |
| --- | --- |
| Intelligence overview (`/`) | Search, TA + date filters, illustrative metrics, source distribution, activity, insight→action |
| Competitive landscape (`/landscape`) | Search/filter/sort, MoA/indication/status, evidence links, verification + fictional labels |
| Evidence explorer (`/evidence`) | Full provenance fields, six lifecycle statuses, claim↔evidence links, draft brief add/remove |
| Signal briefs (`/briefs`) | Structure, unsupported gating, confirm approve with actor/time (server transition API), audit, print |
| Ask Signal (`/ask`) | Retrieve-then-cite via `/api/ask` deterministic matcher — **not a live LLM**; abstention + rate limit |
| Safety & governance (`/governance`, `/safety`) | Synthetic AE + mock queue; checklist as requirements-to-validate |
| Evaluation centre (`/evaluation`) | Measured fixture runs vs illustrative targets (labelled separately) |
| Product Owner workspace (`/delivery`) | Backlog + AC validation, milestones, change control, decisions, audit |
| About & demo guide (`/about`) | Honest scope, provenance definitions, mocked vs real |
| Shell | Wordmark, 9-area nav + About, breadcrumbs, global search, demo-data indicator |
| Persistence | **Neon PostgreSQL via Prisma** (`DATABASE_URL` / `DATABASE_URL_UNPOOLED`) |
| Auth | Demo session cookies + **server-side** role checks on persist/reset/brief transitions |

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

Entities include: users (demo), sources (with `provenanceKind`), assets, evidence, claims, claim–evidence links, signals, briefs, brief_reviews, evaluation_cases, evaluation_runs, backlog, milestones, change_requests, audit_events, safety_flags.

**Auth:** HTTP-only signed session cookie. Demo users:

| Email | Password | Role |
| --- | --- | --- |
| `analyst@signalforge.demo` | `analyst-demo` | analyst |
| `reviewer@signalforge.demo` | `reviewer-demo` | reviewer |
| `po@signalforge.demo` | `po-demo` | product_owner |
| `admin@signalforge.demo` | `admin-demo` | admin |

UI role chips alone are **not** the security boundary — `PUT /api/state`, `POST /api/state/reset`, and `POST /api/briefs/[id]/transition` enforce permissions server-side. Audit history is append-merged (clients cannot erase prior audit rows by syncing a reduced array).

If the API is down or the session lacks write permission, the UI enters **local demonstration mode** and does not claim successful production writes.

## What is mocked / incomplete

- **No live LLM** — Ask Signal is a deterministic keyword matcher (API-labelled)
- **No live proprietary APIs** or real-time ingestion
- **No production pharmacovigilance** — safety cases are synthetic and labelled fictional
- Demo credentials are intentionally public — replace before any shared environment
- Evaluation **targets** are illustrative; **fixture runs** are measured against the seed corpus only
- One pipeline asset (`SIGFOR-101`) is **clearly labelled fictional / unverified**
- Discovery URLs ≠ verified claim support (`provenanceKind` + lifecycle status)
- Controlled release gates A–G: see [AUDIT.md](./AUDIT.md) — **most are partial; do not publish as production until met**

## Design

See [DESIGN.md](./DESIGN.md) and `design-tokens.json`. Visual language: clinical green accents, pale mint surfaces, white panels, Fraunces + Source Sans 3. Inspired by premium biotech product UI (inspiration only — no third-party assets copied).

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
npm test                # matcher, permissions, provenance, rate-limit, audit-merge
npm run lint
```

### Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed AD corpus |
| `npm run db:reset` | Reset DB + re-seed |
| `npm test` | Unit tests |
| `npm run lint` | ESLint |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon Postgres pooled URL (`…-pooler…`, with `pgbouncer=true`) |
| `DATABASE_URL_UNPOOLED` | Yes | Neon direct (non-pooler) URL for migrations (Vercel Neon integration name) |
| `SESSION_SECRET` | Recommended | HMAC secret for demo session cookies |

Copy `.env.example` → `.env` and fill in Neon credentials from the Neon console. Do not put connection strings in the client bundle, README, or other tracked files. No LLM API keys.

## Security notes (demo)

- Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, CSP (demo-relaxed), `Permissions-Policy`
- Ask Signal rate-limited in-process (`/api/ask`)
- Prompt-injection style queries abstain without inventing evidence

## Out of scope

Production PV systems, live proprietary data feeds, claiming regulatory/compliance certification, patient-specific treatment advice, auto-deploy to production without gates.

## Live deploy

Portfolio demo URL (may lag `main`): https://signalforge-4gob.vercel.app/

**Readiness:** portfolio demo-ready — **not** pilot-ready or production-ready (see [AUDIT.md](./AUDIT.md)).
