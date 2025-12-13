import React from "react";
import Link from "next/link";
import { ArrowRight, LogOut, Mail, Settings2, Wand2 } from "lucide-react";

type Props = {
  email?: string | null;
  onSignOut?: () => Promise<void> | void;
};

export function QuickActions({ email, onSignOut }: Props) {
  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Paramètres rapides</p>
          <h2 className="text-xl font-semibold text-slate-900">Actions immédiates</h2>
        </div>
        {email && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs text-slate-700">
            <Mail className="w-4 h-4" />
            {email}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/profile"
          className="rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white transition p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">Modifier profil</p>
            <p className="text-xs text-slate-600">Mets à jour tes infos et préférences.</p>
          </div>
          <Wand2 className="w-5 h-5 text-indigo-500" />
        </Link>
        <Link
          href="/quiz"
          className="rounded-2xl border border-indigo-100 bg-indigo-50/80 hover:bg-indigo-50 transition p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">Refaire le quiz</p>
            <p className="text-xs text-slate-600">Actualise ton profil et tes allocations.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-600" />
        </Link>
        <Link
          href="/settings"
          className="rounded-2xl border border-slate-100 bg-white hover:shadow-md transition p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">Paramètres</p>
            <p className="text-xs text-slate-600">Sécurité, notifications, préférences.</p>
          </div>
          <Settings2 className="w-5 h-5 text-slate-600" />
        </Link>
        <button
          onClick={onSignOut}
          className="rounded-2xl border border-red-100 bg-rose-50/80 hover:bg-rose-50 transition p-4 flex items-center justify-between text-left"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">Déconnexion</p>
            <p className="text-xs text-slate-600">Sécurise ta session.</p>
          </div>
          <LogOut className="w-5 h-5 text-rose-500" />
        </button>
      </div>
    </section>
  );
}

