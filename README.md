# SignalForge — Pharma Intelligence Workbench

Evidence-grounded pharmaceutical competitive intelligence workbench (portfolio MVP). SignalForge turns fragmented biomedical, clinical-trial, and regulatory information into **traceable competitive signals**, **reviewable insights**, and **actionable strategic questions**.

**Independent portfolio prototype — not affiliated with Atacana Group.**

Therapeutic focus for this demo: **moderate-to-severe atopic dermatitis**.

Illustrative / demo data only. Not a validated pharmacovigilance system. Not for clinical decision support. Interpretations are hypotheses for human review.

## What is implemented

| Area | Status |
| --- | --- |
| Intelligence overview (`/`) | Working UI + seeded signals |
| Competitive landscape (`/landscape`, `/landscape/[id]`) | Search, filters, sort, verification labels |
| Evidence explorer (`/evidence`, `/evidence/[id]`) | Provenance, review state, add-to-brief |
| Briefs (`/briefs`, `/briefs/[id]`) | Claim-level citations, unsupported warnings, draft → needs-review → approved-for-internal-discussion with confirmation, print/export |
| Ask Signal (`/ask`) | Deterministic seeded matcher — **not a live LLM** |
| Safety (`/safety`) | Synthetic / fictional AE triage → mock human-review queue |
| Governance (`/governance`) | Checklist + audit log |
| Evaluation (`/evaluation`) | Mock evaluation centre (illustrative metrics) |
| Delivery (`/delivery`) | PO backlog, milestones, change requests + decision log |
| Persistence | **SQLite via Prisma** (`prisma/dev.db`) with migrations + seed |

## Database choice

**Prisma 6 + SQLite** (local file `prisma/dev.db`).

- Supabase MCP listed unrelated projects only (no SignalForge project).
- Neon MCP required authentication.
- SQLite keeps the demo fully runnable offline with real models, relationships, and migrations.

Schema covers: sources, assets, evidence, signals, briefs, claims, claim–evidence links, evaluation cases, backlog, milestones, change requests, safety flags, audit events, usage events, and app meta.

On first API load, if `AppMeta` is missing, the atopic dermatitis corpus is seeded automatically. `POST /api/state/reset` re-seeds from the TypeScript seed modules. Client store hydrates via `GET /api/state` and debounced `PUT /api/state`.

## What is mocked / incomplete (production readiness)

- **No live LLM** — Ask Signal is a deterministic keyword matcher over the seeded corpus
- **No live proprietary APIs** or real-time ingestion
- **No production pharmacovigilance** — safety cases are synthetic and clearly labelled fictional
- **No auth / multi-user RBAC** — demo actor labels only (`demo.user`, `demo.reviewer`)
- **No compliance certification claims** — governance is a checklist + audit log mock
- Evaluation pass rates and targets are **illustrative demo metrics**
- One pipeline asset (`SIGFOR-101`) is **clearly labelled fictional / unverified**
- Client store mirrors server state via full-document sync (not fine-grained APIs)

## Architecture notes (from PRD)

- Citations attach to **claim–evidence links**, not whole briefs
- Material claims without evidence links show an **unsupported** warning
- A brief cannot be labelled fully evidence-supported if material claims lack sources
- Ask Signal **abstains** when evidence is insufficient
- Demo metrics are labelled illustrative

## Run locally

```bash
npm install
cp .env.example .env   # DATABASE_URL="file:./dev.db"
npx prisma migrate dev
npm run db:seed         # optional if migrate already seeded
npm run dev             # http://localhost:3847
```

```bash
npm run build
npm start               # also port 3847
```

### Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed AD corpus |
| `npm run db:reset` | Reset DB + re-seed |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | SQLite URL, e.g. `file:./dev.db` (relative to `prisma/`) |

No LLM API keys. No secrets required for the demo.

## Design notes

Visual language: clinical green accents, pale mint surfaces, white panels, Fraunces + Source Sans 3. Inspired by premium biotech product UI (inspiration only — no third-party assets copied).

## Out of scope

Production PV systems, live proprietary data feeds, claiming regulatory/compliance certification, patient-specific treatment advice.
