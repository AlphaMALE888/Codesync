"use client";

import React from "react";
import Image from "next/image";
import { TeamMember } from "@/data/types";
import { cn } from "@/lib/cn";

interface LeadershipCardProps {
  member: TeamMember;
}

export function LeadershipCard({ member }: LeadershipCardProps) {
  const fieldClasses: Record<number, string> = {
    1: "bg-field-1",
    2: "bg-field-2",
    3: "bg-field-3",
  };

  const bgClass = member.field ? fieldClasses[member.field] : "bg-field-1";

  return (
    <div
      className={cn(
        "group relative rounded-md overflow-hidden flex flex-col justify-between p-6 sm:p-8 aspect-[4/5] border border-hairline/60 transition-shadow duration-300 hover:shadow-md",
        bgClass
      )}
    >
      {/* Top: Branded Initial / Role Tag */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-ink/60">
          LEADERSHIP
        </span>
        <span className="font-mono text-xs font-semibold text-accent px-2 py-0.5 rounded bg-white/60 backdrop-blur-xs">
          CODESYNC
        </span>
      </div>

      {/* Center Image (if approved photo exists) */}
      {member.photo ? (
        <div className="relative w-full h-48 sm:h-56 my-auto overflow-hidden rounded-sm">
          <Image
            src={member.photo}
            alt={`${member.name} - ${member.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        /* Typographic Monogram Anchor */
        <div className="my-auto py-8">
          <span className="font-display font-medium text-4xl sm:text-5xl text-ink/15 select-none block">
            {member.name.split(" ").slice(-1)[0]}
          </span>
        </div>
      )}

      {/* Bottom Information */}
      <div className="pt-4 border-t border-ink/10">
        <h3 className="font-display font-medium text-xl sm:text-2xl text-ink tracking-tight">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-accent font-semibold mt-1">
          {member.title}
        </p>

        {/* Bio Line Hover Reveal (if present) */}
        {member.bio && (
          <p className="mt-2 text-xs text-ink/75 leading-relaxed line-clamp-2 transition-opacity duration-200">
            {member.bio}
          </p>
        )}
      </div>
    </div>
  );
}
