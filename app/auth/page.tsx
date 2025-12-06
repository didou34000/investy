"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Mail, ArrowRight, Check, Sparkles, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Status = "idle" | "loading" | "sent" | "error";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const hasAccessToken = hash.includes("access_token=");

    if (hasAccessToken) {
      window.location.href = `/${hash}`;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#E8EDFF]/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#DDE6FF]/45 rounded-full blur-3xl" />
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "radial-gradient(600px at 20% 30%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(520px at 80% 70%, rgba(255,255,255,0.25), transparent 50%)" }} />
      </div>

      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_16px_50px_rgba(0,0,0,0.08)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#007AFF]/10 to-[#5856D6]/10 mb-4">
              <Sparkles className="w-7 h-7 text-[#007AFF]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Connexion à Invsty
            </h1>
            <p className="text-gray-500 mt-2">
              Email + mot de passe pour accéder à ton espace
            </p>
          </div>

          {status === "sent" ? (
            /* Success State */
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#34C759]/10 mb-4">
                <Check className="w-8 h-8 text-[#34C759]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Email envoyé !
              </h2>
              <p className="text-gray-500 mb-6">
                Un lien de connexion a été envoyé à<br />
                <span className="font-medium text-gray-700">{email}</span>
              </p>
              <div className="p-4 rounded-2xl bg-[#007AFF]/5 border border-[#007AFF]/10">
                <p className="text-sm text-[#007AFF]">
                  📩 Vérifie ta boîte mail et clique sur le lien pour te connecter.
                </p>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "w-full pl-12 pr-4 py-3.5",
                      "text-base text-gray-900",
                      "bg-white/60 backdrop-blur-md",
                      "border border-black/[0.08] rounded-xl",
                      "placeholder:text-gray-400",
                      "transition-all duration-200",
                      "hover:border-black/[0.12]",
                      "focus:outline-none focus:border-[#007AFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
                    )}
                    placeholder="toi@exemple.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "w-full pl-12 pr-12 py-3.5",
                      "text-base text-gray-900",
                      "bg-white/60 backdrop-blur-md",
                      "border border-black/[0.08] rounded-xl",
                      "placeholder:text-gray-400",
                      "transition-all duration-200",
                      "hover:border-black/[0.12]",
                      "focus:outline-none focus:border-[#007AFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
                    )}
                    placeholder="Ton mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-right">
                  <Link href="/auth/reset" className="text-xs text-[#007AFF] hover:text-[#0066D6] font-medium">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20">
                  <p className="text-sm text-[#FF3B30]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className={cn(
                  "group w-full flex items-center justify-center gap-2",
                  "px-6 py-3.5 rounded-xl",
                  "text-base font-semibold text-slate-900",
                  "bg-white/35 border border-white/50 backdrop-blur-md",
                  "shadow-[0_12px_30px_rgba(0,0,0,0.08)]",
                  "hover:bg-white/60 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]",
                  "active:scale-[0.99]",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                  "transition-all duration-250"
                )}
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Recevoir le lien magique</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-black/[0.06] text-center">
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <Link href="/quiz" className="text-[#007AFF] hover:text-[#0066D6] font-medium">
                Faire le quiz
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            🔒 Connexion sécurisée · Chiffrement Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
