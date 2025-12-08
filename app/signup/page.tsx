"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthConfig = {
    faible: { label: "Faible", color: "text-red-500", bar: "bg-red-400", width: "w-1/3" },
    correct: { label: "Correct", color: "text-amber-500", bar: "bg-amber-400", width: "w-2/3" },
    fort: { label: "Fort", color: "text-emerald-500", bar: "bg-emerald-500", width: "w-full" },
    none: { label: "", color: "text-slate-400", bar: "bg-slate-200", width: "w-0" },
  } as const;

  const passwordStrength =
    passwordScore >= 4 ? strengthConfig.fort :
    passwordScore >= 3 ? strengthConfig.correct :
    password.length > 0 ? strengthConfig.faible :
    strengthConfig.none;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }
    if (passwordScore < 3) {
      setError("Mot de passe trop faible. Ajoute longueur, chiffre et symbole.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Si le compte est créé mais sans session (email à confirmer)
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("Compte créé. Vérifie ton email pour confirmer et te connecter.");
      setLoading(false);
      return;
    }

    await fetch("/api/create-profile", { method: "POST" });
    router.push("/signup/success");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#E8EDFF]/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#DDE6FF]/45 rounded-full blur-3xl" />
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "radial-gradient(600px at 20% 30%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(520px at 80% 70%, rgba(255,255,255,0.25), transparent 50%)" }} />
      </div>

      <div className="w-full max-w-md">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_16px_50px_rgba(0,0,0,0.08)] space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F63FF]/10 to-[#6A5DFF]/10">
              <CheckCircle2 className="w-7 h-7 text-[#4F63FF]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
            <p className="text-slate-500 text-sm">Email + mot de passe pour accéder à Invsty.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Adresse email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base text-gray-900 bg-white/60 backdrop-blur-md border border-black/[0.08] rounded-xl placeholder:text-gray-400 transition-all duration-200 hover:border-black/[0.12] focus:outline-none focus:border-[#4F63FF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,99,255,0.12)]"
                  placeholder="toi@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
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
                  placeholder="Minimum 6 caractères"
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
              {password.length > 0 && (
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.bar} ${passwordStrength.width} transition-[width,background-color] duration-400 ease-out`}
                    />
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="uppercase tracking-wide text-[11px] text-gray-500">Sécurité</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/60 border border-white/70 ${passwordStrength.color.replace("text-", "text-")}`}
                    >
                      {passwordStrength.label}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Ajoute longueur, majuscules, chiffres, symboles pour renforcer.
                    </span>
                  </div>
                </div>
              )}
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
                  aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-900 bg-white/35 border border-white/50 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:bg-white/60 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-250"
            >
              {loading ? "Création..." : "Créer mon compte"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <a href="/auth" className="text-[#4F63FF] hover:text-[#384ee6] font-semibold">Se connecter</a>
          </div>
        </div>
      </div>
    </div>
  );
}

