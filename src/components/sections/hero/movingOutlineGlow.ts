import * as THREE from "three";
import type { ArrowContourData } from "./growthArrowGeometry";
import { clamp } from "@/lib/visualExperience";

export interface MovingOutlineGlowRig {
  group: THREE.Group;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  update: (phase: number, boost: number, reducedMotion: boolean) => void;
  getPrimaryPulsePoint: (phase: number, out: THREE.Vector3) => THREE.Vector3;
}

function buildTracedTubeGeometry(
  curve: THREE.CatmullRomCurve3,
  tubularSegments: number,
  radius: number,
  radialSegments = 6
): THREE.TubeGeometry {
  const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
  const posAttr = geo.getAttribute("position");
  const uvAttr = geo.getAttribute("uv");
  const traceU = new Float32Array(posAttr.count);

  for (let i = 0; i < posAttr.count; i++) {
    // TubeGeometry sets uv.x = i / tubularSegments along length
    traceU[i] = clamp(uvAttr.getX(i), 0, 1);
  }
  geo.setAttribute("aTraceU", new THREE.BufferAttribute(traceU, 1));
  geo.computeBoundingSphere();
  return geo;
}

function createOutlineTraceMaterial(mode: "base" | "core" | "halo"): THREE.ShaderMaterial {
  const isBase = mode === "base";
  const isHalo = mode === "halo";

  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: isBase ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms: {
      uPhase: { value: 0 },
      uBoost: { value: 0 },
      uReducedMotion: { value: 0 },
      uIsHalo: { value: isHalo ? 1.0 : 0.0 },
      uIsBase: { value: isBase ? 1.0 : 0.0 },
    },
    vertexShader: `
      attribute float aTraceU;
      varying float vTraceU;
      varying vec3 vViewNormal;
      varying vec3 vViewDir;

      void main() {
        vTraceU = aTraceU;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uPhase;
      uniform float uBoost;
      uniform float uReducedMotion;
      uniform float uIsHalo;
      uniform float uIsBase;

      varying float vTraceU;
      varying vec3 vViewNormal;
      varying vec3 vViewDir;

      float evalComet(float u, float headPos, float tailLen, float headSigma) {
        float distBehind = headPos - u;
        if (distBehind < -0.055) return 0.0;
        if (distBehind < 0.0) {
          return exp(-(distBehind * distBehind) / (0.022 * 0.022));
        }
        float tail = exp(-distBehind / tailLen);
        float head = exp(-(distBehind * distBehind) / (headSigma * headSigma));
        return clamp(tail * 0.72 + head * 0.78, 0.0, 1.0);
      }

      void main() {
        float p1Phase = fract(uPhase);
        float p2Phase = fract(uPhase + 0.52);

        float head1 = p1Phase * 1.32 - 0.16;
        float head2 = p2Phase * 1.32 - 0.16;

        float comet1 = evalComet(vTraceU, head1, 0.16, 0.030);
        float comet2 = evalComet(vTraceU, head2, 0.125, 0.026) * 0.80;
        float pulse = max(comet1, comet2);

        float staticGlow = 0.32;
        float activePulse = mix(pulse, staticGlow, step(0.5, uReducedMotion));

        float endFade = smoothstep(0.02, 0.095, vTraceU) * (1.0 - smoothstep(0.955, 1.0, vTraceU) * 0.20);
        float facing = abs(dot(normalize(vViewNormal), normalize(vViewDir)));

        if (uIsBase > 0.5) {
          vec3 wineEdge = vec3(0.45, 0.008, 0.045);
          vec3 pulseEdge = vec3(0.96, 0.045, 0.13);
          vec3 baseCol = mix(wineEdge, pulseEdge, activePulse);
          float baseAlpha = (0.12 + activePulse * 0.82) * endFade * pow(facing, 0.55);
          gl_FragColor = vec4(baseCol, clamp(baseAlpha, 0.0, 0.95));
          return;
        }

        float radialProfile = uIsHalo > 0.5 ? pow(facing, 2.4) : pow(facing, 0.78);
        vec3 deepCrimson = vec3(0.62, 0.008, 0.055);
        vec3 vividCrimson = vec3(0.95, 0.035, 0.115);
        vec3 hotCrimsonPeak = vec3(1.0, 0.14, 0.22);

        float hotMix = smoothstep(0.62, 1.0, activePulse);
        vec3 baseCol = mix(deepCrimson, vividCrimson, smoothstep(0.08, 0.65, activePulse));
        vec3 col = mix(baseCol, hotCrimsonPeak, hotMix * (1.0 - uIsHalo * 0.75));

        float baseIdle = uIsHalo > 0.5 ? 0.015 : 0.05;
        float pulseGain = uIsHalo > 0.5 ? 0.48 : 0.96;
        float alpha = (baseIdle + activePulse * pulseGain) * (1.0 + uBoost * 0.42) * endFade * radialProfile;

        gl_FragColor = vec4(col * alpha, clamp(alpha, 0.0, 1.0));
      }
    `,
  });
}

