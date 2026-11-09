import React from "react";
import { TeamMember } from "@/data/types";

interface TextLeadershipRowProps {
  members: TeamMember[];
}

export function TextLeadershipRow({ members }: TextLeadershipRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-hairline">
      {members.map((member) => (
        <div key={member.id} className="pt-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold block mb-1">
            {member.title}
          </span>
          <h4 className="font-display font-medium text-lg text-ink">
            {member.name}
          </h4>
          {member.note && (
            <span className="text-[11px] text-text-secondary/70 italic block mt-0.5">
              {member.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
