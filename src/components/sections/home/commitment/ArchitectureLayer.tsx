"use client";

import React, { useId, useMemo } from "react";
import {
  buildIsometricPlatePaths,
  type CommitmentLayerSpec,
  type LayerInteractionVisualState,
} from "@/lib/commitmentArchitecture";
import { LayerIcon } from "./LayerIcon";

interface ArchitectureLayerProps {
  layer: CommitmentLayerSpec;
  state: LayerInteractionVisualState;
  prefersReducedMotion: boolean;
  onActivate: (id: CommitmentLayerSpec["id"]) => void;
  onDeactivate: (id: CommitmentLayerSpec["id"]) => void;
  onToggle: (id: CommitmentLayerSpec["id"]) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function ArchitectureLayer({
  layer,
  state,
  prefersReducedMotion,
  onActivate,
  onDeactivate,
  onToggle,
  style,
  className = "",
}: ArchitectureLayerProps) {
  const plate = useMemo(() => buildIsometricPlatePaths(96, 18, 0.545, 11), []);
  const reactId = useId().replace(/:/g, "");

  const uid = `slab-${layer.id}-${reactId}`;
  const isStrongGlow = layer.crimsonIntensity === "strong" || layer.crimsonIntensity === "high";
  const underGlowOpacity = state.isActive
    ? isStrongGlow
      ? 0.62
      : 0.44
    : layer.crimsonIntensity === "strong"
      ? 0.48
      : layer.crimsonIntensity === "high"
        ? 0.44
        : layer.crimsonIntensity === "medium"
          ? 0.24
          : 0.14;

  // Surface top gradient palette calibrated per layer to match dark smoked-glass vs brushed metallic depth
  const topStops =
    layer.surfaceTone === "metallic"
      ? { c0: "#28282D", c1: "#1A1A1E", c2: "#121216" }
      : layer.surfaceTone === "metallic-crimson"
        ? { c0: "#24191D", c1: "#171114", c2: "#140A0D" }
        : layer.surfaceTone === "translucent"
          ? { c0: "#221D20", c1: "#161417", c2: "#110E11" }
          : { c0: "#23191D", c1: "#161215", c2: "#140A0E" };

  return (
    <button
      type="button"
      data-commitment-layer={layer.id}
      data-reveal-slab={layer.id}
      aria-label={`${layer.title} ${layer.subtitle}: ${layer.description}`}
      aria-pressed={state.isActive}
      onMouseEnter={() => onActivate(layer.id)}
      onMouseLeave={() => onDeactivate(layer.id)}
      onFocus={() => onActivate(layer.id)}
      onBlur={() => onDeactivate(layer.id)}
      onClick={() => onToggle(layer.id)}
      style={style}
      className={`group pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E02E4F]/80 rounded-xl select-none ${className}`}
    >
      {/* Independent hover lift container (never affects sibling slabs) */}
      <div
        className="w-full h-full will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translate3d(0, -${state.liftPx}px, 0)`,
        }}
      >
        {/* Subtle restrained GPU idle float */}
        <div
          className={!prefersReducedMotion ? "w-full h-full animate-commitment-float" : "w-full h-full"}
          style={
            !prefersReducedMotion
              ? ({
                  "--float-dur": `${layer.floatDurationSec}s`,
                  "--float-delay": `${layer.floatDelaySec}s`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <svg
            viewBox="-150 -86 300 184"
            className="w-full h-full overflow-visible pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              {/* Soft radial crimson under-glow bleeding onto nearby surfaces */}
              <radialGradient id={`${uid}-underglow`} cx="50%" cy="62%" r="54%">
                <stop offset="0%" stopColor="#E02E4F" stopOpacity="0.95" />
                <stop offset="42%" stopColor="#A51F3D" stopOpacity="0.52" />
                <stop offset="100%" stopColor="#700018" stopOpacity="0" />
              </radialGradient>

              {/* Smoked dark glass & subtle metallic plate surface */}
              <linearGradient id={`${uid}-topface`} x1="15%" y1="5%" x2="85%" y2="95%">
                <stop offset="0%" stopColor={topStops.c0} stopOpacity="0.94" />
                <stop offset="52%" stopColor={topStops.c1} stopOpacity="0.91" />
                <stop offset="100%" stopColor={topStops.c2} stopOpacity="0.95" />
              </linearGradient>

              {/* Diagonal glass specular reflection */}
              <linearGradient id={`${uid}-sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
                <stop offset="38%" stopColor="#FFFFFF" stopOpacity="0.03" />
                <stop offset="68%" stopColor="#C8102E" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#E02E4F" stopOpacity={isStrongGlow ? "0.18" : "0.08"} />
              </linearGradient>

              {/* Extruded 3D side wall shading (left facet catches crimson, right facet stays deep slate) */}
              <linearGradient id={`${uid}-sidewall`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#4A0A17" />
                <stop offset="36%" stopColor="#26080F" />
                <stop offset="52%" stopColor="#1B1519" />
                <stop offset="100%" stopColor="#111115" />
              </linearGradient>

              {/* Crimson illuminated bottom bevel edge */}
              <linearGradient id={`${uid}-crimsonedge`} x1="0%" y1="45%" x2="100%" y2="45%">
                <stop offset="0%" stopColor="#FF3B5C" />
                <stop offset="45%" stopColor="#C8102E" />
                <stop offset="78%" stopColor="#78071B" />
                <stop offset="100%" stopColor="#3B1019" />
              </linearGradient>

              {/* Upper metallic rim */}
              <linearGradient id={`${uid}-upperrim`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.12" />
              </linearGradient>
            </defs>

            {/* Ground / lower-layer soft ambient shadow */}
            <ellipse
              cx="0"
              cy="18"
              rx="126"
              ry="62"
              fill="#000000"
              opacity={state.isActive ? 0.56 : 0.44}
            />

            {/* Crimson under-lighting aura */}
            <ellipse
              cx="-12"
              cy="20"
              rx="138"
              ry="68"
              fill={`url(#${uid}-underglow)`}
              opacity={underGlowOpacity}
            />

            {/* Physical 3D Extruded Slab interactive hit target */}
            <g className="pointer-events-auto cursor-pointer">
              {/* 3D Extruded thickness body */}
              <path d={plate.sideWallPath} fill={`url(#${uid}-sidewall)`} />

              {/* Soft crimson glow bloom along lower beveled edge */}
              <path
                d={plate.lowerCrimsonEdgePath}
                fill="none"
                stroke="#C8102E"
                strokeWidth={state.isActive ? 9 : 7}
                strokeLinecap="round"
                opacity={state.edgeGlowOpacity * 0.32}
              />
              <path
                d={plate.lowerCrimsonEdgePath}
                fill="none"
                stroke="#FF294D"
                strokeWidth={state.isActive ? 4.2 : 3.4}
                strokeLinecap="round"
                opacity={state.edgeGlowOpacity * 0.45}
              />

              {/* Top smoked-glass & metallic surface */}
              <path
                d={plate.topFacePath}
                fill={`url(#${uid}-topface)`}
                stroke={state.isActive ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.14)"}
                strokeWidth="1"
              />
              <path d={plate.topFacePath} fill={`url(#${uid}-sheen)`} />

              {/* Upper crisp metallic bevel highlight */}
              <path
                d={plate.upperBevelRimPath}
                fill="none"
                stroke={`url(#${uid}-upperrim)`}
                strokeWidth={state.isActive ? 1.5 : 1.15}
                strokeLinecap="round"
              />

              {/* Lower-edge illuminated crimson rim */}
              <path
                d={plate.lowerCrimsonEdgePath}
                fill="none"
                stroke={`url(#${uid}-crimsonedge)`}
                strokeWidth={state.isActive ? 2.4 : 1.9}
                strokeLinecap="round"
                opacity={state.edgeGlowOpacity}
              />

              {/* Center isometric architectural icon */}
              <LayerIcon
                layerId={layer.id}
                isActive={state.isActive}
                brightness={state.iconBrightness}
              />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}
