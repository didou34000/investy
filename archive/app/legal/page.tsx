import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales – Investy",
  description:
    "MVP éducatif — non-conseil financier, risques, cookies, emails, données personnelles.",
  openGraph: {
    title: "Mentions légales – Investy",
    description:
      "Informations légales: non-conseil, risques, données, cookies, contact.",
    url: "https://example.com/legal",
  },
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-12">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-bold">Mentions légales</h1>
          <p className="mt-3 text-slate-300">Informations importantes & conditions d'utilisation</p>
        </div>
      </div>

      <div className="container max-w-6xl py-12">
        <div className="grid md:grid-cols-[280px_1fr] gap-12">
          {/* Sticky TOC */}
          <aside className="md:sticky md:top-24 md:self-start">
            <div className="card">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">Sommaire</h2>
              <nav className="space-y-2 text-sm">
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#non-conseil">Avertissement</a>
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#risques">Risques & performances</a>
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#responsabilite">Responsabilité</a>
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#donnees-personnelles">Données personnelles</a>
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#emails">Emails</a>
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#cookies">Cookies</a>
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#propriete">Propriété intellectuelle</a>
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#contact">Contact</a>
                <a className="block text-slate-700 hover:text-slate-900 hover:underline" href="#juridiction">Juridiction</a>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="max-w-prose">
            <div className="card bg-amber-50 border-amber-200 mb-8">
              <div className="flex gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong>Version courte :</strong> Investy est un <strong>MVP éducatif</strong>. Il <strong>n'apporte aucun conseil en investissement</strong>, ne recommande ni achat ni vente. Les informations sont fournies à titre <strong>pédagogique</strong> et <strong>général</strong>. Les marchés financiers comportent des <strong>risques de perte en capital</strong>.
                </div>
              </div>
            </div>

            <section id="non-conseil" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Avertissement – Non-conseil financier</h2>
              <div className="prose prose-slate leading-relaxed space-y-3 text-slate-700">
                <ul className="space-y-2">
                  <li>Investy est un <strong>outil éducatif</strong>.</li>
                  <li>Aucune information ne constitue une recommandation personnalisée.</li>
                  <li>Vous demeurez <strong>seul responsable</strong> de vos décisions d'investissement.</li>
                  <li>Avant toute décision, rapprochez-vous d'un <strong>professionnel</strong> agréé si nécessaire.</li>
                </ul>
              </div>
            </section>

            <section id="risques" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Risques & performances passées</h2>
              <div className="prose prose-slate leading-relaxed space-y-3 text-slate-700">
                <ul className="space-y-2">
                  <li>Les <strong>marchés financiers</strong> comportent des <strong>risques de perte en capital</strong>.</li>
                  <li>Les <strong>performances passées ne préjugent pas des performances futures</strong>.</li>
                  <li>Les simulations, allocations type et taux moyens sont <strong>indicatifs</strong> et <strong>non garantis</strong>.</li>
                </ul>
              </div>
            </section>

            <section id="responsabilite" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Responsabilité & utilisation du site</h2>
              <div className="prose prose-slate leading-relaxed space-y-3 text-slate-700">
                <ul className="space-y-2">
                  <li>Investy fournit des contenus <strong>généraux</strong> susceptibles d'être incomplets ou simplifiés.</li>
                  <li>Malgré le soin apporté, des <strong>erreurs</strong> ou <strong>omissions</strong> peuvent subsister.</li>
                  <li>Investy ne peut être tenu responsable des <strong>décisions</strong> prises à partir des informations présentées.</li>
                  <li>Le site peut évoluer, être interrompu ou mis à jour <strong>sans préavis</strong>.</li>
                </ul>
              </div>
            </section>

            <section id="donnees-personnelles" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Données personnelles</h2>
              <div className="prose prose-slate leading-relaxed space-y-3 text-slate-700">
                <ul className="space-y-2">
                  <li>Dans le cadre du MVP, nous pouvons collecter un <strong>email</strong> (et éventuellement un profil agrégé).</li>
                  <li>Base légale : <strong>intérêt légitime</strong> (tests MVP) ou <strong>consentement</strong> (newsletter éducative).</li>
                  <li>Finalités : envoi d'emails <strong>pédagogiques</strong> (plan en 4 semaines), amélioration du produit.</li>
                  <li>Conservation : durée limitée au <strong>test MVP</strong>, puis <strong>suppression</strong> ou <strong>anonymisation</strong>.</li>
                  <li>Droits : accès, rectification, effacement, opposition.</li>
                  <li>Exercice des droits : contactez-nous (voir section Contact).</li>
                  <li>Nous n'extrayons aucune donnée <strong>sensible</strong>.</li>
                </ul>
              </div>
            </section>

            <section id="emails" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Emails & désinscription</h2>
              <div className="prose prose-slate leading-relaxed space-y-3 text-slate-700">
                <ul className="space-y-2">
                  <li>Vous pouvez vous <strong>désinscrire à tout moment</strong> via le lien en pied d'email (si implémenté) ou en demandant la suppression par email (voir Contact).</li>
                  <li>Nous évitons tout <strong>spam</strong> : uniquement des emails pédagogiques liés à Investy.</li>
                </ul>
              </div>
            </section>

            <section id="cookies" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Cookies & mesure d'audience</h2>
              <div className="prose prose-slate leading-relaxed space-y-3 text-slate-700">
                <ul className="space-y-2">
                  <li>Bandeau cookies affiché au premier accès.</li>
                  <li><strong>Deux choix</strong> : <em>Accepter</em> ou <em>Refuser</em>.</li>
                  <li>Cookies techniques nécessaires au fonctionnement ; mesure d'audience <strong>basique</strong> potentielle (anonyme) — pas de profilage individualisé.</li>
                  <li>Vous pouvez changer d'avis en <strong>supprimant</strong> <code className="px-2 py-1 bg-slate-100 rounded text-sm">investy_cookie_consent</code> dans votre navigateur.</li>
                </ul>
              </div>
            </section>

            <section id="propriete" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Propriété intellectuelle</h2>
              <div className="prose prose-slate leading-relaxed space-y-3 text-slate-700">
                <ul className="space-y-2">
                  <li>Les contenus (textes, visuels, code) du site Investy sont protégés.</li>
                  <li>Toute reproduction ou réutilisation nécessite <strong>autorisation préalable</strong>.</li>
                </ul>
              </div>
            </section>

            <section id="contact" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Contact</h2>
              <div className="prose prose-slate leading-relaxed text-slate-700">
                <p>Email de contact : <strong className="text-slate-900">contact@investy.example</strong> (placeholder — à adapter).</p>
                <p>Toute demande relative aux <strong>données</strong> ou aux <strong>emails</strong> peut être adressée ici.</p>
              </div>
            </section>

            <section id="juridiction" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Juridiction & droit applicable</h2>
              <div className="prose prose-slate leading-relaxed space-y-3 text-slate-700">
                <ul className="space-y-2">
                  <li>Droit applicable : <strong>droit français</strong>.</li>
                  <li>Compétence : tribunaux du <strong>ressort du siège</strong> (à préciser si besoin).</li>
                  <li>En cas de litige, une tentative de <strong>résolution amiable</strong> sera privilégiée.</li>
                </ul>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}