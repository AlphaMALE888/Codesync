"use client";

import React from "react";
import type {
  CommitmentLayerSpec,
  LayerInteractionVisualState,
} from "@/lib/commitmentArchitecture";
import { cn } from "@/lib/cn";

interface LayerInformationLabelProps {
  layer: CommitmentLayerSpec;
  state: LayerInteractionVisualState;
  onActivate: (id: CommitmentLayerSpec["id"]) => void;
  onDeactivate: (id: CommitmentLayerSpec["id"]) => void;
  onToggle: (id: CommitmentLayerSpec["id"]) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function LayerInformationLabel({
  layer,
  state,
  onActivate,
  onDeactivate,
  onToggle,
  style,
  className,
}: LayerInformationLabelProps) {
  return (
    <button
      type="button"
      data-commitment-label={layer.id}
      data-reveal-label={layer.id}
      aria-label={`${layer.title} ${layer.subtitle}: ${layer.description}`}
      aria-pressed={state.isActive}
      onMouseEnter={() => onActivate(layer.id)}
      onMouseLeave={() => onDeactivate(layer.id)}
      onFocus={() => onActivate(layer.id)}
      onBlur={() => onDeactivate(layer.id)}
      onClick={() => onToggle(layer.id)}
      style={style}
      className={cn(
        "group relative block w-full text-left rounded-[12px] border px-3.5 py-2.5 lg:px-4 lg:py-3",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E02E4F]/80",
        state.isActive
          ? "bg-[#1A1014]/95 border-[#E02E4F]/75 shadow-[0_0_28px_rgba(200,16,46,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]"
          : state.hasOtherActive
            ? "bg-[#101013]/85 border-white/8 opacity-75"
            : "bg-[#121215]/92 border-white/12 hover:border-[#C8102E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className
      )}
    >
      {/* Subtle left crimson active accent dot inside border */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-opacity duration-200",
          state.isActive ? "bg-[#FF3B5C] opacity-100 shadow-[0_0_8px_#FF3B5C]" : "bg-[#C8102E] opacity-0"
        )}
      />

      <div className="text-[13.5px] lg:text-[14.5px] xl:text-[15.5px] font-semibold tracking-tight text-[#F5F5F5] leading-snug">
        {layer.title}
      </div>
      <div
        className={cn(
          "text-[11px] lg:text-[11.5px] xl:text-[12.5px] leading-snug mt-0.5 transition-colors duration-200",
          state.isActive ? "text-[#E2CFD3]" : "text-[#A5A5A5]"
        )}
      >
        {layer.subtitle}
      </div>
    </button>
  );
}
