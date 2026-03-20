"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TaskCheckProps {
  checked: boolean;
  className?: string;
}

export function TaskCheck({ checked, className }: TaskCheckProps) {
  return (
    <div
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150",
        checked
          ? "border-brand-500 bg-brand-500/10"
          : "border-surface-300 bg-white group-hover:border-surface-400 group-hover:bg-brand-500/5",
        className
      )}
    >
      <svg
        className={cn(
          "h-3.5 w-3.5 transition-opacity duration-150",
          checked
            ? "text-brand-500 opacity-100"
            : "text-brand-500 opacity-0 group-hover:opacity-100"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={4.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
}
