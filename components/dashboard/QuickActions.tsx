import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Wand2 } from "lucide-react";
import { DashCard } from "./DashCard";

export function QuickActions() {
  return (
    <DashCard>
      <div className="p-5 flex flex-wrap gap-3">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 transition-all"
        >
          Modifier mon profil
          <Wand2 className="w-4 h-4" />
        </Link>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 transition-all"
        >
          Paramètres
          <Shield className="w-4 h-4" />
        </Link>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
        >
          Refaire le quiz
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </DashCard>
  );
}

