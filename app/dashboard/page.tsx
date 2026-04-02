"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, AlertTriangle, XCircle,
  TrendingUp, Clock, Shield, LogOut, Target, Wallet,
  ChevronDown, ChevronUp, ExternalLink, BarChart3,
  Zap, Info, Bell, Settings, User, BookOpen,
  PieChart, Newspaper, MessageCircle,
} from "lucide-react";
import { simulateInvestment } from "@/lib/simulate";

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────
type AuthUser = { id: string; email: string; full_name?: string; plan?: string } | null;

type QuizResult = {
  id?: string;
  score?: number;
  risk_index?: number;
  profile_code?: string;
  profile_label?: string;
  horizon?: string;
  expected_return?: number;
  expected_vol?: number;
  allocation?: any;
  created_date?: string;
};

type Portfolio = {
  actions: number; etf: number; obligations: number; crypto: number; liquidites: number;
};

type TargetAllocation = { actions: number; obligations: number; liquidites: number; crypto: number };
type CoherenceStatus = "unknown" | "coherent" | "warning" | "misaligned";

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
const getProfileLabel = (score: number) => {
  if (score <= 20) return "Très prudent";
  if (score <= 40) return "Prudent";
  if (score <= 60) return "Équilibré";
  if (score <= 80) return "Dynamique";
  return "Offensif";
};
const getHorizonLabel = (score: number) => {
  if (score <= 25) return "3-5 ans";
  if (score <= 45) return "5-7 ans";
  if (score <= 65) return "7-10 ans";
  return "10+ ans";
};
const formatMoney = (n: number) => n.toLocaleString("fr-FR") + " €";
const formatDate = (v?: string | null) => {
  if (!v) return null;
  return new Date(v).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const computeCoherence = (target: TargetAllocation, portfolio: Portfolio): { status: CoherenceStatus; message: string; details: string[] } => {
  const total = portfolio.actions + portfolio.etf + portfolio.obligations + portfolio.crypto + portfolio.liquidites;
  if (total === 0) return { status: "unknown", message: "Cohérence non évaluée", details: ["Renseigne ton portefeuille pour vérifier la cohérence avec ton plan."] };
  const current = {
    actions: Math.round(((portfolio.actions + portfolio.etf) / total) * 100),
    obligations: Math.round((portfolio.obligations / total) * 100),
    liquidites: Math.round((portfolio.liquidites / total) * 100),
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
  if (maxDiff <= 5) return { status: "coherent", message: "Portefeuille cohérent ✓", details: ["Ton allocation correspond à ton plan. Aucun ajustement nécessaire."] };
  if (maxDiff <= 15) return { status: "warning", message: "Ajustements mineurs suggérés", details: details.length ? details : ["Quelques écarts, mais rien d'urgent."] };
  return { status: "misaligned", message: "Rééquilibrage recommandé", details: details.length ? details : ["Écarts significatifs avec ton plan."] };
};

const TABS = [
  { id: "overview", label: "Vue d'ensemble", icon: Target },
  { id: "portfolio", label: "Portefeuille", icon: Wallet },
  { id: "projection", label: "Projection", icon: TrendingUp },
  { id: "actu", label: "Actualités", icon: Newspaper },
];

// ──────────────────────────────────────────────
// MINI COMPONENTS
// ──────────────────────────────────────────────
function StatCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ${accent ? "bg-slate-900 text-white" : "bg-[#F5F7FA] border border-[rgba(0,0,0,0.06)]"}`}>
      <p className={`text-xs font-medium mb-1 ${accent ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
      <p className={`text-2xl font-bold ${accent ? "text-white" : "text-slate-900"}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${accent ? "text-slate-400" : "text-slate-500"}`}>{sub}</p>}
    </div>
  );
}

