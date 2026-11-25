"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { particleBridge } from "@/components/particles/particleState";
import {
  computeGrowthArrowScrollState,
  computeGrowthArrowViewportLayout,
} from "@/lib/growthArrowHero";
import { clamp, type ViewportRect } from "@/lib/visualExperience";
import { buildArrowSculptureAssets } from "./growthArrowGeometry";
import { buildMovingOutlineGlow } from "./movingOutlineGlow";
import { buildMarketingElements } from "./floatingMarketingElements";

const _pulseLocalPos = new THREE.Vector3();
const _pulseWorldPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();

function detectSoftwareWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  if (typeof document === "undefined") {
    return { supported: false, isSoftwareGl: false };
  }
  const probeCanvas = document.createElement("canvas");
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null;
  try {
    gl =
      (probeCanvas.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (probeCanvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return { supported: false, isSoftwareGl: false };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || "");
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftwareGl };
  } catch {
    return { supported: false, isSoftwareGl: false };
  } finally {
    try {
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      // Ignore cleanup error on probe context
    }
  }
}

function measureCopyVisualRect(copyEl: HTMLElement): ViewportRect {
  const baseRect = copyEl.getBoundingClientRect();
  let visualRight = baseRect.left;

  try {
    const walker = document.createTreeWalker(copyEl, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (!node.textContent || !node.textContent.trim()) continue;
      range.selectNodeContents(node);
      const r = range.getBoundingClientRect();
      if (r.width > 0) {
        visualRight = Math.max(visualRight, r.right);
      }
    }
  } catch {
    visualRight = Math.min(baseRect.right, baseRect.left + 600);
  }

  copyEl.querySelectorAll("a, button").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0) {
      visualRight = Math.max(visualRight, r.right);
    }
  });

  if (visualRight <= baseRect.left) {
    visualRight = Math.min(baseRect.right, baseRect.left + 600);
  }

  return {
    left: baseRect.left,
    top: baseRect.top,
    right: Math.min(baseRect.right, visualRight),
    bottom: baseRect.bottom,
  };
}

