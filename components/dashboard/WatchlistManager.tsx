"use client";
import { useState } from "react";
import { Search, Plus, Check } from "lucide-react";

type Item = { source: "yahoo" | "coingecko"; symbol: string; label: string; category: string; image?: string | null };

export default function WatchlistManager() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<string[]>([]);

  async function search() {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache: "no-store" });
      const j = await r.json();
      setResults(j.items || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function add(it: Item) {
    const saved = localStorage.getItem("invsty_watchlist");
    const current: any[] = saved ? JSON.parse(saved) : [];
    if (current.find((x) => x.symbol === it.symbol)) {
      setAdded((a) => [...a, it.symbol]);
      return;
    }
    const updated = [...current, { id: Date.now().toString(), ...it, alert_threshold: null }];
    localStorage.setItem("invsty_watchlist", JSON.stringify(updated));
    setAdded((a) => [...a, it.symbol]);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Chercher un actif (AAPL, BTC...)"
            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <button onClick={search} disabled={loading}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-all">
          {loading ? "..." : "Chercher"}
        </button>
      </div>

      <div className="space-y-2">
        {results.map((it, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)]">
            <div>
              <p className="text-sm font-semibold text-slate-900">{it.symbol}</p>
              <p className="text-xs text-slate-500">{it.label}</p>
            </div>
            <button onClick={() => add(it)}
              disabled={added.includes(it.symbol)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                added.includes(it.symbol)
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}>
              {added.includes(it.symbol) ? <><Check className="w-3.5 h-3.5" /> Ajouté</> : <><Plus className="w-3.5 h-3.5" /> Suivre</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
