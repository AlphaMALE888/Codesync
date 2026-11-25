export type CommitmentLayerId = "authority" | "ux" | "content" | "technical";

export interface CommitmentLayerSpec {
  id: CommitmentLayerId;
  orderIndex: number; // 0 = top (Authority), 3 = bottom (Technical Structure)
  revealOrder: number; // 0 = first in (Technical Structure), 3 = last in (Authority)
  title: string;
  subtitle: string;
  description: string;
  crimsonIntensity: "high" | "low" | "medium" | "strong";
  surfaceTone: "smoked" | "metallic" | "translucent" | "metallic-crimson";
  floatDurationSec: number;
  floatDelaySec: number;
}

export const COMMITMENT_COPY = {
  eyebrow: "THE CODESYNC COMMITMENT",
  headlinePrimary: "We don't promise rankings.",
  headlineSecondary: "We build the work that earns them.",
  supportingBody:
    "Sustainable growth comes from clear technical architecture, high-converting design, and ethical search marketing built to compound over time.",
} as const;

/**
 * Exact top-to-bottom architectural stack order matching visual reference:
 * 1. Authority -> 2. User Experience -> 3. Content -> 4. Technical Structure
 */
export const COMMITMENT_LAYERS: readonly CommitmentLayerSpec[] = [
  {
    id: "authority",
    orderIndex: 0,
    revealOrder: 3,
    title: "Authority",
    subtitle: "(Trust & Topical Strength)",
    description:
      "Consistent brand signals, local citations, and topical depth that earn lasting search trust.",
    crimsonIntensity: "high",
    surfaceTone: "smoked",
    floatDurationSec: 5.4,
    floatDelaySec: 0.9,
  },
  {
    id: "ux",
    orderIndex: 1,
    revealOrder: 2,
    title: "User Experience",
    subtitle: "(Speed, UX & Conversion)",
    description:
      "Fast page loads, intuitive navigation, and frictionless lead capture that convert traffic.",
    crimsonIntensity: "low",
    surfaceTone: "metallic",
    floatDurationSec: 5.8,
    floatDelaySec: 0.6,
  },
  {
    id: "content",
    orderIndex: 2,
    revealOrder: 1,
    title: "Content",
    subtitle: "(Relevant & High-Intent)",
    description:
      "Structured service pages and intent-aligned copy written for real buyers, not filler.",
    crimsonIntensity: "medium",
    surfaceTone: "translucent",
    floatDurationSec: 5.6,
    floatDelaySec: 0.3,
  },
  {
    id: "technical",
    orderIndex: 3,
    revealOrder: 0,
    title: "Technical Structure",
    subtitle: "(Crawl, Index & Core Setup)",
    description:
      "Clean semantic HTML, fast rendering, structured schema, and indexable foundations.",
    crimsonIntensity: "strong",
    surfaceTone: "metallic-crimson",
    floatDurationSec: 6.0,
    floatDelaySec: 0,
  },
] as const;

export interface LayerInteractionVisualState {
  isActive: boolean;
  hasOtherActive: boolean;
  liftPx: number;
  edgeGlowOpacity: number;
  iconBrightness: number;
  connectorOpacity: number;
  nodeScale: number;
}

/**
 * Computes synchronized bidirectional visual state for a slab + label pair.
 * Each layer acts strictly independently without affecting sibling slab positions.
 */
export function getLayerInteractionState(
  layerId: CommitmentLayerId,
  activeLayerId: CommitmentLayerId | null,
  baseCrimson: CommitmentLayerSpec["crimsonIntensity"]
): LayerInteractionVisualState {
  const isActive = activeLayerId === layerId;
  const hasOtherActive = activeLayerId !== null && activeLayerId !== layerId;

  const baseEdgeOpacity =
    baseCrimson === "strong"
      ? 0.94
      : baseCrimson === "high"
        ? 0.88
        : baseCrimson === "medium"
          ? 0.56
          : 0.34;

  return {
    isActive,
    hasOtherActive,
    liftPx: isActive ? 5 : 0,
    edgeGlowOpacity: isActive ? 1 : hasOtherActive ? baseEdgeOpacity * 0.72 : baseEdgeOpacity,
    iconBrightness: isActive ? 1.24 : hasOtherActive ? 0.84 : 1.0,
    connectorOpacity: isActive ? 1 : hasOtherActive ? 0.35 : 0.68,
    nodeScale: isActive ? 1.32 : hasOtherActive ? 0.88 : 1.0,
  };
}

export interface DesktopStackGeometry {
  viewBoxWidth: number;
  viewBoxHeight: number;
  leftGuideX: number;
  rightNodeX: number;
  labelAnchorX: number;
  layerCenterY: readonly number[];
  verticalDotsPerGuide: readonly number[];
}

/**
 * Computes exact SVG coordinate geometry for the desktop 4-layer exploded diagram
 * so left/right vertical dotted guides, crimson right-vertex nodes, and horizontal
 * connector lines align precisely with the 4 isometric diamond slabs and label boxes.
 */
export function computeDesktopStackGeometry(): DesktopStackGeometry {
  const viewBoxWidth = 640;
  const viewBoxHeight = 460;
  // Center X of the isometric diamond stack sits at x = 186; diamond half-width = 136
  const leftGuideX = 50;
  const rightNodeX = 322;
  const labelAnchorX = 414;

  // Vertical center Y of each slab diamond (even 98px spacing from top 84 -> 182 -> 280 -> 378)
  const layerCenterY = [84, 182, 280, 378] as const;

  // Vertical crimson data dots placed along both vertical guides (at each slab vertex + mid-spans)
  const verticalDotsPerGuide = [
    84, 133, 182, 231, 280, 329, 378,
  ] as const;

  return {
    viewBoxWidth,
    viewBoxHeight,
    leftGuideX,
    rightNodeX,
    labelAnchorX,
    layerCenterY,
    verticalDotsPerGuide,
  };
}

