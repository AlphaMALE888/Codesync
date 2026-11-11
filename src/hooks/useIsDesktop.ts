"use client";

import { useState, useEffect } from "react";

/**
 * Detects whether the device has a fine pointer (mouse/trackpad) and supports hover.
 * Used to disable heavy scrubbed parallax and desktop-specific hover interactions on mobile/touch devices.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
    setIsDesktop(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return isDesktop;
}
