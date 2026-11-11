/**
 * Motion Tokens Single Source of Truth
 * Phase 10: Animation & Interaction Pass
 * All values align with docs/antigravity/MOTION_INVENTORY.md
 */

export const dur = {
  hover: 0.18,          // 180ms
  cardImage: 0.35,      // 350ms
  accordion: 0.3,       // 300ms
  panel: 0.45,          // 450ms
  counter: 1.1,         // 1100ms
  reveal: 0.7,          // 700ms
  revealMobile: 0.4,    // 400ms
  lineReveal: 0.8,      // 800ms
  imageReveal: 0.9,     // 900ms
  imageScale: 1.1,      // 1100ms
  pageTransition: 0.35, // 350ms
  navScroll: 0.2,       // 200ms
  marquee: 32,          // 32s
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  cssOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  cssInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

export const stagger = {
  reveal: 0.07,          // 70ms per child
  maxRevealChildren: 6,
  lineReveal: 0.09,      // 90ms per line
  wordReveal: 0.03,      // 30ms per word
} as const;

export const travel = {
  yReveal: 24,           // 24px desktop
  yRevealMobile: 12,     // 12px mobile
  yPageTransition: 12,   // 12px page transition
  parallaxHeroBack: -0.04,
  parallaxHeroMid: -0.09,
  parallaxHeroFront: -0.14,
} as const;
