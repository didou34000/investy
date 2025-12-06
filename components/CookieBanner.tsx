"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "investy_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(CONSENT_KEY);
    if (!v) {
      // Petit délai pour une meilleure UX
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function setConsent(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50 p-4 pointer-events-none"
        >
          <div className="container pointer-events-auto">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-5">
              {/* Gradient décoratif */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30 pointer-events-none" />
              
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Icône + Texte */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Cookie icon */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/50 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.553-.45-1-1.003-1h-.17a1.5 1.5 0 01-1.327-2.197c.164-.32.25-.682.25-1.053A2.75 2.75 0 0017 5c-.371 0-.733.086-1.053.25A1.5 1.5 0 0113.75 3.923V3.75a1 1 0 00-1-1c-.081 0-.162.01-.24.028A10.04 10.04 0 0012 2zm-2.5 5.5a1 1 0 110 2 1 1 0 010-2zm-2 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm5 1a1 1 0 110 2 1 1 0 010-2zm3 3a1 1 0 110 2 1 1 0 010-2zm-6.5 1.5a1 1 0 110 2 1 1 0 010-2z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-0.5">
                      Nous respectons votre vie privée
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Nous utilisons des cookies pour améliorer votre expérience.{" "}
                      <Link 
                        href="/legal#cookies" 
                        className="text-blue-600 hover:text-blue-700 underline underline-offset-2 decoration-blue-300 hover:decoration-blue-500 transition-colors"
                      >
                        En savoir plus
                      </Link>
                    </p>
                  </div>
                </div>
                
                {/* Boutons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setConsent("rejected")}
                    aria-label="Refuser les cookies"
                    className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={() => setConsent("accepted")}
                    aria-label="Accepter les cookies"
                    className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Accepter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
