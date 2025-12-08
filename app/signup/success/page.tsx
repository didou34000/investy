"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SignupSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-[#F4F7FF] via-white to-[#E8EDFF]">
      <div className="w-full max-w-md relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.08)] p-8 sm:p-10 space-y-5">
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "radial-gradient(520px at 20% 30%, rgba(255,255,255,0.65), transparent 50%), radial-gradient(540px at 80% 70%, rgba(255,255,255,0.4), transparent 55%)" }} />
        <div className="relative space-y-3 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F63FF]/10 to-[#6A5DFF]/10">
            <CheckCircle2 className="w-7 h-7 text-[#4F63FF]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Compte créé</h1>
          <p className="text-slate-600 text-sm">Ton profil Supabase est prêt. Tu peux accéder à l’app.</p>
        </div>
        <div className="relative flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#4F63FF] text-white font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.1)] hover:bg-[#3f52e6] transition-all"
          >
            Aller au dashboard
          </Link>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/70 border border-white/80 text-slate-900 font-semibold shadow-sm hover:-translate-y-0.5 transition-all"
          >
            Lancer le quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

