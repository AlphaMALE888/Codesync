"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { dur, ease } from "@/lib/motion-tokens";

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ImageReveal({
  children,
  className,
  delay = 0,
}: ImageRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn("overflow-hidden", className)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: dur.imageReveal, // 0.9s
        delay,
        ease: ease.out,
      }}
      className={cn("overflow-hidden", className)}
    >
      <motion.div
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1.0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: dur.imageScale, // 1.1s
          delay,
          ease: ease.out,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
