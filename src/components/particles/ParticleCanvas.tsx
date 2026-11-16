"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { particleBridge } from "./particleState";

const GRAIN_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uAspect;
  uniform float uMobile;
  uniform float uReducedMotion;

  uniform vec3 uSphereCenter;
  uniform float uSphereScale;

  uniform float uDissolve;
  uniform float uDispersion;
  uniform float uHeroWeight;

  uniform vec2 uCursorNDC;
  uniform float uCursorActive;
  uniform vec2 uHoverNDC;
  uniform float uHoverStrength;

  attribute vec3 aSphere;
  attribute vec4 aSeed;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aLayer; // 0 = outer spherical crust, 1 = inner 3D volume, 2 = ember highlights, 3 = micro-rim

  varying vec3 vColor;
  varying float vAlpha;
  varying float vCrispness;

  mat2 rot2(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    float motionScale = mix(1.0, 0.14, uReducedMotion);
    float t = uTime * motionScale;

    vec3 localPos = aSphere;
    float origRadius = length(localPos);

    // Slow continuous 3D rotation
    float spinY = t * (0.09 + aLayer * 0.015);
    localPos.xz = rot2(spinY) * localPos.xz;
    localPos.yz = rot2(0.14 + sin(t * 0.25) * 0.05) * localPos.yz;

    // Subtle tangential shimmer across the sphere surface while preserving exact radius
    vec3 shimmer = vec3(
      sin(t * 0.9 + aSeed.y * 14.0 + localPos.y * 3.1),
      cos(t * 0.8 + aSeed.z * 14.0 + localPos.x * 3.1),
      sin(t * 0.85 + aSeed.w * 14.0 + localPos.z * 3.1)
    ) * (0.018 + 0.016 * aLayer) * motionScale;
    localPos = normalize(localPos + shimmer + vec3(0.0001)) * origRadius;

    // Gentle uniform spherical breathing (preserves perfect sphere silhouette)
    float breathe = 1.0 + 0.012 * sin(t * 0.9);
    localPos *= breathe;

    vec3 pos = localPos * uSphereScale + uSphereCenter;

    // SCROLL DISSOLUTION: outer particles loosen first and disperse into dark-red ink flow
    if (uDissolve > 0.001) {
      float layerBias = clamp(aLayer / 3.0, 0.0, 1.0);
      float particleProgress = clamp((uDissolve * 1.26) - (1.0 - layerBias) * 0.24, 0.0, 1.0);
      float easedSpread = particleProgress * particleProgress * (3.0 - 2.0 * particleProgress);

      vec3 dir = normalize(localPos + vec3(
        (aSeed.x - 0.5) * 0.85,
        (aSeed.y - 0.5) * 0.72,
        (aSeed.z - 0.5) * 0.85
      ) + vec3(0.0001));

      vec3 swirlAxis = normalize(cross(dir, vec3(0.18, 1.0, -0.22)) + vec3(0.0001));
      float burstAmt = (0.95 + aSeed.w * 2.15 + layerBias * 1.45) * (easedSpread * 0.82 + uDispersion * 0.34) * uSphereScale;

      // Drift outward & sweep organically into fluid stream (fully reversible with uDissolve)
      pos += dir * burstAmt * motionScale;
      pos += swirlAxis * (0.95 * uSphereScale * sin(easedSpread * 3.14159 + aSeed.x * 6.2831) * motionScale);
      pos.x -= easedSpread * (0.85 + aSeed.y * 1.35) * uSphereScale * motionScale;
      pos.y += easedSpread * (0.32 + (aSeed.z - 0.5) * 1.15) * uSphereScale * motionScale;
      pos.z -= easedSpread * 0.6 * uSphereScale * motionScale;
    }

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec4 clipPos = projectionMatrix * mvPos;
    vec2 ndcPos = clipPos.xy / max(0.15, clipPos.w);

    // LOCALIZED CURSOR DEFORMATION ON SPHERE SURFACE (sphere stays anchored)
    float proximityGlow = 0.0;
    if (uCursorActive > 0.001 && uReducedMotion < 0.5) {
      vec2 toParticle = ndcPos - uCursorNDC;
      // Aspect-adjusted screen distance so cursor repulsion is circular
      vec2 scaled = vec2(toParticle.x * uAspect, toParticle.y);
      float dist = length(scaled);
      float influence = smoothstep(0.32, 0.0, dist) * uCursorActive * (1.0 - uDissolve * 0.65);

      if (influence > 0.001) {
        vec2 pushDir = dist > 0.0001 ? normalize(scaled) : vec2(0.0, 1.0);
        vec2 tangentDir = vec2(-pushDir.y, pushDir.x);

        // Grains part organically around the cursor while sphere keeps overall mass
        float dispScale = (0.21 + 0.14 * aSeed.w) * uSphereScale * influence;
        mvPos.xy += pushDir * dispScale + tangentDir * (dispScale * 0.36 * sin(aSeed.x * 6.2831 + t * 2.0));
        // Surface ripple depth bulge
        mvPos.z += (0.18 - dist * 0.32) * uSphereScale * influence;
        proximityGlow = influence;
      }
    }

    // Subtle card focus nudge if active while hero visible
    if (uHoverStrength > 0.001 && uReducedMotion < 0.5) {
      vec2 delta = uHoverNDC - ndcPos;
      float d = length(delta);
      float r = smoothstep(0.65, 0.0, d) * uHoverStrength * (1.0 - uDissolve);
      if (r > 0.001) {
        mvPos.xy += normalize(delta + vec2(0.0001)) * r * 0.12 * uSphereScale;
      }
    }

    gl_Position = projectionMatrix * mvPos;

    // Perspective sizing: rich dense grains with crisp three-dimensional depth
    float depthScale = clamp(15.2 / max(2.0, -mvPos.z), 0.72, 1.55);
    float dissolveSize = mix(1.0, 0.48, smoothstep(0.42, 1.0, uDissolve));
    float ptSize = aSize * depthScale * uPixelRatio * dissolveSize * (1.0 + proximityGlow * 0.2);
    gl_PointSize = clamp(ptSize, 1.8 * uPixelRatio, 12.5 * uPixelRatio);

    // Visibility & alpha: vivid readable grains on #09090B, dissolving cleanly into fluid ink
    float twinkle = 0.88 + 0.12 * sin(t * 2.3 + aSeed.x * 30.0 + aSeed.y * 17.0);
    float layerOpacity = aLayer < 0.5 ? 0.98 : aLayer < 1.5 ? 0.88 : aLayer < 2.5 ? 1.0 : 0.72;
    float mobileDim = mix(1.0, 0.52, uMobile);
    float dissolveFade = 1.0 - smoothstep(0.55, 0.99, uDissolve);

    vAlpha = clamp(layerOpacity * twinkle * mobileDim * dissolveFade * uHeroWeight, 0.0, 1.0);
    vColor = aColor * (1.18 + proximityGlow * 0.35 + (aLayer > 1.5 && aLayer < 2.5 ? 0.25 : 0.0));
    vCrispness = clamp(1.0 - aLayer * 0.12, 0.5, 1.0);
  }
