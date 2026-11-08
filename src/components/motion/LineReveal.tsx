"use client";

import React from "react";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "./useReducedMotion";

export interface LineRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: (index: number) => string;
  delay?: number;
}

export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0.15,
}: LineRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <h1 className={cn("flex flex-col select-none", className)}>
      {lines.map((line, index) => (
        <span
          key={index}
          className="relative inline-block overflow-hidden py-0.5"
        >
          <motion.span
            initial={shouldReduceMotion ? { y: 0 } : { y: "115%" }}
            animate={{ y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.8,
                    delay: delay + index * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
            className={cn(
              "inline-block will-change-transform leading-[0.96]",
              lineClassName ? lineClassName(index) : ""
            )}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
