import * as THREE from "three";
import {
  evaluateArrowRibbonFrame,
  evaluateRibbonHalfDepth,
  evaluateRibbonHalfHeight,
  platformHeightAt,
} from "@/lib/growthArrowHero";
import { clamp, smoothstep } from "@/lib/visualExperience";

export interface ArrowContourData {
  upperContour: THREE.Vector3[];
  lowerContour: THREE.Vector3[];
  arrowheadPerimeter: THREE.Vector3[];
  tipPoint: THREE.Vector3;
}

export interface ArrowSculptureAssets {
  ribbonGeometry: THREE.BufferGeometry;
  arrowheadGeometry: THREE.BufferGeometry;
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

    // Deterministic subtle mineral grain
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const img = ctx.getImageData(0, 0, size, size);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (rand() - 0.5) * 26;
      const v = clamp(Math.round(145 + n), 108, 188);
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

/**
 * Generates a rounded-bevel rectangular cross-section ring in normalized (nx, ny) space:
 * nx along depth axis B (+1 front, -1 back), ny along ribbon height U (+1 crest, -1 underside).
 */
function buildRoundedRectProfile(cornerRadius = 0.24, segPerCorner = 6): Array<{
  nx: number;
  ny: number;
  undersideWeight: number;
}> {
  const pts: Array<{ nx: number; ny: number }> = [];
  const r = clamp(cornerRadius, 0.05, 0.45);
  const inner = 1 - r;

  const corners: Array<{ cx: number; cy: number; startAngle: number }> = [
    { cx: inner, cy: inner, startAngle: 0 }, // top-front
    { cx: -inner, cy: inner, startAngle: Math.PI * 0.5 }, // top-back
    { cx: -inner, cy: -inner, startAngle: Math.PI }, // bottom-back
    { cx: inner, cy: -inner, startAngle: Math.PI * 1.5 }, // bottom-front
  ];

  for (const c of corners) {
    for (let s = 0; s <= segPerCorner; s++) {
      const a = c.startAngle + (s / segPerCorner) * (Math.PI * 0.5);
      pts.push({
        nx: c.cx + Math.cos(a) * r,
        ny: c.cy + Math.sin(a) * r,
      });
    }
  }

  return pts.map((p) => {
    // Underside crimson glow concentrates on the bottom soffit and wraps slightly onto the lower-front bevel
    const bottomFace = smoothstep(-0.22, -0.84, p.ny);
    const frontRoll = smoothstep(-0.08, -0.58, p.ny) * smoothstep(-0.2, 0.85, p.nx) * 0.45;
    return {
      nx: p.nx,
      ny: p.ny,
      undersideWeight: clamp(Math.max(bottomFace, frontRoll), 0, 1),
    };
  });
}

function createRibbonSweepGeometry(): {
  geometry: THREE.BufferGeometry;
  upperContour: THREE.Vector3[];
  lowerContour: THREE.Vector3[];
} {
  const spineSteps = 128;
  const profile = buildRoundedRectProfile(0.24, 5);
  const ringCount = profile.length;

  const positions: number[] = [];
  const uvs: number[] = [];
  const undersideAttr: number[] = [];
  const traceUAttr: number[] = [];
  const indices: number[] = [];

  const upperContour: THREE.Vector3[] = [];
  const lowerContour: THREE.Vector3[] = [];

  for (let i = 0; i <= spineSteps; i++) {
    const u = i / spineSteps;
    const frame = evaluateArrowRibbonFrame(u);
    const halfH = evaluateRibbonHalfHeight(u);
    const halfD = evaluateRibbonHalfDepth(u);

    // Slight soffit boost beneath the arches where crimson reflection pools strongly
    const archFactor = 0.82 + 0.24 * (1 - smoothstep(0.75, 1.0, u));
    const traceU = u * 0.8; // Ribbon runs 0.0 -> 0.80, arrowhead covers 0.78 -> 1.0

    for (let j = 0; j < ringCount; j++) {
      const p = profile[j];
      const bx = p.nx * halfD;
      const uy = p.ny * halfH;

      const vx = frame.position.x + frame.binormal.x * bx + frame.up.x * uy;
      const vy = frame.position.y + frame.binormal.y * bx + frame.up.y * uy;
      const vz = frame.position.z + frame.binormal.z * bx + frame.up.z * uy;

      positions.push(vx, vy, vz);
      uvs.push(u * 4.0, j / ringCount);
      undersideAttr.push(clamp(p.undersideWeight * archFactor, 0, 1));
      traceUAttr.push(traceU);
    }

    // Record exact front-top & front-bottom bevel ridge contours proud of the rounded corner for the glowing outline trace
    const edgeD = halfD * 0.975;
    const edgeH = halfH * 0.955;
    upperContour.push(
      new THREE.Vector3(
        frame.position.x + frame.binormal.x * edgeD + frame.up.x * edgeH,
        frame.position.y + frame.binormal.y * edgeD + frame.up.y * edgeH,
        frame.position.z + frame.binormal.z * edgeD + frame.up.z * edgeH
      )
    );
    lowerContour.push(
      new THREE.Vector3(
        frame.position.x + frame.binormal.x * edgeD - frame.up.x * edgeH,
        frame.position.y + frame.binormal.y * edgeD - frame.up.y * edgeH,
        frame.position.z + frame.binormal.z * edgeD - frame.up.z * edgeH
      )
    );
  }

  for (let i = 0; i < spineSteps; i++) {
    const rowA = i * ringCount;
    const rowB = (i + 1) * ringCount;
    for (let j = 0; j < ringCount; j++) {
      const jNext = (j + 1) % ringCount;
      const a = rowA + j;
      const b = rowB + j;
      const c = rowB + jNext;
      const d = rowA + jNext;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Cap terminal faces at emergence and collar
  const startCenterIdx = positions.length / 3;
  const startFrame = evaluateArrowRibbonFrame(0);
  positions.push(startFrame.position.x, startFrame.position.y, startFrame.position.z);
  uvs.push(0, 0.5);
  undersideAttr.push(0.5);
  traceUAttr.push(0);
  for (let j = 0; j < ringCount; j++) {
    const jNext = (j + 1) % ringCount;
    indices.push(startCenterIdx, jNext, j);
  }

  const endCenterIdx = positions.length / 3;
  const endFrame = evaluateArrowRibbonFrame(1);
  positions.push(endFrame.position.x, endFrame.position.y, endFrame.position.z);
  uvs.push(4, 0.5);
  undersideAttr.push(0.2);
  traceUAttr.push(0.8);
  const lastRow = spineSteps * ringCount;
  for (let j = 0; j < ringCount; j++) {
    const jNext = (j + 1) % ringCount;
    indices.push(endCenterIdx, lastRow + j, lastRow + jNext);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aUnderside", new THREE.Float32BufferAttribute(undersideAttr, 1));
  geometry.setAttribute("aTraceU", new THREE.Float32BufferAttribute(traceUAttr, 1));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return { geometry, upperContour, lowerContour };
}

function createBeveledArrowheadGeometry(): {
  geometry: THREE.BufferGeometry;
  perimeterPoints: THREE.Vector3[];
  tipPoint: THREE.Vector3;
} {
  // Build rounded bold arrowhead in local 2D space: +X along tangent T, +Y along up U
  const wingSpan = 1.24;
  const tipX = 1.72;
  const shoulderX = -0.14;
  const notchX = 0.08;
  const neckHalfY = 0.34;

  const shape = new THREE.Shape();
  shape.moveTo(notchX, neckHalfY);
  shape.quadraticCurveTo(shoulderX - 0.14, neckHalfY + 0.18, shoulderX - 0.08, wingSpan - 0.24);
  shape.quadraticCurveTo(shoulderX + 0.02, wingSpan + 0.04, shoulderX + 0.28, wingSpan - 0.14);
  shape.lineTo(tipX - 0.22, 0.19);
  shape.quadraticCurveTo(tipX + 0.06, 0, tipX - 0.22, -0.19);
  shape.lineTo(shoulderX + 0.28, -(wingSpan - 0.14));
  shape.quadraticCurveTo(shoulderX + 0.02, -(wingSpan + 0.04), shoulderX - 0.08, -(wingSpan - 0.24));
  shape.quadraticCurveTo(shoulderX - 0.14, -(neckHalfY + 0.18), notchX, -neckHalfY);
  shape.closePath();

  const extrudeDepth = 0.72;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    steps: 2,
    curveSegments: 22,
    bevelEnabled: true,
    bevelThickness: 0.13,
    bevelSize: 0.10,
    bevelSegments: 5,
  });

  // Center along Z (depth axis B)
  geo.translate(0, 0, -extrudeDepth * 0.5);
  geo.computeVertexNormals();

  const posAttr = geo.getAttribute("position");
  const normAttr = geo.getAttribute("normal");
  const count = posAttr.count;

  const underside = new Float32Array(count);
  const traceU = new Float32Array(count);

  const endFrame = evaluateArrowRibbonFrame(1);
  const T = new THREE.Vector3(endFrame.tangent.x, endFrame.tangent.y, endFrame.tangent.z);
  const U = new THREE.Vector3(endFrame.up.x, endFrame.up.y, endFrame.up.z);
  const B = new THREE.Vector3(endFrame.binormal.x, endFrame.binormal.y, endFrame.binormal.z);

  const origin = new THREE.Vector3(
    endFrame.position.x,
    endFrame.position.y,
    endFrame.position.z
  ).addScaledVector(T, -0.12);

  const basis = new THREE.Matrix4().makeBasis(T, U, B);
  basis.setPosition(origin);

  const normalMatrix = new THREE.Matrix3().getNormalMatrix(basis);
  const tmpPos = new THREE.Vector3();
  const tmpNorm = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const lx = posAttr.getX(i);
    const ly = posAttr.getY(i);
    const lz = posAttr.getZ(i);

    const nx = normAttr.getX(i);
    const ny = normAttr.getY(i);
    const nz = normAttr.getZ(i);

    // Underside crimson glow concentrates beneath the lower wing & inner wing shoulder bevels
    const lowerWing = smoothstep(0.05, -0.82, ly) * smoothstep(0.25, -0.7, ny);
    const upperShoulderUnder = smoothstep(0.28, 0.92, ly) * smoothstep(-0.15, -0.82, nx) * 0.88;
    const lowerFrontGlow = smoothstep(-0.35, -1.18, ly) * smoothstep(0.1, 0.85, lz) * 0.32;
    underside[i] = clamp(Math.max(lowerWing, upperShoulderUnder, lowerFrontGlow), 0, 1);

    traceU[i] = clamp(0.78 + ((lx + 0.25) / (tipX + 0.25)) * 0.22, 0.78, 1.0);

    tmpPos.set(lx, ly, lz).applyMatrix4(basis);
    posAttr.setXYZ(i, tmpPos.x, tmpPos.y, tmpPos.z);

    tmpNorm.set(nx, ny, nz).applyMatrix3(normalMatrix).normalize();
    normAttr.setXYZ(i, tmpNorm.x, tmpNorm.y, tmpNorm.z);
  }

  geo.setAttribute("aUnderside", new THREE.BufferAttribute(underside, 1));
  geo.setAttribute("aTraceU", new THREE.BufferAttribute(traceU, 1));
  geo.computeBoundingSphere();

  // Sample front bevel perimeter points proud of extrudeDepth*0.5 + bevelThickness (0.49) so trace hugs outer edge cleanly
  const frontZ = extrudeDepth * 0.5 + 0.128;
  const perimeterLocal: Array<[number, number]> = [
    [notchX, neckHalfY],
    [shoulderX - 0.08, wingSpan * 0.58],
    [shoulderX + 0.04, wingSpan - 0.02],
    [shoulderX + 0.28, wingSpan - 0.11],
    [tipX * 0.54, wingSpan * 0.53],
    [tipX + 0.04, 0.0],
    [tipX * 0.54, -wingSpan * 0.53],
    [shoulderX + 0.28, -(wingSpan - 0.11)],
    [shoulderX + 0.04, -(wingSpan - 0.02)],
    [shoulderX - 0.08, -wingSpan * 0.58],
    [notchX, -neckHalfY],
  ];

  const perimeterPoints = perimeterLocal.map(([lx, ly]) =>
    new THREE.Vector3(lx, ly, frontZ).applyMatrix4(basis)
  );
  const tipPoint = new THREE.Vector3(tipX + 0.04, 0, frontZ).applyMatrix4(basis);

  return { geometry: geo, perimeterPoints, tipPoint };
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
    color: new THREE.Color(0xeae3dc),
    roughness: 0.35,
    metalness: 0.03,
    clearcoat: 0.14,
    clearcoatRoughness: 0.35,
    reflectivity: 0.45,
    envMapIntensity: 0.30,
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
        vec3 ivoryTone = vec3(0.90, 0.875, 0.845);
        vec3 deepWine = vec3(0.035, 0.0, 0.005);
        vec3 richCrimson = vec3(0.20, 0.002, 0.020);
        float underMask = smoothstep(0.08, 0.85, vUnderside);
        vec3 underAlbedo = mix(deepWine, richCrimson, smoothstep(0.32, 0.95, vUnderside));
        float buriedFade = smoothstep(-2.45, -2.12, vLocalSculptPos.y);
        float baseEmbed = smoothstep(0.0, 0.08, vTraceU) * buriedFade;
        diffuseColor.rgb = mix(vec3(0.03, 0.002, 0.005), mix(ivoryTone, underAlbedo, underMask), mix(0.18, 1.0, baseEmbed));`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float pulseDist = abs(vTraceU - uPulseU);
        float pulseWave = exp(-(pulseDist * pulseDist) / (0.11 * 0.11));
        float breath = 0.94 + 0.06 * sin(uTime * 1.45);
        float buriedMask = smoothstep(-2.42, -2.08, vLocalSculptPos.y);
        float underGlowMask = smoothstep(0.24, 0.94, vUnderside) * buriedMask;
        float softBevelBounce = smoothstep(0.10, 0.40, vUnderside) * buriedMask * (0.04 + 0.14 * pulseWave);
        vec3 crimsonInner = vec3(0.24, 0.001, 0.020);
        vec3 crimsonHot = vec3(0.58, 0.006, 0.056);
        vec3 innerLight = mix(crimsonInner, crimsonHot, clamp(vUnderside * 0.56 + pulseWave * 0.44, 0.0, 1.0));
        totalEmissiveRadiance += innerLight * (underGlowMask * (0.68 + uCrimsonBoost * 0.42) * breath + softBevelBounce);`
      );
  };

  material.customProgramCacheKey = () => "codesync_sculptural_growth_arrow_v4";

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
    roughness: 0.72,
    metalness: 0.02,
    envMapIntensity: 0.03,
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
        // Smooth radial elliptical feathering kept opaque under the arrow emergence so the submerged root never peeks through
        float ex = (vPlatLocalPos.x - 0.3) / 7.5;
        float ez = (vPlatLocalPos.z + 0.05) / 4.1;
        float radial = length(vec2(ex, ez));
        float edgeAlpha = 1.0 - smoothstep(0.72, 1.02, radial);
        float leftFeather = smoothstep(-6.4, -3.4, vPlatLocalPos.x);
        diffuseColor.a *= edgeAlpha * leftFeather;`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        // Subtle dark obsidian horizon sheen + broad ruby crimson bounce light pools beneath arches & bars
        float ridgeSheen = exp(-pow((vPlatLocalPos.z - 0.65) / 1.15, 2.0)) * smoothstep(-4.4, 3.2, vPlatLocalPos.x) * 0.032;
        float pool1 = exp(-pow((vPlatLocalPos.x + 1.45) / 1.65, 2.0) - pow((vPlatLocalPos.z - 0.25) / 1.35, 2.0));
        float pool2 = exp(-pow((vPlatLocalPos.x - 1.0) / 2.0, 2.0) - pow((vPlatLocalPos.z - 0.15) / 1.45, 2.0));
        float pulsePool = exp(-pow((vPlatLocalPos.x - uPulseWorldX) / 1.35, 2.0) - pow(vPlatLocalPos.z / 1.35, 2.0));
        vec3 bounceRed = vec3(0.28, 0.002, 0.028);
        totalEmissiveRadiance += vec3(ridgeSheen) + bounceRed * ((pool1 * 0.44 + pool2 * 0.50 + pulsePool * 0.24) * (1.0 + uCrimsonBoost * 0.55));`
      );
  };

  material.customProgramCacheKey = () => "codesync_dark_platform_v4";

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
  const ribbon = createRibbonSweepGeometry();
  const arrowhead = createBeveledArrowheadGeometry();
  const { material: sculptureMaterial, updateUniforms: updateSculptUniforms } =
    createSculptureMaterial(roughnessTexture);
  const platform = createDarkCurvedPlatform();

  return {
    ribbonGeometry: ribbon.geometry,
    arrowheadGeometry: arrowhead.geometry,
    sculptureMaterial,
    platformGeometry: platform.geometry,
    platformMaterial: platform.material,
    roughnessTexture,
    contours: {
      upperContour: ribbon.upperContour,
      lowerContour: ribbon.lowerContour,
      arrowheadPerimeter: arrowhead.perimeterPoints,
      tipPoint: arrowhead.tipPoint,
    },
    updateShaderUniforms: (elapsed: number, pulseU: number, crimsonBoost: number) => {
      updateSculptUniforms(elapsed, pulseU, crimsonBoost);
      const pulseFrame = evaluateArrowRibbonFrame(clamp(pulseU, 0, 1));
      platform.updateUniforms(pulseFrame.position.x, crimsonBoost);
    },
  };
}
