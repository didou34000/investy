import React from "react";
import { ArrowRight, BookOpen, Gauge, PieChart, Rocket } from "lucide-react";

const steps = [
  { title: "Optimiser ton allocation", desc: "Ajuste les pourcentages actions/obligations/crypto selon ton horizon.", icon: PieChart, href: "/quiz" },
  { title: "Comprendre ton profil", desc: "Revois tes réponses clés et la logique de scoring.", icon: Gauge, href: "/result" },
  { title: "Construire ton portefeuille", desc: "Sélectionne les ETF/Actions adaptés à ton support PEA/CTO.", icon: BookOpen, href: "/dashboard" },
  { title: "Lancer une simulation avancée", desc: "Projette plusieurs scénarios avec volatilité et versements.", icon: Rocket, href: "/result" },
];

export function NextStepsCard() {
  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Guidance</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Next steps</h2>
          <p className="text-sm text-slate-600">Roadmap rapide pour poursuivre ton pilotage financier.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <a
              key={step.title}
              href={step.href}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white transition shadow-sm p-4 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="text-xs text-slate-600">{step.desc}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-semibold">
                  Explorer <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
