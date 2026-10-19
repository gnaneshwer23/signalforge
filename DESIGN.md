# SignalForge Visual System

**Inspiration:** [Pharma Biotech Website UI/UX — Medical research homepage](https://dribbble.com/shots/27696621-Pharma-Biotech-Website-UI-UX-Medical-research-homepage-design) (shot `27696621`, Luminara-style medical research concept).  
**Adaptation only** — do **not** copy shot assets, photography, 3D illustrations, logo, copy, or brand name.

**Scope:** Enterprise pharma AI workbench (Overview, Landscape, Evidence, Briefs, Ask Signal, Safety, Governance, Evaluation, Delivery). Apply consistently across **all** screens.

**Source notes (2026-10-19):** Dribbble antibot blocked direct HTML fetch. Visual direction extracted from a rendered shot capture (thum.io) plus pixel sampling: soft sage mint fields, white content planes, near-black charcoal CTAs, airy whitespace, large soft radii on marketing cards. Machine-readable tokens: [`design-tokens.json`](./design-tokens.json).

---

## Design intent

Clean-room medical research: pale sage atmosphere, white work surfaces, charcoal authority for primary actions, restrained chrome. Feels like a regulated intelligence bench — not a marketing landing clone and not a purple SaaS template.

| Landing-page cue (reference) | Workbench adaptation (SignalForge) |
| --- | --- |
| Full-bleed hero + lab photography / glass 3D | Soft sage wash behind shell; no stock photos or copied 3D |
| Large marketing stats | Compact metric row / `DemoMetric` — large number, tiny uppercase label |
| Soft floating cards (large radius) | Prefer **non-cards**; interactive panels use hairline borders + moderate radius (`10–12px`) |
| Pill / dark CTAs | Soft rectangle charcoal CTAs (`8–10px` radius) — avoid `rounded-full` pills |
| Decorative scientific art | Real product UI only; no copied illustrations |

---

## Color tokens

### Surfaces & brand

| Token | Hex | Role |
| --- | --- | --- |
| `--sf-paper` | `#F5F8F4` | Cool sage-tinted paper (not warm cream) |
| `--sf-background` | `#E8F0E4` | App background / sage field |
| `--sf-surface` | `#FFFFFF` | Panels, tables, drawers |
| `--sf-surface-muted` | `#DDE8D8` | Hover rows, muted wells |
| `--sf-sage` | `#B5C9AF` | Accent wash, chip fills (sampled ~`#B1C5AB`) |
| `--sf-ink` | `#161A18` | Primary text / brand ink |
| `--sf-muted` | `#5A6B62` | Secondary text |
| `--sf-border` | `#C9D6C8` | Hairline borders |
| `--sf-primary` | `#1A1B22` | Charcoal — CTAs, active nav (shot CTA treatment) |
| `--sf-primary-foreground` | `#F5F8F4` | On primary |
| `--sf-primary-deep` | `#0D0E12` | Hover / pressed primary |
| `--sf-accent-signal` | `#3F6B4F` | Links, verified, scientific accent (deeper sage) |
| `--sf-ring` | `#3F6B4F` | Focus ring |

### Status (verification & review)

| Token | Hex | Meaning |
| --- | --- | --- |
| `--sf-verified` | `#3F6B4F` | Verified source / approved |
| `--sf-verified-bg` | mix 12% verified on white | Chip / row tint |
| `--sf-needs-review` | `#B45309` | Needs human review |
| `--sf-needs-review-bg` | mix 14% amber on white | Chip tint |
| `--sf-unverified` | `#5A6B62` | Unverified / incomplete provenance |
| `--sf-unverified-bg` | `#DDE8D8` | Neutral muted chip |
| `--sf-danger` | `#B42318` | Safety / destructive / hard fail |
| `--sf-danger-bg` | mix 10% danger on white | Alert strip |

Avoid purple, neon glow, and high-chroma gradients. Atmosphere = soft sage field + white panels — not dark mode. Prefer cool sage paper over warm cream editorial tropes.

---

## Typography

Avoid Inter, Roboto, Arial, and system UI stacks.

| Role | Recommendation | Fallback chain | Notes |
| --- | --- | --- | --- |
| **Display / brand** | **Sora** (Google Fonts) | `ui-sans-serif, sans-serif` | Hero-level **SignalForge** wordmark; geometric modern sans matching research-homepage energy. |
| **Body / UI** | **Plus Jakarta Sans** | `ui-sans-serif, sans-serif` | Tables, forms, nav, body. |
| **Mono / IDs** | **Geist Mono** | `ui-monospace, monospace` | Evidence IDs, claim keys, audit timestamps. |

### Type scale (workbench)

| Use | Size | Weight | Tracking |
| --- | --- | --- | --- |
| Brand wordmark | `1.5–1.75rem` | 600 | `-0.03em` |
| Page title (H1) | `1.5–1.75rem` | 600 | `-0.025em` |
| Section title (H2) | `1.125rem` | 600 | `-0.015em` |
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
| `--radius` | `10px` (`0.625rem`) | Default controls & panels (marketing radii dialed down) |
| `--radius-sm` | `6px` | Chips, dense badges |
| `--radius-lg` | `12–14px` | Drawers, dialogs only |
| Border | `1px solid var(--sf-border)` | Prefer border over shadow |
| Shadow | `0 1px 2px rgb(22 26 24 / 0.05)` | Optional lift on open sheets only — no multi-layer glow |

**Do not** use `rounded-full` pills for primary CTAs or nav. Status chips may use slight rounding (`rounded-md`), not stadium pills.

---

## Component patterns

### Navigation

- Left sidebar (desktop): pale sage/sidebar wash, hairline right border.
- Brand: **SignalForge** in display font as the strongest first signal; subtitle “Pharma Intelligence Workbench” in muted meta.
- Active item: solid charcoal fill + light text (reference CTA language).
- Soft sage left rail / hover wash for inactive items.
- Mobile: sheet drawer from left; same link list.

### Hero / overview treatment

Workbench “hero” = composition, not marketing:

1. Brand already in nav  
2. One page headline  
3. One short supporting sentence  
4. One primary CTA group (e.g. Open Landscape / Ask Signal)  
5. Optional soft sage atmosphere — **no** inset media cards, floating badges, or copied photography  

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
| Verified | Deep sage text + pale verified bg + soft border |
| Needs review | Amber text + pale amber bg |
| Unverified | Muted text + muted bg |
| Danger / fictional AE | Danger text + pale danger bg; always explicit wording |
| Provenance lifecycle | Unverified / Source located / Evidence reviewed / Supported / Conflicting / Insufficient — see `src/lib/provenance/status.ts` |

### Shell chrome

- Breadcrumbs under header
- Global search (assets, evidence, signals, briefs) — functional, not decorative
- Demo-data indicator always visible
- Reset demo control gated to admin role (dead for other roles)

### CTAs

- **Primary:** charcoal fill, light text, `10px` radius, no glow.
- **Secondary:** white/sage fill + border.
- **Ghost:** text + hover accent wash.
- Links / scientific accent: `--sf-accent-signal`.
- One primary per section.

### Drawers / sheets

- Right or left sheet for evidence detail, brief claim review, walkthrough.
- White surface, hairline edge, restrained shadow.
- Title in display or semibold sans; body Plus Jakarta Sans.
- Footer actions: secondary + primary, right-aligned.

### Alerts / disclaimer

- Persistent disclaimer banner: muted sage strip — never alarming red for routine compliance copy.
- Safety fiction cases use danger / amber-review tokens.

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
| `src/app/layout.tsx` | Load Sora + Plus Jakarta Sans (+ mono) |
| UI surfaces | Apply `surface-panel`, status badges, nav active styles across all routes |

---

## Non-goals

- Copying Luminara / shot naming, logo, photography, or 3D art  
- Dark-mode-first chrome  
- Purple / indigo SaaS gradients  
- Warm cream + terracotta editorial tropes  
- Marketing pill clusters, floating promo badges, multi-shadow cards  
- Glassmorphism overlays in the workbench chrome  

---

## Checklist for redesign agent

- [x] All workbench routes share the same surface / primary / status tokens  
- [x] SignalForge wordmark remains the strongest brand signal in the shell  
- [x] Status chips encode verified / needs-review / unverified / danger  
- [x] Tables and drawers feel clinical and quiet  
- [x] At least two of the three motions ship; honor reduced motion  
- [x] No shot assets or branding  
