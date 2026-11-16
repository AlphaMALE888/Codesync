"use client";

import React from "react";
import { TeamMember } from "@/data/types";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { cn } from "@/lib/cn";
import {
  clearParticleFocus,
  setParticleFocusFromElement,
} from "@/components/particles/particleState";

export interface TeamCardProps {
  member: TeamMember;
  className?: string;
}

export function TeamCard({ member, className }: TeamCardProps) {
  const fieldBgClass = {
    1: "bg-field-1/90 text-ink",
    2: "bg-field-2/90 text-ink",
    3: "bg-field-3/90 text-ink",
  }[member.field || 1];

  return (
    <div
      onMouseEnter={(e) => setParticleFocusFromElement(e.currentTarget, "wave", 0.55)}
      onMouseLeave={() => clearParticleFocus()}
      className={cn(
        "group relative rounded-md overflow-hidden border border-hairline flex flex-col justify-between",
        "aspect-[4/5] p-6 transition-all duration-base shadow-sm hover:border-accent-soft/40 select-none",
        fieldBgClass,
        className
      )}
    >
      {/* Top Metadata / Initials Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-secondary">
          {"// LEADERSHIP"}
        </span>
        <span className="w-8 h-8 rounded-pill bg-white/10 border border-white/10 flex items-center justify-center font-display font-bold text-xs text-ink group-hover:bg-accent group-hover:border-accent-soft/50 transition-colors">
          {member.name.split(" ").map((n) => n[0]).join("")}
        </span>
      </div>

      {/* Middle Image or Graphical Initial Placeholder */}
      <div className="my-auto py-4 overflow-hidden rounded-sm">
        {member.photo ? (
          <div className="w-full h-full overflow-hidden">
            <MediaSlot
              src={member.photo}
              alt={member.name}
              aspect="4/5"
              className="w-full h-full object-cover transition-transform duration-slow ease-out-custom group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs leading-relaxed text-text-secondary font-medium line-clamp-3">
              {member.bio}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Name & Role */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="font-display font-bold text-lg text-ink tracking-tight group-hover:text-accent-soft transition-colors">
          {member.name}
        </h4>
        <p className="type-label text-[11px] text-text-secondary font-semibold mt-0.5">
          {member.title}
        </p>
      </div>
    </div>
  );
}
