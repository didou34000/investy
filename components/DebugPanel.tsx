"use client";

import { useEffect, useState } from "react";
import { getAllFlags } from "@/lib/flags";
import { X } from "lucide-react";

export default function DebugPanel() {
  const [visible, setVisible] = useState(false);
  const [flags, setFlags] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const v = localStorage.getItem("investy_debug");
    setVisible(v === "on");
    setFlags(getAllFlags());
    setConsent(localStorage.getItem("investy_cookie_consent"));
  }, []);

  const handleClose = () => {
    localStorage.setItem("investy_debug", "off");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[60] max-h-[50vh] w-[320px] overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-xs font-mono shadow-2xl">
      {/* Bouton de fermeture en haut à droite */}
      <button 
        onClick={handleClose}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Fermer le panneau debug"
      >
        <X className="w-4 h-4 text-slate-600" />
      </button>

      <div className="font-bold text-slate-900 mb-3">DEBUG</div>
      
      <div className="space-y-2">
        <div>
          <span className="text-slate-500">Route:</span>{" "}
          <span className="text-slate-900 font-medium">
            {typeof window !== "undefined" ? window.location.pathname : "/"}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Consent:</span>{" "}
          <span className="text-slate-900 font-medium">{consent ?? "(none)"}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="font-semibold text-slate-700 mb-2">Flags</div>
        <pre className="text-[10px] leading-relaxed bg-slate-50 p-2 rounded whitespace-pre-wrap break-words">
          {JSON.stringify(flags, null, 2)}
        </pre>
      </div>
    </div>
  );
}


