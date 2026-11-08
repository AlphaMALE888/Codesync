import React from "react";
import { Eyebrow, Heading, Text } from "./Typography";
import { cn } from "@/lib/cn";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  intro?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  action,
  align = "left",
  tone = "light",
  className,
}: SectionHeaderProps) {
  const isCentered = align === "center";
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "w-full mb-12 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6",
        isCentered && "text-center md:flex-col md:items-center",
        className
      )}
    >
      <div className={cn("space-y-4 max-w-2xl", isCentered && "mx-auto")}>
        {eyebrow && (
          <Eyebrow
            className={cn(isDark ? "text-accent-soft" : "text-text-secondary")}
            withRule={!isCentered}
          >
            {eyebrow}
          </Eyebrow>
        )}

        <Heading
          level={2}
          className={cn("tracking-tight", isDark ? "text-on-dark" : "text-ink")}
        >
          {title}
        </Heading>

        {intro && (
          <Text
            variant={isDark ? "secondary-on-dark" : "secondary"}
            className="text-base sm:text-lg leading-relaxed max-w-xl"
          >
            {intro}
          </Text>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
