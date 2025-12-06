"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
  title?: string;
  description?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

function GlassModal({
  open,
  onClose,
  children,
  className,
  size = "md",
  showClose = true,
  title,
  description,
}: GlassModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
            className={cn(
              "fixed z-[101]",
              "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[calc(100%-2rem)]",
              sizeMap[size],
              "bg-white/[0.85] backdrop-blur-2xl",
              "border border-white/50",
              "rounded-3xl",
              "shadow-[0_24px_80px_rgba(0,0,0,0.2)]",
              "overflow-hidden",
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  {title && (
                    <h2 
                      id="modal-title"
                      className="text-xl font-semibold text-gray-900 tracking-tight"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className={cn(
                      "p-2 rounded-full",
                      "text-gray-400 hover:text-gray-600",
                      "bg-gray-100/50 hover:bg-gray-100",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
                    )}
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

// Modal footer for actions
interface GlassModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function GlassModalFooter({ className, children, ...props }: GlassModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 pt-4 mt-4",
        "border-t border-black/[0.06]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { GlassModal, GlassModalFooter };

