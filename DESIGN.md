# EveryMoment Design Brief

## Tone & Aesthetic
Editorial, minimalist. Dignified memory curation — focused on human moments, not interface chrome. Refined simplicity inspired by editorial photography: clean compositions, generous whitespace, content as the focal point.

## Color Palette
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `0.98 0 0` | `0.14 0 0` | Page canvas |
| Foreground | `0.15 0 0` | `0.95 0 0` | Primary text |
| Card | `0.99 0 0` | `0.18 0 0` | Media cards, containers |
| Primary/Accent | `0.32 0 0` | `0.82 0 0` | Buttons, active states, CTAs (warm charcoal) |
| Muted | `0.92 0 0` | `0.20 0 0` | Secondary backgrounds, disabled states |
| Border | `0.88 0 0` | `0.25 0 0` | Subtle dividers, card edges |
| Destructive | `0.54 0.18 22` | `0.65 0.18 22` | Removals, rejections (warm red) |
| Success | `0.65 0.16 142` | `0.58 0.14 142` | RSVP confirmations (desaturated green) |

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | General Sans (medium) | Moment titles, headings, hero text |
| Body | DM Sans (regular) | UI labels, descriptions, system text |
| Mono | Geist Mono | Timestamps, share links, technical info |

## Spacing & Density
- `--radius: 0.5rem` (8px) — cards, inputs, buttons (soft but not rounded)
- Generous margins and padding (breathing room)
- Touch targets: 48px minimum (mobile-first)
- Card-based layouts with consistent gutters

## Elevation & Depth
- **Header/Nav**: Sticky, subtle `bg-card` + `border-b` (light divider, no shadow)
- **Main Content**: `bg-background` — open, breathable
- **Cards**: `bg-card` with `1px border` in `oklch(var(--border))` — individual media cards are focal point
- **Buttons**: Grayscale `bg-muted` on light, darker variants on dark; accent color on `:hover`/`:active`
- **Sidebar**: Inherit from header or `bg-muted/20` for hierarchy
- **Footer**: Sticky or bottom-adhering, `bg-muted/40`

## Structural Zones
| Zone | Treatment |
|------|-----------|
| Header/Navigation | Sticky, card-colored background, 1px bottom border, no shadow |
| Main Content Area | Background color canvas, full-bleed media cards |
| Card/Media Feed | Bordered containers with 8px radius, consistent gutter spacing |
| Action Buttons | Muted background; accent color only on interactive states (:hover/:active) |
| Footer/Bottom Nav | Muted background, higher opacity, border-top for separation |

## Component Patterns
- Cards: Uniform border radius (8px), subtle 1px border
- Buttons: 48px+ touch target; hover state changes background to primary or accent
- Input/Textarea: Border focus state with ring in primary color
- Modals: Card on overlay, centered, no excessive shadow, focus on content
- Avatar/Profile Pic: 32px–48px, full-circle border-radius
- Status Indicators: Success (green), destructive (red), neutral (grey)
- RSVP Badges: Display attending/maybe/not-attending with semantic color (success/warning/muted)
- **Event Pass Modal**: Centered dark card, QR code focal point, minimal text
- **Editable Profile**: Card-style form sections (basic info, socials list, payment details), add/remove buttons
- **Explore Filter Bar**: Compact row with date input, tag chips, "Near Me" button; removable tags
- **Share Section**: Copy-link button with success feedback, collapsible QR container, prioritized tabs (Memories/Media/People)

## Motion
Single, consistent transition: `cubic-bezier(0.4, 0, 0.2, 1)` at 0.3s for all interactive elements. No bounce, no easing delays. Subtle fade-in for modals and overlays.

## Signature Detail
**"Moments live in time"** — Chronological framing embedded in every interaction. Media feeds display reverse-chronological (newest first). Moment creation emphasizes date/time as primary metadata. Social actions (following, RSVP) preserve the moment's narrative. Timeline-based UX reinforces memory-capture story.

**New Feature Patterns (v2)**:
- **Event Pass**: QR-only modal confirming attendance; scanning reveals username, RSVP time, event date, status
- **Profile Editing**: Flexible payment details (PayPal, wallet, Revolut, etc.) as label/value pairs; multiple socials; live edit without intermediate save
- **Explore Filters**: Compact filter bar with date range, tag chips (removable), "Near Me" button (user-triggered location only)
- **Share Redesign**: Copy-link button with success feedback replaces full URL display; QR collapses by default; Memories/Media/People tabs prioritized

## Anti-patterns to Avoid
- ❌ No gradients, no decorative blurs, no ambient orbs
- ❌ No rainbow color palettes; only grayscale + two accent colors (red, green)
- ❌ No uniform rounded-lg everywhere; vary radius intentionally
- ❌ No default Tailwind shadows; depth via elevation zones only
- ❌ No scattered animations; all motion follows single choreography

## Constraints
- Mobile-first responsive design (breakpoints: sm, md, lg)
- Dark mode: intentional, not inverted lightness; tune L and C separately
- Backend-driven color for semantic state (no client guessing)
- Accessibility: WCAG AA+ contrast verified in both modes
