"use client";

import * as React from "react";
import Container from "./Container";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ title, subtitle, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn("w-full", className)}>
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="text-slate-600 text-sm md:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="mt-2 sm:mt-0">{actions}</div>}
      </Container>
    </div>
  );
}








