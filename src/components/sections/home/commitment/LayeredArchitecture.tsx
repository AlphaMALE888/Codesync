"use client";

import React, { useRef, useState } from "react";
import {
  COMMITMENT_LAYERS,
  computeDesktopStackGeometry,
  getBottomToTopRevealOrder,
  getLayerInteractionState,
  type CommitmentLayerId,
} from "@/lib/commitmentArchitecture";
import { useGSAPContext, gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ArchitectureLayer } from "./ArchitectureLayer";
import { ConnectorLines } from "./ConnectorLines";
import { LayerInformationLabel } from "./LayerInformationLabel";
import { cn } from "@/lib/cn";

export function LayeredArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [hoveredId, setHoveredId] = useState<CommitmentLayerId | null>(null);
  const [pinnedId, setPinnedId] = useState<CommitmentLayerId | null>(null);

  const activeLayerId = hoveredId ?? pinnedId;

  const handleActivate = (id: CommitmentLayerId) => {
    setHoveredId(id);
  };

  const handleDeactivate = (id: CommitmentLayerId) => {
    setHoveredId((prev) => (prev === id ? null : prev));
  };

  const handleToggle = (id: CommitmentLayerId) => {
    setPinnedId((prev) => (prev === id ? null : id));
  };

  // GSAP ScrollTrigger bottom-to-top sequential reveal (plays once, preserves completed state)
  useGSAPContext(
    containerRef,
    () => {
      if (prefersReducedMotion || typeof window === "undefined") return;
      const root = containerRef.current;
      if (!root) return;

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const scope =
        root.querySelector(
          isDesktop
            ? '[data-testid="commitment-layered-architecture-desktop"]'
            : '[data-testid="commitment-layered-architecture-mobile"]'
        ) ?? root;

      const bottomToTop = getBottomToTopRevealOrder();
      const slabEls = bottomToTop
        .map((l) => scope.querySelector(`[data-reveal-slab="${l.id}"]`))
        .filter(Boolean) as HTMLElement[];

      const guideEls = Array.from(scope.querySelectorAll("[data-reveal-guide]")) as SVGElement[];
      const dotEls = Array.from(scope.querySelectorAll("[data-reveal-dot]")) as SVGElement[];
      const connectorEls = bottomToTop
        .map((l) => scope.querySelector(`[data-reveal-connector="${l.id}"]`))
        .filter(Boolean) as SVGLineElement[];
      const nodeEls = bottomToTop
        .map((l) => scope.querySelector(`[data-reveal-node="${l.id}"]`))
        .filter(Boolean) as SVGElement[];
      const labelEls = bottomToTop
        .map((l) => scope.querySelector(`[data-reveal-label="${l.id}"]`))
        .filter(Boolean) as HTMLElement[];

      if (slabEls.length === 0) return;

      // Initial pre-assembly states
      gsap.set(slabEls, { opacity: 0, y: 20, scale: 0.965 });
      gsap.set(guideEls, { opacity: 0 });
      gsap.set(dotEls, { opacity: 0, scale: 0.4, transformOrigin: "center" });
      connectorEls.forEach((line) => {
        const len = Number(line.getAttribute("stroke-dasharray") || 100);
        gsap.set(line, { strokeDashoffset: len, opacity: 0 });
      });
      gsap.set(nodeEls, { opacity: 0, scale: 0.35, transformOrigin: "center" });
      gsap.set(labelEls, { opacity: 0, x: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          once: true,
        },
      });

      // 1-4: Bottom-to-top sequential slab assembly (Technical -> Content -> UX -> Authority)
      tl.to(slabEls, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.44,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      })
        // 5: Vertical guides & data points appear
        .to(
          guideEls,
          { opacity: 1, duration: 0.28, ease: "power2.out" },
          "-=0.2"
        )
        .to(
          dotEls,
          { opacity: 0.85, scale: 1, duration: 0.22, stagger: 0.02, ease: "back.out(1.7)" },
          "-=0.22"
        )
        // 6: Horizontal connector lines draw progressively and crimson nodes illuminate
        .to(
          connectorEls,
          {
            strokeDashoffset: 0,
            opacity: 0.78,
            duration: 0.34,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "opacity",
          },
          "-=0.14"
        )
        .to(
          nodeEls,
          {
            opacity: 1,
            scale: 1,
            duration: 0.28,
            stagger: 0.05,
            ease: "back.out(1.8)",
          },
          "-=0.28"
        )
        // 7: Four descriptive labels fade smoothly into place
        .to(
          labelEls,
          {
            opacity: 1,
            x: 0,
            duration: 0.32,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.22"
        );
    },
    [prefersReducedMotion]
  );

  const geom = computeDesktopStackGeometry();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* DESKTOP & TABLET (md+): Exact 4-Layer Isometric Stack + Connector System + Right Labels */}
      <div
        className="hidden md:block relative w-full max-w-[640px] mx-auto aspect-[640/460]"
        data-testid="commitment-layered-architecture-desktop"
      >
        {/* Subtle restrained crimson ground ambient pool below bottom Technical Structure */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            left: "4%",
            bottom: "0%",
            width: "52%",
            height: "30%",
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(200, 16, 46, 0.22) 0%, rgba(112, 0, 24, 0.1) 48%, transparent 78%)",
          }}
        />

        {/* Progressive SVG vertical guides, horizontal connectors, and crimson nodes */}
        <ConnectorLines
          activeLayerId={activeLayerId}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Four physical isometric 3D plates (Authority top z-40 -> Technical bottom z-10) */}
        {COMMITMENT_LAYERS.map((layer) => {
          const yCenter = geom.layerCenterY[layer.orderIndex];
          const state = getLayerInteractionState(
            layer.id,
            activeLayerId,
            layer.crimsonIntensity
          );

          // Exact Z-layering so top plate's lower bevel naturally overlaps upper edge of plate beneath
          const zClass =
            layer.orderIndex === 0
              ? "z-40"
              : layer.orderIndex === 1
                ? "z-30"
                : layer.orderIndex === 2
                  ? "z-20"
                  : "z-10";

          return (
            <ArchitectureLayer
              key={layer.id}
              layer={layer}
              state={state}
              prefersReducedMotion={prefersReducedMotion}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onToggle={handleToggle}
              className={cn("absolute -translate-x-1/2 -translate-y-1/2", zClass)}
              style={{
                left: `${(186 / geom.viewBoxWidth) * 100}%`,
                top: `${(yCenter / geom.viewBoxHeight) * 100}%`,
                width: `${(300 / geom.viewBoxWidth) * 100}%`,
                height: `${(184 / geom.viewBoxHeight) * 100}%`,
              }}
            />
          );
        })}

        {/* Four aligned right-side interactive info labels */}
        {COMMITMENT_LAYERS.map((layer) => {
          const yCenter = geom.layerCenterY[layer.orderIndex];
          const state = getLayerInteractionState(
            layer.id,
            activeLayerId,
            layer.crimsonIntensity
          );

          return (
            <div
              key={`label-slot-${layer.id}`}
              className="absolute -translate-y-1/2 z-40"
              style={{
                left: `${(geom.labelAnchorX / geom.viewBoxWidth) * 100}%`,
                right: "0%",
                top: `${(yCenter / geom.viewBoxHeight) * 100}%`,
              }}
            >
              <LayerInformationLabel
                layer={layer}
                state={state}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
                onToggle={handleToggle}
              />
            </div>
          );
        })}
      </div>

      {/* MOBILE (< md): Clean vertically stacked 4-layer isometric pair list with tap/focus inspection */}
      <div
        className="md:hidden flex flex-col gap-4 w-full"
        data-testid="commitment-layered-architecture-mobile"
      >
        {COMMITMENT_LAYERS.map((layer) => {
          const state = getLayerInteractionState(
            layer.id,
            activeLayerId,
            layer.crimsonIntensity
          );

          return (
            <div
              key={`mobile-${layer.id}`}
              className="relative flex items-center gap-3 w-full"
            >
              {/* Compact isometric 3D plate */}
              <div className="relative w-[132px] h-[82px] shrink-0">
                <ArchitectureLayer
                  layer={layer}
                  state={state}
                  prefersReducedMotion={true}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  onToggle={handleToggle}
                  className="w-full h-full"
                />
              </div>

              {/* Crimson node + short connector */}
              <div className="flex items-center shrink-0" aria-hidden="true">
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-200",
                    state.isActive
                      ? "bg-[#FF3B5C] shadow-[0_0_12px_#FF3B5C] scale-125"
                      : "bg-[#C8102E] shadow-[0_0_8px_rgba(200,16,46,0.65)]"
                  )}
                />
                <span
                  className={cn(
                    "h-[1.5px] w-4 transition-colors duration-200",
                    state.isActive ? "bg-[#E02E4F]" : "bg-white/20"
                  )}
                />
              </div>

              {/* Interactive label box */}
              <div className="flex-1 min-w-0">
                <LayerInformationLabel
                  layer={layer}
                  state={state}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  onToggle={handleToggle}
                  className="w-full px-3.5 py-2.5"
                />
                {pinnedId === layer.id && (
                  <p className="mt-1.5 px-1 text-xs text-[#A5A5A5] leading-relaxed">
                    {layer.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
