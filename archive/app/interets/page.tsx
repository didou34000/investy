"use client";
import { useEffect, useState } from "react";
import { packsForProfile, getAssetLogo } from "@/lib/assetPacks";
import { supabase } from "@/lib/supabaseClient";
import { track } from "@/lib/analytics";
import AssetLogo from "@/components/ui/AssetLogo";

export default function InterestsPage() {
  const [profile, setProfile] = useState<string>("Équilibré");
  const [session, setSession] = useState<any>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    track("page_interests_view");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session) {
          const { data: up } = await supabase
            .from("users_public")
            .select("profile_type")
            .eq("user_id", session.user.id)
            .maybeSingle();
          
          if (up?.profile_type) {
            setProfile(up.profile_type);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const packs = packsForProfile(profile);

  async function addPack(id: string) {
    const pack = packs.find(p => p.id === id);
    if (!pack || !session) {
      alert("Connectez-vous pour enregistrer vos intérêts.");
      return;
    }

    try {
      const payload = pack.items.map(it => ({
        user_id: session.user.id,
        symbol: it.symbol,
        label: it.label,
        category: it.category
      }));

      const { error } = await supabase
        .from("user_watchlist")
        .upsert(payload);

      if (error) {
        alert(error.message);
      } else {
        setSelected(prev => ({ ...prev, [id]: true }));
        track("interest_pack_added", { id, profile, items_count: pack.items.length });
        alert(`Pack "${pack.title}" ajouté à votre suivi !`);
      }
    } catch (error) {
      console.error("Error adding pack:", error);
      alert("Erreur lors de l'ajout du pack");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Chargement...</h2>
          <p className="text-slate-600">Récupération de votre profil</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Centre d'intérêts</h1>
          <p className="text-slate-600">
            Packs proposés selon votre profil <span className="font-semibold text-blue-600">{profile}</span>. 
            Ajoutez-les à votre suivi en un clic.
          </p>
        </div>

        {!session && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="text-yellow-600 text-xl">⚠️</div>
              <div>
                <div className="font-semibold text-yellow-900">Connexion requise</div>
                <div className="text-sm text-yellow-700 mt-1">
                  Connectez-vous pour sauvegarder vos intérêts et recevoir des alertes personnalisées.
                </div>
                <a 
                  href="/quiz" 
                  className="inline-block mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Commencer le quiz
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-lg text-slate-900">{p.title}</div>
                {selected[p.id] && (
                  <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                    ✓ Ajouté
                  </span>
                )}
              </div>
              
              <p className="text-sm text-slate-600 mb-4">{p.blurb}</p>
              
              <div className="space-y-2 mb-4">
                {p.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <AssetLogo 
                      src={getAssetLogo(it.symbol, it.category)} 
                      label={it.label} 
                      size={20}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{it.label}</div>
                      <div className="text-xs text-slate-400 uppercase">{it.category}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => addPack(p.id)}
                disabled={selected[p.id]}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  selected[p.id]
                    ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {selected[p.id] ? "Déjà ajouté" : "Ajouter au suivi"}
              </button>
            </div>
          ))}
        </div>

        {packs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun pack disponible</h3>
            <p className="text-slate-600">
              Aucun pack d'actifs n'est disponible pour votre profil actuel.
            </p>
          </div>
        )}

        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Prochaines étapes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">📊</span>
              </div>
              <div>
                <div className="font-medium text-slate-900">Dashboard</div>
                <div className="text-sm text-slate-600">Suivez vos actifs en temps réel</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">📧</span>
              </div>
              <div>
                <div className="font-medium text-slate-900">Alertes personnalisées</div>
                <div className="text-sm text-slate-600">Recevez des notifications par email</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a 
            href="/dashboard" 
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-800 hover:bg-white text-center font-medium"
          >
            Voir mon dashboard
          </a>
          <a 
            href="/quiz" 
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-center font-medium"
          >
            Refaire le quiz
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Rappel :</strong> Investy est un outil éducatif, non un conseiller financier. 
            Aucune garantie de performance. Investir comporte des risques de perte en capital.
          </div>
        </div>
      </div>
    </main>
  );
}
