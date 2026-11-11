"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { dur, ease, travel } from "@/lib/motion-tokens";

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: travel.yPageTransition }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: dur.pageTransition,
        ease: ease.out,
      }}
    >
      {children}
    </motion.div>
  );
}
