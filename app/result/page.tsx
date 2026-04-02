"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { 
  ArrowRight, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Shield,
  Wallet,
  Zap,
  BarChart3,
  Target,
  Clock,
  Landmark,
  PieChart,
  Info,
} from "lucide-react";
import { getProfileCopy } from "@/lib/profileCopy";
import { simulateInvestment } from "@/lib/simulate";

// ============================================
// TYPES
// ============================================

type Allocation = { cash: number; bonds: number; equities_core: number; equities_tilts: number; crypto: number };
type Result = {
  code: string;
  label: string;
  subtitle: string;
  riskIndex: number;
  expectedReturn: number;
  expectedVol: number;
  allocation: Allocation;
};

// ============================================
// NAVIGATION
// ============================================

const sections = [
  { id: "resultat", label: "Résultat" },
  { id: "details", label: "Détails" },
  { id: "projection", label: "Projection" },
  { id: "suite", label: "Suite" },
];

// ============================================
// HELPERS
// ============================================

const getHorizonLabel = (riskIndex: number) => {
  if (riskIndex <= 25) return "3-5 ans";
  if (riskIndex <= 45) return "5-7 ans";
  if (riskIndex <= 65) return "7-10 ans";
  return "10+ ans";
};

const getRiskLevel = (riskIndex: number) => {
  if (riskIndex <= 25) return { label: "Faible", level: 1, color: "emerald" };
  if (riskIndex <= 45) return { label: "Modéré", level: 2, color: "blue" };
  if (riskIndex <= 65) return { label: "Moyen", level: 3, color: "amber" };
  if (riskIndex <= 85) return { label: "Élevé", level: 4, color: "orange" };
  return { label: "Très élevé", level: 5, color: "red" };
};

const getVariationRange = (riskIndex: number) => {
  if (riskIndex <= 25) return "±5-8%";
  if (riskIndex <= 45) return "±8-12%";
  if (riskIndex <= 65) return "±10-15%";
  if (riskIndex <= 85) return "±15-25%";
  return "±20-35%";
};

const allocationItems = [
  { key: "equities_core", label: "Actions / ETF", color: "#4F46E5", icon: TrendingUp, desc: "Croissance long terme" },
  { key: "bonds", label: "Obligations", color: "#7C3AED", icon: Shield, desc: "Stabilité et revenus" },
  { key: "cash", label: "Liquidités", color: "#64748B", icon: Wallet, desc: "Sécurité immédiate" },
  { key: "equities_tilts", label: "Thématiques", color: "#F59E0B", icon: Zap, desc: "Secteurs spécifiques" },
  { key: "crypto", label: "Crypto", color: "#06B6D4", icon: BarChart3, desc: "Actifs alternatifs" },
];

function formatMoney(n: number) {
  return n.toLocaleString('fr-FR') + ' €';
}

// ============================================
// SIDE NAVIGATION - FIXED
// ============================================

