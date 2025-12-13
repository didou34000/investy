import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Politique de confidentialité</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Collecte des données</h2>
            <p className="text-slate-600 leading-relaxed">
              Nous collectons uniquement les données strictement nécessaires au fonctionnement du service :
            </p>
            <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
              <li>Adresse email (si création de compte)</li>
              <li>Réponses au quiz d'investissement</li>
              <li>Données de navigation anonymisées</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Utilisation des données</h2>
            <p className="text-slate-600 leading-relaxed">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
              <li>Générer votre profil d'investisseur personnalisé</li>
              <li>Sauvegarder vos résultats (si compte créé)</li>
              <li>Améliorer le service</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              <strong>Nous ne vendons jamais vos données à des tiers.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Stockage et sécurité</h2>
            <p className="text-slate-600 leading-relaxed">
              Vos données sont stockées de manière sécurisée via Supabase, 
              une plateforme conforme aux standards de sécurité modernes. 
              Les communications sont chiffrées via HTTPS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              Nous utilisons des cookies essentiels au fonctionnement du site 
              (authentification, préférences). Des cookies analytiques peuvent 
              être utilisés pour comprendre l&apos;usage du site, avec votre consentement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Vos droits</h2>
            <p className="text-slate-600 leading-relaxed">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@invsty.app" className="text-indigo-600 hover:underline">
                contact@invsty.app
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Conservation des données</h2>
            <p className="text-slate-600 leading-relaxed">
              Les données de compte sont conservées tant que le compte est actif. 
              Les données anonymisées peuvent être conservées à des fins statistiques.
              Vous pouvez demander la suppression de votre compte à tout moment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              Pour toute question concernant cette politique de confidentialité :{" "}
              <a href="mailto:contact@invsty.app" className="text-indigo-600 hover:underline">
                contact@invsty.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
