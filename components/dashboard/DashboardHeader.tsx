import React from "react";
import { BadgeCheck, Clock, Compass, Shield, Sparkles } from "lucide-react";

type Props = {
  name: string;
  profileLabel: string;
  support: string;
  score?: number | null;
  horizon?: string;
  allocationMain?: string;
  lastUpdated?: string | null;
};

const badgeTone: Record<string, string> = {
  Prudent: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Modéré: "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Équilibré": "bg-blue-100 text-blue-700 border-blue-200",
  Dynamique: "bg-pink-100 text-pink-700 border-pink-200",
  Offensif: "bg-orange-100 text-orange-700 border-orange-200",
};

export function DashboardHeader({
  name,
  profileLabel,
  support,
  score,
  horizon,
  allocationMain,
  lastUpdated,
}: Props) {
  const badgeClass = badgeTone[profileLabel] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#eef2ff] via-white to-[#e0f2fe] border border-white/70 shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.12),transparent_30%)]" />
      <div className="relative p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/80 shadow-sm text-xs text-slate-700">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Espace investisseur premium
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Bienvenue {name} 👋
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Ton cockpit financier centralise profil, allocations, supports et recommandations sur-mesure.
            </p>
            {lastUpdated && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-white/80 border border-white/90 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                Dernière mise à jour : {lastUpdated}
              </div>
            )}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold shadow-sm bg-white/80">
            <BadgeCheck className="w-4 h-4 text-indigo-500" />
            {profileLabel}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white/90 border border-white/80 shadow-md p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
              {score != null ? score : "—"}
            </div>
            <div>
              <p className="text-xs text-slate-500">Score</p>
              <p className="text-sm font-semibold text-slate-900">Indice de risque</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 border border-white/80 shadow-md p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Horizon</p>
              <p className="text-sm font-semibold text-slate-900">{horizon || "À préciser"}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 border border-white/80 shadow-md p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl border text-sm font-semibold flex items-center justify-center ${badgeClass}`}>
              {support}
            </div>
            <div>
              <p className="text-xs text-slate-500">Support recommandé</p>
              <p className="text-sm font-semibold text-slate-900">PEA / CTO</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 border border-white/80 shadow-md p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Allocation</p>
              <p className="text-sm font-semibold text-slate-900">{allocationMain || "Diversifiée"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
