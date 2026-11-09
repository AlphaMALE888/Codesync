import React from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  error,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-mono uppercase tracking-wider text-text-secondary"
      >
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 font-sans mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
