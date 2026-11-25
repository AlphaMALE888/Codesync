"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { particleBridge } from "@/components/particles/particleState";
import {
  SMOOTH_CURSOR_SPRING,
  isPointExcluded,
} from "@/lib/visualExperience";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="tab"], input, textarea, select, label, summary, [data-interactive="true"]';
const TEXT_INPUT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

export function SmoothCursor() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isTextTarget, setIsTextTarget] = useState(false);

  const cursorX = useSpring(0, SMOOTH_CURSOR_SPRING);
  const cursorY = useSpring(0, SMOOTH_CURSOR_SPRING);
  const rotation = useSpring(0, {
    ...SMOOTH_CURSOR_SPRING,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...SMOOTH_CURSOR_SPRING,
    stiffness: 500,
    damping: 35,
  });

  const lastPosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const angleRef = useRef({ prev: 0, accum: 0 });
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarsePointer =
      window.matchMedia?.("(pointer: coarse)")?.matches ||
      (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);

    if (isCoarsePointer || prefersReducedMotion) {
      document.documentElement.classList.remove("has-smooth-cursor");
      setEnabled(false);
      return;
    }

    document.documentElement.classList.add("has-smooth-cursor");
    setEnabled(true);

    // Keep unified bridge synced directly to SmoothCursor spring coordinates
    const unsubX = cursorX.on("change", (val) => {
      const prev = particleBridge.springClientX;
      particleBridge.springVelX = val - prev;
      particleBridge.springClientX = val;
    });
    const unsubY = cursorY.on("change", (val) => {
      const prev = particleBridge.springClientY;
      particleBridge.springVelY = val - prev;
      particleBridge.springClientY = val;
    });

    let cachedFooterEl: HTMLElement | null = null;
    let cachedServicesEl: HTMLElement | null = null;
    let cachedPathname = "";
    let lastExclusionCheck = 0;

    const updateExclusionAtPoint = (clientX: number, clientY: number) => {
      if (particleBridge.fluidBlend <= 0.01) {
        particleBridge.cursorExcluded = false;
        return;
      }
      const now = performance.now();
      if (now - lastExclusionCheck < 80) return;
      lastExclusionCheck = now;

      if (cachedPathname !== particleBridge.pathname) {
        cachedPathname = particleBridge.pathname;
        cachedFooterEl = document.getElementById("site-footer");
        cachedServicesEl =
          cachedPathname === "/" ? document.getElementById("services-section") : null;
      } else {
        if (!cachedFooterEl) cachedFooterEl = document.getElementById("site-footer");
        if (cachedPathname === "/" && !cachedServicesEl) {
          cachedServicesEl = document.getElementById("services-section");
        }
      }

      particleBridge.cursorExcluded = isPointExcluded(clientX, clientY, [
        cachedFooterEl?.getBoundingClientRect() ?? null,
        cachedServicesEl?.getBoundingClientRect() ?? null,
      ]);
    };

    let isCurrentlyVisible = false;
    let rafId = 0;
    const processPointerPosition = (
      clientX: number,
      clientY: number,
      targetEl: HTMLElement | null
    ) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastPosRef.current.time);
      const vx = (clientX - lastPosRef.current.x) / dt;
      const vy = (clientY - lastPosRef.current.y) / dt;
      const speed = Math.hypot(vx, vy);

      lastPosRef.current = { x: clientX, y: clientY, time: now };

      if (!particleBridge.hasPointerMoved) {
        cursorX.jump(clientX);
        cursorY.jump(clientY);
        particleBridge.springClientX = clientX;
        particleBridge.springClientY = clientY;
        particleBridge.hasPointerMoved = true;
      } else {
        cursorX.set(clientX);
        cursorY.set(clientY);
      }

      particleBridge.cursorActive = true;
      updateExclusionAtPoint(clientX, clientY);
      if (!isCurrentlyVisible) {
        isCurrentlyVisible = true;
        setVisible(true);
      }

      const onText = Boolean(targetEl?.closest?.(TEXT_INPUT_SELECTOR));
      const onInteractive = Boolean(targetEl?.closest?.(INTERACTIVE_SELECTOR));
      particleBridge.interactiveHover = onInteractive;
      particleBridge.isTextInputHover = onText;
      setIsTextTarget(onText);
      setIsInteractive(onInteractive);

      if (onText) {
        rotation.set(0);
        angleRef.current.accum = 0;
      } else if (speed > 0.12) {
        const currentAngle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;
        let diff = currentAngle - angleRef.current.prev;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        angleRef.current.accum += diff * 0.25;
        angleRef.current.prev = currentAngle;
        rotation.set(Math.max(-24, Math.min(24, angleRef.current.accum * 0.2)));
        scale.set(0.95);

        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(() => {
          scale.set(1);
          rotation.set(0);
          angleRef.current.accum = 0;
        }, 150);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const clientX = e.clientX;
      const clientY = e.clientY;
      const targetEl = e.target as HTMLElement | null;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        processPointerPosition(clientX, clientY, targetEl);
      });
    };

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      processPointerPosition(e.clientX, e.clientY, e.target as HTMLElement | null);
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch" || isCurrentlyVisible) return;
      processPointerPosition(e.clientX, e.clientY, e.target as HTMLElement | null);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!isCurrentlyVisible) {
        processPointerPosition(e.clientX, e.clientY, e.target as HTMLElement | null);
      }
      particleBridge.pendingClickSplats.push({
        clientX: e.clientX,
        clientY: e.clientY,
      });
      scale.set(0.9);
      setTimeout(() => scale.set(1), 120);
    };

    const handleMouseLeave = () => {
      particleBridge.cursorActive = false;
      isCurrentlyVisible = false;
      setVisible(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.targetTouches?.[0];
      if (!touch) return;
      particleBridge.hasPointerMoved = true;
      particleBridge.cursorActive = true;
      particleBridge.springClientX = touch.clientX;
      particleBridge.springClientY = touch.clientY;
      updateExclusionAtPoint(touch.clientX, touch.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerenter", handlePointerEnter, {
      passive: true,
    });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-smooth-cursor");
      if (rafId) cancelAnimationFrame(rafId);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      unsubX();
      unsubY();
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerenter", handlePointerEnter);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [cursorX, cursorY, rotation, scale, prefersReducedMotion]);

  if (!enabled || !visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      data-visual-layer="smooth-cursor"
      data-cursor-interactive={isInteractive ? "true" : "false"}
      data-cursor-text={isTextTarget ? "true" : "false"}
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-16.7%",
        translateY: "-16.7%",
        rotate: rotation,
        scale,
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "transform",
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isTextTarget ? 0.88 : 0.96,
      }}
      transition={{ duration: 0.14, ease: "easeOut" }}
    >
      <MousePointer2
        className={
          isInteractive && !isTextTarget
            ? "w-[18px] h-[18px] text-[#FFFFFF] fill-[#E02E4F]/90 drop-shadow-[0_2px_8px_rgba(224,46,79,0.6)] transition-colors duration-150"
            : isTextTarget
              ? "w-[18px] h-[18px] text-[#F5F5F5] fill-[#A12642]/35 drop-shadow-[0_1px_4px_rgba(161,38,66,0.35)] transition-colors duration-150"
              : "w-[18px] h-[18px] text-[#F5F5F5] fill-[#A12642]/80 drop-shadow-[0_2px_6px_rgba(161,38,66,0.45)] transition-colors duration-150"
        }
        strokeWidth={1.6}
      />
    </motion.div>
  );
}
