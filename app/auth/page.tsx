import Link from "next/link";
import AuthEmailCard from "@/components/AuthEmailCard";
import { Check, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Connexion / Création de compte | Investy",
  description: "Connectez-vous ou créez votre compte pour suivre vos actifs.",
};

const planMeta: Record<string, { name: string; perks: string[]; color: string }> = {
  free: {
    name: "Gratuit",
    perks: ["1 actif suivi", "Mise à jour quotidienne", "Recommandations éducatives"],
    color: "bg-slate-900",
  },
  standard: {
    name: "Standard",
    perks: ["10 actifs suivis", "Mises à jour quotidiennes", "Alertes basiques"],
    color: "bg-blue-600",
  },
  pro: {
    name: "Pro",
    perks: ["Actifs illimités", "Mises à jour intrajournalières", "Alertes intelligentes"],
    color: "bg-amber-500",
  },
};

export default function AuthPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const planParam = searchParams?.plan;
  const plan = (Array.isArray(planParam) ? planParam[0] : planParam) || "free";
  const meta = planMeta[plan.toLowerCase()] ?? planMeta.free;

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-2 items-start">
        {/* Left: Plan summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Link href="/suivi-actifs" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux plans
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <div className={`h-9 w-9 rounded-lg ${meta.color} text-white inline-flex items-center justify-center font-semibold`}>
              {meta.name[0]}
            </div>
            <div>
              <div className="text-sm text-slate-500">Vous avez choisi</div>
              <div className="text-lg font-semibold text-slate-900">Plan {meta.name}</div>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {meta.perks.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Check className="h-3.5 w-3.5" aria-hidden={true} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">Vous pourrez changer de plan plus tard.</p>
        </div>

        {/* Right: Auth */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Connexion ou création de compte</h1>
            <p className="mt-1 text-sm text-slate-600">Recevez un lien sécurisé par email. Pas de mot de passe requis.</p>
            <div className="mt-4">
              <AuthEmailCard planCode={plan.toLowerCase()} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-600">
              En vous connectant, vous acceptez nos <Link href="/legal" className="underline hover:text-slate-900">conditions</Link> et notre <Link href="/legal" className="underline hover:text-slate-900">politique de confidentialité</Link>.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


