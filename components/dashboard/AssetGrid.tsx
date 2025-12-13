import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Filter, Sparkles, Tag } from "lucide-react";
import type { AssetItem } from "@/lib/assetsCatalog";

type Props = {
  assets: AssetItem[];
  supportHint?: string | null;
  profileLabel?: string;
};

type Quote = { price: number | null; change: number | null; changePercent: number | null; currency: string | null };

function formatType(type: AssetItem["type"]) {
  if (type === "etf") return "ETF";
  if (type === "action") return "Action";
  return "Crypto";
}

export function AssetGrid({ assets, supportHint, profileLabel }: Props) {
  const [filter, setFilter] = useState<"all" | "pea" | "cto" | "crypto" | "etf" | "action">(() => {
    if (!supportHint) return "all";
    if (supportHint.toLowerCase().includes("pea") && !supportHint.toLowerCase().includes("cto")) return "pea";
    if (supportHint.toLowerCase().includes("cto") && !supportHint.toLowerCase().includes("pea")) return "cto";
    return "all";
  });

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (filter === "pea") return a.peaEligible;
      if (filter === "cto") return a.ctoEligible;
      if (filter === "crypto") return a.type === "crypto";
      if (filter === "etf") return a.type === "etf";
      if (filter === "action") return a.type === "action";
      return true;
    });
  }, [assets, filter]);

  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    const tickers = Array.from(new Set(assets.map((a) => a.ticker).filter(Boolean)));
    if (!tickers.length) return;
    const fetchQuotes = async () => {
      try {
        const params = new URLSearchParams({ tickers: tickers.join(",") });
        const res = await fetch(`/api/quotes?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        setQuotes(data || {});
      } catch (e) {
        console.warn("quotes fetch failed", e);
      }
    };
    fetchQuotes();
  }, [assets]);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Recommandations</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Actifs adaptés</h2>
          <p className="text-sm text-slate-600">
            Logos réels, tags PEA/CTO et note pédagogique. Adapté au profil {profileLabel || "investisseur"}.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Assistant d’actifs
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
            <Filter className="w-4 h-4" />
            Filtre {filter === "all" ? "Tous" : filter.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex gap-2 text-xs flex-wrap">
        {[
          { key: "all", label: "Tout" },
          { key: "pea", label: "PEA" },
          { key: "cto", label: "CTO" },
          { key: "etf", label: "ETF" },
          { key: "action", label: "Actions" },
          { key: "crypto", label: "Crypto" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-3 py-1.5 rounded-full border transition font-semibold ${
              filter === f.key
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-600">
          Aucune suggestion pour ce support. Essaie un filtre plus large ou refais le quiz pour ajuster ton profil.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asset) => {
            const logoSrc = asset.logoUrl || "/logos/default-asset.svg";
            return (
              <div
                key={asset.id}
                className="rounded-2xl border border-slate-100 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.04)] p-4 flex gap-3 items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={logoSrc}
                    alt={asset.name}
                    loading="lazy"
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.dataset.fallbackApplied) return;
                      target.dataset.fallbackApplied = "true";
                      target.src = "/logos/default-asset.svg";
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900">{asset.name}</p>
                    <span className="text-xs text-slate-500">{asset.ticker}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      <Tag className="w-3.5 h-3.5" />
                      {formatType(asset.type)} • {asset.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{asset.shortDescription}</p>
                  <div className="flex gap-2 flex-wrap text-[11px] mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
                      Adapté à ton profil
                    </span>
                    {asset.peaEligible && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                        PEA
                      </span>
                    )}
                    {asset.ctoEligible && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
                        CTO
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700">
                      Risque : {asset.riskBucket}
                    </span>
                  </div>
                <div className="text-xs text-slate-700 flex items-center gap-2">
                  {quotes[asset.ticker]?.price != null ? (
                    <>
                      <span className="font-semibold">{quotes[asset.ticker]?.price} {quotes[asset.ticker]?.currency || ""}</span>
                      {quotes[asset.ticker]?.changePercent != null && (
                        <span
                          className={`px-2 py-0.5 rounded-full border ${
                            (quotes[asset.ticker]?.changePercent || 0) >= 0
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                              : "bg-rose-50 border-rose-100 text-rose-700"
                          }`}
                        >
                          {quotes[asset.ticker]?.change?.toFixed(2)} ({quotes[asset.ticker]?.changePercent?.toFixed(2)}%)
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-500">Cours indisponible</span>
                  )}
                </div>
                  <div className="pt-2">
                    <button className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                      Voir fiche
                      <BadgeCheck className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
