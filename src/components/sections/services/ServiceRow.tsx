"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceItem } from "@/data/types";
import {
  setParticleFocusFromElement,
  clearParticleFocus,
} from "@/components/particles/particleState";

interface ServiceRowProps {
  service: ServiceItem;
  index: number;
  theme?: "light" | "dark";
}

export function ServiceRow({ service, index }: ServiceRowProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/services/${service.slug}`}
      onMouseEnter={(e) => setParticleFocusFromElement(e.currentTarget, "attract", 0.85)}
      onMouseLeave={() => clearParticleFocus()}
      className="group relative flex flex-col md:flex-row md:items-center justify-between min-h-[56px] py-5 sm:py-6 px-4 sm:px-6 rounded-md transition-colors duration-200 ease-out border-b border-white/10 hover:bg-white/[0.04] text-ink"
    >
      <div className="flex items-start md:items-center gap-4 sm:gap-6 flex-1 pr-4">
        {/* Number */}
        <span className="font-mono text-xs sm:text-sm tracking-widest pt-1 md:pt-0 transition-colors duration-200 text-white/45 group-hover:text-accent-soft">
          {formattedIndex}
        </span>

        {/* Title & OneLiner */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-6 flex-1">
          <h3 className="font-display font-medium text-lg sm:text-xl text-ink group-hover:text-white tracking-tight transition-colors duration-200">
            {service.name}
          </h3>
          <p className="text-sm tracking-normal line-clamp-2 lg:line-clamp-1 max-w-xl text-text-secondary-on-dark">
            {service.oneLiner}
          </p>
        </div>
      </div>

      {/* Trailing arrow */}
      <div className="flex items-center justify-end mt-2 md:mt-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ease-out bg-white/8 border border-white/10 group-hover:bg-accent group-hover:border-accent-soft text-white group-hover:translate-x-1.5">
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}
