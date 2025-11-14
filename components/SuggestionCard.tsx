"use client";
import { Asset } from "@/lib/suggestions";
import AssetLogo from "@/components/ui/AssetLogo";

export default function SuggestionCard({ asset }: { asset: Asset }) {
  const riskColor =
    asset.risque === "faible" ? "text-green-600" :
    asset.risque === "modéré" ? "text-blue-600" :
    asset.risque === "élevé" ? "text-amber-600" : "text-red-600";

  const adaptationColor =
    asset.adaptation === "Très adapté" ? "bg-green-50 text-green-700 border-green-200" :
    asset.adaptation === "Adapté" ? "bg-blue-50 text-blue-700 border-blue-200" :
    asset.adaptation === "À considérer" ? "bg-amber-50 text-amber-700 border-amber-200" :
    "bg-slate-50 text-slate-700 border-slate-200";

  const typeIcon = {
    "Action": "📈",
    "ETF": "📊", 
    "Crypto": "₿",
    "Obligation": "🏛️",
    "Immobilier": "🏠"
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header avec nom et adaptation */}
      <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AssetLogo
                src={asset.logo}
                label={asset.name}
                size={24}
              />
              <div className="font-semibold text-slate-900">{asset.name}</div>
            </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${adaptationColor}`}>
          {asset.adaptation}
        </span>
      </div>

      {/* Symbol et région */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-mono text-slate-600">{asset.symbol}</span>
        <span className="text-xs text-slate-500">•</span>
        <span className="text-xs text-slate-500">{asset.region}</span>
      </div>

      {/* Risque et métriques */}
      <div className="flex items-center gap-4 mb-3">
        <span className={`text-sm font-medium ${riskColor} capitalize`}>
          Risque {asset.risque}
        </span>
        <div className="flex gap-3 text-xs text-slate-600">
          <span>Rendement: {asset.rendementMoyen}%</span>
          <span>Vol: {asset.volatilite}%</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-3 leading-relaxed">
        {asset.description}
      </p>

      {/* Raison */}
      <p className="text-xs text-slate-500 italic mb-4">
        💡 {asset.raison}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <a 
          href={asset.lien} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
        >
          <span>Voir la fiche</span>
          <span>↗</span>
        </a>
        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          Suivre
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
        Contenu éducatif, non prescriptif. Aucune garantie de performance.
      </p>
    </div>
  );
}
