export default function AbGuide() {
  return (
    <section className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold">Cadre d’expérimentation A/B</h1>
      <p className="mt-2 text-slate-700">Hypothèse: un wording plus direct améliore le CTR (CTA) et la complétion (quiz).</p>
      <h2 className="mt-4 font-semibold">Variantes</h2>
      <ul className="list-disc list-inside text-slate-700">
        <li>CTA Accueil – A: « Commencer le quiz » / B: « Découvrez votre profil maintenant » (flag: <code>ff_cta_copy</code>).</li>
        <li>Bouton final Quiz – A: « Voir mon profil » / B: « Découvrir mon profil » (flag: <code>ff_quiz_variant</code>).</li>
      </ul>
      <h2 className="mt-4 font-semibold">Mesure</h2>
      <p className="text-slate-700">Exposition via <code>flag_exposure</code>. CTR: clic CTA / vues accueil (calcul manuel dans /admin/analytics).</p>
      <h2 className="mt-4 font-semibold">Règle de décision</h2>
      <p className="text-slate-700">Si B &gt; A de +10% sur ≥ 200 sessions → basculer B par défaut. Durée: 7–14 jours ou 200 sessions.</p>
      <h2 className="mt-4 font-semibold">Réglage des flags</h2>
      <p className="text-slate-700">Dans la console navigateur: <code>localStorage.setItem('ff_cta_copy','B')</code>, <code>localStorage.setItem('ff_quiz_variant','B')</code> puis recharger.</p>
    </section>
  );
}


