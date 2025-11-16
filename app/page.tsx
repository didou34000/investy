"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RingChart } from "@/components/RingChart";
import { ArrowRight, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFlag } from "@/lib/flags";
import { track } from "@/lib/analytics";
import Section from "@/components/ui/Section";
import { getAllProfiles } from "@/lib/scoring";
import DecorativeCurve from "@/components/DecorativeCurve";
import AssetExplorer from "@/components/AssetExplorer";
import Storyline from "@/components/Storyline";
import MarketStrip from "@/components/MarketStrip";
import EduAlerts from "@/components/EduAlerts";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const cta = getFlag("ff_cta_copy", "A") as string;
  const ctaText = cta === "B" ? "Découvrez votre profil maintenant" : "Commencer le quiz";
  
  // Détecter le token dans le hash et rediriger vers /auth
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token=")) {
      // Token détecté -> rediriger vers /auth qui gérera la connexion
      router.replace(`/auth${hash}`);
    }
    // On ne vérifie pas la session ici pour éviter les redirections multiples
    // La page /auth s'en charge
  }, [router]);
  
  // Track flag exposure only once
  useEffect(() => {
    try { track("flag_exposure", { cta }); } catch {}
  }, [cta]);
  
  const profiles = getAllProfiles();
  const featuredProfiles = profiles; // Tous les 3 profils MVP
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden bg-[#0B1220] text-center text-white">
        {/* === Video background - starts well below navbar === */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          src="/videos/cours.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/og-cover.svg"
          onError={(e) => {
            // Fallback si la vidéo ne charge pas
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* === Fallback background (si vidéo ne charge pas) === */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 opacity-30"></div>
        
        {/* === Overlay (dégradé pour lisibilité) === */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60"></div>

        {/* === Existing Hero Content === */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <span className="text-xs font-medium text-white">Information en temps réel • Gratuit</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6 text-white drop-shadow-lg">
            Investy — la première plateforme qui suit le marché pour vous.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 lead text-balance max-w-2xl mx-auto mb-10">
            Découvrez votre profil investisseur, obtenez une répartition adaptée et recevez des explications claires quand l'économie bouge. Sans jargon. Sans pression d'achat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => track("quiz_start")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
              <Link href="/quiz" className="inline-flex items-center gap-2" prefetch>
                Découvrir mon profil
                <ArrowRight className="w-4 h-4" />
              </Link>
            </button>
          </div>
        </div>
      </section>


      {/* Fil conducteur */}
      <Section className="py-12">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Votre parcours</h2>
          <p className="text-slate-600 mb-8">Un fil simple en 4 étapes pour comprendre, vous situer et agir.</p>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="card p-4"><div className="text-slate-900 font-semibold mb-1">1. Comprendre</div><div className="text-slate-600">Actus et explications claires.</div></div>
            <div className="card p-4"><div className="text-slate-900 font-semibold mb-1">2. Vous situer</div><div className="text-slate-600">Quiz de profil.</div></div>
            <div className="card p-4"><div className="text-slate-900 font-semibold mb-1">3. Explorer</div><div className="text-slate-600">Marchés et actifs.</div></div>
            <div className="card p-4"><div className="text-slate-900 font-semibold mb-1">4. Agir</div><div className="text-slate-600">Répartition adaptée.</div></div>
          </div>
        </div>
      </Section>

      {/* Storyline */}
      <Storyline />

      {/* Market Strip */}
      <MarketStrip />

      {/* Asset Explorer */}
      <AssetExplorer />

      {/* Profiles Preview */}
      <section className="container py-16 border-t border-zinc-200 bg-zinc-50/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">3 Profils d'investisseur</h2>
          <p className="text-center text-zinc-600 mb-12 max-w-2xl mx-auto">
            Du plus sécurisé au plus dynamique, découvrez le profil qui correspond à votre situation et vos objectifs.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {profiles.map((profile, idx) => (
              <div 
                key={profile.key} 
                className="card text-center p-4 hover:shadow-lg transition-all cursor-pointer"
                title={profile.desc}
              >
                <div className={`w-3 h-3 rounded-full ${profile.color} mx-auto mb-2`} />
                <div className="text-xs font-semibold text-slate-900 mb-1">{profile.title}</div>
                <div className="text-xs text-slate-500">{profile.expReturn}%/an</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProfiles.map((profile) => (
              <div key={profile.key} className="card">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-4 ${profile.color}`}>
                  {profile.title}
                </div>
                <div className="flex justify-center mb-4">
                  <RingChart percent={profile.alloc.stocks} label="Actions" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rendement :</span>
                    <span className="font-semibold text-slate-900">{profile.expReturn}%/an</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Volatilité :</span>
                    <span className="font-semibold text-slate-900">±{profile.expVol}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                  {profile.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alertes pédagogiques */}
      <EduAlerts />

      {/* Decorative Curve */}
      <DecorativeCurve />

      {/* CTA Final */}
      <section className="container py-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-lg text-zinc-600 mb-8">
            Identifiez votre profil et recevez des conseils personnalisés gratuitement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => track("quiz_start_bottom")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
              <Link href="/quiz" className="inline-flex items-center gap-2" prefetch>
                Je découvre mon profil
                <ArrowRight className="w-5 h-5" />
              </Link>
            </button>
            <Link href="/signin" className="text-blue-600 hover:text-blue-700 transition-colors border border-blue-300 px-6 py-3 rounded-xl hover:bg-blue-50">
              Créer mon espace (gratuit, optionnel)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
