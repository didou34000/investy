import React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Shield } from "lucide-react";
import { DashCard } from "./DashCard";
import { AllocationBars } from "./AllocationBars";

type Result = {
  score: number | null;
  profile: string;
  risk: number | null;
  allocation: { actions: number; bonds: number; cash: number };
  horizon: string;
};

type Props = {
  hasResult: boolean;
  result: Result | null;
};

export function ResultCard({ hasResult, result }: Props) {
  if (!hasResult || !result) {
    return (
      <DashCard>
        <div className="p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600">Tu n'as pas encore complété le quiz.</p>
            <p className="text-xs text-slate-500">Lance le quiz pour générer ton plan personnalisé.</p>
          </div>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
          >
            Faire le quiz
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </DashCard>
    );
  }

  return (
    <DashCard>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold">
              <BadgeCheck className="w-4 h-4" />
              Profil détecté
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{result.profile}</h3>
            <p className="text-sm text-slate-600">Indice de risque : {result.risk ?? "N/A"} • Horizon : {result.horizon}</p>
          </div>
          <div className="rounded-2xl bg-white/70 border border-slate-200 px-4 py-3 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Score</p>
            <p className="text-3xl font-bold text-slate-900">{result.score}</p>
          </div>
        </div>

        <AllocationBars allocation={result.allocation} />

        <div className="flex flex-wrap gap-3">
          <Link
            href="/result"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
          >
            Voir mes résultats
          </Link>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 transition-all"
          >
            Refaire le quiz
          </Link>
          <Link
            href="/result"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 transition-all"
          >
            Télécharger mon plan
            <Shield className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DashCard>
  );
}

