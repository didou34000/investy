"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";

const footerLinks = {
  navigation: [
    { label: "Quiz", href: "/quiz" },
    { label: "Analyses", href: "/analyses" },
    { label: "Actu", href: "/actu" },
  ],
  legal: [
    { label: "Mentions légales", href: "/legal" },
    { label: "Confidentialité", href: "/legal#privacy" },
    { label: "Cookies", href: "/legal#cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-100 bg-[#F8FAFF] shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      {/* Soft ambient lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-slate-200/50 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6 relative">
        {/* Glow line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent animate-glow" />

        {/* Top row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Invsty"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg border border-slate-100 bg-white shadow-sm"
            />
            <div>
              <div className="text-base font-semibold text-slate-900 leading-tight">Invsty</div>
              <p className="text-xs text-slate-500">L'investissement expliqué simplement.</p>
            </div>
          </Link>
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/60 hover:-translate-y-0.5 active:translate-y-0 transition-all backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            Faire le quiz
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between text-sm text-slate-600">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {footerLinks.navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative pb-0.5 transition-colors hover:text-slate-900 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:origin-left after:bg-slate-900 after:transition-transform after:duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative pb-0.5 transition-colors hover:text-slate-900 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:origin-left after:bg-slate-900 after:transition-transform after:duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="flex items-center gap-1.5 hover:text-slate-900 transition-all">
              <Mail className="h-4 w-4 text-slate-400" />
              Contact
            </Link>
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Invsty</span>
            <span className="text-slate-300">•</span>
            <span>Construire un plan clair, sans blabla.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">FR</span>
            <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">RGPD</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
