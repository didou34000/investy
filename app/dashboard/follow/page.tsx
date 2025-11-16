"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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
  const [user, setUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const hasRedirectedRef = useRef(false);

  // Garde d'authentification - VERSION SIMPLIFIÉE ET ROBUSTE
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      // Vérifier si on vient de /auth (redirection récente)
      const redirectTimestamp = sessionStorage.getItem("auth_redirect_timestamp");
      const comingFromAuth = redirectTimestamp !== null;
      const timeSinceRedirect = redirectTimestamp ? Date.now() - parseInt(redirectTimestamp) : Infinity;
      
      // Si on vient de /auth, attendre plus longtemps
      const waitTime = comingFromAuth && timeSinceRedirect < 10000 ? 2500 : 800;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      
      if (!mounted) return;

      // Vérifier la session plusieurs fois si on vient de /auth
      let session = null;
      const maxAttempts = comingFromAuth ? 5 : 2;
      
      for (let i = 0; i < maxAttempts; i++) {
        if (!mounted) return;
        
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("getSession error", error);
          break;
        }
        
        session = data.session;
        if (session && session.user) {
          break; // Session trouvée
        }
        
        // Attendre avant le prochain essai
        if (i < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
      
      if (!mounted) return;

      if (session && session.user) {
        // ✅ Session valide
        setUser(session.user);
        setLoadingUser(false);
        sessionStorage.removeItem("auth_redirect_timestamp");
      } else {
        // ❌ Pas de session après tous les essais
        setLoadingUser(false);
        sessionStorage.removeItem("auth_redirect_timestamp");
        
        // Ne rediriger QUE si on n'a pas déjà redirigé récemment (évite les boucles)
        if (!hasRedirectedRef.current && timeSinceRedirect > 5000) {
          hasRedirectedRef.current = true;
          router.replace("/auth");
        }
      }
    };

    checkAuth();

    // Écouter les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      if (event === "SIGNED_IN" && session && session.user) {
        setUser(session.user);
        setLoadingUser(false);
        sessionStorage.removeItem("auth_redirect_timestamp");
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setLoadingUser(false);
        sessionStorage.removeItem("auth_redirect_timestamp");
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          router.replace("/auth");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  async function loadSubscriptions() {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.status === 401) {
        // Ne pas rediriger ici, on laisse le useEffect principal gérer
        setLoading(false);
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

  if (loadingUser) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="p-4 text-sm">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="p-4 text-sm">Vérification de la session...</p>
        </div>
      </main>
    );
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
        <p className="text-sm text-gray-600 mb-4">
          Connecté en tant que {user.email}
        </p>
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
