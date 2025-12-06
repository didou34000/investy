"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassNavbarProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "sticky" | "floating";
  blur?: "sm" | "md" | "lg";
}

const GlassNavbar = React.forwardRef<HTMLElement, GlassNavbarProps>(
  ({ className, variant = "sticky", blur = "lg", children, ...props }, ref) => {
    const blurMap = {
      sm: "backdrop-blur-md",
      md: "backdrop-blur-xl",
      lg: "backdrop-blur-2xl",
    };

    const variants = {
      sticky: cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-white/[0.72]",
        blurMap[blur],
        "backdrop-saturate-[180%]",
        "border-b border-black/[0.06]"
      ),
      floating: cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        "bg-white/[0.72]",
        blurMap[blur],
        "backdrop-saturate-[180%]",
        "border border-white/50",
        "rounded-2xl",
        "shadow-[0_4px_30px_rgba(0,0,0,0.08)]",
        "max-w-[calc(100%-2rem)]"
      ),
    };

    return (
      <header
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </header>
    );
  }
);

GlassNavbar.displayName = "GlassNavbar";

// Nav link component
interface GlassNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

const GlassNavLink = React.forwardRef<HTMLAnchorElement, GlassNavLinkProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "text-sm font-medium",
          "transition-colors duration-200",
          active
            ? "text-gray-900"
            : "text-gray-500 hover:text-gray-900",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

GlassNavLink.displayName = "GlassNavLink";

export { GlassNavbar, GlassNavLink };

