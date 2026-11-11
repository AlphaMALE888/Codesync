"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// SSR-safe useLayoutEffect
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Debounced ScrollTrigger refresh setup for resize events
 */
let resizeTimeout: NodeJS.Timeout | null = null;
export function debouncedScrollTriggerRefresh(delay = 200) {
  if (typeof window === "undefined") return;
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, delay);
}

if (typeof window !== "undefined") {
  window.addEventListener("resize", () => debouncedScrollTriggerRefresh(200));
}

/**
 * Safe GSAP context hook that cleanly sets up and cleans up animations/triggers.
 */
export function useGSAPContext(
  scopeRef: React.RefObject<HTMLElement | null>,
  callback: (context: gsap.Context) => void,
  dependencies: React.DependencyList = []
) {
  useEffect(() => {
    if (!scopeRef.current) return;

    const ctx = gsap.context(() => {
      callback(ctx);
    }, scopeRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeRef, ...dependencies]);
}

export { gsap, ScrollTrigger };
