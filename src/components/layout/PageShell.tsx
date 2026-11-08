import React from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

interface PageShellProps {
  children: React.ReactNode;
  hasFooter?: boolean;
}

export function PageShell({ children, hasFooter = true }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-canvas">
      <SiteHeader />
      <div className="flex-1 w-full pt-16 sm:pt-20">
        {children}
      </div>
      {hasFooter && <SiteFooter />}
    </div>
  );
}
