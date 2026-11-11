"use client";

import React, { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { cn } from "@/lib/cn";

export interface CounterProps {
  from?: number;
  to: number;
  duration?: number; // ms
  suffix?: string;
  prefix?: string;
  displayValue?: string; // Static fallback (e.g., "24–48")
  className?: string;
}

export function Counter({
  from = 0,
  to,
  duration = 1100,
  suffix = "",
  prefix = "",
  displayValue,
  className,
}: CounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentValue, setCurrentValue] = useState<number>(shouldReduceMotion ? to : from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (shouldReduceMotion || hasAnimated) {
      setCurrentValue(to);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const startVal = from;
          const endVal = to;

          const step = (currentTime: number) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const val = Math.round(startVal + (endVal - startVal) * easeOut);
            setCurrentValue(val);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCurrentValue(endVal);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [from, to, duration, shouldReduceMotion, hasAnimated]);

  return (
    <span ref={elementRef} className={cn("font-tabular inline-block", className)}>
      {displayValue ? (
        displayValue
      ) : (
        <>
          {prefix}
          {currentValue}
          {suffix}
        </>
      )}
    </span>
  );
}
