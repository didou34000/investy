"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Status = "idle" | "loading" | "error";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur de connexion");
      setStatus("error");
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">i</span>
            </div>
            <span className="text-2xl font-bold text-[#1C1C1E]">invsty</span>
          </div>
          <p className="text-[#6B7280] text-sm">Connecte-toi à ton espace investissement</p>
        </div>

        {/* Card */}
        <div className="bg-white/72 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <h1 className="text-xl font-semibold text-[#1C1C1E] mb-6">Connexion</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              disabled={status === "loading"}
              className="w-full bg-[#007AFF] hover:bg-[#0066DD] disabled:opacity-50 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition shadow-[0_4px_14px_rgba(0,122,255,0.3)]"
            >
              {status === "loading" ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.06)] text-center">
            <p className="text-[#6B7280] text-sm">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-[#007AFF] hover:text-[#0066DD] font-medium transition">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
