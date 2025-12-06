"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthRedirectHandler from "@/components/AuthRedirectHandler";
import { 
  ArrowRight, 
  Target, 
  PieChart, 
  Landmark, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Users,
  BarChart3,
  Quote,
  Wallet,
  LineChart,
  ChevronDown
} from "lucide-react";

// ============================================
// HERO COMPONENTS
// ============================================

function GlassBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm text-sm font-medium text-slate-700 ${className}`}>
      {children}
    </div>
  );
}

function GlassButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/25 text-slate-900 font-semibold text-lg border border-white/30 shadow-[0_12px_35px_rgba(0,0,0,0.07)] hover:bg-white/35 active:scale-[0.98] transition-all duration-300 shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] backdrop-blur-lg"
    >
      {children}
    </Link>
  );
}

function HeroHalo() {
  return (
    <>
      <div className="absolute -top-20 -right-10 w-[500px] h-[400px] bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-violet-400/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 -right-20 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl" />
    </>
  );
}

// Random profile data for variety
const PROFILES = [
  { name: "Prudent", score: 28, actions: 30, obligations: 50, cash: 20, risk: "Faible", horizon: "3-5 ans", return: "+4.5" },
  { name: "Équilibré", score: 54, actions: 55, obligations: 30, cash: 15, risk: "Modéré", horizon: "7-10 ans", return: "+7.2" },
  { name: "Modéré", score: 64, actions: 65, obligations: 20, cash: 15, risk: "Modéré", horizon: "8-12 ans", return: "+8.5" },
  { name: "Dynamique", score: 72, actions: 75, obligations: 15, cash: 10, risk: "Élevé", horizon: "10-15 ans", return: "+9.8" },
  { name: "Offensif", score: 88, actions: 90, obligations: 5, cash: 5, risk: "Très élevé", horizon: "15+ ans", return: "+12.4" },
];

const PROFILE_STYLES: Record<string, { gradient: string; halo: string; iconBg: string }> = {
  Prudent: {
    gradient: "from-emerald-50 via-white to-emerald-100/70",
    halo: "bg-emerald-200/40",
    iconBg: "from-emerald-400 to-teal-500",
  },
  "Équilibré": {
    gradient: "from-[#E8EDFF] via-white to-[#DDE6FF]",
    halo: "bg-blue-200/45",
    iconBg: "from-blue-500 to-indigo-500",
  },
  Modéré: {
    gradient: "from-[#E9E7FF] via-white to-[#DDE6FF]",
    halo: "bg-indigo-200/45",
    iconBg: "from-indigo-500 to-blue-500",
  },
  Dynamique: {
    gradient: "from-[#F9E9FF] via-white to-[#E7E9FF]",
    halo: "bg-pink-200/40",
    iconBg: "from-pink-500 to-violet-500",
  },
  Offensif: {
    gradient: "from-[#FFE8E0] via-white to-[#FFEFE6]",
    halo: "bg-orange-200/40",
    iconBg: "from-orange-500 to-rose-500",
  },
};

function getRandomProfile() {
  return PROFILES[Math.floor(Math.random() * PROFILES.length)];
}

function HeroCard() {
  const [profile, setProfile] = useState(PROFILES[1]); // Default to Équilibré
  
  useEffect(() => {
    setProfile(getRandomProfile());
  }, []);

  return (
    <div className="relative group">
      {/* Halo effect */}
      <HeroHalo />
      <div className={`absolute -inset-6 rounded-[28px] blur-3xl ${PROFILE_STYLES[profile.name]?.halo || "bg-blue-200/30"}`} aria-hidden />
      
      {/* Main Card */}
      <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 overflow-hidden hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)] hover:scale-[1.01] transition-all duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br ${PROFILE_STYLES[profile.name]?.gradient || "from-[#E8EDFF] via-white to-[#DDE6FF]"} opacity-75 pointer-events-none`} />
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${PROFILE_STYLES[profile.name]?.iconBg || "from-blue-500 to-indigo-600"} flex items-center justify-center shadow-lg shadow-blue-500/30`}>
              <PieChart className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-slate-500 text-sm">Profil détecté</div>
              <div className="text-slate-900 font-bold text-xl">{profile.name}</div>
            </div>
            <div className="ml-auto">
              <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-full">
                <span className="text-sm font-semibold text-emerald-600">Score: {profile.score}</span>
              </div>
            </div>
          </div>
          
          {/* Allocation Bars */}
          <div className="space-y-5 mb-8">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">Actions / ETF Monde</span>
                <span className="font-bold text-slate-900">{profile.actions}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out animate-bar-grow" style={{ width: `${profile.actions}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">Obligations</span>
                <span className="font-bold text-slate-900">{profile.obligations}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000 ease-out delay-100 animate-bar-grow" style={{ width: `${profile.obligations}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">Liquidités</span>
                <span className="font-bold text-slate-900">{profile.cash}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all duration-1000 ease-out delay-200 animate-bar-grow" style={{ width: `${profile.cash}%` }} />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-600">
              <Landmark className="w-4 h-4" />
              <span className="text-sm">Support : <strong className="text-slate-900">PEA + CTO</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">{profile.return}%/an</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Badge - Risk */}
      <div className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/60 animate-float">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Risque</div>
            <div className="font-bold text-slate-900">{profile.risk}</div>
          </div>
        </div>
      </div>

      {/* Floating Badge - Horizon */}
      <div className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/60 animate-float-delayed">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Horizon</div>
            <div className="font-bold text-slate-900">{profile.horizon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OTHER COMPONENTS
// ============================================

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="group text-center p-6 bg-white/40 border border-white/20 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="text-4xl font-semibold text-slate-900 mb-2">{value}</div>
      <div className="text-sm text-slate-600 relative inline-flex items-center gap-2">
        <span>{label}</span>
        <span className="block h-[2px] w-6 bg-gradient-to-r from-[#4F63FF] to-[#6A5DFF] transition-all duration-200 group-hover:w-8" />
      </div>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 rounded-full bg-white/30 border border-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-300 shadow-sm">
        <span className="text-2xl font-bold text-[#4F63FF]">{number}</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
    </div>
  );
}

