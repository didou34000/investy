"use client";
import { useEffect, useState } from "react";
import Sparkline from "./Sparkline";

type Row = { id: string; symbol: string; label: string; category: string; alert_threshold: number | null };

export default function WatchlistLive() {
  const [rows, setRows] = useState<Row[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Watchlist stockée en localStorage (sans BDD pour l'instant)
  useEffect(() => {
    const saved = localStorage.getItem("invsty_watchlist");
    if (saved) {
      try { setRows(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!rows.length) { setQuotes([]); return; }
    fetch("/api/quotes", {
      method: "POST",
      body: JSON.stringify({ entries: rows.map((r) => ({ symbol: r.symbol, category: r.category })) }),
    })
      .then((r) => r.ok ? r.json() : { quotes: [] })
      .then((d) => setQuotes(d.quotes || []))
      .catch(() => {});
  }, [rows]);

  if (loading) {
    return <div className="animate-pulse h-20 bg-slate-100 rounded-2xl" />;
  }

  if (!rows.length) {
    return (
      <div className="text-center py-8 bg-[#F5F7FA] rounded-2xl">
        <p className="text-slate-500 text-sm">Aucun actif suivi pour l&apos;instant.</p>
        <p className="text-xs text-slate-400 mt-1">Ajoute des actifs depuis la page Suivi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const q = quotes.find((x: any) => x.symbol === row.symbol);
        return (
          <div key={row.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)]">
            <div>
              <p className="text-sm font-semibold text-slate-900">{row.symbol}</p>
              <p className="text-xs text-slate-500">{row.label}</p>
            </div>
            <div className="text-right">
              {q ? (
                <>
                  <p className="text-sm font-bold text-slate-900">{q.price ? `${q.price} ${q.currency || ""}` : "—"}</p>
                  <p className={`text-xs font-medium ${q.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {q.change >= 0 ? "+" : ""}{q.change?.toFixed(2)}%
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-400">—</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
