"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Investy</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              La première plateforme qui suit le marché pour vous. Découvrez votre profil investisseur, 
              obtenez une répartition adaptée et recevez des explications claires quand l'économie bouge.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">Accueil</Link></li>
              <li><Link href="/quiz" className="text-slate-600 hover:text-blue-600 transition-colors">Quiz de profil</Link></li>
              <li><Link href="/actu" className="text-slate-600 hover:text-blue-600 transition-colors">Actualités</Link></li>
              <li><Link href="/legal" className="text-slate-600 hover:text-blue-600 transition-colors">Mentions légales</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Légal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal" className="text-slate-600 hover:text-blue-600 transition-colors">Mentions légales</Link></li>
              <li><Link href="/legal#privacy" className="text-slate-600 hover:text-blue-600 transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/legal#cookies" className="text-slate-600 hover:text-blue-600 transition-colors">Cookies</Link></li>
              <li><Link href="/legal#contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/60 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              © 2024 Investy. Tous droits réservés.
            </div>
            
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>MVP éducatif — non-conseil financier</span>
            <span aria-hidden>·</span>
            <span>Aucune recommandation d'achat/vente</span>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


