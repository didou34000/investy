"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = {
  product: [
    { href: "/quiz", label: "Faire le quiz" },
    { href: "/result", label: "Voir un exemple" },
  ],
  support: [
    { href: "/contact", label: "Nous contacter" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/confidentialite", label: "Confidentialité" },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  
  // Don't show footer on quiz, result, dashboard, auth pages
  const hideOnPages = ["/quiz", "/result", "/dashboard", "/auth"];
  if (hideOnPages.some(p => pathname?.startsWith(p))) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-slate-900 text-lg mb-4">
              <img src="/logo.png" alt="Invsty" className="w-7 h-7 object-contain" />
              <span>Invsty</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Ton plan d'investissement personnalisé, clair et adapté à ton profil.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Produit</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">
              © {currentYear} Invsty. Tous droits réservés.
            </p>
            <p className="text-xs text-slate-400 text-center sm:text-right max-w-md">
              Invsty ne fournit pas de conseil en investissement personnalisé. 
              Les informations présentées sont à titre indicatif uniquement.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