`;

const GRAIN_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vCrispness;

  void main() {
    if (vAlpha <= 0.004) discard;
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    // Dense glowing grain core + soft crimson ember rim
    float normD = d * 2.0;
    float core = exp(-normD * normD * mix(3.8, 5.4, vCrispness));
    float rim = pow(max(0.0, 1.0 - normD), 1.9) * 0.58;
    float intensity = clamp(core + rim, 0.0, 1.35);

    vec3 grainColor = mix(vColor * 1.25, vColor * 1.85 + vec3(0.14, 0.02, 0.04), core * 0.68);
    gl_FragColor = vec4(grainColor, intensity * vAlpha);
  }
`;

const GLOW_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uMobile;
  uniform vec3 uSphereCenter;
  uniform float uSphereScale;
  uniform float uDissolve;
  uniform float uHeroWeight;
  uniform float uReducedMotion;

  attribute vec3 aOffset;
  attribute float aRadius;
  attribute float aGlowAlpha;
  attribute vec3 aGlowColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float t = uTime * mix(1.0, 0.15, uReducedMotion);
    float breathe = 1.0 + 0.012 * sin(t * 0.9);
    vec3 center = uSphereCenter + vec3(0.0, 0.0, -0.08 * uSphereScale);

    vec3 pos = center + aOffset * uSphereScale * breathe;
    pos.x -= uDissolve * 0.65 * uSphereScale;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float depthScale = clamp(14.5 / max(2.0, -mvPos.z), 0.72, 1.35);
    gl_PointSize = aRadius * depthScale * uPixelRatio * (uSphereScale * 0.65) * (1.0 - uDissolve * 0.35);

    float fade = 1.0 - smoothstep(0.18, 0.84, uDissolve);
    vColor = aGlowColor;
    vAlpha = aGlowAlpha * fade * uHeroWeight * mix(1.0, 0.45, uMobile);
  }
