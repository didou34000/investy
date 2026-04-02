"use client";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

// Ce composant est remplacé par le système auth cookie
// Il redirige simplement vers /signup
export default function AuthEmailCard({ onSuccess, planCode = "free" }: { onSuccess?: () => void; planCode?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-center">
      <div className="w-12 h-12 bg-[#F5F7FA] rounded-2xl flex items-center justify-center mx-auto">
        <Mail className="w-6 h-6 text-slate-500" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Créer un compte</h3>
        <p className="text-sm text-slate-500">Rejoins invsty pour accéder à ton plan personnalisé.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Link href="/signup" className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
          Créer un compte <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/auth" className="w-full py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
