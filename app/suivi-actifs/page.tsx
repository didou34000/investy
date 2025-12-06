import Link from "next/link";
import StartFreeButton from "@/components/StartFreeButton";
import {
  Check,
  Star,
  Zap,
  Crown,
  Calendar,
  BookOpen,
  Bell,
  Activity,
  Infinity,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Suivi d'actifs | Invsty",
  description:
    "Suivez vos actifs préférés avec des recommandations éducatives. Gratuit: 1 actif suivi, mise à jour quotidienne.",
};

const features = {
  free: [
    { icon: Star, text: "1 actif suivi" },
    { icon: Calendar, text: "Mise à jour quotidienne" },
    { icon: BookOpen, text: "Recommandations éducatives" },
  ],
  standard: [
    { icon: Star, text: "10 actifs suivis" },
    { icon: Calendar, text: "Mises à jour quotidiennes" },
    { icon: Bell, text: "Alertes basiques" },
    { icon: BookOpen, text: "Reco. pédagogiques enrichies" },
  ],
  pro: [
    { icon: Infinity, text: "Actifs illimités" },
    { icon: Activity, text: "Mises à jour intrajournalières" },
    { icon: Bell, text: "Alertes intelligentes" },
    { icon: Sparkles, text: "Insights Premium" },
  ],
} as const;

function FeatureItem({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-700">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600 ring-1 ring-blue-100">
        <Icon className="h-3.5 w-3.5" aria-hidden={true} />
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function SuiviActifsPage() {
  return (
    <main className="relative">
      {/* Decorative gradient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-[420px] max-w-6xl blur-3xl" style={{
          background:
            "radial-gradient(600px 200px at 20% 20%, rgba(37,99,235,0.10), transparent 60%), radial-gradient(600px 240px at 80% 10%, rgba(14,165,233,0.10), transparent 60%)",
        }} />
      </div>

      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
          <Zap className="h-3.5 w-3.5" /> Nouveau
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          Suivez vos actifs préférés
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
          Des insights clairs, des explications pédagogiques et des alertes adaptées à votre niveau.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Free */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg">
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-white" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Star className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Gratuit</h3>
            </div>
            <p className="mt-1 text-sm text-slate-600">Idéal pour découvrir</p>
            <div className="mt-4 text-4xl font-bold">0€<span className="text-base font-normal text-slate-500">/mois</span></div>
            <ul className="mt-5 space-y-2">
              {features.free.map((f) => (
                <FeatureItem key={f.text} icon={f.icon}>{f.text}</FeatureItem>
              ))}
            </ul>
            <StartFreeButton />
          </div>

          {/* Standard (featured) */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-6 shadow-sm ring-1 ring-blue-100 transition hover:shadow-xl">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-blue-100 to-white" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Standard</h3>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">Populaire</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">Le meilleur équilibre</p>
            <div className="mt-4 text-4xl font-bold">9€<span className="text-base font-normal text-slate-500">/mois</span></div>
            <ul className="mt-5 space-y-2">
              {features.standard.map((f) => (
                <FeatureItem key={f.text} icon={f.icon}>{f.text}</FeatureItem>
              ))}
            </ul>
            <Link
              href="/auth?plan=standard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Essayer Standard
            </Link>
          </div>

          {/* Pro */}
          <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-6 transition hover:shadow-lg">
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 to-white" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                <Crown className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Pro</h3>
            </div>
            <p className="mt-1 text-sm text-slate-600">Pour les utilisateurs exigeants</p>
            <div className="mt-4 text-4xl font-bold">19€<span className="text-base font-normal text-slate-500">/mois</span></div>
            <ul className="mt-5 space-y-2">
              {features.pro.map((f) => (
                <FeatureItem key={f.text} icon={f.icon}>{f.text}</FeatureItem>
              ))}
            </ul>
            <Link
              href="/auth?plan=pro"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
            >
              Passer en Pro
            </Link>
          </div>
        </div>

        {/* Add-on section */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2 items-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Comment ça marche ?</h2>
            <ol className="mt-4 space-y-3 text-slate-700 text-sm">
              <li>1. Choisissez vos actifs préférés (actions, crypto, indices...).</li>
              <li>2. Recevez des synthèses pédagogiques adaptées à votre plan.</li>
              <li>3. Activez des alertes et suivez l'évolution dans le temps.</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Pourquoi le suivi éducatif ?</h2>
            <p className="mt-4 text-slate-700 text-sm">
              Comprendre avant d'agir. Nos mises à jour visent à expliquer les mouvements de
              marché avec clarté, pour progresser sereinement dans la durée.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


