import type { ViewportRect } from "./visualExperience";
import { clamp, smoothstep } from "./visualExperience";

export interface Vec3Tuple {
  x: number;
  y: number;
  z: number;
}

export interface RibbonFrame {
  position: Vec3Tuple;
  tangent: Vec3Tuple;
  up: Vec3Tuple;
  binormal: Vec3Tuple;
}

export interface GrowthArrowViewportLayout {
  isMobile: boolean;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
  fovDeg: number;
  anchorX: number;
  anchorY: number;
  sceneScale: number;
  showSecondaryTiles: boolean;
}

export interface GrowthArrowScrollState {
  progress: number;
  depthOffsetZ: number;
  elevationY: number;
  tiltPitchX: number;
  crimsonGlowBoost: number;
  outlinePulseBoost: number;
}

export interface ContourPulseSample {
  intensity: number;
  coreIntensity: number;
  haloIntensity: number;
  headU: number;
}

/**
 * Primary sculpted S-wave spine control points from lower-left platform emergence
 * through two dramatic arches up to the arrowhead neck junction.
 */
export const ARROW_SPINE_CONTROL_POINTS: readonly Vec3Tuple[] = [
  { x: -3.18, y: -2.92, z: 0 }, // Grounded deeply inside curved dark platform mound
  { x: -2.74, y: -1.66, z: 0 }, // Steep architectural emergence climb
  { x: -1.88, y: -0.66, z: 0 }, // Crest 1 smooth broad sculptural arch
  { x: -0.92, y: -1.08, z: 0 }, // Valley 1 gentle U-trough exposing deep crimson vault
  { x: 0.40, y: 0.68, z: 0 }, // Crest 2 dominant ascending arch
  { x: 1.24, y: 0.36, z: 0 }, // Valley 2 subtle shoulder inflection
  { x: 2.00, y: 1.16, z: 0 }, // Diagonal neck ramp (~46 deg)
  { x: 2.60, y: 1.78, z: 0 }, // Arrowhead collar junction (~46 deg)
] as const;

// Viewer-facing planar normal (flat front face in XY, extruded along Z; group tilts cleanly for 3/4 depth)
const SCULPT_BINORMAL: Vec3Tuple = normalize3({ x: 0, y: 0, z: 1 });

