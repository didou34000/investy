'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/signin';
        return;
      }

      const email = user.email!;
      setUserEmail(email);

      // Vérifier si l'email est dans la liste des admins
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
      const isAdmin = adminEmails.includes(email);

      if (!isAdmin) {
        window.location.href = '/';
        return;
      }

      setAuthorized(true);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Vérification des droits...</h1>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-red-600">Accès refusé</h1>
          <p className="text-slate-600 mb-6">Vous n'avez pas les droits d'administration.</p>
          <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700" href="/">
            Retour à l'accueil
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Administration Investy</h1>
        <div className="text-sm text-slate-600">
          Connecté en tant que {userEmail}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Analytics</h2>
          <p className="text-sm text-slate-600 mb-4">Consulter les métriques d'usage</p>
          <a className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" href="/admin/analytics">
            Voir les analytics
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">A/B Testing</h2>
          <p className="text-sm text-slate-600 mb-4">Gérer les tests et variantes</p>
          <a className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" href="/admin/ab">
            Gérer les tests
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">KPIs</h2>
          <p className="text-sm text-slate-600 mb-4">Tableaux de bord métier</p>
          <a className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" href="/admin/kpi">
            Voir les KPIs
          </a>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Zone d'administration</h3>
        <p className="text-sm text-yellow-700">
          Cette section est réservée aux administrateurs autorisés. 
          L'accès est contrôlé par la variable d'environnement ADMIN_EMAILS.
        </p>
      </div>
    </main>
  );
}
