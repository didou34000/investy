"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminRuns() {
  const [runs, setRuns] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadRuns() {
    try {
      const { data, error } = await supabase
        .from("alert_runs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(30);
      
      if (error) {
        console.error("Error loading runs:", error);
        return;
      }
      
      setRuns(data || []);
    } catch (err) {
      console.error("Error loading runs:", err);
    }
  }

  async function loadEvents(runId: string) {
    try {
      const { data, error } = await supabase
        .from("alert_events")
        .select("*")
        .eq("run_id", runId)
        .order("created_at", { ascending: false })
        .limit(200);
      
      if (error) {
        console.error("Error loading events:", error);
        return;
      }
      
      setEvents(data || []);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  }

  async function triggerTestRun() {
    try {
      const response = await fetch("/api/cron/alerts?freq=weekly", {
        method: "GET"
      });
      const result = await response.json();
      
      if (result.ok) {
        alert(`Test run triggered successfully! Run ID: ${result.run_id}`);
        loadRuns(); // Reload runs
      } else {
        alert(`Error: ${result.error || result.reason}`);
      }
    } catch (err) {
      console.error("Error triggering test run:", err);
      alert("Error triggering test run");
    }
  }

  useEffect(() => {
    loadRuns().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected) {
      loadEvents(selected);
    }
  }, [selected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Chargement...</h2>
          <p className="text-slate-600">Récupération des données d'administration</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Alertes — Exécutions</h1>
          <p className="text-slate-600">Monitoring des alertes automatiques et des envois d'emails</p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={triggerTestRun}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Déclencher un test (weekly)
          </button>
          <button
            onClick={loadRuns}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            Actualiser
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Liste des runs */}
          <div className="md:col-span-1">
            <div className="border rounded-2xl p-4 bg-white">
              <div className="font-medium mb-4">Derniers runs ({runs.length})</div>
              <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                {runs.map(r => (
                  <div key={r.id}>
                    <button
                      className={`w-full text-left border rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors ${
                        selected === r.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => setSelected(r.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            <span className={`px-2 py-1 rounded text-xs ${
                              r.freq === "daily" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }`}>
                              {r.freq}
                            </span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              r.status === "ok" ? "bg-green-100 text-green-700" :
                              r.status === "error" ? "bg-red-100 text-red-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {r.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1">
                            {new Date(r.started_at).toLocaleString("fr-FR")}
                          </div>
                          <div className="text-xs text-slate-600">
                            {r.processed_count} utilisateurs
                          </div>
                        </div>
                      </div>
                      {r.error && (
                        <div className="text-red-600 text-xs mt-1 truncate" title={r.error}>
                          {r.error}
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Détails des événements */}
          <div className="md:col-span-2">
            <div className="border rounded-2xl p-4 bg-white">
              <div className="font-medium mb-4">
                Événements {selected ? "" : "(sélectionnez un run)"}
                {selected && ` (${events.length})`}
              </div>
              
              {!selected && (
                <div className="text-sm text-slate-600 text-center py-8">
                  Choisissez un run à gauche pour voir les détails.
                </div>
              )}
              
              {selected && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-sm text-slate-600 text-center py-8">
                      Aucun événement pour ce run.
                    </div>
                  ) : (
                    events.map(e => (
                      <div key={e.id} className="border rounded-lg p-3 bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">
                            {e.email || "—"}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              e.sent ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                            }`}>
                              {e.sent ? "Envoyé" : "Non envoyé"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {e.profile_type}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-600 mb-2">
                          Items: {(e.items || []).length} • Fréquence: {e.frequency}
                        </div>
                        
                        {(e.items || []).length > 0 && (
                          <ul className="text-xs text-slate-600 list-disc pl-5 space-y-1">
                            {(e.items || []).map((it: any, i: number) => (
                              <li key={i}>
                                <b>{it.symbol}</b> — {it.message}
                                {it.change1d != null ? ` (1j: ${(it.change1d >= 0 ? "+" : "")}${it.change1d.toFixed(2)}%)` : ""}
                                {it.change5d != null ? ` — 5j: ${(it.change5d >= 0 ? "+" : "")}${it.change5d.toFixed(2)}%` : ""}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-2xl p-4">
            <div className="text-2xl font-bold text-blue-600">
              {runs.filter(r => r.status === "ok").length}
            </div>
            <div className="text-sm text-slate-600">Runs réussis</div>
          </div>
          <div className="bg-white border rounded-2xl p-4">
            <div className="text-2xl font-bold text-red-600">
              {runs.filter(r => r.status === "error").length}
            </div>
            <div className="text-sm text-slate-600">Runs en erreur</div>
          </div>
          <div className="bg-white border rounded-2xl p-4">
            <div className="text-2xl font-bold text-green-600">
              {runs.reduce((sum, r) => sum + (r.processed_count || 0), 0)}
            </div>
            <div className="text-sm text-slate-600">Utilisateurs traités</div>
          </div>
        </div>
      </div>
    </main>
  );
}