function add3(a: Vec3Tuple, b: Vec3Tuple): Vec3Tuple {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function sub3(a: Vec3Tuple, b: Vec3Tuple): Vec3Tuple {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function scale3(v: Vec3Tuple, s: number): Vec3Tuple {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function cross3(a: Vec3Tuple, b: Vec3Tuple): Vec3Tuple {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export function normalize3(v: Vec3Tuple): Vec3Tuple {
  const len = Math.hypot(v.x, v.y, v.z);
  if (len < 1e-8) return { x: 0, y: 1, z: 0 };
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

/**
 * Evaluates a Centripetal Catmull-Rom point across ARROW_SPINE_CONTROL_POINTS for u in [0, 1].
 */
export function evaluateArrowSpinePoint(
  u: number,
  points: readonly Vec3Tuple[] = ARROW_SPINE_CONTROL_POINTS
): Vec3Tuple {
  const tClamped = clamp(u, 0, 1);
  const segCount = points.length - 1;
  const scaled = tClamped * segCount;
  const i = Math.min(segCount - 1, Math.floor(scaled));
  const t = scaled - i;

  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[Math.min(segCount, i + 1)];
  const p3 = points[Math.min(segCount, i + 2)];

  const t2 = t * t;
  const t3 = t2 * t;

  const interp = (a: number, b: number, c: number, d: number) =>
    0.5 *
    (2 * b +
      (-a + c) * t +
      (2 * a - 5 * b + 4 * c - d) * t2 +
      (-a + 3 * b - 3 * c + d) * t3);

  return {
    x: interp(p0.x, p1.x, p2.x, p3.x),
    y: interp(p0.y, p1.y, p2.y, p3.y),
    z: interp(p0.z, p1.z, p2.z, p3.z),
  };
}

/**
 * Computes a torsion-free sculptural ribbon frame { position, tangent, up, binormal }
 * where `up` consistently points toward the ivory crest edge and `-up` toward the crimson underside.
 */
export function evaluateArrowRibbonFrame(u: number): RibbonFrame {
  const eps = 0.0025;
  const u0 = clamp(u - eps, 0, 1);
  const u1 = clamp(u + eps, 0, 1);
  const position = evaluateArrowSpinePoint(u);
  const p0 = evaluateArrowSpinePoint(u0);
  const p1 = evaluateArrowSpinePoint(u1);
  const tangent = normalize3(sub3(p1, p0));

  let up = cross3(SCULPT_BINORMAL, tangent);
  up = normalize3(up);
  // Ensure `up` always points generally upward (+Y) so top/underside never invert
  if (up.y < 0) {
    up = scale3(up, -1);
  }
  const binormal = normalize3(cross3(tangent, up));

  return { position, tangent, up, binormal };
}

/**
 * Smooth ribbon cross-section half-height (sleek crisp architectural ribbon profile).
 */
export function evaluateRibbonHalfHeight(u: number): number {
  const t = clamp(u, 0, 1);
  return 0.38 - smoothstep(0.0, 0.92, t) * 0.055;
}

export function evaluateRibbonHalfDepth(u: number): number {
  const t = clamp(u, 0, 1);
  return 0.68 - smoothstep(0.0, 0.95, t) * 0.04;
}

/**
 * Computes the diagonal upper-right arrowhead tip direction angle (in degrees, ~43-46 deg)
 * used by the monolithic extruded growth arrow geometry.
 */
export function getArrowheadAxisAngleDeg(): number {
  const p0 = evaluateArrowSpinePoint(0.86);
  const p1 = evaluateArrowSpinePoint(1.0);
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/**
 * Analytical height of the curved dark reflective platform at local coordinates (x, z).
 * Forms a smooth low-profile architectural mound peaking beneath Crest 2 and rolling off left/right.
 */
export function platformHeightAt(x: number, z: number): number {
  const dx = (x - 0.55) / 6.9;
  const dz = (z + 0.1) / 3.9;
  const dome = Math.exp(-(dx * dx * 0.88 + dz * dz * 1.18));
  const wave = Math.sin((x + 1.4) * 0.34) * 0.05;
  return -2.86 + dome * 0.88 + wave;
}

/**
 * Evaluates a continuous multi-pulse moving crimson outline light-trace at contour parameter u in [0, 1].
 * Loops seamlessly over phase in [0, 1).
 */
export function evaluateContourPulse(
  u: number,
  phase: number,
  reducedMotion = false
): ContourPulseSample {
  const wrappedPhase = ((phase % 1) + 1) % 1;
  const clampedU = clamp(u, 0, 1);

  if (reducedMotion) {
    return {
      intensity: 0.35,
      coreIntensity: 0.35,
      haloIntensity: 0.22,
      headU: 0.62,
    };
  }

  // Two staggered pulses gliding from platform emergence (0) to arrowhead tip (1)
  const travelSpan = 1.32;
  const offset = 0.16;

  const evalSingleComet = (headPos: number, tailLength: number, headSharpness: number) => {
    const distBehind = headPos - clampedU;
    if (distBehind < -0.055) return 0;
    if (distBehind < 0) {
      // Soft leading edge nose
      return Math.exp(-(distBehind * distBehind) / (0.022 * 0.022));
    }
    // Exponential trailing comet wake behind head
    const tail = Math.exp(-distBehind / tailLength);
    const crispHead = Math.exp(-(distBehind * distBehind) / (headSharpness * headSharpness));
    return clamp(tail * 0.68 + crispHead * 0.65, 0, 1);
  };

  const head1 = wrappedPhase * travelSpan - offset;
  const head2 = ((wrappedPhase + 0.52) % 1) * travelSpan - offset;

  const p1 = evalSingleComet(head1, 0.16, 0.032);
  const p2 = evalSingleComet(head2, 0.125, 0.028) * 0.82;

  // Fade gently right at buried bottom root and right at tip
  const endFade = smoothstep(0.01, 0.09, clampedU) * (1 - smoothstep(0.95, 1.0, clampedU) * 0.25);
  const baseRest = 0.14;
  const coreIntensity = clamp((baseRest + Math.max(p1, p2) * 0.92) * endFade, 0, 1.15);
  const haloIntensity = clamp((0.08 + (p1 + p2 * 0.65) * 0.72) * endFade, 0, 1.0);
  const intensity = clamp(Math.max(coreIntensity, haloIntensity), 0, 1.15);

  return {
    intensity,
    coreIntensity,
    haloIntensity,
    headU: clamp(head1, 0, 1),
  };
}

/**
 * Computes responsive camera & sculpture anchor placement so the growth arrow dominates
 * the right negative space on desktop/laptop without touching hero copy, and settles
 * cleanly below the CTAs in a dedicated mobile stage on narrow screens.
 */
export function computeGrowthArrowViewportLayout(
  viewportWidth: number,
  viewportHeight: number,
  heroRect: ViewportRect,
  copyRect: ViewportRect,
  mobileStageRect?: ViewportRect | null
): GrowthArrowViewportLayout {
  const vw = Math.max(320, viewportWidth);
  const vh = Math.max(320, viewportHeight);
  const heroW = Math.max(320, heroRect.right - heroRect.left);
  const heroH = Math.max(320, heroRect.bottom - heroRect.top);
  const isMobile = vw < 768;

  const fovDeg = isMobile ? 34 : 32;
  const fovRad = (fovDeg * Math.PI) / 180;
  const aspect = heroW / heroH;

  if (isMobile) {
    const cameraZ = 15.2;
    const visH = 2 * cameraZ * Math.tan(fovRad * 0.5);
    const visW = visH * aspect;
    const stageCenterY = mobileStageRect
      ? (mobileStageRect.top + mobileStageRect.bottom) * 0.5
      : heroRect.top + heroH * 0.74;
    const stageH = mobileStageRect
      ? Math.max(200, mobileStageRect.bottom - mobileStageRect.top)
      : heroH * 0.35;

    const normY = 0.5 - (stageCenterY - heroRect.top) / heroH;
    const targetWorldY = normY * visH;

    // Fit full arrow bounding span (width ~7.6 around x=+0.45, height ~6.7 around y=+0.2) inside mobile stage
    const widthCapScale = (visW * 0.82) / 7.6;
    const heightCapScale = ((stageH / heroH) * visH * 0.80) / 6.7;
    const sceneScale = clamp(Math.min(widthCapScale, heightCapScale), 0.26, 0.37);

    return {
      isMobile: true,
      cameraX: 0,
      cameraY: 0,
      cameraZ,
      lookAtX: 0,
      lookAtY: 0,
      lookAtZ: 0,
      fovDeg,
      anchorX: -0.48 * sceneScale,
      anchorY: targetWorldY - 0.14 * sceneScale,
      sceneScale,
      showSecondaryTiles: false,
    };
  }

  const cameraZ = 14.6;
  const visH = 2 * cameraZ * Math.tan(fovRad * 0.5);
  const visW = visH * aspect;

  // Compute normalized right boundary of the copy block inside the hero frame
  const copyRightNorm = clamp((copyRect.right - heroRect.left) / heroW, 0.28, 0.62);
  const minClearWorldX = (copyRightNorm - 0.5) * visW + 0.55;
  const maxRightWorldX = visW * 0.5 - 0.45;
  const rightSpan = Math.max(3.8, maxRightWorldX - minClearWorldX);

  // Target visual span of the arrow composition: slightly compact so arrowhead tip & wing keep clean headroom inside the frame
  const scaleFromWidth = rightSpan / 7.65;
  const scaleFromHeight = visH / 9.15;
  const sceneScale = clamp(Math.min(scaleFromWidth, scaleFromHeight, 0.92), 0.62, 0.92);

  // Anchor so left emergence clears hero copy and arrowhead tip + wing stay safely inside right/top borders
  const desiredLeftEdgeX = minClearWorldX + Math.max(0.08, (rightSpan - 7.35 * sceneScale) * 0.42);
  const maxAnchorForRight = Math.max(0.95, maxRightWorldX - 3.65 * sceneScale * 1.12);
  const anchorX = clamp(desiredLeftEdgeX + 2.65 * sceneScale, 0.72, Math.min(2.35, maxAnchorForRight));

  // Position vertically so arrowhead tip has clean dark margin below top border while platform rests above TrustRail
  const anchorY = clamp(-0.08 + (aspect < 1.5 ? -0.08 : 0.02), -0.22, 0.04);

  return {
    isMobile: false,
    cameraX: -0.20,
    cameraY: -0.06,
    cameraZ,
    lookAtX: 0.14,
    lookAtY: 0.04,
    lookAtZ: 0,
    fovDeg,
    anchorX,
    anchorY,
    sceneScale,
    showSecondaryTiles: vw >= 900,
  };
}

/**
 * Scroll-driven subtle depth, elevation, and crimson illumination enhancement
 * while scrolling down the hero section (smoothly handing off to FluidInkCanvas below).
 */
export function computeGrowthArrowScrollState(scrollProgress: number): GrowthArrowScrollState {
  const p = clamp(scrollProgress, 0, 1);
  const eased = smoothstep(0, 1, p);

  return {
    progress: p,
    depthOffsetZ: eased * -0.95 || 0,
    elevationY: eased * 0.34 || 0,
    tiltPitchX: eased * -0.055 || 0,
    crimsonGlowBoost: eased * 0.42 || 0,
    outlinePulseBoost: eased * 0.28 || 0,
  };
}

export function getArrowTipWorldApprox(): Vec3Tuple {
  const endFrame = evaluateArrowRibbonFrame(1);
  return add3(endFrame.position, scale3(endFrame.tangent, 1.15));
}
