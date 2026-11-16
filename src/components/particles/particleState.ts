"use client";

import type { HeroSphereLayout } from "@/lib/visualExperience";

export type ParticleHoverMode = "attract" | "repel" | "wave";

export interface DissolveInkSeed {
  uvX: number;
  uvY: number;
  dx: number;
  dy: number;
  strength: number;
}

export interface ParticleBridgeState {
  // Interactive card/link focal targets (used by CapabilityAccordion etc.)
  hoverActive: boolean;
  hoverNdcX: number;
  hoverNdcY: number;
  hoverStrength: number;
  hoverMode: ParticleHoverMode;
  activePillarIndex: number;
  pulseBoost: number;

  // Single unified spring-smoothed cursor coordinate stream (viewport px)
  springClientX: number;
  springClientY: number;
  springVelX: number;
  springVelY: number;
  cursorActive: boolean;
  hasPointerMoved: boolean;
  interactiveHover: boolean;
  isTextInputHover: boolean;

  // Hero -> Fluid scroll dissolve choreography (0..1)
  pathname: string;
  hasHero: boolean;
  heroWeight: number;
  heroDissolve: number;
  heroDispersion: number;
  fluidBlend: number;

  // Exact DOM-aligned hero sphere geometry (viewport px)
  heroSphere: HeroSphereLayout;
  hasMeasuredSphere: boolean;

  // Exclusion state & shader UV bounds [uMin, vMin, uMax, vMax]
  cursorExcluded: boolean;
  excludeServicesUv: [number, number, number, number];
  excludeFooterUv: [number, number, number, number];

  // One-shot click splat & sphere-dissolve ink wisps consumed by FluidInkCanvas
  pendingClickSplats: Array<{ clientX: number; clientY: number }>;
  pendingDissolveSeeds: DissolveInkSeed[];
}

export const particleBridge: ParticleBridgeState = {
  hoverActive: false,
  hoverNdcX: 0,
  hoverNdcY: 0,
  hoverStrength: 0,
  hoverMode: "attract",
  activePillarIndex: 0,
  pulseBoost: 0,

  springClientX: 0,
  springClientY: 0,
  springVelX: 0,
  springVelY: 0,
  cursorActive: false,
  hasPointerMoved: false,
  interactiveHover: false,
  isTextInputHover: false,

  pathname: "/",
  hasHero: true,
  heroWeight: 1,
  heroDissolve: 0,
  heroDispersion: 0,
  fluidBlend: 0,

  heroSphere: {
    centerX: 1060,
    centerY: 560,
    diameterPx: 540,
    radiusPx: 270,
    isMobile: false,
  },
  hasMeasuredSphere: false,

  cursorExcluded: false,
  excludeServicesUv: [2, 2, -1, -1],
  excludeFooterUv: [2, 2, -1, -1],

  pendingClickSplats: [],
  pendingDissolveSeeds: [],
};

export function setParticleFocusFromElement(
  el: HTMLElement | null,
  mode: ParticleHoverMode = "attract",
  strength = 1
) {
  if (!el || typeof window === "undefined") return;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const cx = rect.left + rect.width * 0.5;
  const cy = rect.top + rect.height * 0.5;

  particleBridge.hoverNdcX = (cx / window.innerWidth) * 2 - 1;
  particleBridge.hoverNdcY = -((cy / window.innerHeight) * 2 - 1);
  particleBridge.hoverMode = mode;
  particleBridge.hoverStrength = strength;
  particleBridge.hoverActive = true;
}

export function setParticleFocusFromPointer(
  clientX: number,
  clientY: number,
  mode: ParticleHoverMode = "attract",
  strength = 0.85
) {
  if (typeof window === "undefined") return;
  particleBridge.hoverNdcX = (clientX / window.innerWidth) * 2 - 1;
  particleBridge.hoverNdcY = -((clientY / window.innerHeight) * 2 - 1);
  particleBridge.hoverMode = mode;
  particleBridge.hoverStrength = strength;
  particleBridge.hoverActive = true;
}

export function clearParticleFocus() {
  particleBridge.hoverActive = false;
  particleBridge.hoverStrength = 0;
}

export function setActiveServicePillar(index: number) {
  particleBridge.activePillarIndex = Math.max(0, Math.min(2, index));
  particleBridge.pulseBoost = Math.min(1, particleBridge.pulseBoost + 0.65);
}
