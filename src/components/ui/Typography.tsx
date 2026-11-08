import React from "react";
import { cn } from "@/lib/cn";

export interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "p" | "div";
}

export function Display({ children, className, as: Component = "h1", ...props }: DisplayProps) {
  return (
    <Component className={cn("type-display-xl tracking-tighter text-balance", className)} {...props}>
      {children}
    </Component>
  );
}

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "h1" | "h2" | "h3";
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level = 2, size, children, className, ...props }: HeadingProps) {
  const Component = `h${level}` as React.ElementType;
  const resolvedSize = size || (level === 1 ? "h1" : level === 2 ? "h2" : "h3");

  const sizeClass = {
    h1: "type-h1",
    h2: "type-h2",
    h3: "type-h3",
  }[resolvedSize];

  return (
    <Component className={cn(sizeClass, "font-semibold", className)} {...props}>
      {children}
    </Component>
  );
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "body-sm" | "secondary" | "secondary-on-dark";
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}

export function Text({
  variant = "body",
  children,
  className,
  as: Component = "p",
  ...props
}: TextProps) {
  const variantClass = {
    body: "type-body text-ink",
    "body-sm": "type-body-sm text-ink",
    secondary: "type-body-sm text-text-secondary",
    "secondary-on-dark": "type-body-sm text-text-secondary-on-dark",
  }[variant];

  return (
    <Component className={cn(variantClass, className)} {...props}>
      {children}
    </Component>
  );
}

export interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  withRule?: boolean;
}

export function Eyebrow({ children, className, withRule = true, ...props }: EyebrowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 type-label text-text-secondary tracking-widest uppercase",
        className
      )}
      {...props}
    >
      {withRule && <span className="w-6 h-[1px] bg-current opacity-60 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </div>
  );
}
