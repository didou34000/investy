"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  RefreshCw,
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

type Profile = {
  id: string;
  email: string | null;
  quiz_score?: number | null;
  full_name?: string | null;
};

type ResultRow = {
  id: string;
  score: number | null;
  profile: string | null;
  horizon: string | null;
  expected_return?: number | null;
  created_at?: string | null;
  allocation: {
    cash?: number;
    bonds?: number;
    equities_core?: number;
    equities_tilts?: number;
    crypto?: number;
  } | null;
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

const formatMoney = (n: number) => n.toLocaleString('fr-FR') + ' €';

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const d = new Date(value);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

// ============================================
// COHERENCE LOGIC
// ============================================

type CoherenceStatus = "unknown" | "coherent" | "warning" | "misaligned";

const computeCoherence = (
  target: TargetAllocation,
  portfolio: Portfolio | null
): { status: CoherenceStatus; message: string; details: string[] } => {
  if (!portfolio || Object.values(portfolio).every(v => v === 0)) {
    return {
      status: "unknown",
      message: "Cohérence non évaluée",
      details: ["Renseigne ton portefeuille actuel pour vérifier la cohérence avec ton plan."],
    };
  }

  const total = portfolio.actions + portfolio.etf + portfolio.obligations + portfolio.crypto + portfolio.liquidites;
  if (total === 0) {
    return {
      status: "unknown",
      message: "Portefeuille vide",
      details: ["Ajoute tes actifs pour commencer le suivi."],
    };
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

  if (maxDiff <= 5) {
    return {
      status: "coherent",
      message: "Portefeuille cohérent",
      details: ["Ton allocation actuelle correspond à ton plan. Aucun ajustement nécessaire."],
    };
  } else if (maxDiff <= 15) {
    return {
      status: "warning",
      message: "Ajustements mineurs suggérés",
      details: details.length > 0 ? details : ["Quelques écarts détectés, mais rien d'urgent."],
    };
  } else {
    return {
      status: "misaligned",
      message: "Rééquilibrage recommandé",
      details: details.length > 0 ? details : ["Écarts significatifs avec ton plan initial."],
    };
  }
};

// ============================================
// TABS
// ============================================

const tabs = [
  { id: "overview", label: "Vue d'ensemble", icon: Target },
  { id: "portfolio", label: "Mon portefeuille", icon: Wallet },
  { id: "projection", label: "Projection", icon: TrendingUp },
  { id: "suggestions", label: "Titres conseillés", icon: Zap },
];

// ============================================
// MAIN PAGE
// ============================================

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Portfolio state (persisted in localStorage)
  const [portfolio, setPortfolio] = useState<Portfolio>({
    actions: 0,
    etf: 0,
    obligations: 0,
    crypto: 0,
    liquidites: 0,
  });

  // Load portfolio from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("invsty_portfolio");
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save portfolio to localStorage
  const updatePortfolio = (key: keyof Portfolio, value: number) => {
    const newPortfolio = { ...portfolio, [key]: value };
    setPortfolio(newPortfolio);
    localStorage.setItem("invsty_portfolio", JSON.stringify(newPortfolio));
  };

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAuthed(false);
        setLoading(false);
        return;
      }
      setAuthed(true);

      const [{ data: resultsData }, { data: profileData }] = await Promise.all([
        supabase
          .from("results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
      ]);

      setProfile(profileData || null);
      setResults(resultsData ?? []);
      setLoading(false);
    };

    load();
  }, [supabase]);

  const lastResult = results[0] ?? null;

  // Compute data from result
  const data = useMemo(() => {
    const score = lastResult?.score ?? profile?.quiz_score ?? null;
    if (score === null) return null;

    const alloc = lastResult?.allocation;
    const actions = alloc ? Math.round((alloc.equities_core ?? 0) + (alloc.equities_tilts ?? 0)) : 55;
    const obligations = alloc ? Math.round(alloc.bonds ?? 0) : 30;
    const liquidites = alloc ? Math.round(alloc.cash ?? 0) : 15;
    const crypto = alloc ? Math.round(alloc.crypto ?? 0) : 0;

    return {
      score,
      profileLabel: lastResult?.profile ?? getProfileLabel(score),
      horizon: lastResult?.horizon ?? getHorizonLabel(score),
      expectedReturn: lastResult?.expected_return ?? Math.min(3 + score * 0.12, 14),
      targetAllocation: { actions, obligations, liquidites, crypto },
      lastQuizDate: lastResult?.created_at ?? null,
    };
  }, [profile, lastResult]);

  const coherence = useMemo(() => {
    if (!data) return { status: "unknown" as CoherenceStatus, message: "", details: [] };
    return computeCoherence(data.targetAllocation, portfolio);
  }, [data, portfolio]);

  const portfolioTotal = portfolio.actions + portfolio.etf + portfolio.obligations + portfolio.crypto + portfolio.liquidites;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  const greetingName = profile?.full_name || profile?.email?.split("@")[0] || "investisseur";

  // Loading state
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

  // Not authenticated
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

  // No quiz result
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
          <Link 
            href="/quiz" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium"
          >
            Faire le quiz <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Tableau de bord</h1>
              <p className="text-sm text-slate-500">Suivi de ton plan d'investissement</p>
            </div>
            <Link 
              href="/result" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Voir mon plan
            </Link>
          </div>
          
          {/* Info banner */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl text-sm">
            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-slate-600">
              Ce tableau de bord sert à <strong>suivre et ajuster</strong> ton plan dans le temps. 
              Pour voir ton allocation recommandée, <Link href="/result" className="text-indigo-600 font-medium hover:underline">consulte ton plan</Link>.
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
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
        
        {/* ==================== TAB: OVERVIEW ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* Profile summary */}
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
                <div className="text-sm text-slate-500">Dernière mise à jour</div>
                <div className="text-sm font-medium text-slate-700">{formatDate(data.lastQuizDate) || "—"}</div>
              </div>
            </div>

            {/* Coherence status */}
            <div className={`p-5 rounded-2xl border ${
              coherence.status === 'coherent' ? 'bg-emerald-50 border-emerald-200' :
              coherence.status === 'warning' ? 'bg-amber-50 border-amber-200' :
              coherence.status === 'misaligned' ? 'bg-red-50 border-red-200' :
              'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  coherence.status === 'coherent' ? 'bg-emerald-100' :
                  coherence.status === 'warning' ? 'bg-amber-100' :
                  coherence.status === 'misaligned' ? 'bg-red-100' :
                  'bg-slate-100'
                }`}>
                  {coherence.status === 'coherent' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {coherence.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {coherence.status === 'misaligned' && <XCircle className="w-5 h-5 text-red-600" />}
                  {coherence.status === 'unknown' && <Target className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    coherence.status === 'coherent' ? 'text-emerald-900' :
                    coherence.status === 'warning' ? 'text-amber-900' :
                    coherence.status === 'misaligned' ? 'text-red-900' :
                    'text-slate-700'
                  }`}>{coherence.message}</h3>
                  <ul className="space-y-0.5">
                    {coherence.details.map((d, i) => (
                      <li key={i} className={`text-sm ${
                        coherence.status === 'coherent' ? 'text-emerald-700' :
                        coherence.status === 'warning' ? 'text-amber-700' :
                        coherence.status === 'misaligned' ? 'text-red-700' :
                        'text-slate-600'
                      }`}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {coherence.status === 'unknown' && (
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Renseigner mon portefeuille
                </button>
              )}
            </div>

            {/* Target allocation reminder */}
            <div className="p-5 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Allocation cible</h3>
                <Link href="/result" className="text-sm text-indigo-600 font-medium hover:underline">
                  Voir le détail →
                </Link>
              </div>
              <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
                <div className="bg-indigo-500" style={{ width: `${data.targetAllocation.actions}%` }} />
                <div className="bg-violet-500" style={{ width: `${data.targetAllocation.obligations}%` }} />
                <div className="bg-slate-400" style={{ width: `${data.targetAllocation.liquidites}%` }} />
                {data.targetAllocation.crypto > 0 && (
                  <div className="bg-cyan-500" style={{ width: `${data.targetAllocation.crypto}%` }} />
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-slate-600">Actions {data.targetAllocation.actions}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  <span className="text-slate-600">Obligations {data.targetAllocation.obligations}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-slate-600">Liquidités {data.targetAllocation.liquidites}%</span>
                </div>
                {data.targetAllocation.crypto > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span className="text-slate-600">Crypto {data.targetAllocation.crypto}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/quiz" 
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="font-medium text-slate-900 text-sm">Refaire le quiz</div>
                  <div className="text-xs text-slate-500">Mettre à jour mon profil</div>
                </div>
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="font-medium text-slate-900 text-sm">Déconnexion</div>
                  <div className="text-xs text-slate-500 truncate max-w-[120px]">{profile?.email}</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB: PORTFOLIO ==================== */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Mon portefeuille actuel</h2>
              <p className="text-sm text-slate-500 mb-6">
                Renseigne la valeur de tes actifs pour vérifier la cohérence avec ton plan.
              </p>
            </div>

            {/* Portfolio inputs */}
            <div className="space-y-4">
              {[
                { key: "actions", label: "Actions individuelles", icon: TrendingUp, color: "indigo" },
                { key: "etf", label: "ETF / Fonds", icon: BarChart3, color: "blue" },
                { key: "obligations", label: "Obligations / Fonds obligataires", icon: Shield, color: "violet" },
                { key: "crypto", label: "Cryptomonnaies", icon: Zap, color: "cyan" },
                { key: "liquidites", label: "Liquidités (cash, livrets)", icon: Wallet, color: "slate" },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg bg-${item.color}-100 flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-700">{item.label}</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={portfolio[item.key as keyof Portfolio] || ''}
                      onChange={(e) => updatePortfolio(item.key as keyof Portfolio, Number(e.target.value) || 0)}
                      placeholder="0"
                      className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-lg text-right font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <span className="text-slate-400 text-sm">€</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-5 bg-slate-900 rounded-2xl text-white">
              <div>
                <div className="text-sm text-slate-400">Total portefeuille</div>
                <div className="text-2xl font-bold">{formatMoney(portfolioTotal)}</div>
              </div>
              {portfolioTotal > 0 && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  Voir la cohérence
                </button>
              )}
            </div>

            {/* Current allocation breakdown */}
            {portfolioTotal > 0 && (
              <div className="p-5 bg-slate-50 rounded-2xl">
                <h3 className="font-semibold text-slate-900 mb-4">Répartition actuelle</h3>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
                  <div className="bg-indigo-500" style={{ width: `${((portfolio.actions + portfolio.etf) / portfolioTotal) * 100}%` }} />
                  <div className="bg-violet-500" style={{ width: `${(portfolio.obligations / portfolioTotal) * 100}%` }} />
                  <div className="bg-slate-400" style={{ width: `${(portfolio.liquidites / portfolioTotal) * 100}%` }} />
                  <div className="bg-cyan-500" style={{ width: `${(portfolio.crypto / portfolioTotal) * 100}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span className="text-slate-600">Actions/ETF</span>
                    </div>
                    <span className="font-medium text-slate-900">
                      {Math.round(((portfolio.actions + portfolio.etf) / portfolioTotal) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      <span className="text-slate-600">Obligations</span>
                    </div>
                    <span className="font-medium text-slate-900">
                      {Math.round((portfolio.obligations / portfolioTotal) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span className="text-slate-600">Liquidités</span>
                    </div>
                    <span className="font-medium text-slate-900">
                      {Math.round((portfolio.liquidites / portfolioTotal) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      <span className="text-slate-600">Crypto</span>
                    </div>
                    <span className="font-medium text-slate-900">
                      {Math.round((portfolio.crypto / portfolioTotal) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: PROJECTION ==================== */}
        {activeTab === "projection" && (
          <ProjectionTab expectedReturn={data.expectedReturn} />
        )}

        {/* ==================== TAB: SUGGESTIONS ==================== */}
        {activeTab === "suggestions" && (
          <div className="space-y-6">
            
            {/* Coming soon card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-medium mb-6">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                  Bientôt disponible
                </div>
                
                <h2 className="text-2xl font-bold mb-3">Titres conseillés</h2>
                <p className="text-slate-300 mb-8 max-w-md">
                  Des recommandations d&apos;ETF, d&apos;actions et de cryptos adaptées à ton profil, 
                  avec des explications claires pour chaque suggestion.
                </p>

                {/* Preview features */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    {
                      icon: BarChart3,
                      title: "ETF recommandés",
                      desc: "Sélection d'ETF adaptés à ton allocation cible"
                    },
                    {
                      icon: TrendingUp,
                      title: "Actions potentielles",
                      desc: "Idées d'actions selon ton niveau de risque"
                    },
                    {
                      icon: Zap,
                      title: "Crypto (si adapté)",
                      desc: "Suggestions crypto pour les profils dynamiques"
                    },
                    {
                      icon: Shield,
                      title: "Pédagogie intégrée",
                      desc: "Explications pour chaque recommandation"
                    },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-4 h-4 text-white/70" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white/90">{feature.title}</div>
                        <div className="text-xs text-white/50">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notify me */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl">
                    <Clock className="w-5 h-5 text-white/50" />
                    <span className="text-sm text-white/70">Lancement prévu : début 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What to do now */}
            <div className="p-5 bg-slate-50 rounded-2xl">
              <h3 className="font-semibold text-slate-900 mb-3">En attendant...</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900 text-sm">Consulte ton plan</div>
                    <p className="text-xs text-slate-500">
                      Ton allocation recommandée et les détails PEA/CTO sont sur ta page résultat.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900 text-sm">Renseigne ton portefeuille</div>
                    <p className="text-xs text-slate-500">
                      Compare ta situation actuelle avec ton allocation cible.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900 text-sm">Explore les ETF de base</div>
                    <p className="text-xs text-slate-500">
                      MSCI World, S&P 500, et obligations sont les piliers de toute allocation.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick PEA/CTO reminder */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-slate-400" />
                Rappel : PEA vs CTO
              </h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
                  <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-indigo-900 text-sm">PEA — Fiscalité optimisée</div>
                    <p className="text-xs text-indigo-700">
                      17,2% d&apos;impôts après 5 ans • Plafond 150k€ • ETF monde éligibles (Amundi, Lyxor)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-xl">
                  <Zap className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-violet-900 text-sm">CTO — Liberté totale</div>
                    <p className="text-xs text-violet-700">
                      Accès US, crypto, obligations • Sans plafond • Flat tax 30%
                    </p>
                  </div>
                </div>
              </div>
              <Link 
                href="/result#suite"
                className="flex items-center justify-center gap-2 mt-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Voir le détail complet
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CTA */}
            <Link 
              href="/result"
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Voir mon allocation recommandée
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

// ============================================
// PROJECTION TAB COMPONENT
// ============================================

function ProjectionTab({ expectedReturn }: { expectedReturn: number }) {
  const [monthly, setMonthly] = useState(200);
  const [years, setYears] = useState(10);
  const [showDetails, setShowDetails] = useState(false);

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
    <div className="space-y-6">
      
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Projection indicative</h2>
        <p className="text-sm text-slate-500">
          Explore l&apos;évolution possible de ton épargne. Ces chiffres sont des ordres de grandeur, pas des garanties.
        </p>
      </div>

      {/* Inputs */}
      <div className="p-5 bg-slate-50 rounded-2xl space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Versement mensuel</label>
            <span className="text-lg font-bold text-slate-900">{monthly} €</span>
          </div>
          <input
            type="range"
            min={50}
            max={1000}
            step={50}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Durée</label>
            <span className="text-lg font-bold text-slate-900">{years} ans</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
          />
        </div>
      </div>

      {/* Main result - Total invested emphasized */}
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

      {/* Expand details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        {showDetails ? (
          <>Masquer les scénarios <ChevronUp className="w-4 h-4" /></>
        ) : (
          <>Voir les scénarios <ChevronDown className="w-4 h-4" /></>
        )}
      </button>

      {showDetails && (
        <div className="p-5 bg-slate-50 rounded-2xl space-y-4">
          <h3 className="font-medium text-slate-900">Fourchette de scénarios</h3>
          
          {[
            { label: "Prudent", rate: Math.max(1, expectedReturn - 3), color: "slate" },
            { label: "Central", rate: expectedReturn, color: "indigo" },
            { label: "Favorable", rate: expectedReturn + 2, color: "emerald" },
          ].map((scenario) => {
            const proj = simulateInvestment({
              montantInitial: 0,
              mensualite: monthly,
              horizonYears: years,
              tauxAnnuel: scenario.rate / 100,
              reinvest: true,
            });
            return (
              <div key={scenario.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${scenario.color}-500`} />
                  <span className="text-sm text-slate-600">{scenario.label}</span>
                </div>
                <span className={`font-medium ${scenario.label === 'Central' ? 'text-slate-900' : 'text-slate-600'}`}>
                  ~{formatMoney(Math.round(proj.valeurFinale / 1000) * 1000)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
        <div className="flex gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Ces projections sont purement indicatives et basées sur des hypothèses de rendement moyen. 
            Les performances passées ne préjugent pas des performances futures. Aucun rendement n&apos;est garanti.
          </p>
        </div>
      </div>
    </div>
  );
}