// ============================================
// PAGE
// ============================================

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <AuthRedirectHandler />
      
      {/* ================================================
          HERO — VisionOS Premium
          ================================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F4F7FF] via-[#EEF3FF] to-[#F8FAFF]">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(148,163,184,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(148,163,184,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px'
            }}
          />
          {/* Soft veil */}
          <div className="absolute inset-0 bg-white/5" />
          
          {/* Animated Candlestick Chart */}
          <div className="absolute inset-0 flex items-center overflow-hidden opacity-[0.15]">
            <svg 
              className="absolute w-[250%] h-[50%] animate-chart-scroll"
              viewBox="0 0 2000 200" 
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Candlesticks - alternating green and red */}
              {/* Pattern repeats for seamless loop */}
              <g className="candlesticks">
                {/* Candle 1 - Green up */}
                <line x1="20" y1="140" x2="20" y2="90" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="15" y="100" width="10" height="30" fill="#22C55E" rx="1" />
                
                {/* Candle 2 - Red down */}
                <line x1="50" y1="150" x2="50" y2="95" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="45" y="105" width="10" height="35" fill="#EF4444" rx="1" />
                
                {/* Candle 3 - Green up */}
                <line x1="80" y1="130" x2="80" y2="70" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="75" y="80" width="10" height="40" fill="#22C55E" rx="1" />
                
                {/* Candle 4 - Green up */}
                <line x1="110" y1="110" x2="110" y2="55" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="105" y="65" width="10" height="35" fill="#22C55E" rx="1" />
                
                {/* Candle 5 - Red down */}
                <line x1="140" y1="120" x2="140" y2="60" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="135" y="70" width="10" height="40" fill="#EF4444" rx="1" />
                
                {/* Candle 6 - Red down */}
                <line x1="170" y1="140" x2="170" y2="80" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="165" y="90" width="10" height="40" fill="#EF4444" rx="1" />
                
                {/* Candle 7 - Green up */}
                <line x1="200" y1="130" x2="200" y2="60" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="195" y="70" width="10" height="50" fill="#22C55E" rx="1" />
                
                {/* Candle 8 - Green up */}
                <line x1="230" y1="100" x2="230" y2="40" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="225" y="50" width="10" height="40" fill="#22C55E" rx="1" />
                
                {/* Candle 9 - Red down */}
                <line x1="260" y1="110" x2="260" y2="50" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="255" y="60" width="10" height="40" fill="#EF4444" rx="1" />
                
                {/* Candle 10 - Green up */}
                <line x1="290" y1="90" x2="290" y2="35" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="285" y="45" width="10" height="35" fill="#22C55E" rx="1" />
                
                {/* Candle 11 - Green up */}
                <line x1="320" y1="75" x2="320" y2="25" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="315" y="35" width="10" height="30" fill="#22C55E" rx="1" />
                
                {/* Candle 12 - Red down */}
                <line x1="350" y1="90" x2="350" y2="35" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="345" y="45" width="10" height="35" fill="#EF4444" rx="1" />
                
                {/* Candle 13 - Red down */}
                <line x1="380" y1="110" x2="380" y2="50" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="375" y="60" width="10" height="40" fill="#EF4444" rx="1" />
                
                {/* Candle 14 - Green up */}
                <line x1="410" y1="100" x2="410" y2="45" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="405" y="55" width="10" height="35" fill="#22C55E" rx="1" />
                
                {/* Candle 15 - Green up big */}
                <line x1="440" y1="80" x2="440" y2="30" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="435" y="40" width="10" height="30" fill="#22C55E" rx="1" />
                
                {/* Candle 16 - Green up */}
                <line x1="470" y1="65" x2="470" y2="20" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="465" y="30" width="10" height="25" fill="#22C55E" rx="1" />
                
                {/* Candle 17 - Red down */}
                <line x1="500" y1="80" x2="500" y2="25" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="495" y="35" width="10" height="35" fill="#EF4444" rx="1" />
                
                {/* Candle 18 - Red down */}
                <line x1="530" y1="100" x2="530" y2="40" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="525" y="50" width="10" height="40" fill="#EF4444" rx="1" />
                
                {/* Candle 19 - Green up */}
                <line x1="560" y1="90" x2="560" y2="35" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="555" y="45" width="10" height="35" fill="#22C55E" rx="1" />
                
                {/* Candle 20 - Green up */}
                <line x1="590" y1="70" x2="590" y2="25" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="585" y="35" width="10" height="25" fill="#22C55E" rx="1" />
                
                {/* Continue pattern - more candles */}
                <line x1="620" y1="85" x2="620" y2="30" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="615" y="40" width="10" height="35" fill="#EF4444" rx="1" />
                
                <line x1="650" y1="75" x2="650" y2="25" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="645" y="35" width="10" height="30" fill="#22C55E" rx="1" />
                
                <line x1="680" y1="60" x2="680" y2="20" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="675" y="30" width="10" height="20" fill="#22C55E" rx="1" />
                
                <line x1="710" y1="80" x2="710" y2="30" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="705" y="40" width="10" height="30" fill="#EF4444" rx="1" />
                
                <line x1="740" y1="95" x2="740" y2="45" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="735" y="55" width="10" height="30" fill="#EF4444" rx="1" />
                
                <line x1="770" y1="85" x2="770" y2="40" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="765" y="50" width="10" height="25" fill="#22C55E" rx="1" />
                
                <line x1="800" y1="70" x2="800" y2="30" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="795" y="40" width="10" height="20" fill="#22C55E" rx="1" />
                
                {/* Repeat pattern for seamless loop */}
                <line x1="830" y1="140" x2="830" y2="90" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="825" y="100" width="10" height="30" fill="#22C55E" rx="1" />
                
                <line x1="860" y1="150" x2="860" y2="95" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="855" y="105" width="10" height="35" fill="#EF4444" rx="1" />
                
                <line x1="890" y1="130" x2="890" y2="70" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="885" y="80" width="10" height="40" fill="#22C55E" rx="1" />
                
                <line x1="920" y1="110" x2="920" y2="55" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="915" y="65" width="10" height="35" fill="#22C55E" rx="1" />
                
                <line x1="950" y1="120" x2="950" y2="60" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                <rect x="945" y="70" width="10" height="40" fill="#EF4444" rx="1" />
                
                <line x1="980" y1="100" x2="980" y2="45" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
                <rect x="975" y="55" width="10" height="35" fill="#22C55E" rx="1" />
              </g>
              
              {/* Trend line overlay */}
              <path 
                d="M0,130 Q100,110 200,80 T400,50 T600,35 T800,45 T1000,60" 
                stroke="url(#trendGradient)" 
                strokeWidth="2" 
                fill="none"
                opacity="0.4"
              />
              
              <defs>
                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                  <stop offset="20%" stopColor="#3B82F6" />
                  <stop offset="80%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Ambient glow orbs */}
          <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-[#DDE6FF]/60 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-40 w-[420px] h-[420px] bg-[#E8EDFF]/50 rounded-full blur-3xl" />
          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-soft-light pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="max-w-xl">
              {/* Badge */}
              <GlassBadge className="mb-8 animate-fade-in">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Quiz intelligent • Résultats en 2 min</span>
              </GlassBadge>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6">
                Ton plan
                <br />
                d'investissement.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F63FF] via-[#6A5DFF] to-[#4F63FF]">
                  En 2 minutes.
                </span>
          </h1>

              {/* Subtitle */}
              <p className="text-xl text-slate-500 mb-10 max-w-md leading-relaxed">
                Un quiz intelligent qui adapte ton allocation à ton budget, ton horizon et ta tolérance au risque.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 items-start mb-8">
                <GlassButton href="/quiz">
                  Faire le quiz gratuitement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </GlassButton>
              </div>

              {/* Trust Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Gratuit</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Anonyme</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Sans inscription</span>
                </div>
              </div>
            </div>

            {/* Right: Card */}
            <div className="hidden lg:block relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl opacity-30" />
              <HeroCard />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce-slow">
            <span className="text-xs text-slate-400 font-medium">Découvrir</span>
            <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-sm flex items-center justify-center">
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[#dfe6ff] to-transparent opacity-80" />

      {/* ================================================
          2. SECTION "Pourquoi Invsty existe"
          ================================================ */}
      <section className="py-24 px-6 bg-[#F7F9FF]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/40 border border-white/20 rounded-2xl backdrop-blur-md p-8 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/60 border border-white/40 text-[11px] font-semibold text-slate-600 uppercase tracking-[0.18em]">
              Pourquoi Invsty
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
              L'investissement, c'est simple.
              <br />
              <span className="text-[#4F63FF]">On t'a juste mal expliqué.</span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Entre les conseils contradictoires, les produits complexes et les contenus sponsorisés, 
              il est difficile de savoir quoi faire de son argent. Invsty remet de l'ordre : on t'aide 
              à comprendre combien investir, combien de risque prendre, et sur quels supports placer ton argent.
            </p>
            
            {/* 3 points grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/30 border border-white/20 shadow-sm rounded-full backdrop-blur-md">
                <CheckCircle2 className="w-5 h-5 text-[#4F63FF] shrink-0" />
                <span className="text-slate-700 font-medium text-sm">Pas de jargon inutile</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/30 border border-white/20 shadow-sm rounded-full backdrop-blur-md">
                <CheckCircle2 className="w-5 h-5 text-[#4F63FF] shrink-0" />
                <span className="text-slate-700 font-medium text-sm">Pas de promesse irréaliste</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/30 border border-white/20 shadow-sm rounded-full backdrop-blur-md">
                <CheckCircle2 className="w-5 h-5 text-[#4F63FF] shrink-0" />
                <span className="text-slate-700 font-medium text-sm">Recommandations claires</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[#dfe6ff] to-transparent opacity-80" />

      {/* ================================================
          3. SECTION "Ce qu'Invsty construit pour toi"
          ================================================ */}
      <section className="py-24 px-6 bg-[#F4F7FF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-white/60 border border-white/40 text-[11px] font-semibold text-slate-600 uppercase tracking-[0.18em]">
              Ce que tu obtiens
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Ce qu'Invsty construit pour toi
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              À la fin du quiz, tu repars avec un plan d'investissement structuré, 
              pas juste une étiquette de profil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="relative overflow-hidden bg-white/35 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 animate-fade-in">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-8 h-16 bg-[#4F63FF]/10 rounded-full" />
                <div className="absolute top-10 right-8 w-6 h-12 bg-[#6A5DFF]/10 rounded-full" />
                <div className="absolute top-16 right-12 w-4 h-10 bg-[#DDE6FF]/30 rounded-full" />
              </div>
              <div className="w-16 h-16 rounded-full bg-white/25 border border-white/30 shadow-sm flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[#4F63FF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Ton profil investisseur ultra précis
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Au-delà de "prudent" ou "dynamique", on évalue ta capacité à prendre du risque, 
                ton horizon d'investissement, et la perte maximale que tu peux accepter sans paniquer.
              </p>
            </div>

            {/* Card 2 */}
            <div className="relative overflow-hidden bg-white/35 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: "80ms" }}>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-8 h-16 bg-[#6A5DFF]/10 rounded-full" />
                <div className="absolute top-10 right-8 w-6 h-12 bg-[#4F63FF]/10 rounded-full" />
                <div className="absolute top-16 right-12 w-4 h-10 bg-[#E8EDFF]/30 rounded-full" />
              </div>
              <div className="w-16 h-16 rounded-full bg-white/25 border border-white/30 shadow-sm flex items-center justify-center mb-6">
                <PieChart className="w-8 h-8 text-[#6A5DFF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Ton allocation personnalisée
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Une répartition chiffrée entre actions, ETF, obligations et liquidités, 
                adaptée à ton budget, à ton objectif et à ta tolérance au risque.
              </p>
            </div>

            {/* Card 3 */}
            <div className="relative overflow-hidden bg-white/35 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: "140ms" }}>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-8 h-16 bg-[#4F63FF]/12 rounded-full" />
                <div className="absolute top-10 right-8 w-6 h-12 bg-[#6A5DFF]/10 rounded-full" />
                <div className="absolute top-16 right-12 w-4 h-10 bg-[#DDE6FF]/30 rounded-full" />
              </div>
              <div className="w-16 h-16 rounded-full bg-white/25 border border-white/30 shadow-sm flex items-center justify-center mb-6">
                <Landmark className="w-8 h-8 text-[#4F63FF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Le bon support : PEA ou CTO ?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                On t'indique si tu dois privilégier un PEA, un CTO, ou les deux, 
                en fonction de ton profil et de ton horizon. Tu sais enfin où ouvrir tes comptes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[#dfe6ff] to-transparent opacity-80" />

      {/* ================================================
          4. SECTION "La puissance de l'algorithme"
          ================================================ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-slate-100/80 border border-white/60 text-[11px] font-semibold text-slate-600 uppercase tracking-[0.18em]">
                Méthode
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
                Un algorithme qui pense comme un conseiller…
                <span className="text-[#4F63FF]"> sans les frais cachés.</span>
          </h2>

              <p className="text-slate-600 mb-8 leading-relaxed">
                Invsty combine plusieurs paramètres – montant disponible, flux d'épargne, 
                horizon, perte maximale acceptable et confort psychologique – pour calculer 
                un profil et une allocation qui tiennent la route dans la vraie vie.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/30 border border-white/20 backdrop-blur-md rounded-full shadow-sm">
                  <Zap className="w-4 h-4 text-[#4F63FF]" />
                  <span className="text-sm font-medium text-slate-700">Analyse en temps réel</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/30 border border-white/20 backdrop-blur-md rounded-full shadow-sm">
                  <Shield className="w-4 h-4 text-[#4F63FF]" />
                  <span className="text-sm font-medium text-slate-700">Gestion du risque</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/30 border border-white/20 backdrop-blur-md rounded-full shadow-sm">
                  <TrendingUp className="w-4 h-4 text-[#4F63FF]" />
                  <span className="text-sm font-medium text-slate-700">Allocation optimisée</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic">
                Invsty ne remplace pas un conseil personnalisé réglementé. 
                Il te donne un cadre clair pour prendre de meilleures décisions.
              </p>
            </div>

            {/* Right: Simulation Card */}
            <div className="relative">
              <div className="absolute -top-10 -right-6 w-56 h-56 bg-blue-200/30 blur-3xl rounded-full opacity-60" />
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/25 shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
                {/* Abstract curve */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" viewBox="0 0 400 200" fill="none">
                  <path d="M-10 150 C 80 80, 160 220, 260 120 S 420 80 420 180" stroke="#4F63FF" strokeWidth="22" strokeLinecap="round" />
                </svg>

                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/35 border border-white/25 backdrop-blur-md text-sm font-semibold text-slate-800">
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Exemple</span>
                  <span>Investisseur équilibré</span>
                </div>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/35 border border-white/30 flex items-center justify-center shadow-sm">
                    <BarChart3 className="w-6 h-6 text-[#4F63FF]" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm">Exemple de plan</div>
                    <div className="text-slate-900 font-bold text-lg">Investisseur Équilibré</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E8EDFF] flex items-center justify-center">
                        <LineChart className="w-4 h-4 text-[#4F63FF]" />
                      </div>
                      <span className="text-slate-700 font-medium">Actions / ETF Monde</span>
                    </div>
                    <span className="font-bold text-slate-900">60%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EDEAFF] flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[#6A5DFF]" />
                      </div>
                      <span className="text-slate-700 font-medium">Obligations</span>
                    </div>
                    <span className="font-bold text-slate-900">25%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF3E5] flex items-center justify-center">
                        <Landmark className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Immobilier coté</span>
                    </div>
                    <span className="font-bold text-slate-900">10%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Cash de sécurité</span>
                    </div>
                    <span className="font-bold text-slate-900">5%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/30 relative z-10">
                  <div className="text-center">
                    <div className="text-sm text-slate-500 mb-1">Perte max théorique</div>
                    <div className="font-bold text-red-500">-12%</div>
              </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-500 mb-1">Horizon recommandé</div>
                    <div className="font-bold text-[#4F63FF]">≥ 5 ans</div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[#dfe6ff] to-transparent opacity-80" />

      {/* ================================================
          5. SECTION "Comment ça marche ?"
          ================================================ */}
      <section className="py-24 px-6 bg-[#F5F7FF]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-white/60 border border-white/40 text-[11px] font-semibold text-slate-600 uppercase tracking-[0.18em]">
              Parcours
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Comment ça marche ?
          </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Un processus simple, pensé pour aller droit au but.
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent mb-12" />

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
              <StepCard 
                number="1"
                title="Tu réponds au quiz"
                description="Montant, horizon, tolérance au risque, perte max acceptable. On ne te demande que l'essentiel."
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "120ms" }}>
              <StepCard 
                number="2"
                title="On analyse ton risque"
                description="Notre algorithme calcule ton profil, ta capacité à prendre du risque et une allocation cohérente."
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "190ms" }}>
              <StepCard 
                number="3"
                title="Tu obtiens ton plan"
                description="Tu repars avec un plan d'investissement structuré, des pondérations concrètes et le bon type de compte."
              />
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/25 text-slate-900 font-semibold border border-white/30 hover:bg-white/40 active:scale-[0.98] transition-all duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.08)] backdrop-blur-lg"
            >
              Commencer le quiz
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[#dfe6ff] to-transparent opacity-80" />

      {/* ================================================
          6. SECTION "Preuves / chiffres"
          ================================================ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-slate-100/80 border border-white/60 text-[11px] font-semibold text-slate-600 uppercase tracking-[0.18em]">
              Preuve sociale
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Ce que les premiers utilisateurs en disent
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <StatCard value="1 247" label="allocations générées en version beta" />
            <StatCard value="67%" label="découvrent qu'ils ne sont pas sur le bon support" />
            <StatCard value="1:52" label="temps moyen pour compléter le quiz" />
          </div>

          {/* Testimonial */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 max-w-2xl mx-auto">
            <Quote className="w-10 h-10 text-slate-200 mb-4" />
            <p className="text-slate-700 text-lg italic mb-6 leading-relaxed">
              "Invsty m'a permis de clarifier ce que je devais faire avec mon PEA et mon CTO 
              en moins de 5 minutes. Simple, clair, efficace."
            </p>
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
          <div>
                <div className="font-semibold text-slate-900">Utilisateur beta</div>
                <div className="text-sm text-slate-500">Profil Équilibré</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[#dfe6ff] to-transparent opacity-80" />

      {/* ================================================
          7. SECTION CTA FINAL
          ================================================ */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#E8EDFF] to-[#C9D7FF] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-300/15 rounded-full blur-3xl" />
        
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-white/40 border border-white/30 text-[11px] font-semibold text-slate-700 uppercase tracking-[0.18em]">
            Prochaine étape
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Prêt à construire ton portefeuille ?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            En 2 minutes, découvre le plan d'investissement qui correspond à ton profil et à tes objectifs.
          </p>
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white/25 text-slate-900 font-bold text-lg hover:bg-white/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 shadow-xl border border-white/30 backdrop-blur-lg"
          >
            Faire le quiz gratuitement
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes chart-scroll {
          0% {
            transform: translateX(0%);
          }
          50% {
            transform: translateX(-40%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-chart-scroll {
          animation: chart-scroll 60s ease-in-out infinite;
        }
        
        @keyframes slow-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(8px); }
        }
        .animate-slow-float {
          animation: slow-float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        @keyframes bar-grow {
          from { width: 0%; }
        }
        .animate-bar-grow {
          animation: bar-grow 1s ease-out forwards;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

