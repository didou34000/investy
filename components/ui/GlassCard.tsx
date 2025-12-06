"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "solid" | "flat";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = true, padding = "lg", children, ...props }, ref) => {
    const baseStyles = "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]";
    
    const variants = {
      default: cn(
        "bg-white/[0.72] backdrop-blur-xl",
        "border border-white/50",
        "rounded-2xl",
        "shadow-[0_4px_30px_rgba(0,0,0,0.08)]",
        hover && "hover:bg-white/[0.85] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
      ),
      subtle: cn(
        "bg-white/50 backdrop-blur-md",
        "border border-white/30",
        "rounded-xl",
        "shadow-[0_2px_20px_rgba(0,0,0,0.05)]",
        hover && "hover:bg-white/60 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
      ),
      solid: cn(
        "bg-white/90 backdrop-blur-2xl",
        "border border-white/60",
        "rounded-2xl",
        "shadow-[0_4px_30px_rgba(0,0,0,0.08)]",
        hover && "hover:bg-white/95 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
      ),
      flat: cn(
        "bg-white",
        "border border-black/[0.06]",
        "rounded-2xl",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        hover && "hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.1]"
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddingMap[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

// Sub-components for structure
const GlassCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pb-4 border-b border-black/[0.06]", className)}
      {...props}
    />
  )
);
GlassCardHeader.displayName = "GlassCardHeader";

const GlassCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold text-gray-900 tracking-tight", className)}
      {...props}
    />
  )
);
GlassCardTitle.displayName = "GlassCardTitle";

const GlassCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 mt-1", className)}
      {...props}
    />
  )
);
GlassCardDescription.displayName = "GlassCardDescription";

const GlassCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
GlassCardContent.displayName = "GlassCardContent";

const GlassCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pt-4 mt-4 border-t border-black/[0.06]", className)}
      {...props}
    />
  )
);
GlassCardFooter.displayName = "GlassCardFooter";

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
};

