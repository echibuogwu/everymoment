# EveryMoment Design Brief — Liquid Glass

## Direction
Liquid Glass meets Memory App — premium, immersive memory curation with fluid glass morphism surfaces, spring-physics interactions, and scroll-driven parallax that makes every interaction feel alive and connected to content.

## Tone
**Fluid, premium, intentional depth.** Every surface is glass — translucent, layered, with motion that guides attention. Inspired by Apple's 2025 Liquid Glass design language and Pinterest's addictive infinite flow. Dark mode focused, light mode carefully tuned for refined clarity.

## Differentiation
**Scroll reveals depth, not chrome.** Content scrolls behind glass surfaces, parallax cover images drift slower than the page, floating navigation adapts to scroll state. Memory moments feel like opening physical layered objects — not clicking buttons on a flat screen.

## Color Palette
| Token | OKLCH | Role |
|-------|-------|------|
| background | `0.08 0.02 280` / `0.97 0.008 85` | Page canvas — deep purple-to-black (dark) or warm pearl (light) |
| foreground | `0.95 0.01 90` / `0.14 0.01 280` | Primary text — bright near-white (dark) or deep charcoal (light) |
| card | `0.14 0.02 280` / `0.99 0.005 90` | Glass surfaces — frosted containers with 20px blur |
| primary | `0.88 0.01 90` / `0.32 0.04 280` | CTAs, active states — bright on dark, warm charcoal on light |
| accent | `0.72 0.28 280` / `0.65 0.25 280` | Electric indigo — glow, highlights, sparse accents only |
| muted | `0.18 0.01 280` / `0.92 0.01 80` | Secondary backgrounds, disabled, subtle dividers |
| destructive | `0.62 0.2 22` | Removals, rejections (red-orange) |
| success | `0.56 0.15 142` | Confirmations, RSVPs (desaturated green) |

## Typography
- Display: Space Grotesk — bold headlines, moment titles, hero text, high contrast
- Body: Figtree — UI labels, descriptions, content (refined humanist sans)
- Mono: Geist Mono — timestamps, share links, technical info
- Scale: `text-display-xl` hero (5xl/7xl), `text-display-lg` sections (4xl/6xl), `text-display-md` subsections (3xl/5xl), `text-meta` labels (xs/sm uppercase), `text-body` paragraphs (base/lg)

## Elevation & Depth
Glass surfaces layered on gradient backgrounds — no hard shadows. Dark mode: deep plum-to-midnight gradient with glass cards at 20px blur, 5% white background + 12% border. Light mode: warm pearl-to-white gradient with glass cards at 20px blur, 60% white background + 85% border. Navigation floats above content with adaptive blur and opacity on scroll. Cover images parallax at 60-70% of page scroll speed, creating depth illusion.

## Structural Zones
| Zone | Background | Border | Treatment |
|------|-----------|--------|-----------|
| Header/Nav | `glass-nav-dark` / `glass-nav-light` | Subtle 1px glass | Fixed top, sticky on scroll, blurs content beneath |
| Floating Bottom Nav | `glass-nav-dark` / `glass-nav-light` | 1px glass | Floats above bottom edge, shrinks on scroll down, expands on scroll up |
| Main Content | Gradient background, full-bleed | — | Card-based masonry on Explore, full-bleed hero on detail |
| Glass Cards | `glass-card-dark` / `glass-card-light` | 1px glass | Bordered frosted containers, parallax cover images, tap scale feedback |
| Action Buttons | Muted on default, primary on hover | Subtle glass border | 48px+ touch target, spring-physics scale on tap |
| Modals | `glass-modal-dark` / `glass-modal-light` | 1px glass | Centered dark frosted card, backdrop blur overlay, scale-in entrance |

## Spacing & Rhythm
Generous margins with breathing room — 16px gutters on mobile (sm), 24px on tablet (md), 32px desktop (lg). Card spacing consistent across Explore masonry, Memories feed, Media grid. Touch targets 48px minimum (12px padding on 24px base). Staggered entrance animations for list items (60ms delay per item, max 200ms offset).

