"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, rely strictly on native browser scrolling
    if (prefersReducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    // Prevent unnecessary layout recalculation on mobile address-bar resize
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Initialize Lenis for ultra-silky site-wide wheel & momentum scrolling
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      syncTouch: false, // native momentum scrolling on touch devices
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    // GSAP ticker sync
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Observe body style changes only to stop/resume Lenis when state transitions
    let isLocked =
      document.body.style.overflow === "hidden" ||
      document.documentElement.classList.contains("overflow-hidden");
    if (isLocked) lenis.stop();

    const observer = new MutationObserver(() => {
      const nextLocked =
        document.body.style.overflow === "hidden" ||
        document.documentElement.classList.contains("overflow-hidden");
      if (nextLocked !== isLocked) {
        isLocked = nextLocked;
        if (isLocked) {
          lenis.stop();
        } else {
          lenis.start();
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      observer.disconnect();
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
