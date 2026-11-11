/**
 * MOTION_INVENTORY.md
 *
 * Phase 10: Complete Animation and Interaction Pass
 * This file is the single source of truth for every animation value in the CODESYNC site.
 * Library roles are fixed:
 *   Lenis      = smooth scroll only
 *   GSAP/ST    = scroll-linked scrubbed effects only
 *   Framer Motion = component state & enter animations (menus, accordions, reveals, layout)
 *   CSS        = hover, marquee, grain, simple transitions
 */

# Motion Inventory — CODESYNC Digi Marketing Website
**Phase 10 final values | Date: 10 November 2026**

---

## 1. Motion Tokens (all values also in src/lib/motion-tokens.ts)

| Token | Value |
|---|---|
| `dur.hover` | 180ms |
| `dur.cardImage` | 350ms |
| `dur.accordion` | 300ms |
| `dur.panel` | 450ms |
| `dur.counter` | 1100ms |
| `dur.reveal` | 700ms |
| `dur.lineReveal` | 800ms |
| `dur.imageReveal` | 900ms |
| `dur.pageTransition` | 350ms |
| `dur.navScroll` | 200ms |
| `dur.marquee` | 32s |
| `ease.out` | cubic-bezier(0.22, 1, 0.36, 1) |
| `ease.inOut` | cubic-bezier(0.65, 0, 0.35, 1) |
| `ease.spring` | stiffness 300, damping 30 |

---

## 2. Smooth Scroll (Lenis)

| Property | Value |
|---|---|
| Library | Lenis |
| `lerp` | 0.1 |
| `smoothWheel` | true |
| `syncTouch` | false (native on mobile) |
| Disabled conditions | `prefers-reduced-motion`, mobile menu open, dialog open |
| ScrollTrigger bridge | `lenis.on('scroll', ScrollTrigger.update)` |

---

## 3. Section Reveals

| Property | Value |
|---|---|
| Library | Framer Motion `whileInView` |
| Trigger | 20% visibility |
| `once` | true |
| `y` start | 24px |
| `opacity` start | 0 |
| Duration | 700ms |
| Stagger (children) | 70ms, max 6 |
| Mobile | 400ms, y 12px |
| Reduced motion | Final state shown immediately, no movement |

---

## 4. Hero Line Reveal

| Property | Value |
|---|---|
| Library | Framer Motion |
| Effect | y: 110% → 0, clip mask |
| Duration | 800ms |
| Stagger | 90ms per line |
| Ease | cubic-bezier(0.22, 1, 0.36, 1) |
| Reduced motion | Instant final state |

---

## 5. Image Mask & Scale (`ImageReveal`)

| Property | Value |
|---|---|
| Library | Framer Motion |
| Effect | clip-path: inset(0 0 100% 0) → inset(0 0 0% 0) |
| Duration | 900ms |
| Inner image scale | 1.08 → 1 over 1100ms |
| Trigger | 25% viewport visibility |
| Used on | Large case-study media, About photos |
| NOT used on | Small cards (card hover scale stays 1.03) |
| Reduced motion | Instant final state |

---

## 6. Parallax Scrubs (GSAP ScrollTrigger)

| Element | Travel | scrub | Desktop only |
|---|---|---|---|
| Hero arch backdrop layers | back: -4%, mid: -9%, front: -14% of height | 1.2 | Yes |
| Statement panel arches | scale 0.94→1.06 | 1.5 | Yes |
| Project mockup inner image | yPercent -3→3 | 1 | Yes |
| Mobile/touch | Disabled (pointer media query) | — | — |

---

## 7. Navigation Scroll State

| Property | Value |
|---|---|
| Trigger | 24px scroll depth |
| Effect | Border opacity + shadow `shadow-sm → shadow-md`, transition 200ms |
| Library | CSS class toggle via useEffect + scroll listener |

---

## 8. Hover & Button States

| Element | Effect | Duration | Condition |
|---|---|---|---|
| `SplitArrowButton` arrow tile | translateX 3px | 180ms | `hover:hover`, `pointer:fine` |
| Press feedback | scale 0.98 | 120ms | Active state |
| Card (image-led) cover scale | 1.0 → 1.03 | 350ms | hover:hover |
| Card (text-led) background | darken/lighten one step | 220ms | hover:hover |
| NavLink active pill | layout spring | stiffness 300 damping 30 | always |

---

## 9. Page Transition (`app/template.tsx`)

| Property | Value |
|---|---|
| Library | Framer Motion |
| Effect | opacity 0→1, y: 12px→0 |
| Duration | 350ms |
| Ease | cubic-bezier(0.22, 1, 0.36, 1) |
| Delay | 0ms (no exit anim; App Router) |
| Above-fold reveals | 150ms start delay to avoid replay |
| Reduced motion | Instant render, no fade |

---

## 10. Marquee

| Property | Value |
|---|---|
| Library | CSS animation |
| Speed | 32s per cycle |
| Pause | On hover and focus-within |
| Reduced motion | Animation paused (static display) |

---

## 11. Accordion

| Property | Value |
|---|---|
| Library | Framer Motion `AnimatePresence` + height `auto` |
| Duration | 300ms ease-in-out |
| Plus → Close icon | Rotate 45° over 240ms |

---

## 12. Pricing Toggle

| Property | Value |
|---|---|
| Library | Framer Motion `layoutId` spring |
| Indicator slide | stiffness 300, damping 30 |
| Panel cross-fade | out: 150ms, in: 350ms y:16px |

---

## 13. Counter

| Property | Value |
|---|---|
| Library | Custom rAF (Counter.tsx) |
| Duration | 1100ms ease-out |
| Trigger | IntersectionObserver once |
| Reduced motion | Final value shown immediately |
