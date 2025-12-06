"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
  loading?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2",
      "font-semibold",
      "rounded-xl",
      "transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
      "active:scale-[0.97]",
      "select-none"
    );
    
    const variants = {
      primary: cn(
        "bg-[#007AFF] text-white",
        "shadow-[0_2px_12px_rgba(0,122,255,0.25)]",
        "hover:bg-[#0066D6] hover:shadow-[0_4px_20px_rgba(0,122,255,0.35)] hover:-translate-y-px"
      ),
      secondary: cn(
        "bg-white/[0.72] backdrop-blur-xl text-gray-900",
        "border border-black/[0.06]",
        "shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
        "hover:bg-white/[0.85] hover:border-black/[0.1] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      ),
      ghost: cn(
        "bg-transparent text-[#007AFF]",
        "hover:bg-[#007AFF]/[0.08]"
      ),
      outline: cn(
        "bg-transparent text-gray-900",
        "border border-gray-300",
        "hover:bg-gray-50 hover:border-gray-400"
      ),
      danger: cn(
        "bg-[#FF3B30] text-white",
        "shadow-[0_2px_12px_rgba(255,59,48,0.25)]",
        "hover:bg-[#E6352B] hover:shadow-[0_4px_20px_rgba(255,59,48,0.35)]"
      ),
    };
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Chargement...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton };

