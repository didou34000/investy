"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AssetSelector from "@/components/AssetSelector";
import AssetLogo from "@/components/ui/AssetLogo";

type Subscription = {
  id: string;
  symbol: string;
  frequency: string;
  enabled: boolean;
  next_run_at: string | null;
  last_run_at: string | null;
  last_status: string | null;
  send_hour: number;
  send_minute: number;
};

// Formulaire de création d'alerte (inchangé)
function NewSubscriptionForm({ onCreated }: { onCreated: () => void }) {
  const [symbol, setSymbol] = useState("");
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    if (!symbol.trim()) {
      setCreateError("Le symbole est requis");
      setCreating(false);
      return;
    }

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
        setCreateError(json.error || "Création impossible, réessaie");
        return;
      }

      setSymbol("");
      setHour(8);
      setMinute(0);
      onCreated();
    } catch (e: any) {
      setCreateError("Erreur réseau, réessaie");
      console.error("Create subscription error:", e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4 mb-6 bg-white">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Nouvelle alerte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Actif à suivre
          </label>
          <AssetSelector
            value={symbol}
            onChange={setSymbol}
            disabled={creating}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Heure
            </label>
            <select
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              disabled={creating}
            >
              <option value={8}>08</option>
              <option value={9}>09</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Minute
            </label>
            <select
              value={minute}
              onChange={(e) => setMinute(parseInt(e.target.value))}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              disabled={creating}
            >
              <option value={0}>00</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
            </select>
          </div>
        </div>

        {createError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {createError}
          </div>
        )}

        <button
          type="submit"
          disabled={creating}
          className="rounded-md px-4 py-2 text-sm font-medium bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
        >
          {creating ? "Création..." : "Créer l'alerte"}
        </button>
      </form>
    </div>
  );
}

export default function FollowPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [subsError, setSubsError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});
  const [assetsMap, setAssetsMap] = useState<Map<string, { label: string; logo: string | null; category: string }>>(new Map());

  // Chargement des subscriptions (sans aucune logique de redirection /auth)
  const loadSubscriptions = useCallback(async () => {
    setLoadingSubs(true);
    setSubsError(null);

    try {
      const res = await fetch("/api/subscriptions", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        // Utilisateur non connecté côté serveur : on affiche un message clair, sans redirection automatique
        setSubs([]);
        setSubsError("Tu n'es pas connecté. Va sur la page de connexion pour accéder à tes alertes.");
        return;
      }

      const json = await res.json();

      if (!res.ok) {
        setSubsError("Impossible de charger les alertes");
        return;
      }

      setSubs(json.subscriptions || []);
    } catch (e) {
      console.error("Error loading subscriptions:", e);
      setSubsError("Impossible de charger les alertes");
    } finally {
      setLoadingSubs(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  // Charger les actifs pour les logos
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const res = await fetch("/api/market");
        const json = await res.json();
        if (res.ok && json.data) {
          const map = new Map();
          json.data.forEach((asset: any) => {
            map.set(asset.symbol, {
              label: asset.label,
              logo: asset.logo,
              category: asset.category,
            });
          });
          setAssetsMap(map);
        }
      } catch (e) {
        console.error("Error loading assets:", e);
      }
    };
    loadAssets();
  }, []);

  const handlePause = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: "pause" }));
    try {
      const res = await fetch(`/api/subscriptions/${id}/pause`, { method: "POST" });
      if (!res.ok) {
        const json = await res.json();
        console.error("Pause error:", json.error);
        return;
      }
      await loadSubscriptions();
    } catch (e) {
      console.error("Pause error:", e);
    } finally {
      setActionLoading((prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      }));
    }
  };

  const handleResume = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: "resume" }));
    try {
      const res = await fetch(`/api/subscriptions/${id}/resume`, { method: "POST" });
      if (!res.ok) {
        const json = await res.json();
        console.error("Resume error:", json.error);
        return;
      }
      await loadSubscriptions();
    } catch (e) {
      console.error("Resume error:", e);
    } finally {
      setActionLoading((prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      }));
    }
  };

  const handleTest = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: "test" }));
    try {
      const res = await fetch(`/api/subscription-run/${id}`, { method: "POST" });
      if (!res.ok) {
        const json = await res.json();
        console.error("Test error:", json.error);
        return;
      }
      await loadSubscriptions();
    } catch (e) {
      console.error("Test error:", e);
    } finally {
      setActionLoading((prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      }));
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Suivi d'actifs</h1>

        <NewSubscriptionForm onCreated={loadSubscriptions} />

        <div className="border border-slate-200 rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Mes alertes ({subs.length})
          </h2>

          {loadingSubs && (
            <div className="text-center py-8 text-slate-600">
              Chargement des alertes...
            </div>
          )}

          {subsError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4">
              {subsError}
            </div>
          )}

          {!loadingSubs && subs.length === 0 && !subsError && (
            <div className="text-center py-8 text-slate-500">
              <p>Aucune alerte pour l'instant.</p>
              <p className="text-sm mt-2">Crée ta première alerte ci-dessus.</p>
            </div>
          )}

          {!loadingSubs && subs.length > 0 && (
            <div className="space-y-3">
              {subs.map((sub) => {
                const isLoading = actionLoading[sub.id];
                const timeStr = `${String(sub.send_hour).padStart(2, "0")}:${String(sub.send_minute).padStart(2, "0")}`;
                const assetInfo = assetsMap.get(sub.symbol);

                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <AssetLogo
                          src={assetInfo?.logo || null}
                          label={assetInfo?.label || sub.symbol}
                          size={32}
                        />
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {assetInfo?.label || sub.symbol}
                          </span>
                          <span className="text-xs text-slate-500">({sub.symbol})</span>
                        </div>
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
                      <div className="text-xs text-slate-500">
                        Envoi programmé : {timeStr}
                        {sub.last_run_at && (
                          <span className="ml-2">
                            • Dernier envoi : {new Date(sub.last_run_at).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.enabled ? (
                        <button
                          onClick={() => handlePause(sub.id)}
                          disabled={!!isLoading}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          {isLoading === "pause" ? "…" : "Pause"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleResume(sub.id)}
                          disabled={!!isLoading}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          {isLoading === "resume" ? "…" : "Reprendre"}
                        </button>
                      )}

                      <button
                        onClick={() => handleTest(sub.id)}
                        disabled={!!isLoading}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading === "test" ? "…" : "Tester"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
