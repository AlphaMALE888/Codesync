import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  COMMITMENT_COPY,
  COMMITMENT_LAYERS,
  buildIsometricPlatePaths,
  computeDesktopStackGeometry,
  getBottomToTopRevealOrder,
  getLayerInteractionState,
} from "./commitmentArchitecture";

describe("commitmentArchitecture pure logic", () => {
  it("preserves exact copy and top-to-bottom layer order", () => {
    assert.equal(COMMITMENT_COPY.eyebrow, "THE CODESYNC COMMITMENT");
    assert.equal(COMMITMENT_COPY.headlinePrimary, "We don't promise rankings.");
    assert.equal(COMMITMENT_COPY.headlineSecondary, "We build the work that earns them.");

    assert.deepEqual(
      COMMITMENT_LAYERS.map((l) => l.id),
      ["authority", "ux", "content", "technical"]
    );
    assert.deepEqual(
      COMMITMENT_LAYERS.map((l) => l.title),
      ["Authority", "User Experience", "Content", "Technical Structure"]
    );
  });

  it("orders initial assembly strictly from bottom foundation up to Authority", () => {
    const revealSequence = getBottomToTopRevealOrder();
    assert.deepEqual(
      revealSequence.map((l) => l.id),
      ["technical", "content", "ux", "authority"]
    );
  });

  it("synchronizes active layer hover/focus independently without moving sibling slabs", () => {
    const activeUx = getLayerInteractionState("ux", "ux", "low");
    const siblingAuth = getLayerInteractionState("authority", "ux", "high");
    const idleTech = getLayerInteractionState("technical", null, "strong");

    assert.equal(activeUx.isActive, true);
    assert.ok(activeUx.liftPx >= 3 && activeUx.liftPx <= 6);
    assert.equal(activeUx.edgeGlowOpacity, 1);
    assert.ok(activeUx.nodeScale > 1.2);

    assert.equal(siblingAuth.isActive, false);
    assert.equal(siblingAuth.hasOtherActive, true);
    assert.equal(siblingAuth.liftPx, 0, "sibling layers must remain stationary");

    assert.equal(idleTech.isActive, false);
    assert.equal(idleTech.liftPx, 0);
    assert.ok(idleTech.edgeGlowOpacity > 0.85);
  });

  it("aligns horizontal connectors cleanly between diamond right nodes and label boxes", () => {
    const geom = computeDesktopStackGeometry();
    assert.equal(geom.layerCenterY.length, 4);
    assert.ok(geom.leftGuideX < geom.rightNodeX);
    assert.ok(geom.rightNodeX < geom.labelAnchorX, "horizontal connector runs strictly left-to-right without crossing text");
    for (let i = 1; i < geom.layerCenterY.length; i++) {
      assert.ok(geom.layerCenterY[i] > geom.layerCenterY[i - 1], "vertical slab centers strictly descend");
    }
  });

  it("generates symmetric isometric extruded slab paths with valid bounds", () => {
    const paths = buildIsometricPlatePaths();
    assert.ok(paths.topFacePath.startsWith("M") && paths.topFacePath.endsWith("Z"));
    assert.ok(paths.sideWallPath.startsWith("M") && paths.sideWallPath.endsWith("Z"));
    assert.ok(Math.abs(paths.leftVertexX + paths.rightVertexX) < 1, "left and right vertices are symmetric");
    assert.ok(paths.rightVertexX > 120, "right vertex extends positively");
    assert.ok(paths.topVertexY < -50, "top vertex is negative in SVG Y");
    assert.ok(paths.bottomVertexY > Math.abs(paths.topVertexY), "extruded bottom exceeds top magnitude");
  });
});
