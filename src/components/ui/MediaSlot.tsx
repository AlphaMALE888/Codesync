import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export interface MediaSlotProps {
  src?: string | null;
  alt?: string;
  label?: string;
  aspect?: "16/9" | "16/10" | "4/3" | "4/5" | "1/1" | "auto";
  sizes?: string;
  priority?: boolean;
  poster?: string;
  rounded?: "sm" | "md" | "lg" | "pill" | "none";
  className?: string;
  isVideo?: boolean;
  fallback?: React.ReactNode;
}

export function MediaSlot({
  src,
  alt = "",
  label = "Asset",
  aspect = "16/9",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  poster,
  rounded = "md",
  className,
  isVideo = false,
  fallback,
}: MediaSlotProps) {
  const roundedClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    pill: "rounded-pill",
    none: "rounded-none",
  }[rounded];

  const aspectClass = {
    "16/9": "aspect-[16/9]",
    "16/10": "aspect-[16/10]",
    "4/3": "aspect-[4/3]",
    "4/5": "aspect-[4/5]",
    "1/1": "aspect-square",
    auto: "aspect-auto",
  }[aspect];

  // Missing asset handling
  if (!src) {
    // In production: cleanly omit and render nothing
    if (process.env.NODE_ENV === "production") {
      return fallback ? <>{fallback}</> : null;
    }

    // In development: render an informative striped placeholder
    return (
      <div
        className={cn(
          "w-full relative flex items-center justify-center p-6 border border-dashed border-hairline overflow-hidden select-none",
          "bg-[repeating-linear-gradient(45deg,#EBEBE9,#EBEBE9_10px,#F5F5F3_10px,#F5F5F3_20px)]",
          aspectClass,
          roundedClass,
          className
        )}
        aria-hidden="true"
      >
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded bg-ink text-white shadow-sm">
          ASSET NEEDED: {label || alt || "Image"}
        </span>
      </div>
    );
  }

  // Video render
  if (isVideo) {
    return (
      <div className={cn("relative w-full overflow-hidden", aspectClass, roundedClass, className)}>
        <video
          src={src}
          poster={poster}
          playsInline
          muted
          loop
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Image render via Next/Image
  return (
    <div className={cn("relative w-full overflow-hidden", aspectClass, roundedClass, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
