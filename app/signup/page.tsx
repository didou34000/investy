"use client";

import { useState, useMemo } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
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

  const strength =
    passwordScore >= 4 ? { label: "Fort", color: "text-[#34C759]", bar: "bg-[#34C759]", width: "w-full" } :
    passwordScore >= 3 ? { label: "Correct", color: "text-[#FF9500]", bar: "bg-[#FF9500]", width: "w-2/3" } :
    password.length > 0 ? { label: "Faible", color: "text-[#FF3B30]", bar: "bg-[#FF3B30]", width: "w-1/3" } :
    { label: "", color: "", bar: "bg-[#EFF3F8]", width: "w-0" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) return setError("Les mots de passe ne correspondent pas.");
    if (passwordScore < 3) return setError("Mot de passe trop faible. Ajoute des chiffres ou symboles.");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur lors de la création du compte");
      setLoading(false);
      return;
    }

    // Rediriger vers le quiz pour définir le profil
    window.location.href = "/quiz";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">i</span>
            </div>
            <span className="text-2xl font-bold text-[#1C1C1E]">invsty</span>
          </div>
          <p className="text-[#6B7280] text-sm">Crée ton profil investisseur en 2 minutes</p>
        </div>

        <div className="bg-white/72 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <h1 className="text-xl font-semibold text-[#1C1C1E] mb-6">Créer un compte</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom */}
            <div>
              <label className="text-sm text-[#3C3C43] mb-1.5 block font-medium">Prénom <span className="text-[#9CA3AF] font-normal">(optionnel)</span></label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ton prénom"
                  className="w-full bg-[#F5F7FA] border border-[rgba(0,0,0,0.06)] rounded-xl pl-10 pr-4 py-3 text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/10 transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-[#3C3C43] mb-1.5 block font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@email.com"
                  className="w-full bg-[#F5F7FA] border border-[rgba(0,0,0,0.06)] rounded-xl pl-10 pr-4 py-3 text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/10 transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-[#3C3C43] mb-1.5 block font-medium">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F5F7FA] border border-[rgba(0,0,0,0.06)] rounded-xl pl-10 pr-12 py-3 text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/10 transition text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-[#EFF3F8] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.bar} ${strength.width}`} />
                  </div>
                  <p className={`text-xs mt-1 ${strength.color}`}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="text-sm text-[#3C3C43] mb-1.5 block font-medium">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F5F7FA] border border-[rgba(0,0,0,0.06)] rounded-xl pl-10 pr-12 py-3 text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/10 transition text-sm"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007AFF] hover:bg-[#0066DD] disabled:opacity-50 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition shadow-[0_4px_14px_rgba(0,122,255,0.3)]"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Steps hint */}
          <div className="mt-6 p-4 bg-[#F5F7FA] rounded-xl">
            <p className="text-xs text-[#6B7280] font-medium mb-2">Ce qui t&apos;attend :</p>
            <div className="space-y-1.5">
              {["Création du compte", "Quiz investisseur (5 min)", "Ton plan personnalisé"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#007AFF] text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-xs text-[#3C3C43]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.06)] text-center">
            <p className="text-[#6B7280] text-sm">
              Déjà un compte ?{" "}
              <Link href="/auth" className="text-[#007AFF] hover:text-[#0066DD] font-medium transition">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
