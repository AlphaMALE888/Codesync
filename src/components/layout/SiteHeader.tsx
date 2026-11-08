import React from "react";
import { FloatingNav } from "@/components/navigation/FloatingNav";

export function SiteHeader() {
  return (
    <header className="w-full relative z-40">
      <FloatingNav />
    </header>
  );
}