`;

const GLOW_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.002) discard;
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;
    float falloff = exp(-d * d * 4.2) * pow(1.0 - d, 1.6);
    gl_FragColor = vec4(vColor, falloff * vAlpha);
  }
`;

function detectSoftwareWebGL(renderer: THREE.WebGLRenderer): boolean {
  try {
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const str = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
      return /swiftshader|llvmpipe|software|mesa/i.test(str);
    }
    const baseStr = String(gl.getParameter(gl.RENDERER) || "");
    return /swiftshader|llvmpipe|software|mesa/i.test(baseStr);
  } catch {
    return false;
  }
}

export function HeroParticleSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const reducedMotionRef = useRef(prefersReducedMotion);
  reducedMotionRef.current = prefersReducedMotion;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      });
    } catch {
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL(renderer);
    const width = window.innerWidth;
    const height = Math.max(1, window.innerHeight);
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const pixelRatio = isSoftwareGl
      ? 1
      : Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);

    const canvasEl = renderer.domElement;
    canvasEl.dataset.visualLayer = "hero-particle-sphere";
    canvasEl.style.width = "100%";
    canvasEl.style.height = "100%";
    canvasEl.style.display = "block";
    container.appendChild(canvasEl);

    const scene = new THREE.Scene();
    // Narrow 22-deg FOV eliminates off-center perspective stretching so the 3D sphere stays a true circle
    const camera = new THREE.PerspectiveCamera(22, width / height, 0.1, 60);
    camera.position.set(0, 0, 14.5);

    const count = isMobile ? 4000 : isSoftwareGl || isTablet ? 7500 : 15000;

    // Seeded deterministic PRNG
    let seed = 884217;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    // Build 14 organic cluster anchors on the unit sphere for dense filamentous grain texture
    const clusterCenters: Array<[number, number, number]> = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let c = 0; c < 14; c++) {
      const cy = 1 - ((c + 0.5) / 14) * 2;
      const cr = Math.sqrt(Math.max(0, 1 - cy * cy));
      const ca = goldenAngle * c * 2.1;
      clusterCenters.push([Math.cos(ca) * cr, cy, Math.sin(ca) * cr]);
    }

    const positions = new Float32Array(count * 3);
    const aSphere = new Float32Array(count * 3);
    const aSeed = new Float32Array(count * 4);
    const aColor = new Float32Array(count * 3);
    const aSize = new Float32Array(count);
    const aLayer = new Float32Array(count);

    // Rich crimson / wine grain palette + rare silver-red sparks
    const colDeepWine = new THREE.Color("#5A1023");
    const colWine = new THREE.Color("#8E1936");
    const colCrimson = new THREE.Color("#B82143");
    const colRuby = new THREE.Color("#DF2E53");
    const colHighlight = new THREE.Color("#FF4367");
    const colSilverRed = new THREE.Color("#E2C4CD");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      const u = (i + 0.5) / count;

      // Base Fibonacci unit sphere direction mixed with organic surface cluster attraction
      const yBase = 1 - 2 * u;
      const rSlice = Math.sqrt(Math.max(0, 1 - yBase * yBase));
      const theta = goldenAngle * i + (rand() - 0.5) * 0.42;
      let dx = Math.cos(theta) * rSlice;
      let dy = yBase;
      let dz = Math.sin(theta) * rSlice;

      // Cluster pull on ~62% of grains for organic grain filaments, then re-normalized onto exact sphere
      if (rand() < 0.62) {
        const cl = clusterCenters[Math.floor(rand() * clusterCenters.length)];
        const pull = 0.24 + rand() * 0.36;
        dx = dx * (1 - pull) + cl[0] * pull + (rand() - 0.5) * 0.2;
        dy = dy * (1 - pull) + cl[1] * pull + (rand() - 0.5) * 0.2;
        dz = dz * (1 - pull) + cl[2] * pull + (rand() - 0.5) * 0.2;
        const invLen = 1 / Math.max(0.0001, Math.hypot(dx, dy, dz));
        dx *= invLen;
        dy *= invLen;
        dz *= invLen;
      }

      // Normalized unit-sphere radial layering (R = 1.000): crisp circular perimeter + deep 3D interior
      const roll = rand();
      let radius: number;
      let layer: number;

      if (roll < 0.54) {
        // Crisp outer spherical shell
        radius = 0.955 + rand() * 0.045;
        layer = 0;
      } else if (roll < 0.88) {
        // Inner 3D luminous depth
        radius = 0.16 + Math.pow(rand(), 0.5) * 0.795;
        layer = 1;
      } else if (roll < 0.98) {
        // Brighter ember ridge grains across the sphere shell
        radius = 0.91 + rand() * 0.09;
        layer = 2;
      } else {
        // Ultra-tight micro-rim sparkles hugging the exact spherical boundary
        radius = 0.995 + rand() * 0.012;
        layer = 3;
      }

      const sx = dx * radius;
      const sy = dy * radius;
      const sz = dz * radius;

      aSphere[i3] = sx;
      aSphere[i3 + 1] = sy;
      aSphere[i3 + 2] = sz;

      positions[i3] = sx;
      positions[i3 + 1] = sy;
      positions[i3 + 2] = sz;

      aSeed[i4] = rand();
      aSeed[i4 + 1] = rand();
      aSeed[i4 + 2] = rand();
      aSeed[i4 + 3] = rand();
      aLayer[i] = layer;

      const colorRoll = rand();
      let c: THREE.Color;
      let ptSize: number;

      if (layer === 2) {
        c = colorRoll < 0.65 ? colHighlight : colRuby;
        ptSize = 2.15 + rand() * 2.15;
      } else if (colorRoll < 0.2) {
        c = colDeepWine;
        ptSize = 2.2 + rand() * 2.2;
      } else if (colorRoll < 0.52) {
        c = colWine;
        ptSize = 2.0 + rand() * 2.0;
      } else if (colorRoll < 0.82) {
        c = colCrimson;
        ptSize = 1.9 + rand() * 2.0;
      } else if (colorRoll < 0.96) {
        c = colRuby;
        ptSize = 1.8 + rand() * 1.85;
      } else {
        c = colSilverRed;
        ptSize = 1.45 + rand() * 1.35;
      }

      if (layer === 3) {
        ptSize *= 0.72;
      } else if (rand() < 0.08) {
        ptSize *= 1.35;
      }

      aColor[i3] = c.r;
      aColor[i3 + 1] = c.g;
      aColor[i3 + 2] = c.b;
      aSize[i] = ptSize;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSphere", new THREE.BufferAttribute(aSphere, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 4));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(aColor, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
    geometry.setAttribute("aLayer", new THREE.BufferAttribute(aLayer, 1));

    const uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uAspect: { value: width / height },
      uMobile: { value: isMobile ? 1 : 0 },
      uReducedMotion: { value: reducedMotionRef.current ? 1 : 0 },
      uSphereCenter: { value: new THREE.Vector3(1.5, -0.25, 0) },
      uSphereScale: { value: 1.5 },
      uDissolve: { value: 0 },
      uDispersion: { value: 0 },
      uHeroWeight: { value: 1 },
      uCursorNDC: { value: new THREE.Vector2(0, 0) },
      uCursorActive: { value: 0 },
      uHoverNDC: { value: new THREE.Vector2(0, 0) },
      uHoverStrength: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: GRAIN_VERTEX_SHADER,
      fragmentShader: GRAIN_FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    // Subtle volumetric inner crimson illumination bounded strictly inside the unit sphere
    const glowCount = 36;
    const glowPos = new Float32Array(glowCount * 3);
    const glowOffset = new Float32Array(glowCount * 3);
    const glowRadius = new Float32Array(glowCount);
    const glowAlpha = new Float32Array(glowCount);
    const glowColor = new Float32Array(glowCount * 3);
    const gWine = new THREE.Color("#641326");
    const gCrimson = new THREE.Color("#8B1A33");

    for (let g = 0; g < glowCount; g++) {
      const g3 = g * 3;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 0.1 + rand() * 0.44;
      glowOffset[g3] = Math.sin(phi) * Math.cos(theta) * r;
      glowOffset[g3 + 1] = Math.cos(phi) * r;
      glowOffset[g3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
      glowRadius[g] = 105 + rand() * 115;
      glowAlpha[g] = 0.045 + rand() * 0.032;
      const gc = rand() < 0.6 ? gWine : gCrimson;
      glowColor[g3] = gc.r;
      glowColor[g3 + 1] = gc.g;
      glowColor[g3 + 2] = gc.b;
    }

    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPos, 3));
    glowGeo.setAttribute("aOffset", new THREE.BufferAttribute(glowOffset, 3));
    glowGeo.setAttribute("aRadius", new THREE.BufferAttribute(glowRadius, 1));
    glowGeo.setAttribute("aGlowAlpha", new THREE.BufferAttribute(glowAlpha, 1));
    glowGeo.setAttribute("aGlowColor", new THREE.BufferAttribute(glowColor, 3));

    const glowUniforms = {
      uTime: uniforms.uTime,
      uPixelRatio: uniforms.uPixelRatio,
      uMobile: uniforms.uMobile,
      uSphereCenter: uniforms.uSphereCenter,
      uSphereScale: uniforms.uSphereScale,
      uDissolve: uniforms.uDissolve,
      uHeroWeight: uniforms.uHeroWeight,
      uReducedMotion: uniforms.uReducedMotion,
    };

    const glowMat = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERTEX_SHADER,
      fragmentShader: GLOW_FRAGMENT_SHADER,
      uniforms: glowUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const glowPoints = new THREE.Points(glowGeo, glowMat);
    glowPoints.frustumCulled = false;
    scene.add(glowPoints);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = Math.max(1, window.innerHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      uniforms.uAspect.value = w / h;
      uniforms.uMobile.value = w < 768 ? 1 : 0;
    };

    let contextLost = false;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const handleContextRestored = () => {
      contextLost = false;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    canvasEl.addEventListener("webglcontextlost", handleContextLost);
    canvasEl.addEventListener("webglcontextrestored", handleContextRestored);

    let rafId = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    let lastTime = performance.now();
    let prevDissolve = particleBridge.heroDissolve;
    let snappedInitial = false;

    const damp = (cur: number, tgt: number, lambda: number, dt: number) =>
      cur + (tgt - cur) * (1 - Math.exp(-lambda * dt));

    const tick = () => {
      if (disposed) return;

      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // Follow GSAP ScrollTrigger scrubbed progression closely without introducing extra lag or asymmetry
      uniforms.uDissolve.value = damp(uniforms.uDissolve.value, particleBridge.heroDissolve, 26, dt);
      uniforms.uDispersion.value = damp(
        uniforms.uDispersion.value,
        particleBridge.heroDispersion,
        26,
        dt
      );
      uniforms.uHeroWeight.value = damp(
        uniforms.uHeroWeight.value,
        particleBridge.heroWeight,
        26,
        dt
      );

      container.dataset.dissolve = uniforms.uDissolve.value.toFixed(3);
      container.dataset.heroWeight = uniforms.uHeroWeight.value.toFixed(3);

      const isActive =
        particleBridge.hasHero &&
        (particleBridge.heroDissolve < 0.996 || uniforms.uDissolve.value < 0.996) &&
        uniforms.uHeroWeight.value > 0.002;

      if (!isActive || contextLost) {
        if (container.style.opacity !== "0") {
          container.style.opacity = "0";
        }
        prevDissolve = particleBridge.heroDissolve;
        if (isSoftwareGl) {
          timerId = setTimeout(() => {
            if (!disposed) rafId = requestAnimationFrame(tick);
          }, 120);
        } else {
          rafId = requestAnimationFrame(tick);
        }
        return;
      }

      if (container.style.opacity !== "1") {
        container.style.opacity = "1";
      }

      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);

      // Map DOM-measured heroSphere (centerX, centerY, diameterPx) to exact Three.js world space
      const hs = particleBridge.heroSphere;
      const halfWorldH =
        camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
      const worldH = halfWorldH * 2;
      const worldW = worldH * (vw / vh);
      const targetNdcX = (hs.centerX / vw) * 2 - 1;
      const targetNdcY = 1 - (hs.centerY / vh) * 2;
      const targetWorldX = targetNdcX * (worldW * 0.5);
      const targetWorldY = targetNdcY * (worldH * 0.5);
      const targetWorldScale = Math.max(
        0.18,
        ((hs.diameterPx - 5) * 0.5 / vh) * worldH * 0.992
      );

      if (!snappedInitial && particleBridge.hasMeasuredSphere) {
        uniforms.uSphereCenter.value.set(targetWorldX, targetWorldY, 0);
        uniforms.uSphereScale.value = targetWorldScale;
        snappedInitial = true;
      } else {
        uniforms.uSphereCenter.value.x = damp(uniforms.uSphereCenter.value.x, targetWorldX, 14, dt);
        uniforms.uSphereCenter.value.y = damp(uniforms.uSphereCenter.value.y, targetWorldY, 14, dt);
        uniforms.uSphereScale.value = damp(uniforms.uSphereScale.value, targetWorldScale, 14, dt);
      }

      uniforms.uTime.value += dt;
      uniforms.uReducedMotion.value = reducedMotionRef.current ? 1 : 0;

      // Bridge dispersing sphere grains into fluid ink tendrils during scroll dissolution
      const dissolveDelta = particleBridge.heroDissolve - prevDissolve;
      prevDissolve = particleBridge.heroDissolve;
      if (
        Math.abs(dissolveDelta) > 0.002 &&
        particleBridge.heroDissolve > 0.14 &&
        particleBridge.heroDissolve < 0.88 &&
        particleBridge.pendingDissolveSeeds.length < 18
      ) {
        const baseX = Math.max(
          0.12,
          Math.min(0.9, hs.centerX / vw - particleBridge.heroDissolve * 0.22)
        );
        const baseY = Math.max(0.1, Math.min(0.9, 1 - hs.centerY / vh));
        for (let s = 0; s < 2; s++) {
          const ang = (now * 0.003 + s * 2.1) % (Math.PI * 2);
          particleBridge.pendingDissolveSeeds.push({
            uvX: Math.min(0.95, Math.max(0.05, baseX + Math.cos(ang) * 0.08)),
            uvY: Math.min(0.95, Math.max(0.05, baseY + Math.sin(ang) * 0.09)),
            dx: Math.cos(ang) * 0.012 - 0.009,
            dy: Math.sin(ang) * 0.01 + (dissolveDelta > 0 ? 0.006 : -0.006),
            strength: Math.min(1, Math.abs(dissolveDelta) * 18),
          });
        }
      }

      // Single shared spring cursor coordinate stream (written by SmoothCursor)
      const ndcX = (particleBridge.springClientX / vw) * 2 - 1;
      const ndcY = -((particleBridge.springClientY / vh) * 2 - 1);
      uniforms.uCursorNDC.value.set(ndcX, ndcY);
      uniforms.uCursorActive.value = damp(
        uniforms.uCursorActive.value,
        particleBridge.cursorActive ? 1 : 0,
        12,
        dt
      );

      uniforms.uHoverNDC.value.x = damp(uniforms.uHoverNDC.value.x, particleBridge.hoverNdcX, 8, dt);
      uniforms.uHoverNDC.value.y = damp(uniforms.uHoverNDC.value.y, particleBridge.hoverNdcY, 8, dt);
      uniforms.uHoverStrength.value = damp(
        uniforms.uHoverStrength.value,
        particleBridge.hoverActive ? particleBridge.hoverStrength : 0,
        8,
        dt
      );

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        timerId = setTimeout(() => {
          if (!disposed) rafId = requestAnimationFrame(tick);
        }, 85);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      window.removeEventListener("resize", handleResize);
      canvasEl.removeEventListener("webglcontextlost", handleContextLost);
      canvasEl.removeEventListener("webglcontextrestored", handleContextRestored);

      geometry.dispose();
      material.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      renderer.dispose();

      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-visual-layer="hero-particle-container"
      className="fixed inset-0 z-[1] pointer-events-none select-none overflow-hidden"
    />
  );
}

export const ParticleCanvas = HeroParticleSphere;
