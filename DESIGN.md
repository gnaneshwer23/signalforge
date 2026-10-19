# SignalForge Visual System — Chlorophyll Clinical

**Inspiration (not copied):**  
[Pharma Biotech medical-research homepage](https://dribbble.com/shots/27696621-Pharma-Biotech-Website-UI-UX-Medical-research-homepage-design) · [Bionil Pharma Factory landing](https://dribbble.com/shots/22558925-Bionil-Pharma-Factory-Landing-page)

Adaptation only — do **not** copy shot assets, photography, 3D art, layouts, logo, or copy.

**Scope:** One design system for **public marketing** and **authenticated workbench**. Machine-readable tokens: [`design-tokens.json`](./design-tokens.json) (v4).

---

## Design intent

Premium scientific SaaS: deep **forest green** authority, **scientific teal** accents, warm white / pale mint atmosphere, charcoal/ink type, **amber only for warnings**. Marketing uses editorial serif for display headlines; the workbench is calm, clinical, and data-dense with geometric sans.

| Cue | SignalForge adaptation |
| --- | --- |
| Biotech homepage hero | Full-bleed mint/forest atmosphere + **live ProductPreview** |
| Soft marketing cards | Prefer **non-cards**; interactive panels use hairline borders |
| Dark CTAs | Forest green primary — never `rounded-full` pills |
| Decorative scientific art | Real product UI only; no fake logos/testimonials/stats |

---

## Color tokens

| Token | Hex | Role |
| --- | --- | --- |
| `--sf-paper` / `--paper` | `#F4F8F5` | Warm white / pale mint paper |
| `--background` | `#E6F0EA` | App / page field |
| `--mint` | `#E3F2EB` | Soft wash / hero atmosphere |
| `--card` | `#FFFFFF` | Panels, tables, drawers |
| `--muted` | `#D5E6DB` | Hover rows, muted wells |
| `--forest` / `--primary` | `#0B3A2C` | Brand / primary CTA |
| `--forest-deep` | `#07281E` | Hover / pressed primary |
| `--teal` / `--accent-signal` | `#117A6B` | Scientific accent, links, verified |
| `--ink` / `--foreground` | `#101F18` | Primary text |
| `--muted-foreground` | `#4A5E54` | Secondary text |
| `--border` | `#BFD4C8` | Hairline borders |
| `--amber-review` | `#A85708` | Attention / needs review only |
| `--verified` | `#117A6B` | Verified / supported |
| `--destructive` | `#A61E14` | Safety / destructive |

Avoid purple, neon glow, cream+terracotta, and high-chroma gradients.

---

## Typography

Avoid Inter, Roboto, Arial, and system UI stacks.

| Role | Face | Usage |
| --- | --- | --- |
| **Display** | Source Serif 4 | Marketing H1/H2 and public/app **brand wordmark only** |
| **Body / UI** | Plus Jakarta Sans | Workbench titles, tables, forms, nav, body |
| **Mono** | Geist Mono | Evidence IDs, claim keys, timestamps |

**Rule:** Do not apply display serif to workbench page or section titles. Use `font-display` only for marketing display and brand marks.

### Type scale

| Use | Size | Weight | Tracking |
| --- | --- | --- | --- |
| Marketing hero H1 | `2.5–3.25rem` display | 600 | `-0.02em` |
| Brand wordmark | `1.5–1.75rem` display | 600 | `-0.02em` |
| Workbench page title | `1.5–1.75rem` sans | 600 | `-0.02em` |
| Section title | `1.125–1.25rem` sans | 600 | `-0.01em` |
| Body | `0.875–1rem` | 400 | `0` |
| Meta / eyebrow | `0.6875rem` | 500 | `0.12em` uppercase |

---

## Spacing, radius, border, shadow

| Token | Value | Guidance |
| --- | --- | --- |
| Spacing base | `4px` | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 |
| Page padding | `16–32px` | `px-4 sm:px-6 lg:px-8` |
| `--radius` | `8px` | Controls & panels |
| Border | `1px solid var(--border)` | Prefer border over shadow |
| Shadow | `0 1px 2px rgb(11 58 44 / 0.05)` | Sheets only — no glow |

**Do not** use `rounded-full` pills for primary CTAs or status badges.

---

## Components

- **Buttons** — forest primary, outline secondary; focus ring teal; radius md
- **Inputs** — hairline border, teal focus ring, white/paper fill
- **Tables** — hairline header, muted hover, horizontal scroll on mobile
- **Cards** — only for interactive units (`surface-panel`)
- **Badges** — `rounded-md` (sm); variants: verified / needs-review / unverified / danger
- **Page headers** — sans title in workbench; eyebrow + description + actions
- **Empty / loading / error** — `surface-panel` with clear hierarchy

---

## Shells

### Marketing

- Top nav: Platform, Solutions, Methodology, About + Demo / Start CTAs
- Brand: **SignalForge** in Source Serif 4 as strongest first-viewport signal
- Hero budget: brand, one headline, one support line, one CTA group, one live preview
- No fake logos, testimonials, or invented statistics

### Workbench

- Left sidebar: pale mint wash, hairline right border
- Active nav: solid forest fill + light text
- Serif only on the wordmark; all page titles use Plus Jakarta Sans
- Persistent disclaimer + demo-data indicator
- Density for tables; readable evidence cards; provenance chips; mobile sheet nav

---

## Motion

Honor `prefers-reduced-motion: reduce` → opacity-only.

1. **`rise-in`** — fade + translateY `6px` → `0` (~400ms)
2. **`slide-nav`** — sidebar stagger (~25ms steps)
3. **`fade-delay`** — secondary band (~500ms, 100ms delay)

---

## Implementation map

| Artifact | Role |
| --- | --- |
| `design-tokens.json` | Canonical values |
| `src/app/globals.css` | CSS variables + utilities + keyframes |
| `src/app/layout.tsx` | Source Serif 4 + Plus Jakarta Sans + Geist Mono |
| `src/components/marketing/*` | Public shell |
| `src/components/layout/*` | App shell |
| `src/components/ui/*` + `shared/*` | Reusable primitives |

---

## Non-goals

- Copying shot naming, logo, photography, or layouts  
- Fake logos, testimonials, or vanity metrics  
- Purple/indigo SaaS clichés; cream + terracotta editorial tropes  
- Broadsheet newspaper chrome; glassmorphism overload  
- Claiming regulatory compliance or production readiness  

---

## Checklist

- [x] Forest green + scientific teal tokens shared across public + app  
- [x] Editorial serif for marketing headlines / brand only; sans for UI  
- [x] Status chips: verified / needs-review / unverified / danger (no stadium pills)  
- [x] Reduced-motion honored  
- [x] No shot assets or branding  
