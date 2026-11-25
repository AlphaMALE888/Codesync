import * as THREE from "three";
import { platformHeightAt } from "@/lib/growthArrowHero";

export interface FloatingElementEntry {
  group: THREE.Group;
  basePosition: THREE.Vector3;
  baseRotation: THREE.Euler;
  floatAmplitude: number;
  floatSpeed: number;
  floatPhase: number;
  isSecondaryTile: boolean;
}

export interface MarketingElementsBundle {
  root: THREE.Group;
  entries: FloatingElementEntry[];
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
}

function createRoundedSquareShape(size: number, radius: number): THREE.Shape {
  const half = size * 0.5;
  const r = Math.min(radius, half * 0.45);
  const shape = new THREE.Shape();
  shape.moveTo(-half + r, -half);
  shape.lineTo(half - r, -half);
  shape.quadraticCurveTo(half, -half, half, -half + r);
  shape.lineTo(half, half - r);
  shape.quadraticCurveTo(half, half, half - r, half);
  shape.lineTo(-half + r, half);
  shape.quadraticCurveTo(-half, half, -half, half - r);
  shape.lineTo(-half, -half + r);
  shape.quadraticCurveTo(-half, -half, -half + r, -half);
  shape.closePath();
  return shape;
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const hw = width * 0.5;
  const hh = height * 0.5;
  const r = Math.min(radius, hw * 0.45, hh * 0.45);
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  shape.closePath();
  return shape;
}

function createSectorShape(
  radius: number,
  startAngle: number,
  endAngle: number,
  segments = 28
): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  for (let i = 0; i <= segments; i++) {
    const a = startAngle + (i / segments) * (endAngle - startAngle);
    shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  shape.closePath();
  return shape;
}

