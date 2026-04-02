"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  Shield,
  LogOut,
  Target,
  Wallet,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BarChart3,
  Zap,
  Info,
  Landmark,
} from "lucide-react";
import { simulateInvestment } from "@/lib/simulate";

// ============================================
// TYPES
// ============================================

type AuthUser = { id: string; email: string; full_name?: string; plan?: string } | null;

type ResultRow = {
  id: string;
  score?: number | null;
  profile_code?: string | null;
  profile_label?: string | null;
  horizon?: string | null;
  expected_return?: number | null;
  created_date?: string | null;
  allocation?: string | null;
};

type Portfolio = {
  actions: number;
  etf: number;
  obligations: number;
  crypto: number;
  liquidites: number;
};

type TargetAllocation = {
  actions: number;
  obligations: number;
  liquidites: number;
  crypto: number;
};

type CoherenceStatus = "unknown" | "coherent" | "warning" | "misaligned";

// ============================================
// HELPERS
// ============================================

const getProfileLabel = (score: number) => {
  if (score <= 25) return "Prudent";
  if (score <= 45) return "Modéré";
  if (score <= 65) return "Équilibré";
  if (score <= 85) return "Dynamique";
  return "Offensif";
};

const getHorizonLabel = (score: number) => {
  if (score <= 25) return "3-5 ans";
  if (score <= 45) return "5-7 ans";
  if (score <= 65) return "7-10 ans";
  return "10+ ans";
};

const formatMoney = (n: number) => n.toLocaleString("fr-FR") + " €";

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const d = new Date(value);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const computeCoherence = (
  target: TargetAllocation,
  portfolio: Portfolio
): { status: CoherenceStatus; message: string; details: string[] } => {
  if (!portfolio || Object.values(portfolio).every((v) => v === 0)) {
    return {
      status: "unknown",
      message: "Cohérence non évaluée",
      details: ["Renseigne ton portefeuille actuel pour vérifier la cohérence avec ton plan."],
    };
  }
  const total =
    portfolio.actions + portfolio.etf + portfolio.obligations + portfolio.crypto + portfolio.liquidites;
  if (total === 0) {
    return { status: "unknown", message: "Portefeuille vide", details: ["Ajoute tes actifs pour commencer."] };
  }
  const current = {
    actions: Math.round(((portfolio.actions + portfolio.etf) / total) * 100),
    obligations: Math.round((portfolio.obligations / total) * 100),
    liquidites: Math.round((portfolio.liquidites / total) * 100),
    crypto: Math.round((portfolio.crypto / total) * 100),
  };
  const diffs = {
    actions: Math.abs(target.actions - current.actions),
    obligations: Math.abs(target.obligations - current.obligations),
    liquidites: Math.abs(target.liquidites - current.liquidites),
  };
  const maxDiff = Math.max(diffs.actions, diffs.obligations, diffs.liquidites);
  const details: string[] = [];
  if (diffs.actions > 10) details.push(`Actions/ETF : écart de ${diffs.actions}%`);
  if (diffs.obligations > 10) details.push(`Obligations : écart de ${diffs.obligations}%`);
  if (diffs.liquidites > 5) details.push(`Liquidités : écart de ${diffs.liquidites}%`);

  if (maxDiff <= 5) return { status: "coherent", message: "Portefeuille cohérent", details: ["Ton allocation correspond à ton plan. Aucun ajustement nécessaire."] };
  if (maxDiff <= 15) return { status: "warning", message: "Ajustements mineurs suggérés", details: details.length > 0 ? details : ["Quelques écarts, mais rien d'urgent."] };
  return { status: "misaligned", message: "Rééquilibrage recommandé", details: details.length > 0 ? details : ["Écarts significatifs avec ton plan."] };
};

const tabs = [
  { id: "overview", label: "Vue d'ensemble", icon: Target },
  { id: "portfolio", label: "Mon portefeuille", icon: Wallet },
  { id: "projection", label: "Projection", icon: TrendingUp },
  { id: "suggestions", label: "Titres conseillés", icon: Zap },
];