function SideNav({ activeSection }: { activeSection: string }) {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeIndex = sections.findIndex(s => s.id === activeSection);

  return (
    <nav className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
        
        {/* Progress line */}
        <div 
          className="absolute left-[7px] top-2 w-0.5 bg-slate-900 transition-all duration-300"
          style={{ height: `${(activeIndex / (sections.length - 1)) * 100}%` }}
        />
        
        {/* Dots */}
        <div className="relative flex flex-col gap-8">
          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            const isPast = activeIndex > index;
            
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className="flex items-center gap-4 group"
              >
                <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-900 border-slate-900 scale-110' 
                    : isPast 
                      ? 'bg-slate-900 border-slate-900' 
                      : 'bg-white border-slate-300 group-hover:border-slate-400'
                }`}>
                  {isPast && !isActive && (
                    <CheckCircle2 className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
                
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive 
                    ? 'text-slate-900' 
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function ResultPage() {

  const [res, setRes] = useState<Result | null>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [monthly, setMonthly] = useState(200);
  const [activeSection, setActiveSection] = useState("resultat");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("investy_result") || localStorage.getItem("invsty_result");
      if (raw) {
        setRes(JSON.parse(raw) as Result);
        setTimeout(() => setMounted(true), 50);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : { user: null })
      .then(d => setUser(d.user ?? null))
      .catch(() => {});
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (!mounted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-10% 0px -40% 0px'
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [mounted]);

  // No result
  if (!res) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Target className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Aucun résultat</h1>
          <p className="text-slate-500 mb-6">Fais le quiz pour voir ton profil.</p>
          <Link href="/quiz" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium">
            Commencer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  const risk = getRiskLevel(res.riskIndex);
  const copy = getProfileCopy(res.code);
  const supportHint = res.riskIndex <= 50 ? "PEA" : "CTO";

  // Projection calculations
  const years = 10;
  const projection = simulateInvestment({
    montantInitial: 0,
    mensualite: monthly,
    horizonYears: years,
    tauxAnnuel: (res.expectedReturn || 5) / 100,
    reinvest: true,
  });
  const invested = monthly * years * 12;
  const gains = projection.valeurFinale - invested;

  return (
    <main className="min-h-screen bg-white">
      
      {/* Side Navigation */}
      <SideNav activeSection={activeSection} />
      
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium text-slate-900">{res.label}</span>
          </div>
          <span className="text-sm text-slate-500">{res.riskIndex}/100</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 lg:pl-32">
        
        {/* ========== SECTION 1: RÉSULTAT ========== */}
        <section id="resultat" className="py-16 lg:py-24 scroll-mt-20">
          
          {/* Success badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <CheckCircle2 className="w-4 h-4" />
            Analyse terminée
          </div>
          
          {/* Profile title */}
          <h1 className={`text-4xl lg:text-5xl font-bold text-slate-900 mb-3 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Profil {res.label}
          </h1>
          
          <p className={`text-lg text-slate-500 mb-8 transition-all duration-500 delay-150 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {res.subtitle}
          </p>
          
          {/* Key metrics grid */}
          <div className={`grid grid-cols-3 gap-4 mb-8 transition-all duration-500 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {/* Risk score */}
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Risque</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{res.riskIndex}</div>
              <div className="text-sm text-slate-500">sur 100</div>
            </div>
            
            {/* Risk level */}
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Niveau</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{risk.label}</div>
              <div className="text-sm text-slate-500">{getVariationRange(res.riskIndex)}/an</div>
            </div>
            
            {/* Horizon */}
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Horizon</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{getHorizonLabel(res.riskIndex).split(' ')[0]}</div>
              <div className="text-sm text-slate-500">ans minimum</div>
            </div>
          </div>
          
          {/* Risk gauge visual */}
          <div className={`bg-slate-50 rounded-2xl p-5 transition-all duration-500 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-600">Échelle de risque</span>
              <span className="text-sm font-medium text-slate-900">{risk.label}</span>
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-3 rounded-full transition-all duration-500`}
                  style={{ 
                    backgroundColor: i <= risk.level ? '#1E293B' : '#E2E8F0',
                    transitionDelay: `${300 + i * 100}ms`
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Prudent</span>
              <span>Offensif</span>
            </div>
          </div>
        </section>

        {/* ========== SECTION 2: DÉTAILS ========== */}
        <section id="details" className="py-16 lg:py-24 border-t border-slate-100 scroll-mt-20">
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ton allocation</h2>
          <p className="text-slate-500 mb-8">Répartition recommandée de ton portefeuille</p>
          
          {/* Allocation visual bar */}
          <div className="mb-6">
            <div className="flex h-5 rounded-full overflow-hidden shadow-inner bg-slate-100">
              {allocationItems.map((item, index) => {
                const value = res.allocation[item.key as keyof Allocation] || 0;
                if (value === 0) return null;
                return (
                  <div 
                    key={item.key}
                    className="transition-all duration-700 first:rounded-l-full last:rounded-r-full relative group"
                    style={{ 
                      width: mounted ? `${value}%` : '0%',
                      backgroundColor: item.color,
                      transitionDelay: `${index * 100}ms`
                    }} 
                  />
                );
              })}
            </div>
          </div>
          
          {/* Allocation breakdown */}
          <div className="space-y-3 mb-8">
            {allocationItems.map((item) => {
              const value = res.allocation[item.key as keyof Allocation] || 0;
              if (value === 0) return null;
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{item.label}</span>
                      <span className="text-xl font-bold text-slate-900">{value}%</span>
                    </div>
                    <span className="text-sm text-slate-500">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interpretation */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-indigo-900 mb-2">Ce que ça signifie</h3>
                <p className="text-sm text-indigo-800 leading-relaxed">{copy.paragraph}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SECTION 3: PROJECTION ========== */}
        <section id="projection" className="py-16 lg:py-24 border-t border-slate-100 scroll-mt-20">
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Projection sur {years} ans</h2>
          <p className="text-slate-500 mb-8">Estimation avec intérêts composés</p>
          
          {/* Monthly input */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-slate-700">Versement mensuel</label>
              <div className="text-2xl font-bold text-slate-900">{monthly} €</div>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={25}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>50 €</span>
              <span>500 €</span>
            </div>
          </div>
          
          {/* Projection results */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-2xl p-5">
              <div className="text-sm text-slate-500 mb-1">Total versé</div>
              <div className="text-2xl font-bold text-slate-900">{formatMoney(invested)}</div>
              <div className="text-sm text-slate-400 mt-1">{monthly} € × {years * 12} mois</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-5 text-white">
              <div className="text-sm text-slate-400 mb-1">Valeur estimée</div>
              <div className="text-2xl font-bold">{formatMoney(Math.round(projection.valeurFinale))}</div>
              <div className="text-sm text-emerald-400 mt-1">+{formatMoney(Math.round(gains))} de gains</div>
            </div>
          </div>
          
          {/* Growth breakdown */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-emerald-900">Gains estimés</div>
                  <div className="text-sm text-emerald-700">Intérêts composés sur {years} ans</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-700">+{formatMoney(Math.round(gains))}</div>
            </div>
          </div>
          
          {/* Visual bar */}
          <div className="mb-4">
            <div className="flex h-8 rounded-xl overflow-hidden">
              <div 
                className="bg-slate-300 flex items-center justify-center transition-all duration-500"
                style={{ width: `${(invested / projection.valeurFinale) * 100}%` }}
              >
                <span className="text-xs font-medium text-slate-700 px-2">Versements</span>
              </div>
              <div 
                className="bg-emerald-500 flex items-center justify-center transition-all duration-500"
                style={{ width: `${(gains / projection.valeurFinale) * 100}%` }}
              >
                <span className="text-xs font-medium text-white px-2">Gains</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 text-center">
            Estimation indicative basée sur un rendement moyen. Aucun rendement n&apos;est garanti.
          </p>
        </section>

        {/* ========== SECTION 4: SUITE ========== */}
        <section id="suite" className="py-16 lg:py-24 border-t border-slate-100 scroll-mt-20">
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Passer à l&apos;action</h2>
          <p className="text-slate-500 mb-8">Les 3 étapes pour mettre en place ton plan</p>
          
          {/* Steps */}
          <div className="space-y-4 mb-10">
            <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">1</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Landmark className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">Ouvre un compte d&apos;investissement</span>
                </div>
                <p className="text-sm text-slate-500">
                  Choisis entre PEA et CTO selon ton profil (voir détails ci-dessous).
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">2</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <PieChart className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">Investis selon l&apos;allocation</span>
                </div>
                <p className="text-sm text-slate-500">
                  Utilise des ETF (fonds indiciels) pour répliquer facilement cette répartition. Un ETF monde + un ETF obligations peut suffire.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">3</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">Rééquilibre une fois par an</span>
                </div>
                <p className="text-sm text-slate-500">
                  Vérifie que les proportions sont toujours respectées. Si une classe a trop monté, vends un peu pour réinvestir dans les autres.
                </p>
              </div>
            </div>
          </div>

          {/* PEA vs CTO Section */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quel support choisir ?</h3>
            
            {/* Recommended badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-slate-500">Pour ton profil :</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                supportHint === "PEA" 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "bg-violet-100 text-violet-700"
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {supportHint} recommandé
              </span>
            </div>
            
            <div className="grid gap-4">
              {/* PEA Card */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${
                supportHint === "PEA" 
                  ? "border-indigo-200 bg-indigo-50/50" 
                  : "border-slate-200 bg-white"
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      supportHint === "PEA" ? "bg-indigo-100" : "bg-slate-100"
                    }`}>
                      <Shield className={`w-5 h-5 ${supportHint === "PEA" ? "text-indigo-600" : "text-slate-500"}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">PEA</h4>
                      <p className="text-xs text-slate-500">Plan d&apos;Épargne en Actions</p>
                    </div>
                  </div>
                  {supportHint === "PEA" && (
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">Recommandé</span>
                  )}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Fiscalité avantageuse après 5 ans</span>
                      <p className="text-slate-500">Seulement 17,2% de prélèvements sociaux sur les gains (au lieu de 30% flat tax).</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Plafond : 150 000 €</span>
                      <p className="text-slate-500">En versements (les gains ne comptent pas dans le plafond).</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Univers limité</span>
                      <p className="text-slate-500">Actions UE uniquement, mais ETF monde éligibles via réplication synthétique (Amundi, Lyxor).</p>
                    </div>
                  </div>
                </div>

                {/* ETF suggestions for PEA */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">ETF populaires éligibles PEA</p>
                  <div className="flex flex-wrap gap-2">
                    {["Amundi MSCI World", "Lyxor S&P 500", "Amundi Euro Stoxx 50", "BNP Easy CAC 40"].map((etf) => (
                      <span key={etf} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">{etf}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTO Card */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${
                supportHint === "CTO" 
                  ? "border-violet-200 bg-violet-50/50" 
                  : "border-slate-200 bg-white"
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      supportHint === "CTO" ? "bg-violet-100" : "bg-slate-100"
                    }`}>
                      <Zap className={`w-5 h-5 ${supportHint === "CTO" ? "text-violet-600" : "text-slate-500"}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">CTO</h4>
                      <p className="text-xs text-slate-500">Compte-Titres Ordinaire</p>
                    </div>
                  </div>
                  {supportHint === "CTO" && (
                    <span className="text-xs font-medium text-violet-600 bg-violet-100 px-2 py-1 rounded-full">Recommandé</span>
                  )}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Accès mondial</span>
                      <p className="text-slate-500">Actions US, ETF étrangers, crypto, obligations... Aucune restriction géographique.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Pas de plafond</span>
                      <p className="text-slate-500">Tu peux investir autant que tu veux, sans limite.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Fiscalité classique</span>
                      <p className="text-slate-500">Flat tax de 30% sur les plus-values (12,8% IR + 17,2% PS).</p>
                    </div>
                  </div>
                </div>

                {/* ETF suggestions for CTO */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">ETF populaires sur CTO</p>
                  <div className="flex flex-wrap gap-2">
                    {["iShares Core MSCI World", "Vanguard S&P 500", "iShares Core Aggregate Bond", "Invesco QQQ (Nasdaq)"].map((etf) => (
                      <span key={etf} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">{etf}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Brokers info */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-2">
                <span className="font-medium text-slate-600">Où ouvrir ?</span> Plusieurs options selon tes besoins :
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Boursorama", type: "PEA + CTO" },
                  { name: "Bourse Direct", type: "PEA + CTO" },
                  { name: "Trade Republic", type: "CTO" },
                  { name: "Degiro", type: "CTO" },
                  { name: "Fortuneo", type: "PEA + CTO" },
                ].map((broker) => (
                  <span key={broker.name} className="text-xs px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md">
                    {broker.name} <span className="text-slate-400">({broker.type})</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Compare les frais avant de choisir. Invsty ne recommande pas de courtier en particulier.
              </p>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 mb-8">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <span className="font-medium">Important :</span> Ceci n&apos;est pas un conseil en investissement personnalisé. 
              Les estimations sont indicatives. Fais toujours tes propres recherches avant d&apos;investir.
            </div>
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!user ? (
              <Link href="/auth" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all">
                Sauvegarder mon profil
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/dashboard" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all">
                Voir mon dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link href="/quiz" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all">
              <RefreshCw className="w-4 h-4" />
              Refaire le quiz
            </Link>
          </div>
          
          {/* Bottom spacing */}
          <div className="h-16" />
        </section>

      </div>
    </main>
  );
}
