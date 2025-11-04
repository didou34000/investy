"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ChipVariant = "mono" | "pastel" | "neutral";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  active?: boolean;
}

export function Chip({ className, variant = "neutral", active = false, ...props }: ChipProps) {
  const styles =
    variant === "mono"
      ? "bg-neutral-100 text-neutral-800 border-neutral-200"
      : variant === "pastel"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-white text-slate-700 border-slate-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        styles,
        active && "ring-2 ring-blue-500",
        className
      )}
      {...props}
    />
  );
}