function createRingShape(outerR: number, innerR: number, segments = 32): THREE.Shape {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      size * 0.06,
      size * 0.5,
      size * 0.5,
      size * 0.5
    );
    grad.addColorStop(0, "rgba(0, 0, 0, 0.78)");
    grad.addColorStop(0.55, "rgba(0, 0, 0, 0.34)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function buildMarketingElements(
  roughnessTexture: THREE.CanvasTexture,
  castShadowOnGpu: boolean
): MarketingElementsBundle {
  const root = new THREE.Group();
  root.name = "supportingMarketingElements";

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const entries: FloatingElementEntry[] = [];

  // Shared calibrated PBR materials (roughness varies >= 0.25 between ivory tiles and crimson accents)
  const ivoryMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xefe8e0),
    roughness: 0.32,
    metalness: 0.03,
    clearcoat: 0.24,
    clearcoatRoughness: 0.32,
    envMapIntensity: 0.20,
    roughnessMap: roughnessTexture,
  });

  const barColumnMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xede5dd),
    roughness: 0.30,
    metalness: 0.04,
    clearcoat: 0.28,
    clearcoatRoughness: 0.30,
    envMapIntensity: 0.20,
    roughnessMap: roughnessTexture,
  });

  const crimsonAccentMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xa60b23),
    emissive: new THREE.Color(0x3a000a),
    emissiveIntensity: 0.34,
    roughness: 0.55,
    metalness: 0.06,
    clearcoat: 0.24,
    clearcoatRoughness: 0.36,
    envMapIntensity: 0.42,
  });

  const crimsonDeepMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x88061a),
    emissive: new THREE.Color(0x2a0007),
    emissiveIntensity: 0.28,
    roughness: 0.58,
    metalness: 0.08,
    envMapIntensity: 0.38,
  });

  const contactTex = createContactShadowTexture();
  textures.push(contactTex);

  const contactShadowMat = new THREE.MeshBasicMaterial({
    map: contactTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });

  materials.push(ivoryMat, barColumnMat, crimsonAccentMat, crimsonDeepMat, contactShadowMat);

  // ---------------------------------------------------------------------------
  // 1. Floating Analytics Tile (above Valley 1 / Crest 2) with 4 ascending crimson bars
  // ---------------------------------------------------------------------------
  const analyticsGroup = new THREE.Group();
  analyticsGroup.name = "analyticsTile";

  const tileBaseGeo = new THREE.ExtrudeGeometry(createRoundedSquareShape(0.84, 0.12), {
    depth: 0.13,
    steps: 1,
    curveSegments: 14,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.026,
    bevelSegments: 4,
  });
  tileBaseGeo.translate(0, 0, -0.065);
  tileBaseGeo.computeVertexNormals();
  geometries.push(tileBaseGeo);

  const analyticsSlab = new THREE.Mesh(tileBaseGeo, ivoryMat);
  analyticsSlab.castShadow = castShadowOnGpu;
  analyticsSlab.receiveShadow = true;
  analyticsGroup.add(analyticsSlab);

  const miniBarSpecs = [
    { x: -0.21, h: 0.14 },
    { x: -0.07, h: 0.23 },
    { x: 0.07, h: 0.33 },
    { x: 0.21, h: 0.44 },
  ];
  const barBaseY = -0.23;
  for (const spec of miniBarSpecs) {
    const bGeo = new THREE.ExtrudeGeometry(createRoundedRectShape(0.088, spec.h, 0.016), {
      depth: 0.055,
      steps: 1,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.010,
      bevelSegments: 3,
    });
    bGeo.computeVertexNormals();
    geometries.push(bGeo);

    const barMesh = new THREE.Mesh(bGeo, crimsonAccentMat);
    barMesh.position.set(spec.x, barBaseY + spec.h * 0.5, 0.082);
    analyticsGroup.add(barMesh);
  }

  analyticsGroup.position.set(-0.08, 1.56, 0.24);
  analyticsGroup.rotation.set(0.14, -0.36, 0.10);
  root.add(analyticsGroup);

  entries.push({
    group: analyticsGroup,
    basePosition: analyticsGroup.position.clone(),
    baseRotation: analyticsGroup.rotation.clone(),
    floatAmplitude: 0.085,
    floatSpeed: 1.05,
    floatPhase: 0.4,
    isSecondaryTile: true,
  });

  // ---------------------------------------------------------------------------
  // 2. Floating Target Tile (mid-left above Crest 1) with crimson rings & dart
  // ---------------------------------------------------------------------------
  const targetGroup = new THREE.Group();
  targetGroup.name = "targetTile";

  const targetSlab = new THREE.Mesh(tileBaseGeo, ivoryMat);
  targetSlab.scale.setScalar(0.86);
  targetSlab.castShadow = castShadowOnGpu;
  targetSlab.receiveShadow = true;
  targetGroup.add(targetSlab);

  const outerRingGeo = new THREE.ExtrudeGeometry(createRingShape(0.22, 0.16, 28), {
    depth: 0.036,
    steps: 1,
    curveSegments: 20,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  const innerRingGeo = new THREE.ExtrudeGeometry(createRingShape(0.115, 0.068, 24), {
    depth: 0.04,
    steps: 1,
    curveSegments: 18,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.009,
    bevelSegments: 2,
  });
  const centerDotGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 18);
  centerDotGeo.rotateX(Math.PI * 0.5);

  const dartShaftGeo = new THREE.CylinderGeometry(0.015, 0.012, 0.28, 12);
  const dartTipGeo = new THREE.ConeGeometry(0.032, 0.075, 12);
  const dartFletchGeo = new THREE.BoxGeometry(0.08, 0.055, 0.014);

  geometries.push(
    outerRingGeo,
    innerRingGeo,
    centerDotGeo,
    dartShaftGeo,
    dartTipGeo,
    dartFletchGeo
  );

  const outerRing = new THREE.Mesh(outerRingGeo, crimsonAccentMat);
  outerRing.position.set(0, 0, 0.08);
  const innerRing = new THREE.Mesh(innerRingGeo, crimsonAccentMat);
  innerRing.position.set(0, 0, 0.084);
  const centerDot = new THREE.Mesh(centerDotGeo, crimsonDeepMat);
  centerDot.position.set(0, 0, 0.09);

  const dartGroup = new THREE.Group();
  const shaft = new THREE.Mesh(dartShaftGeo, crimsonDeepMat);
  shaft.position.set(0, 0.14, 0);
  const tip = new THREE.Mesh(dartTipGeo, crimsonAccentMat);
  tip.rotation.z = Math.PI;
  tip.position.set(0, 0.02, 0);
  const fletchA = new THREE.Mesh(dartFletchGeo, crimsonAccentMat);
  fletchA.position.set(0, 0.25, 0);
  const fletchB = new THREE.Mesh(dartFletchGeo, crimsonAccentMat);
  fletchB.rotation.y = Math.PI * 0.5;
  fletchB.position.set(0, 0.25, 0);
  dartGroup.add(shaft, tip, fletchA, fletchB);
  dartGroup.position.set(0.02, 0.02, 0.11);
  dartGroup.rotation.set(0.55, 0.15, -0.78);

  targetGroup.add(outerRing, innerRing, centerDot, dartGroup);
  targetGroup.position.set(-1.94, 0.40, 0.58);
  targetGroup.rotation.set(0.16, -0.34, 0.12);
  targetGroup.scale.setScalar(0.90);
  root.add(targetGroup);

  entries.push({
    group: targetGroup,
    basePosition: targetGroup.position.clone(),
    baseRotation: targetGroup.rotation.clone(),
    floatAmplitude: 0.075,
    floatSpeed: 0.92,
    floatPhase: 1.85,
    isSecondaryTile: true,
  });

  // ---------------------------------------------------------------------------
  // 3. Grounded 3D Ascending Bar Chart (3 beveled ivory columns resting on platform)
  // ---------------------------------------------------------------------------
  const barChartGroup = new THREE.Group();
  barChartGroup.name = "groundedBarChart";

  const columnSpecs = [
    { x: 0.44, z: 0.46, w: 0.46, d: 0.44, h: 0.48 },
    { x: 1.12, z: 0.38, w: 0.48, d: 0.46, h: 0.88 },
    { x: 1.80, z: 0.30, w: 0.50, d: 0.48, h: 1.38 },
  ];

  const shadowDiscGeo = new THREE.CircleGeometry(0.42, 24);
  shadowDiscGeo.rotateX(-Math.PI * 0.5);
  geometries.push(shadowDiscGeo);

  for (const col of columnSpecs) {
    const floorY = platformHeightAt(col.x, col.z);
    // Extrude horizontally and rotate so height grows +Y from y=0 base (bottom-center pivot)
    const colGeo = new THREE.ExtrudeGeometry(createRoundedRectShape(col.w, col.d, 0.048), {
      depth: col.h,
      steps: 1,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 0.028,
      bevelSize: 0.026,
      bevelSegments: 5,
    });
    colGeo.rotateX(-Math.PI * 0.5);
    colGeo.translate(0, 0.028, 0); // shift bottom bevel cleanly onto y = 0
    colGeo.computeVertexNormals();
    geometries.push(colGeo);

    const colMesh = new THREE.Mesh(colGeo, barColumnMat);
    colMesh.position.set(col.x, floorY - 0.03, col.z);
    colMesh.rotation.y = -0.28;
    colMesh.castShadow = castShadowOnGpu;
    colMesh.receiveShadow = true;
    barChartGroup.add(colMesh);

    const contactDisc = new THREE.Mesh(shadowDiscGeo, contactShadowMat);
    contactDisc.position.set(col.x, floorY + 0.015, col.z);
    contactDisc.scale.set(col.w * 1.45, 1, col.d * 1.45);
    barChartGroup.add(contactDisc);
  }

  root.add(barChartGroup);
  entries.push({
    group: barChartGroup,
    basePosition: barChartGroup.position.clone(),
    baseRotation: barChartGroup.rotation.clone(),
    floatAmplitude: 0,
    floatSpeed: 0,
    floatPhase: 0,
    isSecondaryTile: false,
  });

  // ---------------------------------------------------------------------------
  // 4. Floating 3D Pie Chart (290° beveled ivory body + 70° popped-out crimson wedge)
  // ---------------------------------------------------------------------------
  const pieGroup = new THREE.Group();
  pieGroup.name = "pieChartElement";

  const pieRadius = 0.44;
  const wedgeStart = 0.38;
  const wedgeEnd = wedgeStart + 1.24; // ~71 deg crimson sector

  const mainPieShape = createSectorShape(pieRadius, wedgeEnd + 0.06, wedgeStart + Math.PI * 2 - 0.06, 32);
  const wedgeShape = createSectorShape(pieRadius * 1.04, wedgeStart, wedgeEnd, 14);

  const mainPieGeo = new THREE.ExtrudeGeometry(mainPieShape, {
    depth: 0.16,
    steps: 1,
    curveSegments: 24,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.026,
    bevelSegments: 4,
  });
  mainPieGeo.translate(0, 0, -0.08);
  mainPieGeo.computeVertexNormals();

  const wedgeGeo = new THREE.ExtrudeGeometry(wedgeShape, {
    depth: 0.18,
    steps: 1,
    curveSegments: 14,
    bevelEnabled: true,
    bevelThickness: 0.026,
    bevelSize: 0.024,
    bevelSegments: 4,
  });
  wedgeGeo.translate(0, 0, -0.09);
  wedgeGeo.computeVertexNormals();

  geometries.push(mainPieGeo, wedgeGeo);

  const mainPieMesh = new THREE.Mesh(mainPieGeo, ivoryMat);
  mainPieMesh.castShadow = castShadowOnGpu;
  mainPieMesh.receiveShadow = true;

  const midAngle = (wedgeStart + wedgeEnd) * 0.5;
  const wedgeMesh = new THREE.Mesh(wedgeGeo, crimsonAccentMat);
  wedgeMesh.position.set(Math.cos(midAngle) * 0.11, Math.sin(midAngle) * 0.11, 0.06);
  wedgeMesh.castShadow = castShadowOnGpu;

  pieGroup.add(mainPieMesh, wedgeMesh);
  pieGroup.position.set(2.94, -1.04, 0.34);
  pieGroup.rotation.set(-0.18, -0.38, 0.14);
  root.add(pieGroup);

  entries.push({
    group: pieGroup,
    basePosition: pieGroup.position.clone(),
    baseRotation: pieGroup.rotation.clone(),
    floatAmplitude: 0.065,
    floatSpeed: 0.88,
    floatPhase: 3.1,
    isSecondaryTile: true,
  });

  return { root, entries, geometries, materials, textures };
}
