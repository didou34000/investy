"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, Sparkles, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Choisis au moins 8 caractères.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("done");
    setTimeout(() => router.push("/dashboard"), 800);
  };

  const strength =
    password.length >= 12
      ? { label: "Fort", color: "text-emerald-600", bar: "bg-emerald-500 w-full" }
      : password.length >= 10
      ? { label: "Correct", color: "text-amber-600", bar: "bg-amber-500 w-2/3" }
      : password.length >= 6
      ? { label: "Faible", color: "text-red-600", bar: "bg-red-500 w-1/3" }
      : { label: "Très court", color: "text-slate-400", bar: "bg-slate-300 w-1/5" };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#E8EDFF]/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#DDE6FF]/45 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(600px at 20% 30%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(520px at 80% 70%, rgba(255,255,255,0.25), transparent 50%)",
          }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_16px_50px_rgba(0,0,0,0.08)] space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F63FF]/10 to-[#6A5DFF]/10">
              <Sparkles className="w-7 h-7 text-[#4F63FF]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Définir un nouveau mot de passe</h1>
            <p className="text-slate-500 text-sm">Le lien reçu par email ouvre cette page sécurisée.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
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
                  className="w-full pl-12 pr-12 py-3.5 text-base text-gray-900 bg-white/60 backdrop-blur-md border border-black/[0.08] rounded-xl placeholder:text-gray-400 transition-all duration-200 hover:border-black/[0.12] focus:outline-none focus:border-[#4F63FF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,99,255,0.12)]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.bar}`} />
                </div>
                <p className={`text-xs font-semibold ${strength.color}`}>{strength.label}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 text-base text-gray-900 bg-white/60 backdrop-blur-md border border-black/[0.08] rounded-xl placeholder:text-gray-400 transition-all duration-200 hover:border-black/[0.12] focus:outline-none focus:border-[#4F63FF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,99,255,0.12)]"
                  placeholder="Retape ton mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20">
                <p className="text-sm text-[#FF3B30]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading" || status === "done"}
              className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-900 bg-white/35 border border-white/50 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:bg-white/60 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-250"
            >
              {status === "loading" ? "Mise à jour..." : status === "done" ? "Mis à jour" : "Enregistrer"}
            </button>
          </form>

          {status === "done" && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              Mot de passe mis à jour. Redirection...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

