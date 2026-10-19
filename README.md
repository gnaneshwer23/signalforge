# SignalForge — Pharma Intelligence Workbench

Evidence-grounded pharmaceutical competitive intelligence workbench (portfolio MVP). SignalForge turns fragmented biomedical, clinical-trial, and regulatory information into **traceable competitive signals**, **reviewable insights**, and **actionable strategic questions**.

**Independent portfolio prototype — not affiliated with Atacana Group.**

Therapeutic focus for this demo: **moderate-to-severe atopic dermatitis**.

## What it is

A Next.js App Router workbench with:

- Intelligence overview, competitive landscape, evidence explorer
- Intelligence briefs with claim-level citations and review workflow
- Ask Signal (deterministic seeded matcher — not a live LLM)
- Synthetic / fictional AE triage (mock human-review queue only)
- Governance checklist + audit log
- AI evaluation centre (illustrative mock runs, not production benchmarks)
- Product Owner delivery workspace (backlog, milestones, change requests)

Mutable demo state lives in a client store and persists to `localStorage`. There is **no database, auth, live LLM, or external API integration**.

## Run locally

```bash
npm install
npm run dev
```

Dev server defaults to **http://localhost:3847**.

```bash
npm run build
npm start -- --port 3847
```

## Demo limits

- Seeded corpus only (AD assets + one clearly labelled fictional pipeline record)
- Records without a direct source URL stay `unverified`
- Interpretations are hypotheses for human review
- One safety case is explicitly fictional; no external PV system contact
- Ask Signal abstains when evidence is insufficient; no patient-specific advice
- Sample metrics are labelled **illustrative demo data**
- Out of scope: live ingestion/RAG, enterprise RBAC, production PV, proprietary APIs

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui
