import React from "react";
import type { InvestyProfileResult } from "@/lib/profileMapper";
import { getProfileCopy } from "@/lib/profileCopy";
import { Shield, Sparkles, TrendingUp } from "lucide-react";

type Props = { profile: InvestyProfileResult };

export function ProfileHeader({ profile }: Props) {
  const copy = getProfileCopy(profile.code);
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.06)] p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Ton profil d’investisseur</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{profile.label}</h1>
          <p className="text-sm text-slate-600">{profile.subtitle}</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-sm">
          <Sparkles className="w-4 h-4" />
          {profile.label}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex gap-2 items-start">
          <Shield className="w-4 h-4 text-slate-500 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Risque</p>
            <p className="font-semibold text-slate-900">{profile.riskIndex}/100</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex gap-2 items-start">
          <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Rendement attendu</p>
            <p className="font-semibold text-slate-900">{profile.expectedReturn.toFixed(1)}% / an</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex gap-2 items-start">
          <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Volatilité</p>
            <p className="font-semibold text-slate-900">±{profile.expectedVol.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-900">Ce que ça veut dire pour toi :</p>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 list-disc list-inside">
          {copy.bullets.slice(0, 4).map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}


