import React from "react";
import { Clock3, History, Sparkles } from "lucide-react";

export type HistoryItem = {
  date: string;
  profile: string;
  score?: number | null;
  allocation?: string;
};

export function HistoryCard({ items }: { items: HistoryItem[] }) {
  const hasItems = items.length > 0;
  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Historique</p>
          <h2 className="text-xl font-semibold text-slate-900">Résultats passés</h2>
          <p className="text-sm text-slate-600">Évolution de ton profil, score et allocation.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600">
          <History className="w-4 h-4" />
          Traçabilité
        </div>
      </div>

      {!hasItems ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-sm text-slate-600 space-y-2">
          <p>Pas encore d’historique enregistré.</p>
          <p className="text-xs text-slate-500">Refais le quiz pour suivre ton évolution dans le temps.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.date}-${item.profile}`}
              className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                  {item.score != null ? item.score : "—"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.profile}</p>
                  <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                    <Clock3 className="w-3.5 h-3.5" />
                    {item.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Allocation</p>
                <p className="text-sm font-semibold text-slate-900">{item.allocation || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        Tip : garde une trace après chaque quiz pour voir la progression.
      </div>
    </section>
  );
}