export function buildMovingOutlineGlow(contours: ArrowContourData): MovingOutlineGlowRig {
  const group = new THREE.Group();
  group.name = "arrowMovingOutlineGlow";

  const upperCurve = new THREE.CatmullRomCurve3(
    contours.upperContour,
    false,
    "centripetal",
    0.25
  );

  const lowerCurve = new THREE.CatmullRomCurve3(
    contours.lowerContour,
    false,
    "centripetal",
    0.25
  );

  const baseMat = createOutlineTraceMaterial("base");
  const coreMat = createOutlineTraceMaterial("core");
  const haloMat = createOutlineTraceMaterial("halo");

  const upperBaseGeo = buildTracedTubeGeometry(upperCurve, 136, 0.015, 6);
  const upperCoreGeo = buildTracedTubeGeometry(upperCurve, 136, 0.022, 6);
  const upperHaloGeo = buildTracedTubeGeometry(upperCurve, 120, 0.052, 6);
  const lowerBaseGeo = buildTracedTubeGeometry(lowerCurve, 136, 0.015, 6);
  const lowerCoreGeo = buildTracedTubeGeometry(lowerCurve, 136, 0.022, 6);
  const lowerHaloGeo = buildTracedTubeGeometry(lowerCurve, 120, 0.052, 6);

  const upperBase = new THREE.Mesh(upperBaseGeo, baseMat);
  const upperCore = new THREE.Mesh(upperCoreGeo, coreMat);
  const upperHalo = new THREE.Mesh(upperHaloGeo, haloMat);
  const lowerBase = new THREE.Mesh(lowerBaseGeo, baseMat);
  const lowerCore = new THREE.Mesh(lowerCoreGeo, coreMat);
  const lowerHalo = new THREE.Mesh(lowerHaloGeo, haloMat);

  upperBase.renderOrder = 3;
  lowerBase.renderOrder = 3;
  upperCore.renderOrder = 4;
  lowerCore.renderOrder = 4;
  upperHalo.renderOrder = 5;
  lowerHalo.renderOrder = 5;

  group.add(upperBase, upperCore, upperHalo, lowerBase, lowerCore, lowerHalo);

  return {
    group,
    geometries: [upperBaseGeo, upperCoreGeo, upperHaloGeo, lowerBaseGeo, lowerCoreGeo, lowerHaloGeo],
    materials: [baseMat, coreMat, haloMat],
    update: (phase: number, boost: number, reducedMotion: boolean) => {
      for (const m of [baseMat, coreMat, haloMat]) {
        m.uniforms.uPhase.value = phase;
        m.uniforms.uBoost.value = boost;
        m.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
      }
    },
    getPrimaryPulsePoint: (phase: number, out: THREE.Vector3) => {
      const wrapped = ((phase % 1) + 1) % 1;
      const headU = clamp(wrapped * 1.32 - 0.16, 0.05, 0.96);
      return upperCurve.getPointAt(headU, out);
    },
  };
}
