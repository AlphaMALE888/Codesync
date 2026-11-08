"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export { motion, AnimatePresence, LayoutGroup };

export const transitionFast = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
};

export const transitionBase = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
};

export const transitionSlow = {
  duration: 0.45,
  ease: [0.65, 0, 0.35, 1],
};

export const transitionReveal = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};
