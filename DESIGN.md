# SignalForge Visual System

**Inspiration:** [Bionil — Pharma Factory Landing page](https://dribbble.com/shots/22558925-Bionil-Pharma-Factory-Landing-page) (Artiflow UI/UX Agency, shot `22558925`).  
**Adaptation only** — do **not** copy Bionil assets, illustrations, logo, copy, or brand name.

**Scope:** Enterprise pharma AI workbench (Overview, Landscape, Evidence, Briefs, Ask Signal, Safety, Governance, Evaluation, Delivery). Apply consistently across **all** screens.

**Source notes (2026-10-19):** Dribbble serves a bot/login wall to automated fetches. Guidance below synthesizes (1) shot metadata + Artiflow healthcare/pharma landing patterns, (2) clinical biotech UI conventions matching the shot’s stated category, and (3) SignalForge product constraints (dense workbench, status semantics, human-review workflows). Machine-readable tokens: [`design-tokens.json`](./design-tokens.json).

---

## Design intent

Clean-room clinical biotech: sterile surfaces, deep clinical green authority, pale mint atmosphere, generous whitespace, restrained chrome. Feels like a regulated intelligence bench — not a marketing dashboard and not a purple SaaS template.

| Landing-page cue (reference) | Workbench adaptation (SignalForge) |
| --- | --- |
| Full-bleed hero + photography | Soft mint wash behind shell; brand + one page title + short purpose line |
| Large marketing stats | Compact metric row / `DemoMetric` — large number, tiny uppercase label |
| Soft floating cards | Prefer **non-cards**: hairline borders or open sections; cards only for interactive containers |
| Pill CTAs | Soft rectangle CTAs (`6–8px` radius) — avoid `rounded-full` pills |
| Decorative factory art | Real product UI only; no copied illustrations |

---

## Color tokens

### Surfaces & brand

| Token | Hex | Role |
| --- | --- | --- |
| `--sf-paper` | `#F4FAF7` | Pale mint page wash / paper |
| `--sf-background` | `#EEF7F2` | App background |
| `--sf-surface` | `#FFFFFF` | Panels, tables, drawers |
| `--sf-surface-muted` | `#E4F2EB` | Hover rows, muted wells |
| `--sf-mint` | `#D8EFE6` | Accent wash, chip fills |
| `--sf-ink` | `#14352C` | Primary text / brand ink |
| `--sf-muted` | `#4A6B5F` | Secondary text |
| `--sf-border` | `#C5DDD2` | Hairline borders |
| `--sf-primary` | `#0F6B52` | Clinical green — CTAs, active nav, links |
| `--sf-primary-foreground` | `#F4FAF7` | On primary |
| `--sf-primary-deep` | `#0A4A3A` | Hover / pressed primary |
| `--sf-ring` | `#0F6B52` | Focus ring |

### Status (verification & review)

| Token | Hex | Meaning |
| --- | --- | --- |
| `--sf-verified` | `#0F6B52` | Verified source / approved |
| `--sf-verified-bg` | mix 12% verified on white | Chip / row tint |
| `--sf-needs-review` | `#B45309` | Needs human review |
| `--sf-needs-review-bg` | mix 14% amber on white | Chip tint |
| `--sf-unverified` | `#4A6B5F` | Unverified / incomplete provenance |
| `--sf-unverified-bg` | `#E4F2EB` | Neutral muted chip |
| `--sf-danger` | `#B42318` | Safety / destructive / hard fail |
| `--sf-danger-bg` | mix 10% danger on white | Alert strip |

Avoid purple, neon glow, and high-chroma gradients. Atmosphere = soft mint radial wash + white panels — not dark mode.

---

## Typography

Avoid Inter, Roboto, Arial, and system UI stacks.

| Role | Recommendation | Fallback chain | Notes |
| --- | --- | --- | --- |
| **Display / brand** | **Fraunces** (Google Fonts) | `ui-serif, Georgia, serif` | Hero-level **SignalForge** wordmark; page H1 sparingly. Optical size / soft contrast preferred. |
| **Body / UI** | **Source Sans 3** | `ui-sans-serif, sans-serif` | Tables, forms, nav, body. |
| **Mono / IDs** | **IBM Plex Mono** or **Geist Mono** | `ui-monospace, monospace` | Evidence IDs, claim keys, audit timestamps. |

**Alternate expressive pair** (if swapping later): **Newsreader** (display) + **Manrope** (body).

### Type scale (workbench)

| Use | Size | Weight | Tracking |
| --- | --- | --- | --- |
| Brand wordmark | `1.5–1.75rem` | 600 | `-0.02em` |
| Page title (H1) | `1.375–1.5rem` | 600 | `-0.02em` |
| Section title (H2) | `1.125rem` | 600 | `-0.01em` |
| Body | `0.875–0.9375rem` | 400 | `0` |
| Meta / eyebrow | `0.6875rem` | 500 | `0.12–0.14em` uppercase |
| Metric value | `1.5–1.75rem` display | 600 | `-0.02em` |

Line length for prose: ~65–75ch. Tables stay compact; do not enlarge body to “marketing” sizes.

---

## Spacing, radius, border, shadow

| Token | Value | Guidance |
| --- | --- | --- |
| Spacing base | `4px` | Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 |
| Page padding | `16–32px` | `px-4 sm:px-6 lg:px-8` |
| Section gap | `24–32px` | One purpose per section |
| `--radius` | `6px` (`0.375rem`) | Default controls & panels |
| `--radius-sm` | `4px` | Chips, dense badges |
| `--radius-lg` | `8–10px` | Drawers, dialogs only |
| Border | `1px solid var(--sf-border)` | Prefer border over shadow |
| Shadow | `0 1px 2px rgb(20 53 44 / 0.04)` | Optional lift on open sheets only — no multi-layer glow |

**Do not** use `rounded-full` pills for primary CTAs or nav. Status chips may use slight rounding (`rounded-md`), not stadium pills.

---

## Component patterns

### Navigation

- Left sidebar (desktop): pale mint/sidebar wash, hairline right border.
- Brand: **SignalForge** in display font as the strongest first signal; subtitle “Pharma Intelligence Workbench” in muted meta.
- Active item: solid clinical green fill + light text (not underline-only).
- Mobile: sheet drawer from left; same link list.

### Hero / overview treatment

Workbench “hero” = composition, not marketing:

1. Brand already in nav  
2. One page headline  
3. One short supporting sentence  
4. One primary CTA group (e.g. Open Landscape / Ask Signal)  
5. Optional soft mint atmosphere — **no** inset media cards, floating badges, or stat strips competing in the first viewport  

Stats belong in a **second** band as open metric tiles (border + white fill), large display numbers, uppercase demo labels.

### Cards vs non-cards

- **Default: no cards.** Sections with heading + content on the page wash.
- Use bordered white panels (`surface-panel`) when the region is an **interactive** unit (filterable table, review queue item, form).
- If removing border/background/radius doesn’t hurt comprehension, remove it.

### Tables

- White surface, hairline header bottom border.
- No zebra by default; hover = `--sf-surface-muted`.
- Compact row padding (`py-2.5–3`); status chips inline.
- Sticky header optional on long evidence lists.

### Chips / labels

| Kind | Style |
| --- | --- |
| Verified | Green text + pale verified bg + soft green border |
| Needs review | Amber text + pale amber bg |
| Unverified | Muted text + muted bg |
| Danger / fictional AE | Danger text + pale danger bg; always explicit wording |
| Provenance lifecycle | Unverified / Source located / Evidence reviewed / Supported / Conflicting / Insufficient — see `src/lib/provenance/status.ts` |

Keep labels short; icon optional (BadgeCheck / CircleAlert / CircleHelp / Link2 / Scale).

### Shell chrome

- Breadcrumbs under header
- Global search (assets, evidence, signals, briefs) — functional, not decorative
- Demo-data indicator always visible
- Reset demo control gated to admin role (dead for other roles)

### CTAs

- **Primary:** `--sf-primary` fill, light text, `6px` radius, no glow.
- **Secondary:** white/mint fill + border.
- **Ghost:** text + hover accent wash.
- One primary per section.

### Drawers / sheets

- Right or left sheet for evidence detail, brief claim review, walkthrough.
- White surface, hairline edge, restrained shadow.
- Title in display or semibold sans; body Source Sans 3.
- Footer actions: secondary + primary, right-aligned.

### Alerts / disclaimer

- Persistent disclaimer banner: muted mint strip or soft amber if cautionary — never alarming red for routine compliance copy.
- Safety fiction cases use danger tokens.

---

## Motion (2–3 restrained animations)

Workbench motion = presence, not spectacle. Prefer `prefers-reduced-motion: reduce` → opacity-only or off.

1. **`rise-in`** — content panels fade + translateY `8px` → `0` over `~450ms` ease-out on route enter.  
2. **`slide-nav`** — sidebar links stagger opacity + translateX `6px` (`~30ms` delay steps).  
3. **`fade-delay`** — secondary band (metrics / tables) opacity fade `~550ms` with `120ms` delay.

Optional micro: button/hover background `150–200ms`; sheet enter `200–250ms` ease-out. **No** parallax, bounce, or glow pulses.

---

## Implementation map

| Artifact | Action |
| --- | --- |
| `design-tokens.json` | Canonical token values for Theme / CSS generation |
| `src/app/globals.css` | Map tokens → CSS variables (`--background`, `--primary`, status helpers, keyframes) |
| `src/app/layout.tsx` | Load Fraunces + Source Sans 3 (+ mono) |
| UI surfaces | Apply `surface-panel`, status badges, nav active styles across all routes |

**Concurrency note:** A redesign agent may already be editing theme files. Prefer reading this doc + `design-tokens.json` over racing CSS edits.

---

## Non-goals

- Copying Bionil naming, logo, photography, or illustration  
- Dark-mode-first chrome  
- Purple / indigo SaaS gradients  
- Dense newspaper layouts or cream+terracotta editorial tropes  
- Marketing pill clusters, floating promo badges, multi-shadow cards  

---

## Checklist for redesign agent

- [ ] All workbench routes share the same surface / primary / status tokens  
- [ ] SignalForge wordmark remains the strongest brand signal in the shell  
- [ ] Status chips encode verified / needs-review / unverified / danger  
- [ ] Tables and drawers feel clinical and quiet  
- [ ] At least two of the three motions ship; honor reduced motion  
- [ ] No Bionil assets or branding  