/**
 * Returns the layer IDs ordered from bottom foundation up to top Authority
 * for sequential bottom-to-top viewport assembly animation.
 */
export function getBottomToTopRevealOrder(): CommitmentLayerSpec[] {
  return [...COMMITMENT_LAYERS].sort((a, b) => a.revealOrder - b.revealOrder);
}

export interface IsometricPlatePaths {
  topFacePath: string;
  bottomFacePath: string;
  sideWallPath: string;
  lowerCrimsonEdgePath: string;
  upperBevelRimPath: string;
  leftVertexX: number;
  rightVertexX: number;
  topVertexY: number;
  bottomVertexY: number;
}

/**
 * Generates exact isometric-projected rounded-square SVG paths for a 3D slab:
 * transforms a 2D rounded square (halfSize, cornerRadius) by rotating -45° and
 * foreshortening Y by `tiltY`, producing seamless 3D extruded bevel walls.
 */
export function buildIsometricPlatePaths(
  halfSize = 95,
  cornerRadius = 18,
  tiltY = 0.545,
  thickness = 11
): IsometricPlatePaths {
  const cos = Math.SQRT1_2;
  const sin = -Math.SQRT1_2;
  const inner = halfSize - cornerRadius;

  const project = (lx: number, ly: number, dy = 0): [number, number] => {
    const rx = lx * cos - ly * sin;
    const ry = (lx * sin + ly * cos) * tiltY + dy;
    return [Number(rx.toFixed(2)), Number(ry.toFixed(2))];
  };

  // Sample 4 rounded corners clockwise in SVG +Y-down coordinates:
  // (+inner, -inner) -> TOP (ry < 0)
  // (+inner, +inner) -> RIGHT (rx > 0)
  // (-inner, +inner) -> BOTTOM (ry > 0)
  // (-inner, -inner) -> LEFT (rx < 0)
  const corners = [
    { cx: inner, cy: -inner, a0: -Math.PI * 0.5, a1: 0 }, // Top corner
    { cx: inner, cy: inner, a0: 0, a1: Math.PI * 0.5 }, // Right corner
    { cx: -inner, cy: inner, a0: Math.PI * 0.5, a1: Math.PI }, // Bottom corner
    { cx: -inner, cy: -inner, a0: Math.PI, a1: Math.PI * 1.5 }, // Left corner
  ];

  const arcSteps = 7;
  const ring: Array<{ lx: number; ly: number }> = [];
  for (const c of corners) {
    for (let s = 0; s <= arcSteps; s++) {
      const a = c.a0 + ((c.a1 - c.a0) * s) / arcSteps;
      ring.push({
        lx: c.cx + Math.cos(a) * cornerRadius,
        ly: c.cy + Math.sin(a) * cornerRadius,
      });
    }
  }

  const toClosedPath = (dy: number) =>
    ring
      .map((pt, idx) => {
        const [x, y] = project(pt.lx, pt.ly, dy);
        return `${idx === 0 ? "M" : "L"}${x} ${y}`;
      })
      .join(" ") + " Z";

  // Midpoint indices of each rounded corner arc
  const topMidIdx = Math.floor(arcSteps / 2);
  const rightMidIdx = 1 * (arcSteps + 1) + Math.floor(arcSteps / 2);
  const bottomMidIdx = 2 * (arcSteps + 1) + Math.floor(arcSteps / 2);
  const leftMidIdx = 3 * (arcSteps + 1) + Math.floor(arcSteps / 2);

  // Lower silhouette runs clockwise from Right corner -> Bottom corner -> Left corner
  const lowerArcPts = ring.slice(rightMidIdx, leftMidIdx + 1);
  const topSidePts = lowerArcPts.map((pt) => project(pt.lx, pt.ly, 0));
  const botSidePts = [...lowerArcPts].reverse().map((pt) => project(pt.lx, pt.ly, thickness));

  const sideWallPath =
    topSidePts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ") +
    " " +
    botSidePts.map(([x, y]) => `L${x} ${y}`).join(" ") +
    " Z";

  const lowerCrimsonEdgePath = lowerArcPts
    .map((pt, i) => {
      const [x, y] = project(pt.lx, pt.ly, thickness * 0.82);
      return `${i === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");

  // Upper bevel rim runs clockwise from Left corner -> Top corner -> Right corner
  const upperArcPts = [...ring.slice(leftMidIdx), ...ring.slice(0, rightMidIdx + 1)];
  const upperBevelRimPath = upperArcPts
    .map((pt, i) => {
      const [x, y] = project(pt.lx, pt.ly, 0);
      return `${i === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");

  const [leftVertexX] = project(ring[leftMidIdx].lx, ring[leftMidIdx].ly, 0);
  const [rightVertexX] = project(ring[rightMidIdx].lx, ring[rightMidIdx].ly, 0);
  const [, topVertexY] = project(ring[topMidIdx].lx, ring[topMidIdx].ly, 0);
  const [, bottomVertexY] = project(ring[bottomMidIdx].lx, ring[bottomMidIdx].ly, thickness);

  return {
    topFacePath: toClosedPath(0),
    bottomFacePath: toClosedPath(thickness),
    sideWallPath,
    lowerCrimsonEdgePath,
    upperBevelRimPath,
    leftVertexX,
    rightVertexX,
    topVertexY,
    bottomVertexY,
  };
}

