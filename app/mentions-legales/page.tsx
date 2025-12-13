import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegalesPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mentions légales</h1>
        
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Éditeur du site</h2>
            <p className="text-slate-600 leading-relaxed">
              Le site Invsty est édité par une personne physique à titre personnel.<br />
              Email de contact : <a href="mailto:contact@invsty.app" className="text-indigo-600 hover:underline">contact@invsty.app</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Hébergement</h2>
            <p className="text-slate-600 leading-relaxed">
              Le site est hébergé par Vercel Inc.<br />
              Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Propriété intellectuelle</h2>
            <p className="text-slate-600 leading-relaxed">
              L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes) 
              est la propriété exclusive de l&apos;éditeur, sauf mention contraire. 
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Limitation de responsabilité</h2>
            <p className="text-slate-600 leading-relaxed">
              Les informations présentes sur ce site sont fournies à titre indicatif 
              et ne constituent en aucun cas un conseil en investissement personnalisé. 
              L&apos;éditeur ne saurait être tenu responsable des décisions d&apos;investissement 
              prises sur la base des informations présentées sur ce site.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              <strong>Important :</strong> Les performances passées ne préjugent pas des 
              performances futures. Tout investissement comporte des risques de perte en capital.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Données personnelles</h2>
            <p className="text-slate-600 leading-relaxed">
              Pour en savoir plus sur la collecte et le traitement de vos données personnelles, 
              veuillez consulter notre{" "}
              <Link href="/confidentialite" className="text-indigo-600 hover:underline">
                Politique de confidentialité
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
