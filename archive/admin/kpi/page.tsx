"use client";

import { useEffect, useMemo, useState } from "react";
import KpiCard from "@/components/KpiCard";
import Sparkline from "@/components/Sparkline";

type Row = { id: string; name: string; ts: number; payload?: Record<string, unknown> };

function Status({ ok, note }: { ok: boolean | null; note?: string }) {
  return (
    <span className={`ml-2 inline-block rounded px-2 py-0.5 text-xs ${ok === null ? "bg-slate-200 text-slate-700" : ok ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
      {ok === null ? "Attendre trafic" : ok ? "OK" : "À améliorer"}{note ? ` – ${note}` : ""}
    </span>
  );
}

export default function KpiPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { fetch("/api/events").then(r=>r.json()).then(j=>setRows(j.events ?? [])).catch(()=>setRows([])); }, []);

  const count = (name: string) => rows.filter((r) => r.name === name).length;
  const quizStart = count("quiz_start");
  const quizComplete = count("quiz_complete");
  const subscribeSuccess = count("subscribe_success");
  const resultViews = rows.filter((r) => r.name === "view_page" && r.payload?.route === "/result").length;
  const feedbackSubmit = count("feedback_submit");

  const completionRate = quizStart ? Math.round((quizComplete / quizStart) * 100) : null;
  const captureRate = resultViews ? Math.round((subscribeSuccess / resultViews) * 100) : null;
  const usefulFeedbackPct = feedbackSubmit ? Math.round((rows.filter(r => r.name === "feedback_submit" && String((r.payload as any)?.message || "").length >= 20).length / feedbackSubmit) * 100) : null;

  const byDay = (name: string) => {
    const days: Record<string, number> = {};
    rows.filter((r) => r.name === name).forEach((r) => { const d = new Date(r.ts); const k = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; days[k] = (days[k]||0)+1; });
    const out: number[] = [];
    for (let i=6;i>=0;i--){ const d=new Date(Date.now()-i*86400000); const k=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; out.push(days[k]||0);} return out;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">KPI Dashboard</h1>
              <p className="mt-2 text-slate-300">Indicateurs clés de performance</p>
            </div>
            <a 
              href="/api/analytics/export" 
              className="btn-ghost text-white border-white/20 hover:bg-white/10"
            >
              Exporter CSV
            </a>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl py-12">
        {rows.length === 0 && (
          <div className="card bg-amber-50 border-amber-200">
            <div className="flex gap-3 items-start">
              <div className="text-2xl">📊</div>
              <div>
                <div className="font-semibold text-slate-900">Aucune donnée disponible</div>
                <div className="text-sm text-slate-600 mt-1">Les événements apparaîtront ici une fois que les utilisateurs interagiront avec le site.</div>
              </div>
            </div>
          </div>
        )}

        {/* Main metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Quiz démarrés</div>
            <div className="text-4xl font-bold text-slate-900">{quizStart}</div>
            <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: quizStart > 0 ? '100%' : '0%' }} />
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Quiz complétés</div>
            <div className="text-4xl font-bold text-slate-900">{quizComplete}</div>
            <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-600" style={{ width: quizStart > 0 ? `${(quizComplete/quizStart)*100}%` : '0%' }} />
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Emails collectés</div>
            <div className="text-4xl font-bold text-slate-900">{subscribeSuccess}</div>
            <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600" style={{ width: subscribeSuccess > 0 ? '100%' : '0%' }} />
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Vues résultat</div>
            <div className="text-4xl font-bold text-slate-900">{resultViews}</div>
            <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-600" style={{ width: resultViews > 0 ? '100%' : '0%' }} />
            </div>
          </div>
        </div>

        {/* Conversion metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-slate-700">Taux de complétion</div>
                <div className="text-xs text-slate-500 mt-1">Cible ≥ 65%</div>
              </div>
              <Status ok={completionRate === null ? null : completionRate >= 65} />
            </div>
            <div className="text-5xl font-bold text-slate-900 mb-4">
              {completionRate === null ? "—" : `${completionRate}%`}
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 mb-2">7 derniers jours</div>
              <Sparkline values={byDay("quiz_complete")} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-slate-700">Taux capture email</div>
                <div className="text-xs text-slate-500 mt-1">Cible ≥ 25–35%</div>
              </div>
              <Status ok={captureRate === null ? null : captureRate >= 25} />
            </div>
            <div className="text-5xl font-bold text-slate-900 mb-4">
              {captureRate === null ? "—" : `${captureRate}%`}
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 mb-2">7 derniers jours</div>
              <Sparkline values={byDay("subscribe_success")} />
            </div>
          </div>
        </div>

        {/* Secondary metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-slate-50">
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm font-medium text-slate-700">Taux d'ouverture Email #1</div>
              <Status ok={false} note="suivi manuel" />
            </div>
            <div className="text-slate-600 text-sm leading-relaxed">
              Cible 45–60%. Saisir manuellement via outil emailing (Resend/SendGrid).
            </div>
          </div>

          <div className="card bg-slate-50">
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm font-medium text-slate-700">Feedbacks utiles (≥20 car.)</div>
              <Status ok={usefulFeedbackPct === null ? null : usefulFeedbackPct >= 10} />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {usefulFeedbackPct === null ? "—" : `${usefulFeedbackPct}%`}
            </div>
          </div>

          <div className="card bg-slate-50">
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm font-medium text-slate-700">Latence perçue</div>
              <Status ok={true} note="fluide local" />
            </div>
            <div className="text-slate-600 text-sm leading-relaxed">
              Objectif: navigation locale {"<"} 1s. Test manuel sur plusieurs devices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


