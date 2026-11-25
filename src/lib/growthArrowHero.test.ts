import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ARROW_SPINE_CONTROL_POINTS,
  computeGrowthArrowScrollState,
  computeGrowthArrowViewportLayout,
  evaluateArrowRibbonFrame,
  evaluateArrowSpinePoint,
  evaluateContourPulse,
  evaluateRibbonHalfHeight,
  getArrowheadAxisAngleDeg,
  platformHeightAt,
} from "./growthArrowHero";

describe("growthArrowHero pure math & layout", () => {
  it("evaluates an ascending torsion-free sculptural spine from emergence to neck", () => {
    const start = evaluateArrowSpinePoint(0);
    const end = evaluateArrowSpinePoint(1);
    assert.ok(end.x > start.x + 5.5, "arrow spans horizontally across right zone");
    assert.ok(end.y > start.y + 4.5, "arrow ascends strongly toward upper-right");

    // Verify no Frenet twist / flip along the entire spine
    for (let i = 0; i <= 20; i++) {
      const u = i / 20;
      const frame = evaluateArrowRibbonFrame(u);
      const tLen = Math.hypot(frame.tangent.x, frame.tangent.y, frame.tangent.z);
      const uLen = Math.hypot(frame.up.x, frame.up.y, frame.up.z);
      const bLen = Math.hypot(frame.binormal.x, frame.binormal.y, frame.binormal.z);

      assert.ok(Math.abs(tLen - 1) < 1e-4, "tangent normalized");
      assert.ok(Math.abs(uLen - 1) < 1e-4, "up normalized");
      assert.ok(Math.abs(bLen - 1) < 1e-4, "binormal normalized");
      assert.ok(frame.up.y > 0.15, `ribbon up-normal must remain upright at u=${u}`);
      assert.ok(frame.binormal.z > 0.5, `front face binormal stays viewer-facing at u=${u}`);
    }

    assert.ok(ARROW_SPINE_CONTROL_POINTS.length >= 6);
    assert.ok(evaluateRibbonHalfHeight(0) > evaluateRibbonHalfHeight(1));

    const tipAngleDeg = getArrowheadAxisAngleDeg();
    assert.ok(
      tipAngleDeg >= 38 && tipAngleDeg <= 50,
      `arrowhead points cleanly toward upper-right diagonal (${tipAngleDeg.toFixed(1)} deg)`
    );
  });

  it("models a smooth curved dark platform mound peaking beneath Crest 2", () => {
    const centerHeight = platformHeightAt(0.65, 0);
    const farLeftHeight = platformHeightAt(-5.5, 0);
    const farRightHeight = platformHeightAt(6.5, 0);
    assert.ok(centerHeight > farLeftHeight + 0.4);
    assert.ok(centerHeight > farRightHeight + 0.4);
    assert.ok(centerHeight < -1.5, "platform stays in lower hero region");
  });

  it("produces continuous forward-gliding contour pulses with soft tails and reduced-motion stillness", () => {
    const pHead = evaluateContourPulse(0.5, 0.5, false);
    const pTrailing = evaluateContourPulse(0.38, 0.5, false);
    const pAhead = evaluateContourPulse(0.7, 0.5, false);

    assert.ok(pHead.coreIntensity > pTrailing.coreIntensity, "pulse head is brighter than trailing tail");
    assert.ok(pTrailing.coreIntensity >= pAhead.coreIntensity, "comet tail decays behind head");

    const reducedA = evaluateContourPulse(0.25, 0.1, true);
    const reducedB = evaluateContourPulse(0.25, 0.85, true);
    assert.equal(reducedA.coreIntensity, reducedB.coreIntensity);
  });

  it("keeps desktop growth arrow clear of left hero copy and adapts cleanly on mobile", () => {
    const desktopHero = { left: 16, top: 76, right: 1424, bottom: 860 };
    const desktopCopy = { left: 72, top: 180, right: 640, bottom: 720 };
    const desktopLayout = computeGrowthArrowViewportLayout(1440, 900, desktopHero, desktopCopy);

    assert.equal(desktopLayout.isMobile, false);
    assert.equal(desktopLayout.showSecondaryTiles, true);
    assert.ok(desktopLayout.anchorX > 0.5, "anchors sculpture on the right half");
    assert.ok(desktopLayout.sceneScale >= 0.8);

    // Check desktop left-emergence world X clears copyRect.right inside frustum
    const visH = 2 * desktopLayout.cameraZ * Math.tan((desktopLayout.fovDeg * Math.PI) / 360);
    const aspect = (desktopHero.right - desktopHero.left) / (desktopHero.bottom - desktopHero.top);
    const visW = visH * aspect;
    const copyRightWorldX =
      ((desktopCopy.right - desktopHero.left) / (desktopHero.right - desktopHero.left) - 0.5) * visW;
    const arrowLeftWorldX = desktopLayout.anchorX + -3.05 * desktopLayout.sceneScale;
    assert.ok(
      arrowLeftWorldX > copyRightWorldX - 0.35,
      `arrow emergence (${arrowLeftWorldX.toFixed(2)}) clears copy boundary (${copyRightWorldX.toFixed(2)})`
    );

    const mobileHero = { left: 8, top: 70, right: 382, bottom: 820 };
    const mobileCopy = { left: 28, top: 96, right: 362, bottom: 470 };
    const mobileStage = { left: 28, top: 492, right: 362, bottom: 745 };
    const mobileLayout = computeGrowthArrowViewportLayout(
      390,
      844,
      mobileHero,
      mobileCopy,
      mobileStage
    );

    assert.equal(mobileLayout.isMobile, true);
    assert.equal(mobileLayout.showSecondaryTiles, false);
    assert.ok(mobileLayout.anchorY < 0, "mobile sculpture sits in lower stage below headline/CTAs");
  });

  it("computes smooth scroll transition depth and crimson glow boost", () => {
    const rest = computeGrowthArrowScrollState(0);
    assert.equal(rest.depthOffsetZ, 0);
    assert.equal(rest.crimsonGlowBoost, 0);

    const scrolled = computeGrowthArrowScrollState(0.75);
    assert.ok(scrolled.depthOffsetZ < -0.4);
    assert.ok(scrolled.elevationY > 0.15);
    assert.ok(scrolled.crimsonGlowBoost > 0.2);
  });
});
