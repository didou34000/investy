"use client";
import { useEffect, useState } from "react";
import AssetLogo from "@/components/ui/AssetLogo";

type Item = {
  key: string;
  label: string;
  symbol: string;
  dp: number;
  price: number | null;
  changePct: number | null;
  updatedAt: string | null;
  isEur?: boolean;
  url?: string;
  logo?: string | null;
  category?: string;
};

export default function MarketStrip({ category, title }: { category?: string; title?: string }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  async function load() {
    try {
      setError(null);
      const r = await fetch("/api/market", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "market_fetch_error");
      let data = j.data as Item[];
      if (category) data = data.filter((x: Item) => x.category === category);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Erreur de récupération des marchés");
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30000); // refresh 30s
    return () => clearInterval(id);
  }, []);

  // Effet de défilement automatique
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    const scrollInterval = setInterval(() => {
      setScrollPosition(prev => {
        const itemWidth = 200; // Largeur approximative d'un item
        const maxScroll = items.length * itemWidth;
        const newPosition = prev + 1;
        return newPosition >= maxScroll ? 0 : newPosition;
      });
    }, 30); // Vitesse de défilement (30ms)

    return () => clearInterval(scrollInterval);
  }, [items]);

  return (
    <section aria-label="Suivi des marchés" className="py-4 bg-gradient-to-r from-slate-50 to-blue-50/30 backdrop-blur border-y border-slate-200/60">
      <div className="container mx-auto max-w-7xl px-4 overflow-x-auto">
        {title && (
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">{title}</div>
        )}
        {!items && !error && (
          <div className="flex gap-8 animate-pulse">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="min-w-[200px]">
                <div className="h-3 w-20 bg-slate-200 rounded-full mb-3" />
                <div className="h-5 w-28 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-4">
            <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
              ⚠️ {error}
            </div>
          </div>
        )}

        {items && !error && (
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-8 transition-transform duration-75 ease-linear"
              style={{ transform: `translateX(-${scrollPosition}px)` }}
            >
              {/* Dupliquer les items pour un défilement infini */}
              {[...items, ...items, ...items].map((x, index) => {
                const dp = x.dp ?? 0;
                const val = x.price != null
                  ? x.price.toLocaleString("fr-FR", { 
                      maximumFractionDigits: dp,
                      minimumFractionDigits: x.key === "EURUSD" ? 4 : 0
                    })
                  : "—";
                const pct = x.changePct != null ? x.changePct : 0;
                const pos = pct >= 0;
                const pctTxt = (pos ? "+" : "") + pct.toFixed(2) + "%";
                const currency = x.isEur ? "€" : x.key === "EURUSD" ? "" : "€";
                
                return (
                  <div key={`${x.key}-${index}`} className="min-w-[200px] group hover:scale-105 transition-transform duration-200 flex-shrink-0">
                    {x.url ? (
                      <a
                        href={x.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block cursor-pointer hover:bg-white/50 rounded-lg p-3 transition-all duration-200 hover:shadow-md"
                        title={`Voir le cours de ${x.label} sur Yahoo Finance`}
                      >
                        <div className="text-xs font-medium text-slate-600 mb-2 tracking-wide flex items-center gap-1">
                          <AssetLogo src={x.logo} label={x.label} size={16} className="mr-1"/>
                          {x.label}
                          <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-lg font-bold ${pos ? "text-emerald-600" : "text-rose-600"}`}>
                            {val}{currency}
                          </div>
                          <div
                            className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all duration-200 ${
                              pos
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100"
                            } ${pos ? "shadow-sm" : ""}`}
                          >
                            {pos ? "↗" : "↘"} {pctTxt}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="block p-3">
                        <div className="text-xs font-medium text-slate-600 mb-2 tracking-wide flex items-center gap-1">
                          <AssetLogo src={x.logo} label={x.label} size={16} className="mr-1"/>
                          {x.label}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-lg font-bold ${pos ? "text-emerald-600" : "text-rose-600"}`}>
                            {val}{currency}
                          </div>
                          <div
                            className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all duration-200 ${
                              pos
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100"
                            } ${pos ? "shadow-sm" : ""}`}
                          >
                            {pos ? "↗" : "↘"} {pctTxt}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {items?.length ? (
          <div className="flex items-center justify-center mt-4 pt-3 border-t border-slate-200/40">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              Actualisé&nbsp;: {new Date().toLocaleTimeString("fr-FR", { 
                timeZone: "Europe/Paris",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
