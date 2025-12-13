import React, { useMemo, useState } from "react";
import type { InvestyProfileResult } from "@/lib/profileMapper";
import type { Asset } from "@/lib/assetsCatalog";
import { getAssetRecommendations } from "@/lib/recommendations";

type SupportHint = "PEA" | "CTO" | "PEA+CTO" | null;

const bucketLabel = (bucket: Asset["riskBucket"]) => {
  switch (bucket) {
    case "ultra_prudent": return "Ultra prudent";
    case "prudent": return "Prudent";
    case "modere": return "Modéré";
    case "equilibre": return "Équilibré";
    case "dynamique": return "Dynamique";
    case "agressif": return "Agressif";
    case "speculatif": return "Spéculatif";
    default: return bucket;
  }
};

export function AssetRecommendations({ profile, supportHint }: { profile: InvestyProfileResult; supportHint?: SupportHint }) {
  const [tab, setTab] = useState<"all" | "etf" | "action" | "crypto">("all");
  const assetsAll = useMemo(() => getAssetRecommendations(profile, supportHint || null), [profile, supportHint]);
  const assets = assetsAll.filter((a) => tab === "all" || a.type === tab);

  if (assets.length === 0) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Aucune suggestion disponible pour ce profil.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Idées d’actifs adaptés à ton profil</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
          Éducatif, pas une recommandation personnalisée
        </span>
      </div>
      <div className="flex gap-2 text-xs">
        {[
          { key: "all", label: "Tout" },
          { key: "etf", label: "ETF" },
          { key: "action", label: "Actions" },
          { key: "crypto", label: "Cryptos" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-3 py-1.5 rounded-full border transition ${
              tab === t.key ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((a) => (
          <div key={a.id} className="rounded-2xl border border-white/70 bg-white/90 backdrop-blur shadow-[0_14px_40px_rgba(0,0,0,0.06)] p-4 flex gap-3 items-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700 border border-slate-200 overflow-hidden">
              {a.logoUrl ? <img src={a.logoUrl} alt={a.name} className="w-10 h-10 object-contain" /> : a.ticker}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                <span className="text-xs text-slate-500">{a.ticker}</span>
              </div>
              <p className="text-xs text-slate-500">{a.type.toUpperCase()} • {a.category}</p>
              <p className="text-sm text-slate-700">{a.shortDescription}</p>
              <div className="flex gap-2 flex-wrap text-[11px] text-slate-600 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">Risque : {bucketLabel(a.riskBucket)}</span>
                {a.peaEligible && <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">PEA</span>}
                {a.ctoEligible && <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">CTO</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

