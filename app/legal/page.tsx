"use client";

import Link from "next/link";
import { Mail, Shield, Building2, Globe } from "lucide-react";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F4F7FF] via-white to-[#E8EDFF] px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">
          <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "radial-gradient(600px at 20% 20%, rgba(255,255,255,0.7), transparent 55%), radial-gradient(480px at 80% 60%, rgba(255,255,255,0.5), transparent 60%)" }} />
          <div className="relative space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/60 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">Mentions légales</span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Invsty — Mentions légales</h1>
            <p className="text-slate-600 max-w-2xl">Informations réglementaires et contacts officiels pour la plateforme Invsty.</p>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] p-6 md:p-8">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-5 h-5 text-[#4F63FF]" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Éditeur</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Invsty — Plateforme d’éducation financière.<br />
                  Contact : <Link href="mailto:hello@invsty.app" className="text-[#4F63FF] hover:underline">hello@invsty.app</Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-[#4F63FF]" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">Responsable de publication</h3>
                <p className="text-slate-600 text-sm">Équipe Invsty.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] p-6 md:p-8">
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-5 h-5 text-[#4F63FF]" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Hébergement</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Vercel Inc.<br />
                  440 N Barranca Ave #4133, Covina, CA 91723, USA.
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Les données sont hébergées dans des datacenters conformes aux standards de sécurité en vigueur.
            </p>
          </section>

          <section className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] p-6 md:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#4F63FF]" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Données personnelles</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Invsty collecte le minimum de données nécessaires pour offrir le service (email, réponses au quiz, préférences). Conformément au RGPD, vous pouvez exercer vos droits d’accès, de rectification et de suppression en écrivant à <Link href="mailto:hello@invsty.app" className="text-[#4F63FF] hover:underline">hello@invsty.app</Link>.
                </p>
              </div>
            </div>
            <p className="text-slate-500 text-xs">
              Invsty n’est pas un conseiller financier réglementé. Les informations fournies sont à vocation pédagogique et ne constituent pas une recommandation personnalisée.
            </p>
          </section>

          <section className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Contact direct</h2>
            <p className="text-slate-600 text-sm mb-4">
              Pour toute question ou signalement, écrivez-nous.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/60 border border-white/70 text-sm font-semibold text-slate-900 shadow-sm hover:-translate-y-0.5 transition-all"
            >
              <Mail className="w-4 h-4" />
              Page contact
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

