import * as THREE from "three";
import {
  evaluateArrowRibbonFrame,
  evaluateRibbonHalfHeight,
  platformHeightAt,
} from "@/lib/growthArrowHero";
import { clamp, smoothstep } from "@/lib/visualExperience";

export interface ArrowContourData {
  upperContour: THREE.Vector3[];
  lowerContour: THREE.Vector3[];
  tipPoint: THREE.Vector3;
}

export interface ArrowSculptureAssets {
  arrowGeometry: THREE.BufferGeometry;
  sculptureMaterial: THREE.MeshPhysicalMaterial;
  platformGeometry: THREE.BufferGeometry;
  platformMaterial: THREE.MeshStandardMaterial;
  roughnessTexture: THREE.CanvasTexture;
  contours: ArrowContourData;
  updateShaderUniforms: (elapsed: number, pulseU: number, crimsonBoost: number) => void;
}

/**
 * Generates a subtle tileable micro-satin roughness CanvasTexture (linear data space)
 * so ivory surfaces read as architectural cast lacquer rather than glossy plastic.
 */
export function createSculptureRoughnessTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "rgb(142, 142, 142)";
    ctx.fillRect(0, 0, size, size);

    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const img = ctx.getImageData(0, 0, size, size);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (rand() - 0.5) * 24;
      const v = clamp(Math.round(145 + n), 110, 186);
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function evalQuadraticBezier2D(
  p0: THREE.Vector2,
  ctrl: THREE.Vector2,
  p1: THREE.Vector2,
  steps: number
): THREE.Vector2[] {
  const out: THREE.Vector2[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    out.push(
      new THREE.Vector2(
        mt * mt * p0.x + 2 * mt * t * ctrl.x + t * t * p1.x,
        mt * mt * p0.y + 2 * mt * t * ctrl.y + t * t * p1.y
      )
    );
  }
  return out;
}

/**
 * Builds ONE seamless monolithic architectural 3D growth arrow (`ExtrudeGeometry`) with:
 * - Crisp flat warm-ivory front face and tight chamfer-like bevel corners (no puffy tube/sausage silhouette)
 * - Diagonal upper-right arrowhead orientation (~44.5 deg) matching the reference sculpture
 * - Continuous upper/lower bevel ridge contour paths for the moving crimson outline light-trace
 */
