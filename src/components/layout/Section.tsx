import React from "react";
import { cn } from "@/lib/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: "light" | "dark" | "muted";
  padded?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({
  tone = "light",
  padded = true,
  children,
  className,
  id,
  ...props
}: SectionProps) {
  const toneMap = {
    light: "bg-canvas text-ink",
    dark: "bg-surface-dark text-on-dark",
    muted: "bg-surface-muted text-ink",
  };

  return (
    <section
      id={id}
      className={cn(
        "relative w-full transition-colors duration-base",
        toneMap[tone],
        padded && "py-[clamp(88px,12vw,176px)]",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