## Component Patterns
- **Cards**: `glass-card` utility, rounded-lg (8px), 1px glass border, parallax cover images on scroll
- **Buttons**: 48px+ target, `button-spring` scale on active, accent color only on `:hover`/`:active`, grayscale default
- **Modals**: `glass-modal` + `modal-overlay`, centered, scale-in entrance (0.92 → 1), blur-backdrop
- **Memories Feed**: Animated message bubbles sliding in (slide-up), newest at bottom, tap to expand media fullscreen
- **Event Pass Button**: Shimmer pulse when attending, opens QR modal with scale-spring entrance
- **Profile Editable**: Inline editing, glass input fields, add/remove buttons for payment details, no intermediate save
- **Explore Filters**: Compact glass pill filter bar (date range, tag chips, "Near Me" button), removable tags
- **Share Section**: Copy-link button with success feedback checkmark, collapsible QR (default collapsed), prioritized tabs

## Motion
All animations respect `prefers-reduced-motion`. Default timing: 0.3s ease-out for interactive, 0.5s spring for spring-physics. No bounce except spring-physics buttons. Choreography: entrance animations stagger, hover states instant, dismissals fade-out. Parallax driven by native scroll.

| Interaction | Animation | Timing |
|---|---|---|
| Page entrance | fade-in + slide-up | 0.3s ease-out |
| Tab switch | crossfade or slide | 0.2s ease-out |
| Button tap | scale-spring (0.95→1.02→1) | 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) |
| Modal open | scale-in (0.92→1) + fade-in | 0.3s ease-out |
| Event Pass button | glow-pulse (infinite) | 2s ease-in-out |
| Message enter | slide-up (staggered) | 0.3s ease-out, 60ms per item |
| Shimmer loading | shimmer-sweep (background-position) | 2s infinite |
| Drawer (calendar day view) | drawer-slide (translateY 100%→0) | 0.3s ease-out |

## Constraints
- Mobile-first responsive (sm, md, lg breakpoints — no xl for EveryMoment)
- Dark mode intentional: deep purple gradients, bright near-white text, electric indigo accents; not inverted lightness
- Light mode tuned for clarity: warm pearl gradients, deep charcoal text, sharp indigo accents
- Glass blur maximum 3–4 layers on screen at once (GPU efficiency)
- Animations use `transform` and `opacity` only (no layout thrashing)
- All interactive elements 48px+ touch target on mobile
- WCAG AA+ contrast verified in both light and dark modes
- No session timeout; sessions persist until browser storage cleared
- All accessibility labels and ARIA for screen readers

## Signature Detail
**"Moments live in time"** — parallax scroll depth reinforces chronological narrative. Cover images drift slower than page (60–70% scroll speed), creating illusion of layered depth as you scroll through memories. Floating navigation shrinks on scroll down (gets out of way) and expands on scroll up (ready for navigation). This interplay between content and UI makes scrolling feel purposeful, not just utility.

## Anti-patterns to Avoid
❌ No hard shadows or solid overlays — only glass and blur | ❌ No rainbow palettes — 3 colors max + accent only | ❌ No uniform rounded-lg — vary radius intentionally (4px, 8px, 12px) | ❌ No scattered animations — all follow single choreography | ❌ No session timeouts — sessions persist indefinitely | ❌ No motion by default for prefers-reduced-motion users | ❌ No decorative gradients on text — text must be high contrast

## Verified Tokens
- Glass morphism: `glass-card`, `glass-nav`, `glass-modal`, `glass-input` (dark + light variants)
- Animations: `slide-up`, `scale-in`, `scale-spring`, `glow-pulse`, `shimmer`, `drawer-slide`, `blur-in`
- Typography: `text-display-xl/lg/md/sm`, `text-meta`, `text-body`
- Interactive: `button-spring` (scale 95% on active), `tap-target` (48px min), `transition-smooth` (0.3s)
- Depth: `glow-accent`, `glow-accent-sm` (accent halo)
- Gradients: `bg-gradient-page` (theme-aware light/dark)
