"use client";

import { useEffect, useMemo, useState } from "react";
import { simulateProjection } from "@/lib/profileEnginePro";
import Link from "next/link";
import { 
  PieChart, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Landmark, 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  Download, 
  Share2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  Wallet,
  Calendar
} from "lucide-react";

type Badge = { label: string; tone: "neutral" | "positive" | "warning" };
type Allocation = { cash: number; bonds: number; equities_core: number; equities_tilts: number; crypto: number };
type Result = {
  code: string;
  label: string;
  subtitle: string;
  badges: Badge[];
  warnings: string[];
  riskIndex: number;
  expectedReturn: number;
  expectedVol: number;
  allocation: Allocation;
  monthly?: number;
};

// Profile colors based on label (explicit mapping)
const getProfileThemeByLabel = (label: string) => {
  const map: Record<string, { gradient: string; bg: string; text: string; border: string; halo1: string; halo2: string }> = {
    Prudent: {
      gradient: "from-emerald-100 via-emerald-50 to-white",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
      halo1: "bg-emerald-200/45",
      halo2: "bg-emerald-100/45",
    },
    "Équilibré": {
      gradient: "from-[#E8EDFF] via-[#DDE6FF] to-white",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      halo1: "bg-blue-200/45",
      halo2: "bg-indigo-100/35",
    },
    Modéré: {
      gradient: "from-[#E9E7FF] via-[#DDE6FF] to-white",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-200",
      halo1: "bg-indigo-200/45",
      halo2: "bg-blue-200/35",
    },
    Dynamique: {
      gradient: "from-[#F9E9FF] via-[#E7E9FF] to-white",
      bg: "bg-pink-50",
      text: "text-pink-600",
      border: "border-pink-200",
      halo1: "bg-pink-200/45",
      halo2: "bg-violet-200/35",
    },
    Offensif: {
      gradient: "from-[#FFE8E0] via-[#FFEFE6] to-white",
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      halo1: "bg-orange-200/45",
      halo2: "bg-rose-200/35",
    },
  };
  return map[label] || map["Équilibré"];
};

