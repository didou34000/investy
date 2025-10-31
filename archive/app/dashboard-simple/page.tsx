"use client";

export default function DashboardSimple(){
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-8">Dashboard Simple</h1>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Test de base</h2>
          <p className="text-slate-600 mb-4">Cette page fonctionne sans Supabase ni composants complexes.</p>
          
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> ✅ Page fonctionnelle
            </div>
            <div>
              <strong>Problème identifié:</strong> Le dashboard normal reste bloqué en "Chargement..."
            </div>
            <div>
              <strong>Cause probable:</strong> Problème avec l'authentification Supabase ou les composants React
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tester le dashboard normal
            </button>
            <button 
              onClick={() => window.location.href = '/quiz'}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Aller au quiz
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
