"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "investy_disclaimer_closed";

export default function DisclaimerBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (v !== "true") setOpen(true);
  }, []);

  function close() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-50 overflow-hidden bg-amber-50 border-b border-amber-100"
          aria-live="polite"
        >
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between py-2.5 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-amber-800">
                  <span className="hidden sm:inline">Plateforme éducative — </span>
                  <span className="text-amber-700">non-conseil financier.</span>
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Fermer l'avertissement"
                className="flex-shrink-0 p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