export function GrowthArrowScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const reducedMotionRef = useRef(prefersReducedMotion);
  reducedMotionRef.current = prefersReducedMotion;

  const [useFallback, setUseFallback] = useState(false);
  const [sceneState, setSceneState] = useState<"active" | "paused" | "fallback">("active");
  const sceneStateRef = useRef<"active" | "paused" | "fallback">("active");

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === "undefined") return;

    const { supported, isSoftwareGl } = detectSoftwareWebGL();
    if (!supported) {
      setUseFallback(true);
      sceneStateRef.current = "fallback";
      setSceneState("fallback");
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setUseFallback(true);
      sceneStateRef.current = "fallback";
      setSceneState("fallback");
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.setClearColor(0x080808, 0);

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.setAttribute("data-visual-layer", "growth-arrow-webgl");
    container.innerHTML = "";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.014);

    // Mandatory studio environment reflection (kept active on both GPU and software WebGL)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.12;
    roomEnvironment.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 80);

    // Sculptural root positioned dynamically to sit cleanly beside copy block (or inside mobile stage)
    const sculptureRoot = new THREE.Group();
    sculptureRoot.name = "growthArrowCompositionRoot";
    scene.add(sculptureRoot);

    const parallaxGroup = new THREE.Group();
    parallaxGroup.name = "growthArrowParallaxLayer";
    sculptureRoot.add(parallaxGroup);

    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1);
    const assets = buildArrowSculptureAssets(maxAnisotropy);
    const outlineRig = buildMovingOutlineGlow(assets.contours);
    const marketingBundle = buildMarketingElements(assets.roughnessTexture, !isSoftwareGl);

    // Main monolithic 3D arrow group (seamless extruded sculpture + dynamic moving outline glow)
    const arrowMainGroup = new THREE.Group();
    arrowMainGroup.name = "mainGrowthArrow";
    arrowMainGroup.rotation.set(-0.17, -0.40, 0);
    arrowMainGroup.position.set(0.10, 0.10, 0.14);

    const arrowMesh = new THREE.Mesh(assets.arrowGeometry, assets.sculptureMaterial);
    arrowMesh.castShadow = !isSoftwareGl;
    arrowMesh.receiveShadow = true;

    const platformMesh = new THREE.Mesh(assets.platformGeometry, assets.platformMaterial);
    platformMesh.receiveShadow = true;

    const pulsePointLight = new THREE.PointLight(0xd40f2d, 0.85, 3.8, 2.0);
    pulsePointLight.position.set(-1.2, -0.6, 0.8);

    arrowMainGroup.add(arrowMesh, outlineRig.group, pulsePointLight);
    parallaxGroup.add(platformMesh, arrowMainGroup, marketingBundle.root);

    // Balanced studio 3-point + crimson underside + moving pulse light rig
    const hemiFill = new THREE.HemisphereLight(0xf3ebe2, 0x0d0103, 0.13);
    scene.add(hemiFill);

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.72);
    keyLight.position.set(-8.2, 10.2, 5.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 32;
    keyLight.shadow.camera.left = -7.5;
    keyLight.shadow.camera.right = 7.5;
    keyLight.shadow.camera.top = 7.5;
    keyLight.shadow.camera.bottom = -7.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.025;
    scene.add(keyLight);

    const coolRimLight = new THREE.DirectionalLight(0xc2cde0, 0.24);
    coolRimLight.position.set(-3.5, 5.0, -7.2);
    scene.add(coolRimLight);

    // Crimson underside bounce lights attached to parallaxGroup beneath Crest 1 & Crest 2 arches (also lighting left bar faces)
    const underLight1 = new THREE.PointLight(0xb50620, 0.85, 5.0, 2.0);
    underLight1.position.set(-1.60, -1.05, 0.45);
    const underLight2 = new THREE.PointLight(0xc60824, 0.95, 5.2, 2.0);
    underLight2.position.set(0.20, -0.50, 0.55);

    parallaxGroup.add(underLight1, underLight2);

    // Apply layout relative to hero DOM bounds
    let targetAnchorX = 1.25;
    let targetAnchorY = -0.15;
    let targetScale = 1.0;
    let lastWasMobile: boolean | null = null;

    const syncViewportAndLayout = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(300, Math.round(rect.width));
      const height = Math.max(240, Math.round(rect.height));
      renderer.setSize(width, height, false);

      const heroEl = document.getElementById("hero");
      const copyEl = document.getElementById("hero-copy-block");
      const mobileStageEl = document.getElementById("hero-mobile-stage");

      const heroRect: ViewportRect = heroEl
        ? heroEl.getBoundingClientRect()
        : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
      const copyRect: ViewportRect = copyEl
        ? measureCopyVisualRect(copyEl)
        : { left: 48, top: 140, right: Math.min(620, width * 0.48), bottom: height * 0.72 };
      const mobileStageRect =
        mobileStageEl && mobileStageEl.offsetHeight > 40
          ? mobileStageEl.getBoundingClientRect()
          : null;

      const layout = computeGrowthArrowViewportLayout(
        window.innerWidth,
        window.innerHeight,
        heroRect,
        copyRect,
        mobileStageRect
      );

      camera.fov = layout.fovDeg;
      camera.aspect = width / height;
      camera.position.set(layout.cameraX, layout.cameraY, layout.cameraZ);
      _lookTarget.set(layout.lookAtX, layout.lookAtY, layout.lookAtZ);
      camera.lookAt(_lookTarget);
      camera.updateProjectionMatrix();

      targetAnchorX = layout.anchorX;
      targetAnchorY = layout.anchorY;
      targetScale = layout.sceneScale;

      if (sculptureRoot.userData.initialized !== true || lastWasMobile !== layout.isMobile) {
        sculptureRoot.position.set(targetAnchorX, targetAnchorY, 0);
        sculptureRoot.scale.setScalar(targetScale);
        sculptureRoot.userData.initialized = true;
        lastWasMobile = layout.isMobile;
      }

      marketingBundle.entries.forEach((entry) => {
        if (entry.isSecondaryTile) {
          entry.group.visible = layout.showSecondaryTiles;
        }
      });

      if (!isSoftwareGl) {
        renderer.shadowMap.needsUpdate = true;
      }
    };

    syncViewportAndLayout();

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Responsive measurement updates
    let resizeObs: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(syncViewportAndLayout);
      resizeObs.observe(container);
      const copyEl = document.getElementById("hero-copy-block");
      if (copyEl) resizeObs.observe(copyEl);
    }
    window.addEventListener("resize", syncViewportAndLayout, { passive: true });

    // Pause loop cleanly when hero is outside viewport or tab is hidden
    let isHeroVisible = true;
    let isTabVisible = !document.hidden;
    let isContextLost = false;
    let disposed = false;

    let frameId = 0;
    let timeoutId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let smoothScroll = particleBridge.heroDissolve;

    const updateStateBadge = () => {
      const next: "active" | "paused" | "fallback" = isContextLost
        ? "fallback"
        : isHeroVisible && isTabVisible
          ? "active"
          : "paused";
      if (sceneStateRef.current !== next) {
        sceneStateRef.current = next;
        setSceneState(next);
      }
    };

    const scheduleNext = () => {
      if (disposed || !isHeroVisible || !isTabVisible || isContextLost) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === "function") {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (status === gl.UNSIGNALED) {
            timeoutId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            timeoutId = window.setTimeout(cb, 80);
          }
        };
        timeoutId = window.setTimeout(poll, 5);
      } else {
        timeoutId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (disposed || !isHeroVisible || !isTabVisible || isContextLost) return;

      const now = performance.now();
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const delta = clamp(rawDt, 0.001, 0.05);
      const reduced = reducedMotionRef.current;

      if (!reduced) {
        elapsed += delta;
      }

      // Smooth damped scroll transition (tracks Lenis crisply without double-lag)
      smoothScroll = THREE.MathUtils.damp(smoothScroll, particleBridge.heroDissolve, 14, delta);

      const scrollState = computeGrowthArrowScrollState(smoothScroll);

      // Anchor & responsive scale damping
      sculptureRoot.position.x = THREE.MathUtils.damp(sculptureRoot.position.x, targetAnchorX, 10, delta);
      sculptureRoot.position.y = THREE.MathUtils.damp(
        sculptureRoot.position.y,
        targetAnchorY + scrollState.elevationY,
        10,
        delta
      );
      sculptureRoot.position.z = THREE.MathUtils.damp(
        sculptureRoot.position.z,
        scrollState.depthOffsetZ,
        10,
        delta
      );
      const nextScale = THREE.MathUtils.damp(sculptureRoot.scale.x, targetScale, 10, delta);
      sculptureRoot.scale.setScalar(nextScale);

      // Fixed sculpture orientation & position (scroll pitch only, zero cursor parallax)
      parallaxGroup.rotation.set(scrollState.tiltPitchX, 0, 0);
      parallaxGroup.position.set(0, 0, 0);

      // Gentle non-mouse ambient breathing float on floating marketing elements
      for (const entry of marketingBundle.entries) {
        if (!entry.group.visible || entry.floatAmplitude <= 0) continue;
        const floatY = !reduced
          ? Math.sin(elapsed * entry.floatSpeed + entry.floatPhase) * entry.floatAmplitude
          : 0;
        const floatRotZ = !reduced
          ? Math.cos(elapsed * entry.floatSpeed * 0.8 + entry.floatPhase) * 0.032
          : 0;

        entry.group.position.set(
          entry.basePosition.x,
          entry.basePosition.y + floatY,
          entry.basePosition.z
        );
        entry.group.rotation.set(
          entry.baseRotation.x,
          entry.baseRotation.y,
          entry.baseRotation.z + floatRotZ
        );
      }

      // Dynamic moving crimson outline glow (~4.1s seamless cycle from base to tip)
      const tracePhase = (elapsed / 4.1) % 1.0;
      const headU = clamp(tracePhase * 1.32 - 0.16, 0, 1);

      outlineRig.update(tracePhase, scrollState.outlinePulseBoost, reduced);
      assets.updateShaderUniforms(elapsed, headU, scrollState.crimsonGlowBoost);

      outlineRig.getPrimaryPulsePoint(tracePhase, _pulseLocalPos);
      _pulseWorldPos.copy(_pulseLocalPos);
      pulsePointLight.position.set(
        _pulseWorldPos.x,
        _pulseWorldPos.y - 0.18,
        _pulseWorldPos.z + 0.52
      );
      pulsePointLight.intensity = reduced
        ? 0.48
        : (0.78 + Math.sin(elapsed * 2.2) * 0.12) * (1 + scrollState.crimsonGlowBoost * 0.5);

      underLight1.intensity = 0.85 + scrollState.crimsonGlowBoost * 0.55;
      underLight2.intensity = 0.95 + scrollState.crimsonGlowBoost * 0.60;

      renderer.render(scene, camera);
      scheduleNext();
    }

    const startLoop = () => {
      if (disposed || !isHeroVisible || !isTabVisible || isContextLost) return;
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
      lastTime = performance.now();
      frameId = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };

    // IntersectionObserver on #hero
    let intersectionObs: IntersectionObserver | null = null;
    const heroTarget = document.getElementById("hero") || container;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const nextVisible = Boolean(entry && entry.isIntersecting);
          if (nextVisible !== isHeroVisible) {
            isHeroVisible = nextVisible;
            updateStateBadge();
            if (isHeroVisible && isTabVisible && !isContextLost) {
              startLoop();
            } else {
              stopLoop();
            }
          }
        },
        { threshold: 0.02 }
      );
      intersectionObs.observe(heroTarget);
    }

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      updateStateBadge();
      if (isHeroVisible && isTabVisible && !isContextLost) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let contextLostTimeout = 0;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      isContextLost = true;
      stopLoop();
      updateStateBadge();
      contextLostTimeout = window.setTimeout(() => {
        if (!disposed && isContextLost) {
          setUseFallback(true);
        }
      }, 1500);
    };

    const handleContextRestored = () => {
      clearTimeout(contextLostTimeout);
      isContextLost = false;
      setUseFallback(false);
      updateStateBadge();
      startLoop();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    startLoop();

    return () => {
      disposed = true;
      stopLoop();
      clearTimeout(contextLostTimeout);
      intersectionObs?.disconnect();
      resizeObs?.disconnect();
      window.removeEventListener("resize", syncViewportAndLayout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);

      // Thorough Three.js GPU resource disposal
      assets.arrowGeometry.dispose();
      assets.platformGeometry.dispose();
      assets.sculptureMaterial.dispose();
      assets.platformMaterial.dispose();
      assets.roughnessTexture.dispose();

      outlineRig.geometries.forEach((g) => g.dispose());
      outlineRig.materials.forEach((m) => m.dispose());

      marketingBundle.geometries.forEach((g) => g.dispose());
      marketingBundle.materials.forEach((m) => m.dispose());
      marketingBundle.textures.forEach((t) => t.dispose());

      envTarget.dispose();
      renderer.dispose();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      data-testid="hero-growth-arrow-scene"
      data-state={useFallback ? "fallback" : sceneState}
      data-fallback={String(useFallback)}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {useFallback && (
        <svg
          viewBox="0 0 1200 720"
          className="absolute right-0 bottom-0 w-full md:w-[68%] h-full opacity-90"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <linearGradient id="fallback-arrow-ivory" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5F1EC" />
              <stop offset="100%" stopColor="#CEC6BF" />
            </linearGradient>
            <linearGradient id="fallback-arrow-crimson" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6F0018" />
              <stop offset="100%" stopColor="#C8102E" />
            </linearGradient>
          </defs>
          <ellipse cx="760" cy="670" rx="410" ry="70" fill="#121215" opacity="0.9" />
          <path
            d="M 430 650 C 495 450, 560 415, 625 468 C 680 512, 745 305, 815 322 C 870 335, 935 215, 990 155"
            fill="none"
            stroke="url(#fallback-arrow-crimson)"
            strokeWidth="58"
            strokeLinecap="round"
            transform="translate(8, 22)"
          />
          <path
            d="M 430 650 C 495 450, 560 415, 625 468 C 680 512, 745 305, 815 322 C 870 335, 935 215, 990 155"
            fill="none"
            stroke="url(#fallback-arrow-ivory)"
            strokeWidth="52"
            strokeLinecap="round"
          />
          <polygon points="945,105 1085,78 1052,218" fill="url(#fallback-arrow-ivory)" />
        </svg>
      )}
    </div>
  );
}
