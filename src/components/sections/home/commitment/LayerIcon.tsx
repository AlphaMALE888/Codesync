"use client";

import React from "react";
import type { CommitmentLayerId } from "@/lib/commitmentArchitecture";

interface LayerIconProps {
  layerId: CommitmentLayerId;
  isActive: boolean;
  brightness?: number;
}

export function LayerIcon({ layerId, isActive, brightness = 1 }: LayerIconProps) {
  const strokeColor = isActive ? "#FFF4F5" : "#EDE4E6";
  const accentColor = isActive ? "#FF4766" : "#D68995";
  const opacity = Math.min(1, 0.88 * brightness);

  if (layerId === "authority") {
    return (
      <g
        transform="translate(0, -3) scale(1.04, 0.80)"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      >
        {/* Minimal crown silhouette matching reference */}
        <path d="M-28 14 L-33 -10 L-14 2 L0 -17 L14 2 L33 -10 L28 14 Z" />
        <path d="M-26 20 L26 20" strokeOpacity={0.85} />
        <circle cx="-33" cy="-12.5" r="2.2" fill={strokeColor} stroke="none" />
        <circle cx="0" cy="-20" r="2.6" fill={accentColor} stroke="none" />
        <circle cx="33" cy="-12.5" r="2.2" fill={strokeColor} stroke="none" />
      </g>
    );
  }

  if (layerId === "ux") {
    return (
      <g
        transform="translate(0, -1) scale(1, 0.545) rotate(-45)"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      >
        {/* Minimal isometric browser / interface wireframe */}
        <rect x="-42" y="-32" width="84" height="64" rx="7" vectorEffect="non-scaling-stroke" />
        <line x1="-42" y1="-15" x2="42" y2="-15" vectorEffect="non-scaling-stroke" strokeOpacity={0.75} />
        <circle cx="-31" cy="-23.5" r="2.2" fill={accentColor} stroke="none" />
        <circle cx="-22" cy="-23.5" r="2.2" fill={strokeColor} fillOpacity={0.65} stroke="none" />
        <circle cx="-13" cy="-23.5" r="2.2" fill={strokeColor} fillOpacity={0.4} stroke="none" />
        <rect x="-32" y="-4" width="26" height="24" rx="3" vectorEffect="non-scaling-stroke" strokeOpacity={0.78} />
        <line x1="2" y1="-2" x2="32" y2="-2" vectorEffect="non-scaling-stroke" strokeOpacity={0.82} />
        <line x1="2" y1="8" x2="28" y2="8" vectorEffect="non-scaling-stroke" strokeOpacity={0.68} />
        <line x1="2" y1="18" x2="22" y2="18" vectorEffect="non-scaling-stroke" strokeOpacity={0.55} />
      </g>
    );
  }

  if (layerId === "content") {
    return (
      <g
        transform="translate(0, -1) scale(1, 0.545) rotate(-45)"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      >
        {/* Minimal structured editorial/content layout grid */}
        <rect x="-42" y="-32" width="84" height="64" rx="7" vectorEffect="non-scaling-stroke" />
        <rect x="-32" y="-22" width="64" height="12" rx="3" vectorEffect="non-scaling-stroke" strokeOpacity={0.75} />
        <rect x="-32" y="-2" width="28" height="24" rx="3" vectorEffect="non-scaling-stroke" strokeOpacity={0.82} />
        <rect x="4" y="-2" width="28" height="24" rx="3" vectorEffect="non-scaling-stroke" strokeOpacity={0.82} />
        <line x1="-26" y1="6" x2="-10" y2="6" vectorEffect="non-scaling-stroke" strokeOpacity={0.7} />
        <line x1="-26" y1="14" x2="-14" y2="14" vectorEffect="non-scaling-stroke" strokeOpacity={0.55} />
        <line x1="10" y1="6" x2="26" y2="6" vectorEffect="non-scaling-stroke" strokeOpacity={0.7} />
        <line x1="10" y1="14" x2="22" y2="14" vectorEffect="non-scaling-stroke" strokeOpacity={0.55} />
      </g>
    );
  }

  // Technical Structure: clean isometric </> code symbol
  return (
    <g
      transform="translate(0, -1) scale(1.06, 0.72)"
      fill="none"
      stroke={strokeColor}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    >
      <path d="M-19 -13 L-35 0 L-19 13" />
      <path d="M6 -16 L-6 16" stroke={isActive ? "#FF5C77" : strokeColor} />
      <path d="M19 -13 L35 0 L19 13" />
    </g>
  );
}
