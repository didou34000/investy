"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "investy_disclaimer_closed";

export default function DisclaimerBar() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (v === "true") setOpen(false);
  }, []);

  function close() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-gray-50 border-b text-xs text-gray-700" aria-live="polite">
      <div className="container flex items-center justify-between py-2">
        <p>
          MVP éducatif — non-conseil financier. Aucune recommandation d’achat/vente.
        </p>
        <button
          onClick={close}
          aria-label="Fermer l’avertissement"
          className="rounded px-2 py-1 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}