function ArticleCard({ article }: { article: any }) {
  const cats: Record<string, { bg: string; text: string }> = {
    tech: { bg: "bg-blue-100", text: "text-blue-700" },
    bourse: { bg: "bg-indigo-100", text: "text-indigo-700" },
    crypto: { bg: "bg-cyan-100", text: "text-cyan-700" },
    économie: { bg: "bg-amber-100", text: "text-amber-700" },
    "matières premières": { bg: "bg-orange-100", text: "text-orange-700" },
    immobilier: { bg: "bg-emerald-100", text: "text-emerald-700" },
    épargne: { bg: "bg-violet-100", text: "text-violet-700" },
    macroéconomie: { bg: "bg-rose-100", text: "text-rose-700" },
    médias: { bg: "bg-pink-100", text: "text-pink-700" },
    marché: { bg: "bg-slate-100", text: "text-slate-700" },
  };
  const cat = cats[article.category] || { bg: "bg-slate-100", text: "text-slate-700" };
  return (
    <a href={article.source_url || "#"} target="_blank" rel="noopener noreferrer"
      className="block p-4 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] hover:border-slate-300 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.bg} ${cat.text} shrink-0`}>
          {article.category}
        </span>
        <span className="text-xs text-slate-400 shrink-0">
          {article.source}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1 line-clamp-2">{article.title}</h3>
      {article.summary && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{article.summary}</p>
      )}
    </a>
  );
}

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [monthly, setMonthly] = useState(200);
  const [years, setYears] = useState(10);
  const [showScenarios, setShowScenarios] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio>({ actions: 0, etf: 0, obligations: 0, crypto: 0, liquidites: 0 });

  // Load portfolio from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("invsty_portfolio");
    if (saved) try { setPortfolio(JSON.parse(saved)); } catch {}
  }, []);

  const updatePortfolio = (key: keyof Portfolio, value: number) => {
    const newP = { ...portfolio, [key]: value };
    setPortfolio(newP);
    localStorage.setItem("invsty_portfolio", JSON.stringify(newP));
  };

  // Auth + data load
  useEffect(() => {
    const load = async () => {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { setAuthed(false); setLoading(false); return; }
      const { user: u } = await meRes.json();
      if (!u) { setAuthed(false); setLoading(false); return; }
      setUser(u);
      setAuthed(true);

      // Load quiz result: DB first, then localStorage fallback
      try {
        const qRes = await fetch("/api/quiz-results");
        if (qRes.ok) {
          const data = await qRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setQuizResult(data[0]);
          } else {
            const local = localStorage.getItem("invsty_result") || sessionStorage.getItem("investy_result");
            if (local) setQuizResult(JSON.parse(local));
          }
        }
      } catch {
        const local = localStorage.getItem("invsty_result");
        if (local) try { setQuizResult(JSON.parse(local)); } catch {}
      }

      // Load articles
      try {
        const aRes = await fetch("/api/actu");
        if (aRes.ok) {
          const aData = await aRes.json();
          setArticles(Array.isArray(aData) ? aData.slice(0, 9) : []);
        }
      } catch {}

      setLoading(false);
    };
    load();
  }, []);

  // Derived data from quiz result
  const data = useMemo(() => {
    if (!quizResult) return null;
    const alloc = (() => {
      try { return typeof quizResult.allocation === "string" ? JSON.parse(quizResult.allocation) : quizResult.allocation; }
      catch { return null; }
    })();
    const score = quizResult.risk_index ?? quizResult.score ?? 50;
    const actions = alloc ? Math.round((alloc.equities_core ?? 0) + (alloc.equities_tilts ?? 0)) : 55;
    const obligations = alloc ? Math.round(alloc.bonds ?? 0) : 30;
    const liquidites = alloc ? Math.round(alloc.cash ?? 0) : 15;
    const crypto = alloc ? Math.round(alloc.crypto ?? 0) : 0;
    return {
      score,
      profileLabel: quizResult.profile_label ?? getProfileLabel(score),
      horizon: quizResult.horizon ?? getHorizonLabel(score),
      expectedReturn: quizResult.expected_return ?? Math.min(3 + score * 0.12, 14),
      expectedVol: quizResult.expected_vol ?? 10,
      targetAllocation: { actions, obligations, liquidites, crypto },
      lastQuizDate: quizResult.created_date ?? null,
    };
  }, [quizResult]);

  const coherence = useMemo(() => {
    if (!data) return { status: "unknown" as CoherenceStatus, message: "", details: [] };
    return computeCoherence(data.targetAllocation, portfolio);
  }, [data, portfolio]);

  const portfolioTotal = portfolio.actions + portfolio.etf + portfolio.obligations + portfolio.crypto + portfolio.liquidites;

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const greetingName = user?.full_name || user?.email?.split("@")[0] || "investisseur";

  // ── LOADING ──
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Chargement...</p>
        </div>
      </main>
    );
  }

  // ── NOT AUTH ──
  if (authed === false) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Connexion requise</h1>
          <p className="text-slate-500 mb-6 text-sm">Connecte-toi pour accéder à ton tableau de bord.</p>
          <Link href="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm">
            Se connecter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // ── NO QUIZ ──
  if (!data) {
    return (
      <main className="min-h-screen bg-[#F5F7FA]">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Tableau de bord</h1>
            <p className="text-sm text-slate-500">Bonjour {greetingName} 👋</p>
          </div>
          <button onClick={handleSignOut} className="p-2 text-slate-400 hover:text-slate-700 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white shadow-lg flex items-center justify-center">
            <Target className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Définis ton profil</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Fais le quiz investisseur (5 min) pour activer ton tableau de bord personnalisé — allocation, projections et suggestions.
          </p>
          <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-semibold shadow-lg hover:bg-slate-800 transition-all">
            Faire le quiz <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // ── PROJECTION CALC ──
  const expectedReturn = data.expectedReturn;
  const projection = simulateInvestment({ montantInitial: 0, mensualite: monthly, horizonYears: years, tauxAnnuel: expectedReturn / 100, reinvest: true });
  const invested = monthly * years * 12;
  const gains = projection.valeurFinale - invested;

  // ── MAIN DASHBOARD ──
  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      {/* ── TOP BAR ── */}
      <div className="bg-white border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Tableau de bord</h1>
            <p className="text-sm text-slate-500">Bonjour {greetingName} 👋</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings" className="p-2.5 rounded-xl bg-[#F5F7FA] text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <Settings className="w-4.5 h-4.5 w-5 h-5" />
            </Link>
            <Link href="/chat" className="p-2.5 rounded-xl bg-[#F5F7FA] text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </Link>
            <button onClick={handleSignOut} className="p-2.5 rounded-xl bg-[#F5F7FA] text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PROFILE BANNER ── */}
      <div className="bg-slate-900 text-white px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <span className="text-2xl font-bold">{data.score}</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Profil investisseur</p>
              <p className="text-lg font-bold">{data.profileLabel}</p>
              <p className="text-sm text-slate-400">Horizon {data.horizon} · {data.expectedReturn.toFixed(1)}%/an estimé</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <Link href="/result" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Mon plan
            </Link>
            {data.lastQuizDate && (
              <p className="text-xs text-slate-500">Mis à jour {formatDate(data.lastQuizDate)}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-white border-b border-slate-200/60 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <div className="space-y-5">

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Score de risque" value={String(data.score)} sub="/ 100" accent />
              <StatCard label="Rendement cible" value={`~${data.expectedReturn.toFixed(1)}%`} sub="annuel estimé" />
              <StatCard label="Volatilité" value={`±${data.expectedVol.toFixed(0)}%`} sub="annuelle estimée" />
              <StatCard label="Horizon" value={data.horizon} sub="recommandé" />
            </div>

            {/* Allocation cible */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Allocation cible</h3>
                <Link href="/result" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
                  Détails <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-4">
                {data.targetAllocation.actions > 0 && <div className="bg-indigo-500" style={{ width: `${data.targetAllocation.actions}%` }} />}
                {data.targetAllocation.obligations > 0 && <div className="bg-violet-500" style={{ width: `${data.targetAllocation.obligations}%` }} />}
                {data.targetAllocation.liquidites > 0 && <div className="bg-slate-300" style={{ width: `${data.targetAllocation.liquidites}%` }} />}
                {data.targetAllocation.crypto > 0 && <div className="bg-cyan-400" style={{ width: `${data.targetAllocation.crypto}%` }} />}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Actions / ETF", value: data.targetAllocation.actions, color: "bg-indigo-500" },
                  { label: "Obligations", value: data.targetAllocation.obligations, color: "bg-violet-500" },
                  { label: "Liquidités", value: data.targetAllocation.liquidites, color: "bg-slate-300" },
                  ...(data.targetAllocation.crypto > 0 ? [{ label: "Crypto", value: data.targetAllocation.crypto, color: "bg-cyan-400" }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-900 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cohérence */}
            <div className={`rounded-2xl border p-5 ${
              coherence.status === "coherent" ? "bg-emerald-50 border-emerald-200" :
              coherence.status === "warning" ? "bg-amber-50 border-amber-200" :
              coherence.status === "misaligned" ? "bg-red-50 border-red-200" :
              "bg-white border-[rgba(0,0,0,0.06)]"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  coherence.status === "coherent" ? "bg-emerald-100" :
                  coherence.status === "warning" ? "bg-amber-100" :
                  coherence.status === "misaligned" ? "bg-red-100" : "bg-slate-100"
                }`}>
                  {coherence.status === "coherent" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {coherence.status === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {coherence.status === "misaligned" && <XCircle className="w-5 h-5 text-red-600" />}
                  {coherence.status === "unknown" && <PieChart className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 text-sm ${
                    coherence.status === "coherent" ? "text-emerald-900" :
                    coherence.status === "warning" ? "text-amber-900" :
                    coherence.status === "misaligned" ? "text-red-900" : "text-slate-700"
                  }`}>{coherence.message}</h4>
                  {coherence.details.map((d, i) => (
                    <p key={i} className={`text-xs ${
                      coherence.status === "coherent" ? "text-emerald-700" :
                      coherence.status === "warning" ? "text-amber-700" :
                      coherence.status === "misaligned" ? "text-red-700" : "text-slate-500"
                    }`}>• {d}</p>
                  ))}
                </div>
              </div>
              {coherence.status === "unknown" && (
                <button onClick={() => setActiveTab("portfolio")}
                  className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
                  Renseigner mon portefeuille
                </button>
              )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/quiz", icon: Clock, title: "Refaire le quiz", sub: "Actualiser le profil" },
                { href: "/result", icon: PieChart, title: "Mon plan", sub: "Voir en détail" },
                { href: "/suivi-actifs", icon: TrendingUp, title: "Mes actifs", sub: "Suivi en direct" },
                { href: "/chat", icon: MessageCircle, title: "Assistant IA", sub: "Poser une question" },
              ].map(({ href, icon: Icon, title, sub }) => (
                <Link key={href} href={href} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] hover:border-slate-300 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F7FA] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PORTFOLIO ═══ */}
        {activeTab === "portfolio" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Mon portefeuille</h2>
              <p className="text-sm text-slate-500">Renseigne tes actifs pour vérifier la cohérence avec ton plan.</p>
            </div>

            {portfolioTotal > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total estimé" value={formatMoney(portfolioTotal)} accent />
                <StatCard label="Cohérence"
                  value={coherence.status === "coherent" ? "✓ OK" : coherence.status === "warning" ? "⚠ À ajuster" : coherence.status === "misaligned" ? "✗ À rééquilibrer" : "—"}
                  sub={coherence.message} />
              </div>
            )}

            <div className="space-y-3">
              {([
                { key: "actions", label: "Actions", icon: TrendingUp },
                { key: "etf", label: "ETF", icon: BarChart3 },
                { key: "obligations", label: "Obligations", icon: Shield },
                { key: "crypto", label: "Crypto", icon: Zap },
                { key: "liquidites", label: "Liquidités / Épargne", icon: Wallet },
              ] as const).map(({ key, label, icon: Icon }) => (
                <div key={key} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#F5F7FA] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                    </div>
                    <span className="text-base font-bold text-slate-900">{formatMoney(portfolio[key])}</span>
                  </div>
                  <input type="range" min={0} max={100000} step={500} value={portfolio[key]}
                    onChange={(e) => updatePortfolio(key, Number(e.target.value))}
                    className="w-full h-2 bg-[#EFF3F8] rounded-full appearance-none cursor-pointer accent-slate-900" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0 €</span><span>100 000 €</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PROJECTION ═══ */}
        {activeTab === "projection" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Projection indicative</h2>
              <p className="text-sm text-slate-500">Simule l&apos;évolution de ton épargne dans le temps.</p>
            </div>

            {/* Sliders */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Versement mensuel</label>
                  <span className="text-lg font-bold text-slate-900">{monthly} €</span>
                </div>
                <input type="range" min={50} max={2000} step={50} value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full h-2 bg-[#EFF3F8] rounded-full appearance-none cursor-pointer accent-slate-900" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Durée</label>
                  <span className="text-lg font-bold text-slate-900">{years} ans</span>
                </div>
                <input type="range" min={1} max={30} step={1} value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-[#EFF3F8] rounded-full appearance-none cursor-pointer accent-slate-900" />
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Capital investi" value={formatMoney(invested)} sub={`${monthly} € × ${years * 12} mois`} accent />
              <StatCard label="Estimation finale" value={`~${formatMoney(Math.round(projection.valeurFinale / 1000) * 1000)}`} sub={`+${formatMoney(Math.round(gains / 1000) * 1000)} d'intérêts`} />
            </div>

            {/* Scenarios toggle */}
            <button onClick={() => setShowScenarios(!showScenarios)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              {showScenarios ? <>Masquer <ChevronUp className="w-4 h-4" /></> : <>Voir les scénarios <ChevronDown className="w-4 h-4" /></>}
            </button>

            {showScenarios && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 space-y-3">
                <h3 className="font-medium text-slate-900 text-sm">Fourchette de scénarios</h3>
                {[
                  { label: "Pessimiste", rate: Math.max(1, expectedReturn - 3), color: "text-slate-500" },
                  { label: "Central", rate: expectedReturn, color: "text-slate-900 font-semibold" },
                  { label: "Optimiste", rate: expectedReturn + 2, color: "text-emerald-600" },
                ].map((s) => {
                  const p = simulateInvestment({ montantInitial: 0, mensualite: monthly, horizonYears: years, tauxAnnuel: s.rate / 100, reinvest: true });
                  return (
                    <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <span className="text-sm text-slate-600">{s.label}</span>
                        <span className="text-xs text-slate-400 ml-2">({s.rate.toFixed(1)}%/an)</span>
                      </div>
                      <span className={`text-sm ${s.color}`}>~{formatMoney(Math.round(p.valeurFinale / 1000) * 1000)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">Projections indicatives basées sur des hypothèses de rendement moyen. Les performances passées ne garantissent pas les résultats futurs. Aucun rendement n&apos;est garanti.</p>
            </div>
          </div>
        )}

        {/* ═══ ACTUALITÉS ═══ */}
        {activeTab === "actu" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Actualités financières</h2>
                <p className="text-sm text-slate-500">Sélection d&apos;articles pour rester informé.</p>
              </div>
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1">
                Toutes <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Aucun article disponible</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {articles.map((article, i) => (
                  <ArticleCard key={article.id || i} article={article} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
