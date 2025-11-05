"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Trash2, Plus } from "lucide-react";

type Subscription = {
  id: string;
  symbol: string;
  frequency: string;
  enabled: boolean;
  next_run_at: string | null;
  last_run_at: string | null;
  last_status: string | null;
};

export default function FollowPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  async function loadSubscriptions() {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.status === 401) {
        router.push("/auth?plan=free");
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setSubscriptions(json.subscriptions || []);
      }
    } catch (e) {
      console.error("Error loading subscriptions:", e);
    } finally {
      setLoading(false);
    }
  }

  async function createSub() {
    if (!symbol.trim()) {
      alert("Veuillez entrer un symbole (ex: AAPL, BTC-USD)");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          symbol: symbol.trim().toUpperCase(),
          frequency: "daily",
          timezone: "Europe/Paris",
          send_hour: hour,
          send_minute: minute,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Erreur lors de la création de l'abonnement");
        return;
      }

      // Réinitialiser le formulaire et recharger la liste
      setSymbol("");
      await loadSubscriptions();
    } catch (e: any) {
      alert(e?.message || "Erreur réseau");
    } finally {
      setCreating(false);
    }
  }

  async function togglePause(sub: Subscription) {
    try {
      const endpoint = sub.enabled ? "pause" : "resume";
      const res = await fetch(`/api/subscriptions/${sub.id}/${endpoint}`, {
        method: "POST",
      });

      if (!res.ok) {
        const json = await res.json();
        alert(json.error || "Erreur");
        return;
      }

      await loadSubscriptions();
    } catch (e: any) {
      alert(e?.message || "Erreur réseau");
    }
  }

  if (loading) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Chargement...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Suivi d'actifs</h1>

        {/* Formulaire de création */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un actif à suivre
          </h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Symbole
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="AAPL, BTC-USD..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={creating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Heure
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value) || 8)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={creating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Minute
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={creating}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={createSub}
                disabled={creating || !symbol.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "..." : "Ajouter"}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Exemples: AAPL (Apple), BTC-USD (Bitcoin), TSLA (Tesla), MC.PA (LVMH)
          </p>
        </div>

        {/* Liste des abonnements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Mes abonnements ({subscriptions.length})
          </h2>

          {subscriptions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>Aucun abonnement actif.</p>
              <p className="text-sm mt-2">Ajoutez un actif ci-dessus pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{sub.symbol}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {sub.frequency}
                      </span>
                      {sub.enabled ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Actif
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                          En pause
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {sub.last_run_at
                        ? `Dernier envoi: ${new Date(sub.last_run_at).toLocaleDateString("fr-FR")}`
                        : "Pas encore envoyé"}
                      {sub.next_run_at && ` • Prochain: ${new Date(sub.next_run_at).toLocaleDateString("fr-FR")}`}
                    </div>
                  </div>
                  <button
                    onClick={() => togglePause(sub)}
                    className="p-2 rounded-lg hover:bg-slate-200 transition"
                    title={sub.enabled ? "Mettre en pause" : "Reprendre"}
                  >
                    {sub.enabled ? (
                      <Pause className="h-5 w-5 text-slate-600" />
                    ) : (
                      <Play className="h-5 w-5 text-slate-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

