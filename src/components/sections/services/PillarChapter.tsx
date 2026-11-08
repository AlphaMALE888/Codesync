"use client";

import React from "react";
import { ServiceItem } from "@/data/types";
import { ServiceRow } from "./ServiceRow";
import { GrowArt } from "@/components/illustrations/GrowArt";
import { BuildArt } from "@/components/illustrations/BuildArt";
import { RunArt } from "@/components/illustrations/RunArt";

interface PillarChapterProps {
  id: "grow" | "build" | "run";
  number: string;
  title: string;
  subtitle: string;
  description: string;
  services: ServiceItem[];
  theme?: "light" | "dark";
}

export function PillarChapter({
  id,
  number,
  title,
  subtitle,
  description,
  services,
  theme = "light",
}: PillarChapterProps) {
  const isDark = theme === "dark";

  const renderIllustration = () => {
    switch (id) {
      case "grow":
        return <GrowArt className="w-24 h-24 sm:w-32 sm:h-32 text-accent opacity-80" />;
      case "build":
        return <BuildArt className="w-24 h-24 sm:w-32 sm:h-32 text-accent-soft opacity-80" />;
      case "run":
        return <RunArt className="w-24 h-24 sm:w-32 sm:h-32 text-accent opacity-80" />;
      default:
        return null;
    }
  };

  return (
    <section
      id={`pillar-${id}`}
      data-pillar={id}
      className={`py-16 sm:py-24 rounded-lg my-8 transition-colors ${
        isDark ? "bg-surface-dark text-white p-6 sm:p-12" : "bg-white text-ink p-6 sm:p-12 border border-hairline"
      }`}
    >
      {/* Chapter Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-hairline/60">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`font-mono text-sm tracking-widest ${
                isDark ? "text-accent-soft" : "text-accent font-semibold"
              }`}
            >
              {number}
            </span>
            <span
              className={`text-xs uppercase font-mono tracking-wider ${
                isDark ? "text-white/40" : "text-text-secondary"
              }`}
            >
              {subtitle}
            </span>
          </div>

          <h2 className="font-display font-medium text-display-sm sm:text-display-md tracking-tight">
            {title}
          </h2>

          <p
            className={`mt-2 text-base max-w-xl ${
              isDark ? "text-text-secondary-on-dark" : "text-text-secondary"
            }`}
          >
            {description}
          </p>
        </div>

        <div className="hidden sm:block shrink-0" aria-hidden="true">
          {renderIllustration()}
        </div>
      </div>

      {/* Services List */}
      <div className="mt-6 divide-y divide-transparent">
        {services.map((service, idx) => (
          <ServiceRow
            key={service.slug}
            service={service}
            index={idx}
            theme={theme}
          />
        ))}
      </div>
    </section>
  );
}
