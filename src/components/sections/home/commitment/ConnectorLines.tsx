"use client";

import React from "react";
import {
  COMMITMENT_LAYERS,
  computeDesktopStackGeometry,
  getLayerInteractionState,
  type CommitmentLayerId,
} from "@/lib/commitmentArchitecture";

interface ConnectorLinesProps {
  activeLayerId: CommitmentLayerId | null;
  prefersReducedMotion: boolean;
}

export function ConnectorLines({
  activeLayerId,
  prefersReducedMotion,
}: ConnectorLinesProps) {
  const geom = computeDesktopStackGeometry();
  const topY = geom.layerCenterY[0];
  const bottomY = geom.layerCenterY[geom.layerCenterY.length - 1];

  return (
    <svg
      viewBox={`0 0 ${geom.viewBoxWidth} ${geom.viewBoxHeight}`}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-50 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="conn-node-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4766" stopOpacity="1" />
          <stop offset="35%" stopColor="#C8102E" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#700018" stopOpacity="0" />
        </radialGradient>

        <linearGradient
          id="conn-line-idle"
          gradientUnits="userSpaceOnUse"
          x1={geom.rightNodeX}
          y1="0"
          x2={geom.labelAnchorX}
          y2="0"
        >
          <stop offset="0%" stopColor="#FF3B5C" stopOpacity="0.92" />
          <stop offset="45%" stopColor="#C8102E" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.28" />
        </linearGradient>

        <linearGradient
          id="conn-line-active"
          gradientUnits="userSpaceOnUse"
          x1={geom.rightNodeX}
          y1="0"
          x2={geom.labelAnchorX}
          y2="0"
        >
          <stop offset="0%" stopColor="#FF4D6D" stopOpacity="1" />
          <stop offset="65%" stopColor="#E02E4F" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.72" />
        </linearGradient>
      </defs>

      {/* Left vertical dashed crimson architectural guide */}
      <line
        data-reveal-guide="left"
        x1={geom.leftGuideX}
        y1={topY}
        x2={geom.leftGuideX}
        y2={bottomY}
        stroke="#C8102E"
        strokeOpacity="0.34"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {geom.verticalDotsPerGuide.map((dotY, idx) => (
        <circle
          key={`left-dot-${idx}`}
          data-reveal-dot="left"
          cx={geom.leftGuideX}
          cy={dotY}
          r={idx % 2 === 0 ? 2.2 : 1.5}
          fill={idx % 2 === 0 ? "#E02E4F" : "#C8102E"}
          opacity={idx % 2 === 0 ? 0.85 : 0.6}
        />
      ))}

      {/* Right vertical dashed crimson guide along diamond right tips */}
      <line
        data-reveal-guide="right"
        x1={geom.rightNodeX}
        y1={topY}
        x2={geom.rightNodeX}
        y2={bottomY}
        stroke="#C8102E"
        strokeOpacity="0.28"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {geom.verticalDotsPerGuide
        .filter((_, idx) => idx % 2 === 1)
        .map((dotY, idx) => (
          <circle
            key={`right-mid-dot-${idx}`}
            data-reveal-dot="right"
            cx={geom.rightNodeX}
            cy={dotY}
            r={1.5}
            fill="#C8102E"
            opacity="0.62"
          />
        ))}

      {/* Horizontal layer connectors + glowing crimson connection nodes */}
      {COMMITMENT_LAYERS.map((layer) => {
        const y = geom.layerCenterY[layer.orderIndex];
        const state = getLayerInteractionState(
          layer.id,
          activeLayerId,
          layer.crimsonIntensity
        );
        const lineLen = geom.labelAnchorX - geom.rightNodeX;

        return (
          <g key={layer.id}>
            {/* Horizontal connector from right diamond node straight to label left border */}
            <line
              data-reveal-connector={layer.id}
              x1={geom.rightNodeX}
              y1={y}
              x2={geom.labelAnchorX}
              y2={y}
              stroke={state.isActive ? "url(#conn-line-active)" : "url(#conn-line-idle)"}
              strokeWidth={state.isActive ? 1.75 : 1.15}
              strokeDasharray={lineLen}
              opacity={state.connectorOpacity}
              style={{
                transition: "opacity 240ms ease, stroke-width 240ms ease",
              }}
            />

            {/* Crimson ConnectionNode at diamond right corner */}
            <g
              data-reveal-node={layer.id}
              transform={`translate(${geom.rightNodeX}, ${y})`}
            >
              <g
                style={{
                  transform: `scale(${state.nodeScale})`,
                  transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <g
                  className={!prefersReducedMotion ? "animate-commitment-node" : undefined}
                  style={
                    !prefersReducedMotion
                      ? ({
                          "--node-delay": `${layer.orderIndex * 0.65}s`,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <circle cx="0" cy="0" r={state.isActive ? 13 : 10} fill="url(#conn-node-halo)" />
                  <circle
                    cx="0"
                    cy="0"
                    r={state.isActive ? 3.8 : 3.0}
                    fill="#FF2E4D"
                    opacity={state.isActive ? 1 : 0.9}
                  />
                  <circle cx="0" cy="0" r="1.4" fill="#FFF0F2" />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
