"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardDebug(){
  const [session,setSession]=useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{ 
    (async ()=>{
      try {
        console.log("🔍 Vérification de l'authentification...");
        const { data:{session}, error } = await supabase.auth.getSession();
        console.log("📊 Session:", session);
        console.log("❌ Erreur:", error);
        setSession(session);
        setError(error?.message || null);
      } catch (err: any) {
        console.error("💥 Erreur lors du chargement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })(); 
  },[]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Chargement...</h2>
          <p className="text-slate-600">Vérification de l'authentification</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-8">Debug Dashboard</h1>
        
        <div className="grid gap-6">
          {/* État de l'authentification */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">État de l'authentification</h2>
            <div className="space-y-2">
              <div><strong>Session:</strong> {session ? "✅ Connecté" : "❌ Non connecté"}</div>
              <div><strong>Email:</strong> {session?.user?.email || "N/A"}</div>
              <div><strong>ID:</strong> {session?.user?.id || "N/A"}</div>
              {error && <div className="text-red-600"><strong>Erreur:</strong> {error}</div>}
            </div>
          </div>

          {/* Test de connexion Supabase */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Test de connexion Supabase</h2>
            <button 
              onClick={async () => {
                try {
                  const { data, error } = await supabase.from("users_public").select("count").limit(1);
                  console.log("Test Supabase:", { data, error });
                  alert(error ? `Erreur: ${error.message}` : "Connexion Supabase OK");
                } catch (err: any) {
                  console.error("Erreur test:", err);
                  alert(`Erreur: ${err.message}`);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tester la connexion Supabase
            </button>
          </div>

          {/* Actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = '/quiz'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Aller au quiz
              </button>
              <button 
                onClick={() => window.location.href = '/result'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Aller aux résultats
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                Dashboard normal
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
