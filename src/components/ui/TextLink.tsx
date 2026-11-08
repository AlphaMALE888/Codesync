import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function TextLink({ href, children, className, external, ...props }: TextLinkProps) {
  const isExternal = external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  const classes = cn(
    "inline-flex items-center gap-1 font-medium underline underline-offset-4 decoration-current/40 hover:decoration-current",
    "transition-all duration-fast ease-out-custom hover:decoration-2",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    className
  );

  if (isExternal) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
