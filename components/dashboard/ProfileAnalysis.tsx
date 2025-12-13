import React from "react";
import type { InvestyProfileResult } from "@/lib/profileMapper";
import { Shield, Clock, Sparkles, Compass } from "lucide-react";

type Props = {
  profile: InvestyProfileResult | null;
  lastResultDate?: string | null;
  greetingName: string;
};

const defaultText = {
  style: "Style équilibré pour progresser sereinement.",
  expectation: "Rendement visé long terme avec volatilité mesurée.",
};

export function ProfileAnalysis({ profile, lastResultDate, greetingName }: Props) {
  const score = profile?.riskIndex != null ? Math.round(profile.riskIndex) : null;
  const label = profile?.label ?? "Profil à définir";
  const horizon = profile?.allocation ? (profile.riskIndex && profile.riskIndex < 40 ? "3-5 ans" : "5-10 ans") : "—";
  const support = (profile as any)?.support ?? "PEA / CTO";

  return (
    <section id="profil" className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Profil</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Bonjour {greetingName} 👋</h2>
          <p className="text-sm text-slate-600">Résumé personnalisé de ton profil investisseur.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold">
          {label} {score != null ? `• ${score}/100` : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
          <div className="inline-flex items-center gap-2 text-xs text-slate-600">
            <Shield className="w-4 h-4" />
            Tolérance au risque
          </div>
          <p className="text-sm font-semibold text-slate-900">{label} {score != null ? `(${score}/100)` : ""}</p>
          <p className="text-xs text-slate-600">{profile?.subtitle ?? defaultText.style}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
          <div className="inline-flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-4 h-4" />
            Horizon
          </div>
          <p className="text-sm font-semibold text-slate-900">{profile?.monthly ? "Investisseur récurrent" : "Investisseur progressif"}</p>
          <p className="text-xs text-slate-600">Horizon suggéré : {horizon}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-1">
          <div className="inline-flex items-center gap-2 text-xs text-slate-600">
            <Compass className="w-4 h-4" />
            Support recommandé
          </div>
          <p className="text-sm font-semibold text-slate-900">{support}</p>
          <p className="text-xs text-slate-600">PEA pour l’éligible, CTO pour le reste.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-600">
        {profile?.warnings?.length
          ? profile.warnings.join(" • ")
          : "Ton profil combine prudence et ambition. Ajuste le quiz si tes objectifs évoluent."}
      </div>

      <div className="text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Dernière mise à jour : {lastResultDate || "—"}
        </span>
      </div>
    </section>
  );
}
