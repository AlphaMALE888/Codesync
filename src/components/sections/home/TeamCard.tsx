import React from "react";
import { TeamMember } from "@/data/types";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { cn } from "@/lib/cn";

export interface TeamCardProps {
  member: TeamMember;
  className?: string;
}

export function TeamCard({ member, className }: TeamCardProps) {
  const fieldBgClass = {
    1: "bg-field-1 text-ink",
    2: "bg-field-2 text-ink",
    3: "bg-field-3 text-ink",
  }[member.field || 1];

  return (
    <div
      className={cn(
        "group relative rounded-md overflow-hidden border border-hairline flex flex-col justify-between",
        "aspect-[4/5] p-6 transition-all duration-base shadow-sm hover:shadow-md select-none",
        fieldBgClass,
        className
      )}
    >
      {/* Top Metadata / Initials Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-wider opacity-60">
          {"// LEADERSHIP"}
        </span>
        <span className="w-8 h-8 rounded-pill bg-ink/10 flex items-center justify-center font-display font-bold text-xs">
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
            <p className="text-xs leading-relaxed opacity-75 font-medium line-clamp-3">
              {member.bio}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Name & Role */}
      <div className="pt-4 border-t border-ink/10">
        <h4 className="font-display font-bold text-lg text-ink tracking-tight">
          {member.name}
        </h4>
        <p className="type-label text-[11px] text-ink/70 font-semibold mt-0.5">
          {member.title}
        </p>
      </div>
    </div>
  );
}
