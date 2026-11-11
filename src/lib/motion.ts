"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { dur, ease } from "./motion-tokens";

export { motion, AnimatePresence, LayoutGroup };

export const transitionFast = {
  duration: dur.hover,
  ease: ease.out,
};

export const transitionBase = {
  duration: 0.32,
  ease: ease.out,
};

export const transitionSlow = {
  duration: dur.panel,
  ease: ease.inOut,
};

export const transitionReveal = {
  duration: dur.reveal,
  ease: ease.out,
};

export * from "./motion-tokens";
