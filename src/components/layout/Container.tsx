import React from "react";
import { cn } from "@/lib/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-container mx-auto px-[clamp(20px,4vw,64px)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
