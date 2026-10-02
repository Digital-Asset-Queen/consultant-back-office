# Design Brief: Consultant Back Office

## Direction
Quiet authority. A private, professional back office for independent consultants. Warm parchment content area, deep charcoal text, muted ink blue accents. Restrained, trustworthy, operationally stable. Feels like a premium notebook or high-end financial tool — nothing performed, nothing flashy.

## Tone
Calm, measured, serious. Professional but not corporate. Private tool for private use — no exuberance, no startup energy. Every choice reflects trust and operational clarity.

## Colour Palette
| Token | OKLCH | Purpose |
|-------|-------|----------|
| background | 0.951 0.008 85.7 | Off-white parchment content area |
| foreground | 0.2 0.01 75 | Deep charcoal body text |
| primary | 0.22 0.01 75 | Dark charcoal buttons & elements |
| accent | 0.38 0.038 225 | Muted ink blue accents & highlights |
| success | 0.519 0.11 155.6 | Settled green — understated |
| warning | 0.588 0.118 52.1 | Attention amber — quiet |
| danger | 0.528 0.148 34.5 | Quiet red for overdue/lost |
| sidebar | 0.16 0.005 0 | Deep charcoal nav anchor |
| sidebar-accent | 0.38 0.038 225 | Muted ink blue active highlight |
| border | 0.88 0.01 75 | Light gray subtle dividers |

## Typography
- **Font**: GeneralSans (humanist sans-serif) — single family, two weights: 400 (body), 600 (headings/labels)
- **Scale**: Tight — 0.875rem body, 1.25rem heading, 1.5rem section title
- **Numbers**: Tabular figures for all numeric columns — right-aligned, aligned decimals
- **Line height**: 1.6 body (raised from 1.5 for Thai readability), 1.25 headings

## Bilingual Typography (Thai/English)
- **Approach**: System-font fallback chain — no bundled Thai web font (network downloads blocked)
- **Fallback order**: GeneralSans → Noto Sans Thai → Leelawadee UI → Sukhumvit Set → Thonburi → Tahoma → system-ui
- **Coverage**: Leelawadee UI (Windows), Sukhumvit Set (macOS/iOS), Noto Sans Thai (Android/Linux), Tahoma (cross-platform)
- **Thai word-breaking**: `html[lang='th'] body` applies `word-break: break-word` + `overflow-wrap: break-word` (Thai has no inter-word spaces)
- **Line height**: Body raised to 1.6 to accommodate Thai vowel/tone marks above/below the baseline
- **Lang attribute**: `index.html` `lang` updates dynamically to `th`/`en`; selected language persists in localStorage; default is Thai on first visit

## Shell & Layout
| Zone | Details |
|------|----------|
| Header | Full-width, near-white, fixed 4rem, shows app name only |
| Sidebar | Fixed 15rem dark charcoal, icon+label nav, solid muted-blue pill active state |
| Content | Fluid parchment, 1.5rem padding, page title at top |
| Responsive | Sidebar→icon-only rail (3.5rem) on tablet |

## Density & Spacing
- 8px base grid
- Section padding: 1.5rem
- Row height: 2.75rem
- Table row padding: 0.625rem vertical, 0.875rem horizontal
- Cards: 1.25rem padding
- Medium density — readable, not cramped, not spacious

## Component Patterns
- **Buttons**: Dark charcoal solid, white text, instant focus (no transition), 0.375rem radius
- **Active states**: Muted ink blue background or accent border, never bright
- **Badges**: Color-coded (green/amber/red), small, muted opacity
- **Tables**: Subtle dividers, clean borders, 0.375rem radius, no stripe
- **Forms**: Label above input, light focus ring, no placeholder labels
- **Icons**: 18–20px consistent sizing

## Motion
- **Transitions**: Opacity-only, 150ms fade on mount/unmount
- **Inline forms**: max-height + opacity gate (no height animation)
- **Functional state**: Tab indicator, toggle, chevron — opacity fade only
- **Reduced motion**: All transitions→0ms when `prefers-reduced-motion: reduce` enabled
- **Principle**: Motion supports understanding, never performs

## Constraints
- No modals, dialogs, or slide-in panels — inline/in-place only
- Zero layout shift — elements stable during state/content changes
- All values token-backed — no hardcoded colors, spacing, typography
- Opacity-only motion — no scale, slide, bounce, or transforms
- Respects `prefers-reduced-motion` for accessibility
- Named utility classes only — no bracket notation like `text-[color:var(...)]`

## Utility Classes Enforced
text-success, text-warning, text-danger, text-foreground, text-muted-foreground, text-accent, bg-success-subtle, bg-warning-subtle, bg-danger-subtle, bg-accent-subtle, bg-muted, bg-surface-elevated, border-border, page-padding, card-padding, transition-opacity-fast, item-selected, item-unselected, icon-sm, icon-md, icon-lg, z-sticky, z-fixed, z-modal, h-row, w-sidebar, p-page, p-card, gap-form

## Signature
Stable frame (dark sidebar + parchment content) + charcoal text + muted ink blue accents + tight typography + medium density + opacity-only motion = professional, grounded back office that feels trustworthy and private. Every page follows the same tokens and components. No page-level design decisions. Motion is functional and calm. Layouts are stable.
