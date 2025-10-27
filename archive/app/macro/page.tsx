"use client";
import { useEffect, useState } from "react";

interface MarketSnapshot {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MacroSummary {
  timestamp: string;
  markets: MarketSnapshot[];
  alerts: Array<{
    type: "info" | "warning" | "success";
    message: string;
  }>;
}

export default function MacroPage() {
  const [data, setData] = useState<MacroSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/macro/summary');
        if (!response.ok) throw new Error('Erreur de chargement');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Chargement...</h2>
          <p className="text-slate-600">Récupération des données de marché</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Erreur</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-slate-900 text-center mb-8">
          Actualités & Alertes Macro
        </h1>

        {data && (
          <div className="space-y-6">
            {/* Snapshots de marché */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">État des Marchés</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.markets.map((market) => (
                  <div key={market.symbol} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{market.symbol}</span>
                      <span className={`text-sm ${market.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {market.change >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-2xl font-semibold mt-1">
                      {market.price.toLocaleString('fr-FR')}€
                    </div>
                    <div className={`text-sm ${market.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertes */}
            {data.alerts.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">Alertes Pédagogiques</h2>
                <div className="space-y-3">
                  {data.alerts.map((alert, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${
                        alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                        'bg-blue-50 border-blue-200 text-blue-800'
                      }`}
                    >
                      {alert.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Préférences d'alertes */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Préférences d'Alertes</h2>
              <p className="text-slate-600 mb-4">
                Configurez vos alertes personnalisées pour suivre les mouvements de marché.
              </p>
              <div className="text-center">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Configurer les Alertes
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 text-center mt-6">
          Données éducatives, non contractuelles. Dernière mise à jour : {data?.timestamp}
        </p>
      </div>
    </main>
  );
}