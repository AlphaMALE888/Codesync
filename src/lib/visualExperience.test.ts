import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeHeroDissolveState,
  computeHeroSphereLayout,
  pickWineInkColor,
  computeBowAndWakeSplats,
  isPointExcluded,
  rectToUvBounds,
  SMOOTH_CURSOR_SPRING,
  FLUID_DEFAULTS,
} from "./visualExperience";

describe("visualExperience pure logic", () => {
  it("preserves exact SmoothCursor spring tuning and subtle boat-wake fluid tuning", () => {
    assert.deepEqual(SMOOTH_CURSOR_SPRING, {
      damping: 45,
      stiffness: 400,
      mass: 1,
      restDelta: 0.001,
    });
    assert.ok(FLUID_DEFAULTS.curl >= 0 && FLUID_DEFAULTS.curl <= 0.45);
    assert.ok(FLUID_DEFAULTS.splatRadius >= 0.09 && FLUID_DEFAULTS.splatRadius <= 0.16);
    assert.ok(FLUID_DEFAULTS.maxOpacity <= 0.4);
  });

  it("transitions hero dissolve smoothly from sphere at top to fluid below hero", () => {
    const atTop = computeHeroDissolveState(0, 900, true);
    assert.equal(atTop.heroWeight, 1);
    assert.equal(atTop.dissolve, 0);
    assert.equal(atTop.fluidBlend, 0);

    const at25 = computeHeroDissolveState(225, 900, true);
    assert.ok(at25.dissolve > 0.1 && at25.dissolve < 0.25, "25% scroll begins gentle dispersal");
    assert.equal(at25.heroWeight, 1, "sphere grains remain full opacity through initial dispersal");

    const midHero = computeHeroDissolveState(450, 900, true);
    assert.ok(midHero.dissolve > 0.2 && midHero.dissolve < 0.8);
    assert.ok(midHero.dispersion > 0.7, "particles should actively disperse mid-scroll");
    assert.ok(midHero.fluidBlend > 0.2 && midHero.fluidBlend < 0.9);

    const at75 = computeHeroDissolveState(675, 900, true);
    assert.ok(at75.dissolve > midHero.dissolve && at75.dissolve < 0.95);
    assert.ok(at75.heroWeight > 0.3 && at75.heroWeight < 1, "sphere fades gradually into fluid");
    assert.ok(at75.fluidBlend > midHero.fluidBlend);

    const pastHero = computeHeroDissolveState(920, 900, true);
    assert.equal(pastHero.heroWeight, 0);
    assert.equal(pastHero.dissolve, 1);
    assert.equal(pastHero.fluidBlend, 1);

    const subpage = computeHeroDissolveState(0, 0, false);
    assert.equal(subpage.heroWeight, 0);
    assert.equal(subpage.dissolve, 1);
    assert.equal(subpage.fluidBlend, 1);
  });

  it("aligns desktop hero sphere to the right center in line with text and matches text block height", () => {
    const heroRect = { left: 0, top: 80, right: 1440, bottom: 964 };
    const copyRect = { left: 73, top: 290, right: 655, bottom: 833 }; // height = 543
    const layout = computeHeroSphereLayout(1440, 900, heroRect, copyRect);

    assert.equal(layout.isMobile, false);
    assert.equal(layout.diameterPx, 543);
    assert.equal(layout.centerY, (290 + 833) * 0.5);
    assert.ok(layout.centerX - layout.radiusPx > copyRect.right, "sphere clears text column");
    assert.ok(layout.centerX + layout.radiusPx <= 1440 - 68, "sphere stays cleanly inside hero frame");
    assert.ok(layout.centerX > 720, "sphere is positioned on the right side");
  });

  it("restricts fluid ink palette strictly to dark wine-red tones with red channel dominance", () => {
    for (let s = 0; s <= 1; s += 0.25) {
      for (let p = 0; p < Math.PI * 2; p += 0.7) {
        const c = pickWineInkColor(s, p);
        assert.ok(c.r > c.b * 1.9, "red channel must dominate over blue");
        assert.ok(c.r > c.g * 3.2, "red channel must dominate over green");
        assert.ok(c.r <= 0.55, "dye injection stays restrained to prevent neon/white blowout");
      }
    }
  });

  it("places bow splat slightly ahead of cursor and narrower wake behind", () => {
    const [bow, wake] = computeBowAndWakeSplats(0.5, 0.5, 0.02, 0.01, 1.6, 0.002, 3900);
    assert.ok(bow.x > 0.5 && bow.y > 0.5, "bow leads ahead along positive movement vector");
    assert.ok(wake.x < 0.5 && wake.y < 0.5, "wake trails slightly behind cursor");
    assert.ok(wake.radius < bow.radius, "wake is narrower than bow wave");
  });

  it("detects excluded DOM regions and converts rects into valid WebGL UV bounds", () => {
    const servicesRect = { left: 0, top: 200, right: 1440, bottom: 700 };
    const footerRect = { left: 0, top: 820, right: 1440, bottom: 1200 };

    assert.equal(isPointExcluded(400, 450, [servicesRect, footerRect]), true);
    assert.equal(isPointExcluded(400, 120, [servicesRect, footerRect]), false);
    assert.equal(isPointExcluded(400, 860, [servicesRect, footerRect]), true);

    const uv = rectToUvBounds(footerRect, 1440, 900);
    // In WebGL UV, bottom of viewport (top=820..900) maps to v in [0, 80/900]
    assert.equal(uv[0], 0);
    assert.equal(uv[1], 0);
    assert.equal(uv[2], 1);
    assert.ok(Math.abs(uv[3] - (1 - 820 / 900)) < 1e-6);

    const offscreen = rectToUvBounds({ left: 0, top: 1000, right: 1440, bottom: 1400 }, 1440, 900);
    assert.deepEqual(offscreen, [2, 2, -1, -1]);
  });
});
