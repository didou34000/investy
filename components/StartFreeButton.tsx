"use client";

import { useState } from "react";

export default function StartFreeButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function startFree() {
    try {
      setLoading(true);
      const res = await fetch("/api/choose-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan_code: "free" }),
      });
      if (res.status === 401) {
        // Non connecté → envoyer vers le flux d'auth avec plan pré-sélectionné
        window.location.href = "/auth?plan=free";
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json?.error || "Erreur lors du choix du plan");
        return;
      }
      // Succès → page de suivi
      window.location.href = "/dashboard/follow";
    } catch (e: any) {
      alert(e?.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={startFree}
      disabled={loading}
      className={`mt-6 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? "..." : "Commencer gratuitement"}
    </button>
  );
}


