"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "solid";
  icon?: React.ReactNode;
  error?: string;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, variant = "default", icon, error, type = "text", ...props }, ref) => {
    const baseStyles = cn(
      "w-full",
      "text-base text-gray-900",
      "rounded-xl",
      "transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
      "outline-none",
      "placeholder:text-gray-400"
    );
    
    const variants = {
      default: cn(
        "bg-white/[0.72] backdrop-blur-xl",
        "border border-black/[0.06]",
        "hover:border-black/[0.1]",
        "focus:border-[#007AFF] focus:bg-white/90 focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
      ),
      solid: cn(
        "bg-gray-100",
        "border border-transparent",
        "hover:bg-gray-100/80",
        "focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
      ),
    };
    
    const inputPadding = icon ? "pl-11 pr-4 py-3" : "px-4 py-3";

    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            variants[variant],
            inputPadding,
            error && "border-[#FF3B30] focus:border-[#FF3B30] focus:shadow-[0_0_0_3px_rgba(255,59,48,0.12)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-[#FF3B30]">{error}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

// Textarea variant
interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "solid";
  error?: string;
}

const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, variant = "default", error, ...props }, ref) => {
    const baseStyles = cn(
      "w-full min-h-[120px]",
      "px-4 py-3",
      "text-base text-gray-900",
      "rounded-xl",
      "transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
      "outline-none resize-none",
      "placeholder:text-gray-400"
    );
    
    const variants = {
      default: cn(
        "bg-white/[0.72] backdrop-blur-xl",
        "border border-black/[0.06]",
        "hover:border-black/[0.1]",
        "focus:border-[#007AFF] focus:bg-white/90 focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
      ),
      solid: cn(
        "bg-gray-100",
        "border border-transparent",
        "hover:bg-gray-100/80",
        "focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
      ),
    };

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            baseStyles,
            variants[variant],
            error && "border-[#FF3B30] focus:border-[#FF3B30] focus:shadow-[0_0_0_3px_rgba(255,59,48,0.12)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-[#FF3B30]">{error}</p>
        )}
      </div>
    );
  }
);

GlassTextarea.displayName = "GlassTextarea";

export { GlassInput, GlassTextarea };