// ============================================
// MAIN
// ============================================

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [monthly, setMonthly] = useState(200);
  const [years, setYears] = useState(10);
  const [showDetails, setShowDetails] = useState(false);

  const [portfolio, setPortfolio] = useState<Portfolio>({
    actions: 0, etf: 0, obligations: 0, crypto: 0, liquidites: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("invsty_portfolio");
    if (saved) { try { setPortfolio(JSON.parse(saved)); } catch {} }
  }, []);

  const updatePortfolio = (key: keyof Portfolio, value: number) => {
    const newP = { ...portfolio, [key]: value };
    setPortfolio(newP);
    localStorage.setItem("invsty_portfolio", JSON.stringify(newP));
  };

  useEffect(() => {
    const load = async () => {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { setAuthed(false); setLoading(false); return; }
      const { user: u } = await meRes.json();
      if (!u) { setAuthed(false); setLoading(false); return; }
      setUser(u);
      setAuthed(true);

      // Charger les résultats quiz
      try {
        const res = await fetch("/api/quiz-results");
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  // Récupérer le résultat quiz depuis localStorage si pas de résultats en DB
  const [localResult, setLocalResult] = useState<any>(null);
  useEffect(() => {
    const stored = localStorage.getItem("invsty_result");
    if (stored) { try { setLocalResult(JSON.parse(stored)); } catch {} }
  }, []);

  const lastResult = results[0] ?? null;

  const data = useMemo(() => {
    // Priorité : résultats DB, sinon localStorage
    if (lastResult) {
      const alloc = (() => {
        try { return typeof lastResult.allocation === "string" ? JSON.parse(lastResult.allocation) : lastResult.allocation; }
        catch { return null; }
      })();
      const score = lastResult.score ?? lastResult.risk_index ?? 50;
      const actions = alloc ? Math.round((alloc.equities_core ?? 0) + (alloc.equities_tilts ?? 0)) : 55;
      const obligations = alloc ? Math.round(alloc.bonds ?? 0) : 30;
      const liquidites = alloc ? Math.round(alloc.cash ?? 0) : 15;
      const crypto = alloc ? Math.round(alloc.crypto ?? 0) : 0;
      return {
        score,
        profileLabel: lastResult.profile_label ?? getProfileLabel(score),
        horizon: lastResult.horizon ?? getHorizonLabel(score),
        expectedReturn: lastResult.expected_return ?? Math.min(3 + score * 0.12, 14),
        targetAllocation: { actions, obligations, liquidites, crypto },
        lastQuizDate: lastResult.created_date ?? null,
      };
    }
    if (localResult) {
      const alloc = localResult.allocation;
      const score = localResult.riskIndex ?? 50;
      const actions = alloc ? Math.round((alloc.equities_core ?? 0) + (alloc.equities_tilts ?? 0)) : 55;
      const obligations = alloc ? Math.round(alloc.bonds ?? 0) : 30;
      const liquidites = alloc ? Math.round(alloc.cash ?? 0) : 15;
      const crypto = alloc ? Math.round(alloc.crypto ?? 0) : 0;
      return {
        score,
        profileLabel: localResult.label ?? getProfileLabel(score),
        horizon: localResult.horizon ?? getHorizonLabel(score),
        expectedReturn: localResult.expectedReturn ?? Math.min(3 + score * 0.12, 14),
        targetAllocation: { actions, obligations, liquidites, crypto },
        lastQuizDate: null,
      };
    }
    return null;
  }, [lastResult, localResult]);

  const coherence = useMemo(() => {
    if (!data) return { status: "unknown" as CoherenceStatus, message: "", details: [] };
    return computeCoherence(data.targetAllocation, portfolio);
  }, [data, portfolio]);

  const portfolioTotal = portfolio.actions + portfolio.etf + portfolio.obligations + portfolio.crypto + portfolio.liquidites;

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth";
  };

  const greetingName = user?.full_name || user?.email?.split("@")[0] || "investisseur";

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Chargement...</p>
        </div>
      </main>
    );
  }

  if (authed === false) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Connexion requise</h1>
          <p className="text-slate-500 mb-6">Connecte-toi pour accéder à ton tableau de bord.</p>
          <Link href="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium">
            Se connecter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-indigo-100 flex items-center justify-center">
            <Target className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Bienvenue, {greetingName} !</h1>
          <p className="text-slate-500 mb-8">
            Pour activer ton tableau de bord, commence par définir ton profil d&apos;investisseur.
          </p>
          <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium">
            Faire le quiz <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="mt-4">
            <button onClick={handleSignOut} className="text-sm text-slate-400 hover:text-slate-600">
              Se déconnecter
            </button>
          </div>
        </div>
      </main>
    );
  }

  const expectedReturn = data.expectedReturn;

  const projection = simulateInvestment({
    montantInitial: 0,
    mensualite: monthly,
    horizonYears: years,
    tauxAnnuel: expectedReturn / 100,
    reinvest: true,
  });
  const invested = monthly * years * 12;
  const gains = projection.valeurFinale - invested;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Tableau de bord</h1>
              <p className="text-sm text-slate-500">Bonjour {greetingName} 👋</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/result"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Mon plan
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl text-sm">
            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-slate-600">
              Ce tableau de bord sert à <strong>suivre et ajuster</strong> ton plan dans le temps.
              Pour voir ton allocation recommandée,{" "}
              <Link href="/result" className="text-indigo-600 font-medium hover:underline">consulte ton plan</Link>.
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* ========== OVERVIEW ========== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Profile card */}
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <span className="text-xl font-bold">{data.score}</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{data.profileLabel}</div>
                  <div className="text-sm text-slate-500">Horizon {data.horizon}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Dernier quiz</div>
                <div className="text-sm font-medium text-slate-700">{formatDate(data.lastQuizDate) || "—"}</div>
              </div>
            </div>

            {/* Coherence */}
            <div className={`p-5 rounded-2xl border ${
              coherence.status === "coherent" ? "bg-emerald-50 border-emerald-200" :
              coherence.status === "warning" ? "bg-amber-50 border-amber-200" :
              coherence.status === "misaligned" ? "bg-red-50 border-red-200" :
              "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  coherence.status === "coherent" ? "bg-emerald-100" :
                  coherence.status === "warning" ? "bg-amber-100" :
                  coherence.status === "misaligned" ? "bg-red-100" :
                  "bg-slate-100"
                }`}>
                  {coherence.status === "coherent" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {coherence.status === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {coherence.status === "misaligned" && <XCircle className="w-5 h-5 text-red-600" />}
                  {coherence.status === "unknown" && <Target className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    coherence.status === "coherent" ? "text-emerald-900" :
                    coherence.status === "warning" ? "text-amber-900" :
                    coherence.status === "misaligned" ? "text-red-900" :
                    "text-slate-700"
                  }`}>{coherence.message}</h3>
                  <ul className="space-y-0.5">
                    {coherence.details.map((d, i) => (
                      <li key={i} className={`text-sm ${
                        coherence.status === "coherent" ? "text-emerald-700" :
                        coherence.status === "warning" ? "text-amber-700" :
                        coherence.status === "misaligned" ? "text-red-700" :
                        "text-slate-600"
                      }`}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {coherence.status === "unknown" && (
                <button
                  onClick={() => setActiveTab("portfolio")}
                  className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Renseigner mon portefeuille
                </button>
              )}
            </div>

            {/* Target allocation */}
            <div className="p-5 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Allocation cible</h3>
                <Link href="/result" className="text-sm text-indigo-600 font-medium hover:underline">Voir le détail →</Link>
              </div>
              <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
                <div className="bg-indigo-500" style={{ width: `${data.targetAllocation.actions}%` }} />
                <div className="bg-violet-500" style={{ width: `${data.targetAllocation.obligations}%` }} />
                <div className="bg-slate-400" style={{ width: `${data.targetAllocation.liquidites}%` }} />
                {data.targetAllocation.crypto > 0 && <div className="bg-cyan-500" style={{ width: `${data.targetAllocation.crypto}%` }} />}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><span className="text-slate-600">Actions {data.targetAllocation.actions}%</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-violet-500" /><span className="text-slate-600">Obligations {data.targetAllocation.obligations}%</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-400" /><span className="text-slate-600">Liquidités {data.targetAllocation.liquidites}%</span></div>
                {data.targetAllocation.crypto > 0 && <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-cyan-500" /><span className="text-slate-600">Crypto {data.targetAllocation.crypto}%</span></div>}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/quiz" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Refaire le quiz</div>
                  <div className="text-xs text-slate-500">Mettre à jour</div>
                </div>
              </Link>
              <Link href="/suivi-actifs" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Mes actifs</div>
                  <div className="text-xs text-slate-500">Suivi en direct</div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ========== PORTFOLIO ========== */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Mon portefeuille</h2>
              <p className="text-sm text-slate-500">Renseigne tes actifs pour évaluer la cohérence avec ton plan.</p>
            </div>
            {portfolioTotal > 0 && (
              <div className="p-5 bg-slate-900 rounded-2xl text-white">
                <div className="text-sm text-slate-400 mb-1">Total estimé</div>
                <div className="text-3xl font-bold">{formatMoney(portfolioTotal)}</div>
              </div>
            )}
            <div className="space-y-4">
              {(
                [
                  { key: "actions", label: "Actions", icon: TrendingUp, color: "indigo" },
                  { key: "etf", label: "ETF", icon: BarChart3, color: "blue" },
                  { key: "obligations", label: "Obligations", icon: Shield, color: "violet" },
                  { key: "crypto", label: "Crypto", icon: Zap, color: "cyan" },
                  { key: "liquidites", label: "Liquidités", icon: Wallet, color: "slate" },
                ] as const
              ).map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{formatMoney(portfolio[key])}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={500}
                    value={portfolio[key]}
                    onChange={(e) => updatePortfolio(key, Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== PROJECTION ========== */}
        {activeTab === "projection" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Projection indicative</h2>
              <p className="text-sm text-slate-500">Explore l&apos;évolution possible de ton épargne. Ces chiffres sont des ordres de grandeur.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Versement mensuel</label>
                  <span className="text-lg font-bold text-slate-900">{monthly} €</span>
                </div>
                <input type="range" min={50} max={1000} step={50} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Durée</label>
                  <span className="text-lg font-bold text-slate-900">{years} ans</span>
                </div>
                <input type="range" min={5} max={30} step={5} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-900 rounded-2xl text-white">
                <div className="text-sm text-slate-400 mb-1">Total versé</div>
                <div className="text-2xl font-bold">{formatMoney(invested)}</div>
                <div className="text-xs text-slate-500 mt-1">{monthly} € × {years * 12} mois</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <div className="text-sm text-slate-500 mb-1">Ordre de grandeur</div>
                <div className="text-2xl font-bold text-slate-900">~{formatMoney(Math.round(projection.valeurFinale / 1000) * 1000)}</div>
                <div className="text-xs text-emerald-600 mt-1">dont ~{formatMoney(Math.round(gains / 1000) * 1000)} d&apos;intérêts</div>
              </div>
            </div>
            <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-600 hover:text-slate-900 transition-colors">
              {showDetails ? <>Masquer <ChevronUp className="w-4 h-4" /></> : <>Voir les scénarios <ChevronDown className="w-4 h-4" /></>}
            </button>
            {showDetails && (
              <div className="p-5 bg-slate-50 rounded-2xl space-y-4">
                <h3 className="font-medium text-slate-900">Fourchette de scénarios</h3>
                {[
                  { label: "Prudent", rate: Math.max(1, expectedReturn - 3) },
                  { label: "Central", rate: expectedReturn },
                  { label: "Favorable", rate: expectedReturn + 2 },
                ].map((s) => {
                  const p = simulateInvestment({ montantInitial: 0, mensualite: monthly, horizonYears: years, tauxAnnuel: s.rate / 100, reinvest: true });
                  return (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{s.label}</span>
                      <span className={`font-medium ${s.label === "Central" ? "text-slate-900" : "text-slate-500"}`}>~{formatMoney(Math.round(p.valeurFinale / 1000) * 1000)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">Ces projections sont indicatives. Les performances passées ne préjugent pas de l&apos;avenir. Aucun rendement n&apos;est garanti.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========== SUGGESTIONS ========== */}
        {activeTab === "suggestions" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Titres conseillés</h2>
              <p className="text-sm text-slate-500">Sélection adaptée à ton profil {data.profileLabel}.</p>
            </div>
            {[
              { ticker: "IWDA", name: "iShares Core MSCI World ETF", type: "ETF", risk: "Modéré", color: "indigo" },
              { ticker: "VWCE", name: "Vanguard FTSE All-World ETF", type: "ETF", risk: "Modéré", color: "indigo" },
              { ticker: "AGGH", name: "iShares Core Global Aggregate Bond ETF", type: "Obligations", risk: "Faible", color: "violet" },
              { ticker: "XDEM", name: "Xtrackers MSCI World Momentum Factor ETF", type: "ETF thématique", risk: "Élevé", color: "amber" },
            ].map((s) => (
              <div key={s.ticker} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${s.color}-100 flex items-center justify-center`}>
                    <span className={`text-xs font-bold text-${s.color}-700`}>{s.ticker.slice(0, 3)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{s.ticker}</div>
                    <div className="text-xs text-slate-500">{s.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-700">{s.type}</div>
                  <div className="text-xs text-slate-500">Risque {s.risk}</div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500">Ces suggestions sont données à titre informatif et ne constituent pas un conseil en investissement. Consulte un conseiller financier agréé avant d&apos;investir.</p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
