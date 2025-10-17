import ResultChart from "@/components/ResultChart";

async function getData(token: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/api/share/${token}`, { 
    cache: "no-store" 
  });
  return r.json();
}

export default async function SharePage({ params }: { params: { token: string } }) {
  const data = await getData(params.token);
  const qr = data?.result;

  if (!qr) {
    return (
      <main className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Lien invalide ou expiré</h1>
          <p className="text-slate-600 mb-6">Ce lien de partage n'est plus valide.</p>
          <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700" href="/">
            Retour à l'accueil
          </a>
        </div>
      </main>
    );
  }

  const alloc = qr.allocation_type === 'prudent'
    ? { 'Obligations': 70, 'Actions Monde': 20, 'Liquidités': 10 }
    : qr.allocation_type === 'equilibre'
      ? { 'Actions Monde': 50, 'Obligations': 40, 'Immobilier': 10 }
      : { 'Actions Monde': 80, 'Obligations': 15, 'Alternatives': 5 };

  return (
    <main className="container mx-auto py-10 space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Votre profil partagé
          </h1>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-800 font-semibold text-lg">
            {qr.allocation_type.charAt(0).toUpperCase() + qr.allocation_type.slice(1)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Allocation d'actifs recommandée
            </h2>
            <div className="h-64">
              <ResultChart allocation={alloc} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Rendement estimé</h3>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((qr.expected_return || 0.05) * 100)}%
              </div>
              <p className="text-sm text-slate-500">Rendement annuel moyen</p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Date du quiz</h3>
              <div className="text-lg">
                {new Date(qr.created_at).toLocaleString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 space-y-4">
          <a 
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            href="/signin"
          >
            Créer mon espace Investy
          </a>
          <div>
            <a 
              className="inline-block bg-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
              href="/"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Contenu éducatif, non-AMF. Ceci n'est pas un conseil financier.
          </p>
        </div>
      </div>
    </main>
  );
}
