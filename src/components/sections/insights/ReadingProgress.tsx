"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function ReadingProgress() {
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || typeof window === "undefined") return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = totalScroll / windowHeight;
        setProgress(Math.min(1, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent-default z-50 origin-left transition-transform duration-75"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}
