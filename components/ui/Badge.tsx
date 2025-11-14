"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "soft"
  | "neutral"
  | "blue"
  | "green"
  | "red"
  | "amber";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  mono?: boolean;
}

export function Badge({ className, variant = "neutral", mono = false, ...props }: BadgeProps) {
  const color = mono
    ? "bg-neutral-100 text-neutral-700 border-neutral-200"
    : variant === "blue"
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : variant === "green"
    ? "bg-green-50 text-green-700 border-green-200"
    : variant === "red"
    ? "bg-red-50 text-red-700 border-red-200"
    : variant === "amber"
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : variant === "soft"
    ? "bg-slate-50 text-slate-700 border-slate-200"
    : "bg-neutral-100 text-neutral-700 border-neutral-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        color,
        className
      )}
      {...props}
    />
  );
}












