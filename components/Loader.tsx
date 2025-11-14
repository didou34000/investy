"use client";

import React from "react";

export default function Loader({ label = "Chargement…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600" aria-live="polite" aria-busy="true">
      <span className="inline-block size-4 border-2 border-slate-300 border-t-accent rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
}


