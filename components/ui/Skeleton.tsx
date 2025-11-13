"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "md" | "lg" | "full";
}

export default function Skeleton({ className, rounded = "lg", ...props }: SkeletonProps) {
  const radius = rounded === "full" ? "rounded-full" : rounded === "md" ? "rounded-md" : "rounded-lg";
  return <div className={cn("animate-pulse bg-slate-200", radius, className)} {...props} />;
}












