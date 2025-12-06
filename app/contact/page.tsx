"use client";

import Link from "next/link";
import { Mail, MessageSquare, Phone, Send, Sparkles } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F4F7FF] via-white to-[#E8EDFF] px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">
          <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "radial-gradient(520px at 20% 30%, rgba(255,255,255,0.65), transparent 50%), radial-gradient(540px at 80% 70%, rgba(255,255,255,0.4), transparent 55%)" }} />
          <div className="relative space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/60 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">Contact</span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Parlons-en</h1>
            <p className="text-slate-600 max-w-2xl">Une question, un bug, un retour produit ou une demande pro ? Écris-nous, on répond rapidement.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-white/60 bg-white/85 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] p-6 md:p-7 space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#4F63FF]" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Email direct</h2>
                <p className="text-slate-600 text-sm">hello@invsty.app</p>
                <Link href="mailto:hello@invsty.app" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F63FF] hover:underline mt-2">
                  Envoyer un email
                  <Send className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/60 bg-white/85 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] p-6 md:p-7 space-y-3">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-[#4F63FF]" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Support produit</h2>
                <p className="text-slate-600 text-sm">Feedback, bug, idée : décris-nous ton besoin.</p>
                <Link href="/quiz" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F63FF] hover:underline mt-2">
                  Retourner au quiz
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/60 bg-white/85 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] p-6 md:p-7 space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#4F63FF]" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Partenariats</h2>
                <p className="text-slate-600 text-sm">Média, école, entreprise ? Parlons collaboration.</p>
                <Link href="mailto:hello@invsty.app?subject=Partenariat%20Invsty" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F63FF] hover:underline mt-2">
                  Proposer un partenariat
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/60 bg-white/85 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.05)] p-6 md:p-7 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#4F63FF]" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">RGPD / données</h2>
                <p className="text-slate-600 text-sm">Accès, rectification ou suppression de données.</p>
                <Link href="mailto:hello@invsty.app?subject=RGPD%20Invsty" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F63FF] hover:underline mt-2">
                  Demander via email
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

