"use client";
import { useEffect, useState } from "react";
import { suggestionsByProfile, Suggestion } from "@/lib/resultHelpers";

export default function ResultSuggestions({ riskIndex, allocation }: {
  riskIndex: number;
  allocation: Record<string, number>;
}) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setItems(suggestionsByProfile(riskIndex, allocation));
  }, [riskIndex, allocation]);

  async function follow(s: Suggestion) {
    const res = await fetch("/api/auth/me");
    if (!res.ok) { alert("Connecte-toi pour suivre un actif."); return; }
    const { user } = await res.json();
    if (!user) { alert("Connecte-toi pour suivre un actif."); return; }
    setSaved((prev) => [...prev, s.symbol]);
    // TODO: save to watchlist entity
  }

  const chip = (score: "high" | "medium" | "low") =>
    score === "high" ? <span className="text-green-700 bg-green-50 border border-green-200 text-xs px-2 py-1 rounded">Très adapté</span> :
    score === "medium" ? <span className="text-blue-700 bg-blue-50 border border-blue-200 text-xs px-2 py-1 rounded">Adapté</span> :
    <span className="text-amber-700 bg-amber-50 border border-amber-200 text-xs px-2 py-1 rounded">À considérer</span>;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="text-lg font-semibold mb-2">Suggestions pédagogiques</div>
      <p className="text-sm text-slate-600 mb-4">Exemples d&apos;expositions indicatives selon votre profil. Contenu éducatif, non prescriptif.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((s, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-slate-900">{s.symbol}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
              {chip(s.score)}
            </div>
            <p className="text-xs text-slate-600 mb-3">{s.description}</p>
            <button
              onClick={() => follow(s)}
              disabled={saved.includes(s.symbol)}
              className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {saved.includes(s.symbol) ? "Ajouté ✓" : "Suivre"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