function createMonolithicGrowthArrowGeometry(): {
  geometry: THREE.BufferGeometry;
  upperContour: THREE.Vector3[];
  lowerContour: THREE.Vector3[];
  tipPoint: THREE.Vector3;
} {
  const spineSteps = 120;
  const spineSamples: Array<{ x: number; y: number; u: number }> = [];
  const upper2D: THREE.Vector2[] = [];
  const lower2D: THREE.Vector2[] = [];

  for (let i = 0; i <= spineSteps; i++) {
    const u = i / spineSteps;
    const frame = evaluateArrowRibbonFrame(u);
    const halfH = evaluateRibbonHalfHeight(u);

    spineSamples.push({ x: frame.position.x, y: frame.position.y, u });
    upper2D.push(
      new THREE.Vector2(
        frame.position.x + frame.up.x * halfH,
        frame.position.y + frame.up.y * halfH
      )
    );
    lower2D.push(
      new THREE.Vector2(
        frame.position.x - frame.up.x * halfH,
        frame.position.y - frame.up.y * halfH
      )
    );
  }

  // Construct crisp architectural arrowhead seamlessly joined at collar (u = 1)
  const endFrame = evaluateArrowRibbonFrame(1);
  const C = new THREE.Vector2(endFrame.position.x, endFrame.position.y);
  const T = new THREE.Vector2(endFrame.tangent.x, endFrame.tangent.y).normalize();
  const U = new THREE.Vector2(endFrame.up.x, endFrame.up.y).normalize();
  const neckHalfH = evaluateRibbonHalfHeight(1);

  const toXY = (tDist: number, uDist: number) =>
    new THREE.Vector2(C.x + T.x * tDist + U.x * uDist, C.y + T.y * tDist + U.y * uDist);

  const wingSpan = 1.16;
  const tipDist = 1.80;
  const shoulderT = -0.06;

  // Arrowhead silhouette keypoints (sculpted architectural bevels matching reference)
  const uCollar = toXY(0, neckHalfH);
  const uFlangeCtrl = toXY(-0.04, neckHalfH + 0.12);
  const uFlangeEnd = toXY(-0.06, wingSpan - 0.13);
  const uWingCtrl = toXY(shoulderT, wingSpan);
  const uWingFront = toXY(shoulderT + 0.14, wingSpan - 0.04);
  const uTipApproach = toXY(tipDist - 0.13, 0.08);
  const apexCtrl = toXY(tipDist + 0.04, 0);
  const apexPt = toXY(tipDist - 0.01, 0);

  const lTipApproach = toXY(tipDist - 0.13, -0.08);
  const lWingFront = toXY(shoulderT + 0.14, -(wingSpan - 0.04));
  const lWingCtrl = toXY(shoulderT, -wingSpan);
  const lFlangeEnd = toXY(-0.06, -(wingSpan - 0.13));
  const lFlangeCtrl = toXY(-0.04, -(neckHalfH + 0.12));
  const lCollar = toXY(0, -neckHalfH);

  // Build single continuous closed 2D shape from emergence -> upper contour -> apex -> lower contour
  const shape = new THREE.Shape();
  shape.moveTo(upper2D[0].x, upper2D[0].y);
  for (let i = 1; i < upper2D.length; i++) {
    shape.lineTo(upper2D[i].x, upper2D[i].y);
  }

  // Upper wing -> apex
  shape.quadraticCurveTo(uFlangeCtrl.x, uFlangeCtrl.y, uFlangeEnd.x, uFlangeEnd.y);
  shape.quadraticCurveTo(uWingCtrl.x, uWingCtrl.y, uWingFront.x, uWingFront.y);
  shape.lineTo(uTipApproach.x, uTipApproach.y);
  shape.quadraticCurveTo(apexCtrl.x, apexCtrl.y, apexPt.x, apexPt.y);

  // Apex -> lower wing -> collar
  shape.quadraticCurveTo(apexCtrl.x, apexCtrl.y, lTipApproach.x, lTipApproach.y);
  shape.lineTo(lWingFront.x, lWingFront.y);
  shape.quadraticCurveTo(lWingCtrl.x, lWingCtrl.y, lFlangeEnd.x, lFlangeEnd.y);
  shape.quadraticCurveTo(lFlangeCtrl.x, lFlangeCtrl.y, lCollar.x, lCollar.y);

  // Return down lower ribbon contour
  for (let i = lower2D.length - 2; i >= 0; i--) {
    shape.lineTo(lower2D[i].x, lower2D[i].y);
  }
  shape.closePath();

  const extrudeDepth = 1.38;
  const bevelThickness = 0.092;
  const bevelSize = 0.078;

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    steps: 3,
    curveSegments: 24,
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelSegments: 7,
  });

  // Center along Z so front face sits at +extrudeDepth*0.5 + bevelThickness
  geo.translate(0, 0, -extrudeDepth * 0.5);
  geo.computeVertexNormals();

  const posAttr = geo.getAttribute("position");
  const normAttr = geo.getAttribute("normal");
  const count = posAttr.count;

  const underside = new Float32Array(count);
  const traceU = new Float32Array(count);

  const countSamples = spineSamples.length;

  for (let i = 0; i < count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    const vz = posAttr.getZ(i);
    const nx = normAttr.getX(i);
    const ny = normAttr.getY(i);
    const nz = normAttr.getZ(i);

    // Map vertex (vx, vy) cleanly onto progress u in [0, 1] from emergence to arrowhead tip
    const dxCollar = vx - C.x;
    const dyCollar = vy - C.y;
    const forwardPastCollar = dxCollar * T.x + dyCollar * T.y;

    let uMapped = 0;
    if (forwardPastCollar > -0.08) {
      uMapped = clamp(0.80 + (forwardPastCollar / tipDist) * 0.20, 0.79, 1.0);
    } else {
      let bestDistSq = Infinity;
      let bestU = 0;
      for (let s = 0; s < countSamples; s++) {
        const sp = spineSamples[s];
        const dSq = (vx - sp.x) * (vx - sp.x) + (vy - sp.y) * (vy - sp.y);
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestU = sp.u;
        }
      }
      uMapped = bestU * 0.80;
    }
    traceU[i] = uMapped;

    // Sculptural 3D lighting & color separation:
    // - Flat front face & top bevels (nz > 0.72): pure clean warm satin ivory (underside = 0)
    // - Extruded downward-facing soffit vault from Crest 1 -> Valley 1 -> Crest 2 -> collar notches: rich deep crimson
    // - Outer arrowhead right slope (apex -> lowerWingTip) & lower-left emergence face: crisp shaded stone-grey
    const isSideWall = smoothstep(0.76, 0.34, Math.abs(nz));
    let downwardWall = smoothstep(0.22, -0.42, ny);
    const vaultStartMask = smoothstep(-2.45, -1.80, vx);

    if (forwardPastCollar > -0.05) {
      const alongT = nx * T.x + ny * T.y;
      const innerOverhangOnly = smoothstep(0.04, -0.44, alongT);
      const collarPocket = smoothstep(0.24, -0.08, forwardPastCollar);
      downwardWall = Math.max(
        downwardWall * innerOverhangOnly,
        collarPocket * smoothstep(0.24, -0.34, ny) * 0.92
      );
    }

    const innerDepthFactor = smoothstep(0.58, -0.45, vz);
    const wallCrimson = isSideWall * downwardWall * vaultStartMask * (0.76 + 0.24 * innerDepthFactor);

    const lowerFrontLip =
      forwardPastCollar < -0.02
        ? smoothstep(0.24, 0.78, nz) * smoothstep(-0.34, -0.82, ny) * vaultStartMask * 0.16
        : 0;

    underside[i] = clamp(Math.max(wallCrimson, lowerFrontLip), 0, 1);
  }

  geo.setAttribute("aUnderside", new THREE.BufferAttribute(underside, 1));
  geo.setAttribute("aTraceU", new THREE.BufferAttribute(traceU, 1));
  geo.computeBoundingSphere();

  // Sample continuous upper and lower front bevel ridge contours directly from the 2D shape boundary
  const frontRidgeZ = extrudeDepth * 0.5 + bevelThickness * 0.96;

  const upperHead2D: THREE.Vector2[] = [
    ...evalQuadraticBezier2D(uCollar, uFlangeCtrl, uFlangeEnd, 6),
    ...evalQuadraticBezier2D(uFlangeEnd, uWingCtrl, uWingFront, 6),
    uTipApproach,
    ...evalQuadraticBezier2D(uTipApproach, apexCtrl, apexPt, 5),
  ];

  const lowerHead2D: THREE.Vector2[] = [
    ...evalQuadraticBezier2D(lCollar, lFlangeCtrl, lFlangeEnd, 6),
    ...evalQuadraticBezier2D(lFlangeEnd, lWingCtrl, lWingFront, 6),
    lTipApproach,
    ...evalQuadraticBezier2D(lTipApproach, apexCtrl, apexPt, 5),
  ];

  const upperContour = [
    ...upper2D.filter((_, idx) => idx % 2 === 0 || idx === upper2D.length - 1),
    ...upperHead2D,
  ].map((p) => new THREE.Vector3(p.x, p.y, frontRidgeZ));

  const lowerContour = [
    ...lower2D.filter((_, idx) => idx % 2 === 0 || idx === lower2D.length - 1),
    ...lowerHead2D,
  ].map((p) => new THREE.Vector3(p.x, p.y, frontRidgeZ));

  const tipPoint = new THREE.Vector3(apexPt.x, apexPt.y, frontRidgeZ);

  return { geometry: geo, upperContour, lowerContour, tipPoint };
}

