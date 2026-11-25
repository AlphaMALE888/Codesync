"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FluidInkCanvas } from "@/components/visual/FluidInkCanvas";
import { SmoothCursor } from "@/components/visual/SmoothCursor";
import { particleBridge } from "@/components/particles/particleState";
import {
  computeHeroDissolveState,
  isPointExcluded,
  rectToUvBounds,
} from "@/lib/visualExperience";

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
              updateExclusionZones();
            },
          },
        });
        trigger = scrollTween.scrollTrigger ?? null;
      }
    }

    let resizeObs: ResizeObserver | null = null;
    if (heroEl && typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(() => {
        updateExclusionZones();
      });
      resizeObs.observe(heroEl);
    }

    const handleScroll = () => {
      if (hasHero && prefersReducedMotion) {
        applyHeroProgress(window.scrollY / getHeroScrubDistance(), true);
      }
      updateExclusionZones();
    };

    const handleResize = () => {
      if (hasHero && prefersReducedMotion) {
        applyHeroProgress(window.scrollY / getHeroScrubDistance(), true);
      }
      updateExclusionZones();
      ScrollTrigger.refresh();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    const settleTimer = setTimeout(() => {
      updateExclusionZones();
      ScrollTrigger.refresh();
    }, 120);

    return () => {
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
      <FluidInkCanvas />
      <SmoothCursor />
    </>
  );
}
