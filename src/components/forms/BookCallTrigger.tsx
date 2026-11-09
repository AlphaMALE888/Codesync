"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { BookCallDialog } from "./BookCallDialog";

interface BookCallTriggerProps {
  variant?: "solid-light" | "solid-dark" | "outline";
  size?: "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function BookCallTrigger({
  variant = "solid-light",
  size = "md",
  className,
  children = "Book a free call",
}: BookCallTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    // If on /contact, allow normal hash navigation to #book-a-call
    if (pathname === "/contact") {
      const el = document.getElementById("book-a-call");
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // On all other pages, prevent navigation and open modal
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <SplitArrowButton
        href="/contact#book-a-call"
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {children}
      </SplitArrowButton>

      {/* Modal Dialog */}
      <BookCallDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
