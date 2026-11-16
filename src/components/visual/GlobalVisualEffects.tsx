"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HeroParticleSphere } from "@/components/particles/ParticleCanvas";
import { FluidInkCanvas } from "@/components/visual/FluidInkCanvas";
import { SmoothCursor } from "@/components/visual/SmoothCursor";
import { particleBridge } from "@/components/particles/particleState";
import {
  computeHeroDissolveState,
  computeHeroSphereLayout,
  isPointExcluded,
  rectToUvBounds,
  type ViewportRect,
} from "@/lib/visualExperience";

function measureHeroCopyVisualRect(copyEl: HTMLElement): ViewportRect {
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
    visualRight = Math.min(baseRect.right, baseRect.left + 620);
  }

  // Include interactive CTA buttons/links at bottom of copy block
  const interactiveEls = copyEl.querySelectorAll("a, button");
  interactiveEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0) {
      visualRight = Math.max(visualRight, r.right);
    }
  });

  if (visualRight <= baseRect.left) {
    visualRight = Math.min(baseRect.right, baseRect.left + 620);
  }

  return {
    left: baseRect.left,
    top: baseRect.top,
    right: Math.min(baseRect.right, visualRight),
    bottom: baseRect.bottom,
  };
}

export function GlobalVisualEffects() {
  const pathname = usePathname() || "/";
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    particleBridge.pathname = pathname;

    const updateExclusionZones = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const servicesEl =
        pathname === "/" ? document.getElementById("services-section") : null;
      const footerEl = document.getElementById("site-footer");

      const servicesRect = servicesEl ? servicesEl.getBoundingClientRect() : null;
      const footerRect = footerEl ? footerEl.getBoundingClientRect() : null;

      particleBridge.excludeServicesUv = rectToUvBounds(servicesRect, vw, vh);
      particleBridge.excludeFooterUv = rectToUvBounds(footerRect, vw, vh);

      if (particleBridge.hasPointerMoved) {
        particleBridge.cursorExcluded = isPointExcluded(
          particleBridge.springClientX,
          particleBridge.springClientY,
          [servicesRect, footerRect]
        );
      }
    };

    const updateHeroSphereLayout = () => {
      const heroEl = document.getElementById("hero");
      const copyEl = document.getElementById("hero-copy-block");
      if (!heroEl || !copyEl || pathname !== "/") return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const heroRect = heroEl.getBoundingClientRect();
      const copyRect = measureHeroCopyVisualRect(copyEl);
      const layout = computeHeroSphereLayout(vw, vh, heroRect, copyRect);

      particleBridge.heroSphere = layout;
      particleBridge.hasMeasuredSphere = true;

      const backdropEl = document.getElementById("hero-backdrop");
      if (backdropEl) {
        const bdRect = backdropEl.getBoundingClientRect();
        const relX = layout.centerX - bdRect.left;
        const relY = layout.centerY - bdRect.top;
        backdropEl.style.setProperty("--hero-sphere-x", `${relX.toFixed(1)}px`);
        backdropEl.style.setProperty("--hero-sphere-y", `${relY.toFixed(1)}px`);
        backdropEl.style.setProperty(
          "--hero-sphere-glow-r",
          `${(layout.radiusPx * 1.18).toFixed(1)}px`
        );
      }
    };

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const applyHeroProgress = (progress: number, hasHero: boolean) => {
      if (!hasHero) {
        const subState = computeHeroDissolveState(0, 0, false);
        particleBridge.heroWeight = subState.heroWeight;
        particleBridge.heroDissolve = subState.dissolve;
        particleBridge.heroDispersion = subState.dispersion;
        particleBridge.fluidBlend = subState.fluidBlend;
        return;
      }

      const state = computeHeroDissolveState(clamp01(progress), 1, true);
      particleBridge.heroWeight = state.heroWeight;
      particleBridge.heroDissolve = state.dissolve;
      particleBridge.heroDispersion = state.dispersion;
      particleBridge.fluidBlend = state.fluidBlend;
    };

    const heroEl = pathname === "/" ? document.getElementById("hero") : null;
    const copyEl = pathname === "/" ? document.getElementById("hero-copy-block") : null;
    const hasHero = pathname === "/" && Boolean(heroEl);
    particleBridge.hasHero = hasHero;

    const getHeroScrubDistance = () => {
      if (!heroEl) return Math.max(480, window.innerHeight);
      const h = heroEl.getBoundingClientRect().height || window.innerHeight;
      return Math.max(480, Math.round(h * 1.15));
    };

    if (!hasHero) {
      applyHeroProgress(1, false);
      updateExclusionZones();
    } else {
      const initialProgress = clamp01(window.scrollY / getHeroScrubDistance());
      applyHeroProgress(initialProgress, true);
      updateHeroSphereLayout();
      updateExclusionZones();
    }

    let scrollTween: gsap.core.Tween | null = null;
    let trigger: ScrollTrigger | null = null;

    if (hasHero && heroEl) {
      if (prefersReducedMotion) {
        trigger = ScrollTrigger.create({
          start: 0,
          end: () => getHeroScrubDistance(),
          scrub: false,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            applyHeroProgress(self.progress, true);
            updateHeroSphereLayout();
            updateExclusionZones();
          },
        });
      } else {
        const scrubProxy = {
          progress: clamp01(window.scrollY / getHeroScrubDistance()),
        };

        scrollTween = gsap.to(scrubProxy, {
          progress: 1,
          ease: "none",
          onUpdate: () => {
            applyHeroProgress(scrubProxy.progress, true);
          },
          scrollTrigger: {
            start: 0,
            end: () => getHeroScrubDistance(),
            scrub: 1.25,
            invalidateOnRefresh: true,
            onUpdate: () => {
              updateHeroSphereLayout();
              updateExclusionZones();
            },
          },
        });
        trigger = scrollTween.scrollTrigger ?? null;
      }
    }

    let resizeObs: ResizeObserver | null = null;
    if (copyEl && typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(() => {
        updateHeroSphereLayout();
        updateExclusionZones();
      });
      resizeObs.observe(copyEl);
      if (heroEl) resizeObs.observe(heroEl);
    }

    const handleScroll = () => {
      if (hasHero) {
        updateHeroSphereLayout();
        if (prefersReducedMotion) {
          applyHeroProgress(window.scrollY / getHeroScrubDistance(), true);
        }
      }
      updateExclusionZones();
    };

    const handleResize = () => {
      if (hasHero) {
        updateHeroSphereLayout();
        if (prefersReducedMotion) {
          applyHeroProgress(window.scrollY / getHeroScrubDistance(), true);
        }
      }
      updateExclusionZones();
      ScrollTrigger.refresh();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled && hasHero) {
        updateHeroSphereLayout();
      }
    });

    // Re-sync shortly after route transition settles so DOM bounding rects match new route height
    const settleTimer = setTimeout(() => {
      if (hasHero) {
        updateHeroSphereLayout();
      }
      updateExclusionZones();
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(settleTimer);
      resizeObs?.disconnect();
      trigger?.kill();
      scrollTween?.kill();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname, prefersReducedMotion]);

  return (
    <>
      <HeroParticleSphere />
      <FluidInkCanvas />
      <SmoothCursor />
    </>
  );
}