function createSculptureMaterial(roughnessTexture: THREE.CanvasTexture): {
  material: THREE.MeshPhysicalMaterial;
  updateUniforms: (elapsed: number, pulseU: number, crimsonBoost: number) => void;
} {
  const customUniforms = {
    uTime: { value: 0 },
    uPulseU: { value: 0.35 },
    uCrimsonBoost: { value: 0 },
  };

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xf2ebe3),
    roughness: 0.36,
    metalness: 0.02,
    clearcoat: 0.16,
    clearcoatRoughness: 0.34,
    reflectivity: 0.42,
    envMapIntensity: 0.18,
    roughnessMap: roughnessTexture,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = customUniforms.uTime;
    shader.uniforms.uPulseU = customUniforms.uPulseU;
    shader.uniforms.uCrimsonBoost = customUniforms.uCrimsonBoost;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        attribute float aUnderside;
        attribute float aTraceU;
        varying float vUnderside;
        varying float vTraceU;
        varying vec3 vLocalSculptPos;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vUnderside = aUnderside;
        vTraceU = aTraceU;
        vLocalSculptPos = position;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uTime;
        uniform float uPulseU;
        uniform float uCrimsonBoost;
        varying float vUnderside;
        varying float vTraceU;
        varying vec3 vLocalSculptPos;`
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        vec3 ivoryTone = vec3(0.94, 0.905, 0.865);
        vec3 deepWine = vec3(0.025, 0.0, 0.004);
        vec3 richCrimson = vec3(0.28, 0.002, 0.026);
        float underMask = smoothstep(0.10, 0.85, vUnderside);
        vec3 underAlbedo = mix(deepWine, richCrimson, smoothstep(0.32, 0.96, vUnderside));
        float buriedFade = smoothstep(-2.68, -2.26, vLocalSculptPos.y);
        float baseEmbed = smoothstep(0.0, 0.07, vTraceU) * buriedFade;
        diffuseColor.rgb = mix(vec3(0.03, 0.002, 0.005), mix(ivoryTone, underAlbedo, underMask), mix(0.22, 1.0, baseEmbed));`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float pulseDist = abs(vTraceU - uPulseU);
        float pulseWave = exp(-(pulseDist * pulseDist) / (0.11 * 0.11));
        float breath = 0.94 + 0.06 * sin(uTime * 1.45);
        float buriedMask = smoothstep(-2.64, -2.24, vLocalSculptPos.y);
        float underGlowMask = smoothstep(0.24, 0.92, vUnderside) * buriedMask;
        float softBevelBounce = smoothstep(0.08, 0.38, vUnderside) * buriedMask * (0.03 + 0.14 * pulseWave);
        vec3 crimsonInner = vec3(0.30, 0.001, 0.024);
        vec3 crimsonHot = vec3(0.74, 0.008, 0.068);
        vec3 innerLight = mix(crimsonInner, crimsonHot, clamp(vUnderside * 0.56 + pulseWave * 0.44, 0.0, 1.0));
        totalEmissiveRadiance += innerLight * (underGlowMask * (0.84 + uCrimsonBoost * 0.42) * breath + softBevelBounce);`
      );
  };

  material.customProgramCacheKey = () => "codesync_sculptural_growth_arrow_v7";

  return {
    material,
    updateUniforms: (elapsed: number, pulseU: number, crimsonBoost: number) => {
      customUniforms.uTime.value = elapsed;
      customUniforms.uPulseU.value = pulseU;
      customUniforms.uCrimsonBoost.value = crimsonBoost;
    },
  };
}

function createDarkCurvedPlatform(): {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshStandardMaterial;
  updateUniforms: (pulseWorldX: number, crimsonBoost: number) => void;
} {
  const width = 16.5;
  const depth = 9.0;
  const segX = 80;
  const segZ = 36;

  const geometry = new THREE.PlaneGeometry(width, depth, segX, segZ);
  geometry.rotateX(-Math.PI * 0.5);

  const pos = geometry.getAttribute("position");
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, platformHeightAt(x, z));
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  const customUniforms = {
    uPulseWorldX: { value: 0 },
    uCrimsonBoost: { value: 0 },
  };

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x020203),
    roughness: 0.86,
    metalness: 0.02,
    envMapIntensity: 0.02,
    transparent: true,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPulseWorldX = customUniforms.uPulseWorldX;
    shader.uniforms.uCrimsonBoost = customUniforms.uCrimsonBoost;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vPlatLocalPos;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vPlatLocalPos = position;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uPulseWorldX;
        uniform float uCrimsonBoost;
        varying vec3 vPlatLocalPos;`
      )
      .replace(
        "#include <alphamap_fragment>",
        `#include <alphamap_fragment>
        float ex = (vPlatLocalPos.x - 0.25) / 7.6;
        float ez = (vPlatLocalPos.z + 0.05) / 4.1;
        float radial = length(vec2(ex, ez));
        float edgeAlpha = 1.0 - smoothstep(0.72, 1.02, radial);
        float leftFeather = smoothstep(-6.6, -3.6, vPlatLocalPos.x);
        diffuseColor.a *= edgeAlpha * leftFeather;`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float ridgeSheen = exp(-pow((vPlatLocalPos.z - 0.62) / 1.15, 2.0)) * smoothstep(-4.6, 3.2, vPlatLocalPos.x) * 0.036;
        float pool1 = exp(-pow((vPlatLocalPos.x + 1.55) / 2.05, 2.0) - pow((vPlatLocalPos.z - 0.15) / 1.55, 2.0));
        float pool2 = exp(-pow((vPlatLocalPos.x - 0.85) / 2.25, 2.0) - pow((vPlatLocalPos.z - 0.15) / 1.55, 2.0));
        float pulsePool = exp(-pow((vPlatLocalPos.x - uPulseWorldX) / 1.55, 2.0) - pow(vPlatLocalPos.z / 1.5, 2.0));
        vec3 bounceRed = vec3(0.32, 0.002, 0.032);
        totalEmissiveRadiance += vec3(ridgeSheen) + bounceRed * ((pool1 * 0.48 + pool2 * 0.52 + pulsePool * 0.22) * (1.0 + uCrimsonBoost * 0.55));`
      );
  };

  material.customProgramCacheKey = () => "codesync_dark_platform_v6";

  return {
    geometry,
    material,
    updateUniforms: (pulseWorldX: number, crimsonBoost: number) => {
      customUniforms.uPulseWorldX.value = pulseWorldX;
      customUniforms.uCrimsonBoost.value = crimsonBoost;
    },
  };
}

export function buildArrowSculptureAssets(maxAnisotropy: number): ArrowSculptureAssets {
  const roughnessTexture = createSculptureRoughnessTexture(maxAnisotropy);
  const arrow = createMonolithicGrowthArrowGeometry();
  const { material: sculptureMaterial, updateUniforms: updateSculptUniforms } =
    createSculptureMaterial(roughnessTexture);
  const platform = createDarkCurvedPlatform();

  return {
    arrowGeometry: arrow.geometry,
    sculptureMaterial,
    platformGeometry: platform.geometry,
    platformMaterial: platform.material,
    roughnessTexture,
    contours: {
      upperContour: arrow.upperContour,
      lowerContour: arrow.lowerContour,
      tipPoint: arrow.tipPoint,
    },
    updateShaderUniforms: (elapsed: number, pulseU: number, crimsonBoost: number) => {
      updateSculptUniforms(elapsed, pulseU, crimsonBoost);
      const pulseFrame = evaluateArrowRibbonFrame(clamp(pulseU, 0, 1));
      platform.updateUniforms(pulseFrame.position.x, crimsonBoost);
    },
  };
}