// Fallback palette by risk index (used in gauge / legends)
const getProfileTheme = (riskIndex: number) => {
  if (riskIndex <= 25) return { gradient: "from-emerald-400 to-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" };
  if (riskIndex <= 45) return { gradient: "from-blue-400 to-indigo-500", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" };
  if (riskIndex <= 65) return { gradient: "from-indigo-400 to-blue-500", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" };
  if (riskIndex <= 85) return { gradient: "from-pink-400 to-violet-500", bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" };
  return { gradient: "from-orange-400 to-rose-500", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" };
};

const allocationData = [
  { key: "cash", label: "Liquidités", color: "#94a3b8", icon: Wallet },
  { key: "bonds", label: "Obligations", color: "#3b82f6", icon: Shield },
  { key: "equities_core", label: "Actions (cœur)", color: "#8b5cf6", icon: TrendingUp },
  { key: "equities_tilts", label: "Tilts / Alternatifs", color: "#f59e0b", icon: Zap },
  { key: "crypto", label: "Crypto", color: "#06b6d4", icon: BarChart3 },
];

function formatCurrency(n: number) {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{display.toLocaleString('fr-FR')}{suffix}</span>;
}

function RiskGauge({ value }: { value: number }) {
  const theme = getProfileTheme(value);
  
  return (
    <div className="relative">
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>Prudent</span>
        <span>Équilibré</span>
        <span>Dynamique</span>
        <span>Offensif</span>
      </div>
    </div>
  );
}

function AllocationBar({ data, allocation }: { data: typeof allocationData; allocation: Allocation }) {
  const total = Object.values(allocation).reduce((a, b) => a + b, 0);
  
  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div className="h-4 rounded-full overflow-hidden flex">
        {data.map((item) => {
          const value = allocation[item.key as keyof Allocation] || 0;
          if (value === 0) return null;
          return (
            <div
              key={item.key}
              className="h-full transition-all duration-1000 ease-out first:rounded-l-full last:rounded-r-full"
              style={{ width: `${(value / total) * 100}%`, backgroundColor: item.color }}
            />
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.map((item) => {
          const value = allocation[item.key as keyof Allocation] || 0;
          if (value === 0) return null;
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="font-semibold text-slate-900">{value}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectionChart({ monthly, expectedReturn, reinvest }: { monthly: number; expectedReturn: number; reinvest: boolean }) {
  const years = 10;
  const proj = simulateProjection(0, monthly, years, expectedReturn / 100, reinvest);
  const invested = monthly * years * 12;
  const finalBalance = proj[proj.length - 1]?.balance ?? invested;
  const gains = finalBalance - invested;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Wallet className="w-4 h-4" />
            Total versé
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(invested)}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            Projection 10 ans
          </div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(finalBalance)}</div>
        </div>
      </div>
      
      {/* Visual growth bar */}
      <div className="relative h-16 bg-slate-100 rounded-2xl overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-300 to-slate-400 flex items-center justify-end pr-3"
          style={{ width: `${(invested / finalBalance) * 100}%` }}
        >
          <span className="text-xs font-medium text-white">Versements</span>
        </div>
        <div 
          className="absolute inset-y-0 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-end pr-3"
          style={{ left: `${(invested / finalBalance) * 100}%`, right: 0 }}
        >
          <span className="text-xs font-medium text-white">+{formatCurrency(gains)}</span>
        </div>
      </div>
      
      <div className="text-center text-sm text-slate-500">
        <span className="font-medium text-slate-700">{formatCurrency(monthly)}/mois</span> • Rendement {expectedReturn.toFixed(1)}% • 
        Réinvestissement {reinvest ? "activé" : "désactivé"}
      </div>
    </div>
  );
}

export default function ResultPage() {
  const [res, setRes] = useState<Result | null>(null);
  const [unkHint, setUnkHint] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("investy_result");
      if (raw) {
        const parsed = JSON.parse(raw) as Result & { _meta?: { unkCount?: number } };
        setRes(parsed);
        if ((parsed as any)._meta?.unkCount && (parsed as any)._meta.unkCount >= 2) setUnkHint(true);
        // Trigger animations after load
        setTimeout(() => setShowAnimation(true), 100);
      }
    } catch {}
  }, []);

  const theme = res ? getProfileThemeByLabel(res.label) : getProfileThemeByLabel("Équilibré");

  if (!res) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-slate-50">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100 flex items-center justify-center">
            <Target className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Aucun résultat disponible</h1>
          <p className="text-slate-500 mb-8">Complète le quiz pour découvrir ton profil investisseur personnalisé.</p>
          <Link 
            href="/quiz" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
          >
            Faire le quiz
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} text-slate-900`}>
        {/* Halos principaux */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-60 pointer-events-none" style={{ backgroundColor: "rgba(255,255,255,0.45)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-50 pointer-events-none" style={{ backgroundColor: "rgba(255,255,255,0.35)" }} />
        <div className={`absolute -top-10 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-60 pointer-events-none ${theme.halo1 ?? ""}`} />
        <div className={`absolute bottom-[-80px] right-1/3 w-64 h-64 rounded-full blur-3xl opacity-55 pointer-events-none ${theme.halo2 ?? ""}`} />
        {/* Mesh / formes subtiles */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(600px at 20% 25%, rgba(255,255,255,0.32), transparent 40%),
              radial-gradient(420px at 80% 20%, rgba(255,255,255,0.25), transparent 42%),
              radial-gradient(520px at 40% 80%, rgba(255,255,255,0.22), transparent 45%)
            `
          }}
        />
        <div className="absolute top-16 left-10 w-28 h-28 rounded-full border border-white/35 bg-white/12 blur-sm opacity-75 rotate-3" />
        <div className="absolute top-8 right-24 w-24 h-24 rounded-[32px] border border-white/30 bg-white/15 backdrop-blur-sm opacity-70 -rotate-6" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-12 rounded-full border border-white/25 bg-white/12 backdrop-blur-sm opacity-70 rotate-2" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-12">
          <div className={`transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Analyse complète</span>
            </div>
            
            {/* Profile Title */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">{res.label}</h1>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl">{res.subtitle}</p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-lg">
              <div className="bg-white/65 backdrop-blur-md rounded-2xl p-4 text-center border border-white/70 shadow-sm">
                <div className="text-3xl font-bold">
                  <AnimatedNumber value={res.riskIndex} />
                </div>
                <div className="text-sm text-slate-700">Indice de risque</div>
              </div>
              <div className="bg-white/65 backdrop-blur-md rounded-2xl p-4 text-center border border-white/70 shadow-sm">
                <div className="text-3xl font-bold">
                  <AnimatedNumber value={Math.min(res.expectedReturn, 15)} suffix="%" />
                </div>
                <div className="text-sm text-slate-700">Rendement/an</div>
              </div>
              <div className="bg-white/65 backdrop-blur-md rounded-2xl p-4 text-center border border-white/70 shadow-sm">
                <div className="text-3xl font-bold">
                  <AnimatedNumber value={res.expectedVol} suffix="%" />
                </div>
                <div className="text-sm text-slate-700">Volatilité</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Warnings */}
        {(unkHint || res.warnings.length > 0) && (
          <div className={`mb-8 transition-all duration-500 delay-200 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {unkHint && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong>Résultats calibrés par défaut.</strong> Plusieurs réponses sont « Je ne sais pas ». 
                  Tu pourras affiner ton profil en refaisant le quiz.
                </div>
              </div>
            )}
            {res.warnings.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong className="block mb-1">Points d'attention</strong>
                  <ul className="list-disc ml-4 space-y-1">
                    {res.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        <div className={`flex flex-wrap gap-2 mb-8 transition-all duration-500 delay-300 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {res.badges.map((b, i) => (
            <span 
              key={i} 
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                b.tone === 'positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                b.tone === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Risk Gauge */}
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-500 delay-400 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
                  <Target className={`w-5 h-5 ${theme.text}`} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Profil de risque</h2>
                  <p className="text-sm text-slate-500">Score sur 100</p>
                </div>
              </div>
              <RiskGauge value={res.riskIndex} />
            </div>

            {/* Allocation */}
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-500 delay-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Allocation recommandée</h2>
                  <p className="text-sm text-slate-500">Répartition optimale de ton capital</p>
                </div>
              </div>
              <AllocationBar data={allocationData} allocation={res.allocation} />
            </div>

            {/* Support recommandé */}
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-500 delay-600 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Support recommandé</h2>
                  <p className="text-sm text-slate-500">Compte à privilégier</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border-2 ${res.riskIndex <= 50 ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="font-semibold text-slate-900 mb-1">PEA</div>
                  <div className="text-sm text-slate-500">Actions européennes, avantage fiscal après 5 ans</div>
                  {res.riskIndex <= 50 && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                      <CheckCircle2 className="w-3 h-3" /> Recommandé
                    </div>
                  )}
                </div>
                <div className={`p-4 rounded-2xl border-2 ${res.riskIndex > 50 ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="font-semibold text-slate-900 mb-1">CTO</div>
                  <div className="text-sm text-slate-500">Plus flexible, accès mondial et crypto</div>
                  {res.riskIndex > 50 && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                      <CheckCircle2 className="w-3 h-3" /> Recommandé
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Projection */}
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-500 delay-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Projection d'épargne</h2>
                  <p className="text-sm text-slate-500">Simulation sur 10 ans</p>
                </div>
              </div>
              <ProjectionChart 
                monthly={res.monthly ?? 500} 
                expectedReturn={res.expectedReturn}
                reinvest={res.badges?.some(b => b.label.includes('Réinvestissement')) ?? true}
              />
            </div>

            {/* Metrics */}
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-500 delay-600 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Métriques clés</h2>
                  <p className="text-sm text-slate-500">Estimations basées sur ton profil</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <TrendingUp className="w-4 h-4" />
                    Rendement annuel attendu
                  </div>
                  <div className="font-semibold text-emerald-600">+{Math.min(res.expectedReturn, 15).toFixed(1)}%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <TrendingDown className="w-4 h-4" />
                    Volatilité attendue
                  </div>
                  <div className="font-semibold text-amber-600">±{res.expectedVol.toFixed(0)}%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    Horizon recommandé
                  </div>
                  <div className="font-semibold text-blue-600">
                    {res.riskIndex <= 30 ? "2-5 ans" : res.riskIndex <= 60 ? "5-10 ans" : "10+ ans"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`mt-12 flex flex-wrap gap-4 justify-center transition-all duration-500 delay-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link 
            href="/quiz" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refaire le quiz
          </Link>
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
          >
            <Download className="w-4 h-4" />
            Télécharger mon plan
          </button>
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">
          Ces estimations sont fournies à titre éducatif et ne constituent pas un conseil en investissement personnalisé. 
          Les performances passées ne préjugent pas des performances futures.
        </p>
      </div>
    </main>
  );
}
