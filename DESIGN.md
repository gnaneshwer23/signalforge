# SignalForge Visual System

**Inspiration:** [Pharma Biotech Website UI/UX — Medical research homepage](https://dribbble.com/shots/27696621-Pharma-Biotech-Website-UI-UX-Medical-research-homepage-design) (shot `27696621`) plus Bionil-style **forest green / scientific teal** notes.  
**Adaptation only** — do **not** copy shot assets, photography, 3D illustrations, logo, copy, or brand name.

**Scope:** One design system for **public marketing** and **authenticated workbench** (Workspace, Landscape, Evidence, Briefs, Ask Signal, Safety, Governance, Evaluation, Delivery). Machine-readable tokens: [`design-tokens.json`](./design-tokens.json).

---

## Design intent

Clean-room medical research: deep **forest green** authority, **scientific teal** accents, warm white / pale mint atmosphere, amber for items needing attention. Marketing uses editorial serif headlines; the workbench stays calm and clinical with the same palette.

| Cue | SignalForge adaptation |
| --- | --- |
| Biotech homepage hero | Full-bleed mint/forest atmosphere + **live product preview** (not a fake screenshot) |
| Soft marketing cards | Prefer **non-cards**; interactive panels use hairline borders + moderate radius |
| Dark CTAs | Forest green primary (`--sf-primary`) — avoid `rounded-full` pills |
| Decorative scientific art | Real product UI only; no copied illustrations or fake logos/testimonials/stats |

---

## Color tokens

### Surfaces & brand

| Token | Hex | Role |
| --- | --- | --- |
| `--sf-paper` | `#F7FAF6` | Warm white / pale mint paper |
| `--sf-background` | `#E8F2EC` | App / page field |
| `--sf-mint` | `#E8F5EF` | Soft wash / hero atmosphere |
| `--sf-surface` | `#FFFFFF` | Panels, tables, drawers |
| `--sf-surface-muted` | `#D8E8DE` | Hover rows, muted wells |
| `--sf-forest` | `#0F3D2E` | Brand / primary CTA |
| `--sf-forest-deep` | `#0A2E22` | Hover / pressed primary |
| `--sf-teal` | `#1A7A6D` | Scientific accent, links, verified |
| `--sf-ink` | `#14241C` | Primary text |
| `--sf-muted` | `#4F655A` | Secondary text |
| `--sf-border` | `#C5D9CE` | Hairline borders |
| `--sf-primary` | `#0F3D2E` | Forest — CTAs, active nav |
| `--sf-primary-foreground` | `#F7FAF6` | On primary |
| `--sf-accent-signal` | `#1A7A6D` | Teal links / scientific accent |
| `--sf-ring` | `#1A7A6D` | Focus ring |
| `--sf-amber` | `#B45309` | Attention / needs review |

### Status

| Token | Hex | Meaning |
| --- | --- | --- |
| `--sf-verified` | `#1A7A6D` | Verified / supported (teal) |
| `--sf-needs-review` | `#B45309` | Needs human review (amber) |
| `--sf-unverified` | `#4F655A` | Unverified / incomplete |
| `--sf-danger` | `#B42318` | Safety / destructive |

Avoid purple, neon glow, charcoal-as-primary, and high-chroma gradients. Prefer cool mint paper over warm cream editorial tropes.

---

## Typography

Avoid Inter, Roboto, Arial, and system UI stacks.

| Role | Recommendation | Fallback | Notes |
| --- | --- | --- | --- |
| **Display / marketing** | **Source Serif 4** (Google Fonts) | `ui-serif, Georgia, serif` | Major marketing H1/H2 and public brand wordmark |
| **Body / app UI** | **Plus Jakarta Sans** | `ui-sans-serif, sans-serif` | Workbench tables, forms, nav, body |
| **Mono / IDs** | **Geist Mono** | `ui-monospace, monospace` | Evidence IDs, claim keys, timestamps |

### Type scale

| Use | Size | Weight | Tracking |
| --- | --- | --- | --- |
| Marketing hero H1 | `2.25–3rem` display | 600 | `-0.02em` |
| Brand wordmark (public) | `1.5–1.75rem` display | 600 | `-0.02em` |
| Workbench page title | `1.5–1.75rem` | 600 | `-0.025em` |
| Section title | `1.125–1.5rem` | 600 | `-0.015em` |
| Body | `0.875–1rem` | 400 | `0` |
| Meta / eyebrow | `0.6875rem` | 500 | `0.12–0.14em` uppercase |

---

## Spacing, radius, border, shadow

| Token | Value | Guidance |
| --- | --- | --- |
| Spacing base | `4px` | 4 / 8 / 12 / 16 / 24 / 32 / 48 |
| Page padding | `16–32px` | `px-4 sm:px-6 lg:px-8` |
| `--radius` | `10px` | Controls & panels |
| Border | `1px solid var(--sf-border)` | Prefer border over shadow |
| Shadow | `0 1px 2px rgb(15 61 46 / 0.06)` | Sheets only — no glow |

**Do not** use `rounded-full` pills for primary CTAs.

---

## Shells

### Marketing (public)

- Top horizontal nav: Platform, Solutions, Methodology, About, Demo CTA
- Brand: **SignalForge** in Newsreader as the strongest first-viewport signal
- Hero budget: brand, one headline, one supporting sentence, one CTA group, one **live product preview**
- Portfolio disclaimer in footer and where claims could be misread
- No fake logos, testimonials, or invented statistics

### Workbench (app)

- Left sidebar (desktop): pale mint wash, hairline right border
- Active nav: solid forest fill + light text
- Persistent disclaimer banner + demo-data indicator
- Cards only for interactive units

---

## Motion

Prefer `prefers-reduced-motion: reduce` → opacity-only or off.

1. **`rise-in`** — fade + translateY `8px` → `0` (~450ms)
2. **`slide-nav`** — sidebar stagger (~30ms steps)
3. **`fade-delay`** — secondary band (~550ms, 120ms delay)

---

## Implementation map

| Artifact | Action |
| --- | --- |
| `design-tokens.json` | Canonical token values |
| `src/app/globals.css` | CSS variables + keyframes |
| `src/app/layout.tsx` | Load Source Serif 4 + Plus Jakarta Sans (+ mono) |
| Marketing shell | `src/components/marketing/*` |
| App shell | `src/components/layout/*` |

---

## Non-goals

- Copying shot naming, logo, photography, or 3D art  
- Fake logos, testimonials, or vanity metrics  
- Dark-mode-first chrome; purple/indigo SaaS gradients  
- Warm cream + terracotta editorial tropes  
- Claiming regulatory compliance or production readiness  

---

## Checklist

- [x] Forest green + scientific teal tokens shared across public + app  
- [x] Editorial serif for marketing headings; sans for app UI  
- [x] SignalForge wordmark remains the strongest brand signal  
- [x] Status chips encode verified / needs-review / unverified / danger  
- [x] Reduced-motion honored  
- [x] No shot assets or branding  
`}