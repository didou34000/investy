export default function EduAlerts() {
  const items = [
    { 
      emoji: "📈", 
      title: "Les taux montent", 
      text: "Les obligations deviennent plus attractives vs certaines valeurs de croissance." 
    },
    { 
      emoji: "🛒", 
      title: "Inflation en hausse", 
      text: "Votre pouvoir d'achat baisse: diversification et régularité restent clés." 
    },
    { 
      emoji: "🌍", 
      title: "Choc géopolitique", 
      text: "Volatilité possible: on rappelle les règles d'allocation par profil." 
    },
  ];

  return (
    <section id="suivi" className="py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Alertes pédagogiques, pas des ordres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-700 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 text-center mt-6">
          Contenu éducatif. Non-AMF. Aucun conseil d'achat/vente.
        </p>
      </div>
    </section>
  );
}
