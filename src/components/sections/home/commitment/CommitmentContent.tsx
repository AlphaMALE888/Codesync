import React from "react";
import { COMMITMENT_COPY } from "@/lib/commitmentArchitecture";

export function CommitmentContent() {
  return (
    <div className="relative z-10 max-w-[540px] space-y-5 sm:space-y-6">
      <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#C8102E]">
        {COMMITMENT_COPY.eyebrow}
      </span>

      <h2 className="text-[clamp(2.25rem,4.6vw,4rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#F5F5F5]">
        <span className="block">{COMMITMENT_COPY.headlinePrimary}</span>
        <span className="block text-[#A5A5A5]">{COMMITMENT_COPY.headlineSecondary}</span>
      </h2>

      <p className="max-w-[440px] text-[15px] sm:text-[16.5px] leading-[1.6] text-[#A5A5A5] pt-1">
        {COMMITMENT_COPY.supportingBody}
      </p>
    </div>
  );
}
