"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { dur, ease, travel, stagger } from "@/lib/motion-tokens";

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  staggerChildren?: boolean | number;
  initialDelay?: number;
}

export function Reveal({
  children,
  delay,
  duration,
  yOffset,
  className,
  staggerChildren,
  initialDelay = 0,
}: RevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();

  // If user requests reduced motion, render immediately without animations
  if (prefersReducedMotion) {
    return <div className={cn("w-full js-reveal", className)}>{children}</div>;
  }

  const effectiveDuration =
    duration !== undefined
      ? duration
      : isDesktop
      ? dur.reveal
      : dur.revealMobile;

  const effectiveY =
    yOffset !== undefined
      ? yOffset
      : isDesktop
      ? travel.yReveal
      : travel.yRevealMobile;

  const effectiveDelay = (delay ?? 0) + initialDelay;

  // Stagger container mode when requested
  if (staggerChildren) {
    const staggerTime =
      typeof staggerChildren === "number" ? staggerChildren : stagger.reveal;

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: effectiveDelay,
              staggerChildren: staggerTime,
            },
          },
        }}
        className={cn("w-full js-reveal", className)}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          // Limit stagger to maxRevealChildren (6)
          const childDelay = index < stagger.maxRevealChildren ? 0 : 0;
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: effectiveY },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: effectiveDuration,
                    ease: ease.out,
                    delay: childDelay,
                  },
                },
              }}
            >
              {child}
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: effectiveY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: effectiveDuration,
        delay: effectiveDelay,
        ease: ease.out,
      }}
      className={cn("w-full js-reveal", className)}
    >
      {children}
    </motion.div>
  );
}
