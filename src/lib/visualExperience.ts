export interface HeroDissolveState {
  progress: number;
  heroWeight: number;
  dissolve: number;
  dispersion: number;
  fluidBlend: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ViewportRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface BowWakeSplat {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  dyeScale: number;
}

export interface HeroSphereLayout {
  centerX: number;
  centerY: number;
  diameterPx: number;
  radiusPx: number;
  isMobile: boolean;
}

export const FLUID_DEFAULTS = {
  simResolution: 128,
  dyeResolution: 1024,
  captureResolution: 512,
  densityDissipation: 2.8,
  velocityDissipation: 2.35,
  pressure: 0.22,
  pressureIterations: 20,
  curl: 0.08,
  splatRadius: 0.105,
  splatForce: 3800,
  shading: true,
  colorUpdateSpeed: 4,
  maxOpacity: 0.38,
} as const;

export const SMOOTH_CURSOR_SPRING = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.001,
} as const;

// Restrained wine-red / deep crimson dye palette (sRGB 0..1)
export const WINE_INK_STOPS: readonly RGBColor[] = [
  { r: 0.192, g: 0.031, b: 0.071 }, // #310812 deep burgundy
  { r: 0.392, g: 0.075, b: 0.149 }, // #641326 dark wine red
  { r: 0.506, g: 0.102, b: 0.196 }, // #811A32 rich crimson wine
  { r: 0.631, g: 0.149, b: 0.259 }, // #A12642 subdued ruby edge
] as const;

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x >= edge1 ? 1 : 0;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Computes continuous scroll-synchronized transition between the hero red-grain
 * particle sphere and the global fluid ink simulation.
 */
export function computeHeroDissolveState(
  scrollY: number,
  heroHeight: number,
  hasHero: boolean
): HeroDissolveState {
  if (!hasHero) {
    return {
      progress: 1,
      heroWeight: 0,
      dissolve: 1,
      dispersion: 0,
      fluidBlend: 1,
    };
  }

  const safeHeight = Math.max(1, heroHeight);
  const progress = clamp(scrollY / safeHeight, 0, 1);

  const dissolve = smoothstep(0.02, 0.98, progress);
  const heroWeight = clamp(1 - smoothstep(0.55, 1.0, progress), 0, 1);
  const dispersion = Math.sin(progress * Math.PI);
  const fluidBlend = smoothstep(0.18, 0.86, progress);

  return {
    progress,
    heroWeight,
    dissolve,
    dispersion,
    fluidBlend,
  };
}

/**
 * Picks a restrained dark wine-red ink pigment with subtle variation based on
 * cursor speed and harmonic phase — never neon, white, or orange.
 */
export function pickWineInkColor(speedRatio: number, phase: number): RGBColor {
  const s = clamp(speedRatio, 0, 1);
  const wave = 0.5 + 0.5 * Math.sin(phase);
  const blendPos = clamp(s * 0.68 + wave * 0.32, 0, 1) * (WINE_INK_STOPS.length - 1);

  const i0 = Math.floor(blendPos);
  const i1 = Math.min(WINE_INK_STOPS.length - 1, i0 + 1);
  const f = blendPos - i0;

  const c0 = WINE_INK_STOPS[i0];
  const c1 = WINE_INK_STOPS[i1];

  const gain = 0.54 + s * 0.28;
  return {
    r: (c0.r + (c1.r - c0.r) * f) * gain,
    g: (c0.g + (c1.g - c0.g) * f) * gain,
    b: (c0.b + (c1.b - c0.b) * f) * gain,
  };
}

/**
 * Models boat-through-water wake physics:
 * 1) A subtle forward bow bulge slightly ahead of the cursor along velocity direction.
 * 2) A narrower laminar trailing wake behind the cursor.
 */
export function computeBowAndWakeSplats(
  x: number,
  y: number,
  dx: number,
  dy: number,
  aspectRatio: number,
  baseRadius: number,
  forceScale: number
): [BowWakeSplat, BowWakeSplat] {
  const speed = Math.hypot(dx, dy);
  const nx = speed > 1e-6 ? dx / speed : 0;
  const ny = speed > 1e-6 ? dy / speed : 0;

  const safeAspect = Math.max(0.25, aspectRatio);
  const leadDistance = clamp(speed * 0.42, 0.004, 0.017);
  const invAspectX = safeAspect > 1 ? 1 / safeAspect : 1;
  const invAspectY = safeAspect < 1 ? safeAspect : 1;

  const bowX = clamp(x + nx * leadDistance * invAspectX, 0, 1);
  const bowY = clamp(y + ny * leadDistance * invAspectY, 0, 1);

  const wakeX = clamp(x - nx * leadDistance * 0.6 * invAspectX, 0, 1);
  const wakeY = clamp(y - ny * leadDistance * 0.6 * invAspectY, 0, 1);

  const bow: BowWakeSplat = {
    x: bowX,
    y: bowY,
    dx: dx * forceScale * 0.72,
    dy: dy * forceScale * 0.72,
    radius: baseRadius * 1.12,
    dyeScale: 0.78,
  };

  const wake: BowWakeSplat = {
    x: wakeX,
    y: wakeY,
    dx: dx * forceScale * 0.48,
    dy: dy * forceScale * 0.48,
    radius: baseRadius * 0.74,
    dyeScale: 0.56,
  };

  return [bow, wake];
}

export function isPointInRect(
  clientX: number,
  clientY: number,
  rect: ViewportRect,
  padPx = 0
): boolean {
  if (rect.right <= rect.left || rect.bottom <= rect.top) return false;
  return (
    clientX >= rect.left - padPx &&
    clientX <= rect.right + padPx &&
    clientY >= rect.top - padPx &&
    clientY <= rect.bottom + padPx
  );
}

export function isPointExcluded(
  clientX: number,
  clientY: number,
  rects: readonly (ViewportRect | null | undefined)[],
  padPx = 0
): boolean {
  for (const r of rects) {
    if (r && isPointInRect(clientX, clientY, r, padPx)) {
      return true;
    }
  }
  return false;
}

/**
 * Converts a DOM viewport bounding rect (top-left origin) into WebGL UV bounds
 * [uMin, vMin, uMax, vMax] (bottom-left origin).
 * Returns [2, 2, -1, -1] when disabled or completely outside viewport.
 */
export function rectToUvBounds(
  rect: ViewportRect | null | undefined,
  vw: number,
  vh: number
): [number, number, number, number] {
  if (!rect || vw <= 0 || vh <= 0) return [2, 2, -1, -1];
  if (rect.right <= rect.left || rect.bottom <= rect.top) return [2, 2, -1, -1];
  if (rect.bottom <= 0 || rect.top >= vh || rect.right <= 0 || rect.left >= vw) {
    return [2, 2, -1, -1];
  }

  const uMin = clamp(rect.left / vw, 0, 1);
  const uMax = clamp(rect.right / vw, 0, 1);
  const vMin = clamp(1 - rect.bottom / vh, 0, 1);
  const vMax = clamp(1 - rect.top / vh, 0, 1);

  if (uMax <= uMin || vMax <= vMin) return [2, 2, -1, -1];
  return [uMin, vMin, uMax, vMax];
}

/**
 * Computes exact viewport coordinates and pixel diameter for the hero particle
 * sphere so that on desktop/tablet it sits at the right-center in line with the
 * left copy block and matches the copy block height (from eyebrow to CTAs).
 */
export function computeHeroSphereLayout(
  viewportWidth: number,
  viewportHeight: number,
  heroRect: ViewportRect,
  copyRect: ViewportRect
): HeroSphereLayout {
  const vw = Math.max(320, viewportWidth);
  const vh = Math.max(320, viewportHeight);

  if (vw < 768) {
    const heroH = Math.max(320, heroRect.bottom - heroRect.top);
    const diameterPx = clamp(vw * 0.48, 155, 200);
    return {
      centerX: vw * 0.5,
      centerY: heroRect.top + heroH * 0.22,
      diameterPx,
      radiusPx: diameterPx * 0.5,
      isMobile: true,
    };
  }

  const copyHeight = Math.max(180, copyRect.bottom - copyRect.top);
  const centerY = (copyRect.top + copyRect.bottom) * 0.5;

  const rightInset = vw >= 1024 ? 68 : 44;
  const minGapFromText = vw >= 1200 ? 44 : 28;
  const minLeft = copyRect.right + minGapFromText;
  const maxRight = Math.max(minLeft + 180, heroRect.right - rightInset);
  const availableWidth = Math.max(180, maxRight - minLeft);

  // Match the height of the left text block; cap only if narrow viewport forces horizontal constraint
  const diameterPx = Math.min(copyHeight, availableWidth);
  const radiusPx = diameterPx * 0.5;

  // Center horizontally in the right zone [minLeft, maxRight], slightly right-balanced
  const idealCenterX = minLeft + availableWidth * 0.54;
  const centerX = clamp(idealCenterX, minLeft + radiusPx, maxRight - radiusPx);

  return {
    centerX,
    centerY,
    diameterPx,
    radiusPx,
    isMobile: false,
  };
}

