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
  BarChart3,
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

// Random profile data for variety
const PROFILES = [
  { name: "Prudent", score: 28, actions: 30, obligations: 50, cash: 20, risk: "Faible", horizon: "3-5 ans", return: "+4.5" },
  { name: "Équilibré", score: 54, actions: 55, obligations: 30, cash: 15, risk: "Modéré", horizon: "7-10 ans", return: "+7.2" },
  { name: "Modéré", score: 64, actions: 65, obligations: 20, cash: 15, risk: "Modéré", horizon: "8-12 ans", return: "+8.5" },
  { name: "Dynamique", score: 72, actions: 75, obligations: 15, cash: 10, risk: "Élevé", horizon: "10-15 ans", return: "+9.8" },
  { name: "Offensif", score: 88, actions: 90, obligations: 5, cash: 5, risk: "Très élevé", horizon: "15+ ans", return: "+12.4" },
];

function getRandomProfile() {
  return PROFILES[Math.floor(Math.random() * PROFILES.length)];
}

function HeroCard() {
  const [profile, setProfile] = useState(PROFILES[1]); // Default to Équilibré
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setProfile(getRandomProfile());
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    <div 
      className="relative w-full"
      style={{ perspective: "1200px" }}
    >
      {/* 3D Container with initial rotation */}
      <div 
        className={`relative transition-all duration-1000 ease-out ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          transformStyle: "preserve-3d",
          transform: "rotateX(4deg) rotateY(-6deg)",
        }}
      >
        {/* Multi-layer shadows for depth illusion */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            transform: "translateZ(-25px) translateY(8px)",
            background: "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)",
            filter: "blur(25px)",
          }}
        />
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            transform: "translateZ(-12px) translateY(4px)",
            background: "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 100%)",
            filter: "blur(15px)",
          }}
        />

        {/* Main Card with slow float animation */}
        <div 
          className="relative bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/60 overflow-hidden animate-card-float"
          style={{
            boxShadow: `
              0 4px 6px rgba(0,0,0,0.02),
              0 10px 20px rgba(0,0,0,0.03),
              0 20px 40px rgba(0,0,0,0.04),
              0 40px 80px rgba(0,0,0,0.06)
            `,
          }}
        >
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-slate-50/20 pointer-events-none" />
          
          {/* Micro-label contextuel */}
          <div className="absolute top-4 right-4 z-10">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Basé sur ton profil</span>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Profil</div>
                <div className="text-slate-900 font-bold text-xl">{profile.name}</div>
              </div>
              <div className="ml-auto">
                <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-base font-bold text-indigo-600">{profile.score}/100</span>
                </div>
              </div>
            </div>
            
            {/* Allocation Bars */}
            <div className="space-y-4 mb-8">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Actions / ETF</span>
                  <span className="font-bold text-slate-900">{profile.actions}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: mounted ? `${profile.actions}%` : '0%' }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Obligations</span>
                  <span className="font-bold text-slate-900">{profile.obligations}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-1000 ease-out delay-150" 
                    style={{ width: mounted ? `${profile.obligations}%` : '0%' }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Liquidités</span>
                  <span className="font-bold text-slate-900">{profile.cash}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-slate-300 to-slate-400 rounded-full transition-all duration-1000 ease-out delay-300" 
                    style={{ width: mounted ? `${profile.cash}%` : '0%' }} 
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-500">
                <Landmark className="w-4 h-4" />
                <span className="text-sm">PEA recommandé</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-900">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">{profile.return}%/an</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Satellite Card - Risque (top-right, elevated) */}
      <div 
        className={`absolute -top-2 -right-6 z-20 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        style={{ 
          transformStyle: "preserve-3d",
          transform: "translateZ(35px)",
        }}
      >
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-xl px-4 py-3 border border-amber-100 animate-satellite-float"
          style={{
            boxShadow: `
              0 4px 12px rgba(251,191,36,0.08),
              0 12px 28px rgba(0,0,0,0.06)
            `,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Risque</div>
              <div className="text-sm font-bold text-amber-600">{profile.risk}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Satellite Card - Horizon (bottom-left, elevated) */}
      <div 
        className={`absolute -bottom-2 -left-6 z-20 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ 
          transformStyle: "preserve-3d",
          transform: "translateZ(30px)",
        }}
      >
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-xl px-4 py-3 border border-blue-100 animate-satellite-float-delayed"
          style={{
            boxShadow: `
              0 4px 12px rgba(59,130,246,0.08),
              0 12px 28px rgba(0,0,0,0.06)
            `,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Horizon</div>
              <div className="text-sm font-bold text-blue-600">{profile.horizon}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Satellite Card - Rendement (bottom-right, slightly behind) */}
      <div 
        className={`absolute bottom-12 -right-8 z-10 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
        style={{ 
          transformStyle: "preserve-3d",
          transform: "translateZ(20px)",
        }}
      >
        <div 
          className="bg-white/90 backdrop-blur-lg rounded-xl px-4 py-3 border border-emerald-100 animate-satellite-float-slow"
          style={{
            boxShadow: `
              0 4px 10px rgba(16,185,129,0.08),
              0 8px 20px rgba(0,0,0,0.04)
            `,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Rendement</div>
              <div className="text-sm font-bold text-emerald-600">{profile.return}%</div>
            </div>
          </div>
        </div>
      </div>
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
          <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-[#DDE6FF]/50 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-40 w-[420px] h-[420px] bg-[#E8EDFF]/40 rounded-full blur-3xl" />
          
          {/* Focal point gradient behind card area */}
          <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[500px] h-[600px] bg-gradient-to-br from-slate-100/80 via-blue-50/50 to-transparent rounded-full blur-3xl" />
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

              {/* Title - micro-ajusté */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6">
                Ton plan
                <br />
                d&apos;investissement,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F63FF] via-[#6A5DFF] to-[#4F63FF]">
                  adapté à toi.
                </span>
              </h1>

              {/* Subtitle - plus concret */}
              <p className="text-xl text-slate-500 mb-10 max-w-md leading-relaxed">
                Un quiz intelligent qui transforme ton budget, ton horizon et ton rapport au risque en une allocation claire.
              </p>

              {/* CTA */}
              <div className="flex flex-col items-start gap-3 mb-8">
                <GlassButton href="/quiz">
                  Faire le quiz gratuitement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </GlassButton>
                {/* Micro-reassurance sous le CTA */}
                <p className="text-sm text-slate-400 ml-1">
                  Résultats immédiats • Aucun compte requis
                </p>
              </div>

              {/* Trust Pills - simplifiés */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Gratuit</span>
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

      {/* ================================================
          2. SECTION "Comment ça marche ?" - DÉPLACÉE ICI
          ================================================ */}
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-slate-500">
              3 étapes. 2 minutes. 0 prise de tête.
            </p>
          </div>

          {/* App Flow - Desktop */}
          <div className="hidden md:block">
            <div className="flex items-start justify-center gap-4">
              
              {/* Step 1 - Quiz Screen */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Phone frame */}
                  <div 
                    className="w-52 bg-slate-800 rounded-[2rem] p-2 shadow-2xl"
                    style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                  >
                    {/* Screen */}
                    <div className="bg-white rounded-[1.5rem] overflow-hidden">
                      {/* Status bar */}
                      <div className="bg-slate-50 px-4 py-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">9:41</span>
                        <div className="w-16 h-4 bg-slate-800 rounded-full" />
                        <div className="flex gap-1">
                          <div className="w-3 h-2 bg-slate-400 rounded-sm" />
                        </div>
                      </div>
                      
                      {/* Quiz content */}
                      <div className="p-4 h-72">
                        <div className="text-[10px] text-indigo-500 font-medium mb-2">Question 3/8</div>
                        <div className="text-sm font-semibold text-slate-900 mb-4">
                          Quel est ton horizon d&apos;investissement ?
                        </div>
                        
                        {/* Options */}
                        <div className="space-y-2">
                          <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                            Moins de 3 ans
                          </div>
                          <div className="px-3 py-2 bg-indigo-50 rounded-lg border-2 border-indigo-400 text-xs text-indigo-700 font-medium">
                            5 à 10 ans ✓
                          </div>
                          <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                            Plus de 10 ans
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-6">
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-3/8 bg-indigo-500 rounded-full" style={{ width: '37.5%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    1
                  </div>
                </div>
                
                <h3 className="mt-6 text-base font-semibold text-slate-900">Tu réponds au quiz</h3>
                <p className="text-sm text-slate-500 text-center max-w-[180px]">8 questions simples</p>
              </div>

              {/* Arrow 1 */}
              <div className="flex items-center pt-32">
                <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-300 to-blue-300" />
                <ChevronDown className="w-5 h-5 text-blue-400 -rotate-90 -ml-1" />
              </div>

              {/* Step 2 - Analysis Screen */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Phone frame */}
                  <div 
                    className="w-52 bg-slate-800 rounded-[2rem] p-2 shadow-2xl"
                    style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                  >
                    {/* Screen */}
                    <div className="bg-white rounded-[1.5rem] overflow-hidden">
                      {/* Status bar */}
                      <div className="bg-slate-50 px-4 py-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">9:42</span>
                        <div className="w-16 h-4 bg-slate-800 rounded-full" />
                        <div className="flex gap-1">
                          <div className="w-3 h-2 bg-slate-400 rounded-sm" />
                        </div>
                      </div>
                      
                      {/* Analysis content */}
                      <div className="p-4 h-72 flex flex-col items-center justify-center">
                        {/* Animated loader */}
                        <div className="relative w-20 h-20 mb-4">
                          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                          <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-blue-500" />
                          </div>
                        </div>
                        
                        <div className="text-sm font-semibold text-slate-900 mb-1">Analyse en cours...</div>
                        <div className="text-xs text-slate-500 text-center">
                          Calcul de ton profil<br />et de ton allocation
                        </div>
                        
                        {/* Fake metrics appearing */}
                        <div className="mt-4 space-y-1 w-full">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] text-slate-600">Risque évalué</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] text-slate-600">Horizon validé</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-50">
                            <div className="w-3 h-3 rounded-full border border-slate-300" />
                            <span className="text-[10px] text-slate-400">Allocation...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    2
                  </div>
                </div>
                
                <h3 className="mt-6 text-base font-semibold text-slate-900">On analyse</h3>
                <p className="text-sm text-slate-500 text-center max-w-[180px]">Calcul instantané</p>
              </div>

              {/* Arrow 2 */}
              <div className="flex items-center pt-32">
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-300 to-emerald-300" />
                <ChevronDown className="w-5 h-5 text-emerald-400 -rotate-90 -ml-1" />
              </div>

              {/* Step 3 - Result Screen */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Phone frame */}
                  <div 
                    className="w-52 bg-slate-800 rounded-[2rem] p-2 shadow-2xl"
                    style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                  >
                    {/* Screen */}
                    <div className="bg-white rounded-[1.5rem] overflow-hidden">
                      {/* Status bar */}
                      <div className="bg-slate-50 px-4 py-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">9:43</span>
                        <div className="w-16 h-4 bg-slate-800 rounded-full" />
                        <div className="flex gap-1">
                          <div className="w-3 h-2 bg-slate-400 rounded-sm" />
                        </div>
                      </div>
                      
                      {/* Result content */}
                      <div className="p-4 h-72">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <PieChart className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Ton profil</div>
                            <div className="text-sm font-bold text-slate-900">Équilibré</div>
                          </div>
                          <div className="ml-auto px-2 py-1 bg-emerald-50 rounded text-[10px] font-semibold text-emerald-600">
                            54/100
                          </div>
                        </div>
                        
                        {/* Mini allocation */}
                        <div className="space-y-2 mb-4">
                          <div>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-500">Actions</span>
                              <span className="font-medium text-slate-700">55%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '55%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-500">Obligations</span>
                              <span className="font-medium text-slate-700">30%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-violet-500 rounded-full" style={{ width: '30%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-500">Liquidités</span>
                              <span className="font-medium text-slate-700">15%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-400 rounded-full" style={{ width: '15%' }} />
                            </div>
                          </div>
                        </div>
                        
                        {/* Footer info */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            <Landmark className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] text-slate-500">PEA</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-medium text-emerald-600">+7.2%/an</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    3
                  </div>
                </div>
                
                <h3 className="mt-6 text-base font-semibold text-slate-900">Tu obtiens ton plan</h3>
                <p className="text-sm text-slate-500 text-center max-w-[180px]">Allocation personnalisée</p>
              </div>
            </div>
          </div>

          {/* Mobile version - Simplified */}
          <div className="md:hidden space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                1
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-1">Tu réponds au quiz</h3>
                <p className="text-sm text-slate-500">8 questions simples sur ton budget et tes objectifs.</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-200 to-blue-200" />
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                2
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-1">On analyse ton profil</h3>
                <p className="text-sm text-slate-500">Calcul instantané de ton niveau de risque.</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-blue-200 to-emerald-200" />
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                3
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-1">Tu obtiens ton plan</h3>
                <p className="text-sm text-slate-500">Allocation claire avec le support recommandé.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              Commencer maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================
          3. SECTION "Ce que fait Invsty"
          ================================================ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Ce que fait Invsty
            </h2>
            <p className="text-lg text-slate-500">
              Un quiz. Une allocation. Aucune complexité.
            </p>
          </div>

          {/* 3 cartes visuelles style "app screens" */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Analyse */}
            <div className="group relative">
              <div 
                className="bg-white rounded-2xl border border-slate-200 p-6 h-full transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                {/* Mini app header */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-2 h-2 rounded-full bg-red-300" />
                  <div className="w-2 h-2 rounded-full bg-amber-300" />
                  <div className="w-2 h-2 rounded-full bg-emerald-300" />
                </div>
                
                {/* Visual content */}
                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-20 bg-slate-200 rounded mb-1.5" />
                      <div className="h-1.5 w-14 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-200 rounded" />
                    <div className="h-2 w-3/4 bg-slate-100 rounded" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Analyse ton profil
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Quelques questions pour comprendre ta situation.
                </p>
              </div>
            </div>

            {/* Card 2 - Évalue */}
            <div className="group relative">
              <div 
                className="bg-white rounded-2xl border border-slate-200 p-6 h-full transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                {/* Mini app header */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-2 h-2 rounded-full bg-red-300" />
                  <div className="w-2 h-2 rounded-full bg-amber-300" />
                  <div className="w-2 h-2 rounded-full bg-emerald-300" />
                </div>
                
                {/* Visual content - Risk gauge */}
                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <div className="flex justify-center mb-3">
                    <div className="relative w-20 h-10 overflow-hidden">
                      {/* Gauge arc */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 rounded-full border-4 border-slate-200" />
                      <div className="absolute bottom-0 left-0 right-0 h-20 rounded-full border-4 border-transparent border-l-amber-400 border-b-amber-400" style={{ transform: 'rotate(-45deg)' }} />
                      {/* Needle */}
                      <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-slate-700 origin-bottom -translate-x-1/2" style={{ transform: 'translateX(-50%) rotate(15deg)' }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 px-2">
                    <span>Prudent</span>
                    <span>Modéré</span>
                    <span>Offensif</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Évalue ton risque
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Ton niveau de risque clairement défini.
                </p>
              </div>
            </div>

            {/* Card 3 - Génère */}
            <div className="group relative">
              <div 
                className="bg-white rounded-2xl border border-slate-200 p-6 h-full transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                {/* Mini app header */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-2 h-2 rounded-full bg-red-300" />
                  <div className="w-2 h-2 rounded-full bg-amber-300" />
                  <div className="w-2 h-2 rounded-full bg-emerald-300" />
                </div>
                
                {/* Visual content - Allocation bars */}
                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-500">Actions</span>
                        <span className="font-medium text-slate-700">55%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" style={{ width: '55%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-500">Obligations</span>
                        <span className="font-medium text-slate-700">30%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-500">Liquidités</span>
                        <span className="font-medium text-slate-700">15%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Génère ton allocation
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Une répartition cohérente avec ton profil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          3. SECTION "Comment Invsty réfléchit" - Visual 3D
          ================================================ */}
      <section className="py-20 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Header - très court */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Comment Invsty réfléchit
            </h2>
          </div>

          {/* Flow System - Horizontal on desktop, vertical on mobile */}
          <div className="relative">
            
            {/* Desktop: Horizontal flow */}
            <div className="hidden md:block">
              <div className="flex items-center justify-center gap-4">
                {/* Card 1 - Risque */}
                <div 
                  className="relative bg-white rounded-2xl p-5 border border-slate-200 animate-float-slow w-44"
                  style={{
                    boxShadow: `0 4px 20px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.04)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-0.5">Risque</h3>
                  <p className="text-xs text-slate-500">Ce que tu acceptes de perdre</p>
                </div>

                {/* Connector 1 */}
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-amber-300 to-blue-300"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                </div>

                {/* Card 2 - Horizon */}
                <div 
                  className="relative bg-white rounded-2xl p-5 border border-slate-200 animate-float-slow w-44"
                  style={{
                    animationDelay: "-3s",
                    boxShadow: `0 4px 20px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.04)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-0.5">Horizon</h3>
                  <p className="text-xs text-slate-500">Quand tu auras besoin</p>
                </div>

                {/* Connector 2 */}
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-300 to-violet-300"></div>
                </div>

                {/* Card 3 - Préférences */}
                <div 
                  className="relative bg-white rounded-2xl p-5 border border-slate-200 animate-float-slow w-44"
                  style={{
                    animationDelay: "-6s",
                    boxShadow: `0 4px 20px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.04)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-0.5">Préférences</h3>
                  <p className="text-xs text-slate-500">Ce que tu veux ou non</p>
                </div>
              </div>

              {/* Vertical connector to result */}
              <div className="flex justify-center my-6">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-slate-200 to-indigo-300"></div>
                  <ChevronDown className="w-5 h-5 text-indigo-400 -mt-1" />
                </div>
              </div>

              {/* Result Card */}
              <div className="flex justify-center">
                <div 
                  className="relative bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl px-8 py-5 border border-indigo-200/60 animate-float-slow"
                  style={{
                    animationDelay: "-4s",
                    boxShadow: `0 4px 20px rgba(99,102,241,0.1), 0 12px 40px rgba(0,0,0,0.04)`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                      <PieChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Résultat</p>
                      <p className="text-lg font-semibold text-slate-900">Ton allocation personnalisée</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Vertical flow */}
            <div className="md:hidden space-y-4">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Risque</h3>
                    <p className="text-xs text-slate-500">Ce que tu acceptes de perdre</p>
                  </div>
                </div>
              </div>

              {/* Mobile connector */}
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-gradient-to-b from-amber-200 to-blue-200"></div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Horizon</h3>
                    <p className="text-xs text-slate-500">Quand tu auras besoin</p>
                  </div>
                </div>
              </div>

              {/* Mobile connector */}
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-gradient-to-b from-blue-200 to-violet-200"></div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Préférences</h3>
                    <p className="text-xs text-slate-500">Ce que tu veux ou non</p>
                  </div>
                </div>
              </div>

              {/* Mobile connector to result */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-violet-200 to-indigo-300"></div>
                  <ChevronDown className="w-4 h-4 text-indigo-400" />
                </div>
              </div>

              {/* Result Card Mobile */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-200/60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600 font-medium">RÉSULTAT</p>
                    <p className="font-semibold text-slate-900">Ton allocation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-center text-slate-400 text-sm mt-12">
            Ces trois signaux combinés génèrent une allocation cohérente.
          </p>
        </div>
      </section>

      {/* ================================================
          4. SECTION "Ce que tu obtiens"
          ================================================ */}
      <section className="py-20 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Voici ce que tu obtiens
            </h2>
            <p className="text-lg text-slate-500">
              Un plan clair, adapté à ton profil.
            </p>
          </div>

          {/* MacBook Mockup */}
          <div className="relative max-w-4xl mx-auto">
            {/* Subtle glow behind */}
            <div className="absolute inset-0 -m-10 bg-gradient-to-br from-slate-200/50 via-blue-100/30 to-slate-100/50 rounded-[80px] blur-3xl" />
            
            {/* MacBook Frame */}
            <div className="relative">
              {/* Screen bezel */}
              <div 
                className="relative bg-slate-800 rounded-t-2xl p-3 pt-6"
                style={{
                  boxShadow: `
                    0 -2px 20px rgba(0,0,0,0.1),
                    inset 0 1px 0 rgba(255,255,255,0.1)
                  `,
                }}
              >
                {/* Camera notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-700 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-900 rounded-full" />
                </div>
                
                {/* Screen */}
                <div className="bg-gradient-to-br from-slate-100 to-white rounded-lg overflow-hidden">
                  {/* Browser chrome */}
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-3">
                    {/* Traffic lights */}
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    {/* URL bar */}
                    <div className="flex-1 max-w-xs mx-auto">
                      <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-400 text-center border border-slate-200">
                        invsty.app/result
                      </div>
                    </div>
                    <div className="w-16" />
                  </div>
                  
                  {/* App content - Result Card */}
                  <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 to-white min-h-[320px] md:min-h-[400px]">
                    <div className="max-w-md mx-auto">
                      {/* Result Card inside screen */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
                            <PieChart className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Profil</p>
                            <h3 className="text-xl font-bold text-slate-900">Équilibré</h3>
                          </div>
                          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                            <span className="text-sm font-bold text-indigo-600">54/100</span>
                          </div>
                        </div>

                        {/* Allocation Bars */}
                        <div className="space-y-3 mb-6">
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-slate-600">Actions / ETF</span>
                              <span className="font-semibold text-slate-900">55%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" style={{ width: "55%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-slate-600">Obligations</span>
                              <span className="font-semibold text-slate-900">30%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" style={{ width: "30%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-slate-600">Liquidités</span>
                              <span className="font-semibold text-slate-900">15%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-slate-300 to-slate-400 rounded-full" style={{ width: "15%" }} />
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Landmark className="w-3.5 h-3.5" />
                            <span className="text-xs">PEA recommandé</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-600">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">+7.2%/an</span>
                          </div>
                        </div>
                      </div>

                      {/* Mini indicators row below card */}
                      <div className="flex justify-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                          <Shield className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-medium text-slate-700">Risque modéré</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs font-medium text-slate-700">7-10 ans</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-xs font-medium text-slate-700">Cohérent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* MacBook base/hinge */}
              <div 
                className="relative h-4 bg-gradient-to-b from-slate-700 to-slate-600 rounded-b-sm"
                style={{
                  boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
                }}
              >
                {/* Notch indent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-500 rounded-b-lg" />
              </div>
              
              {/* MacBook bottom part (keyboard area hint) */}
              <div 
                className="relative h-2 bg-gradient-to-b from-slate-500 to-slate-400 mx-12 rounded-b-xl"
                style={{
                  boxShadow: `
                    0 8px 24px rgba(0,0,0,0.12),
                    0 16px 48px rgba(0,0,0,0.08)
                  `,
                }}
              />
            </div>

            {/* Floating badges outside MacBook */}
            <div 
              className="absolute -top-6 -right-4 md:right-8 z-10 animate-float-slow"
              style={{ animationDelay: "-2s" }}
            >
              <div className="bg-white rounded-xl px-4 py-2.5 border border-amber-100 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Risque</p>
                    <p className="text-sm font-bold text-amber-600">Modéré</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="absolute -bottom-2 -left-4 md:left-8 z-10 animate-float-slow"
              style={{ animationDelay: "-5s" }}
            >
              <div className="bg-white rounded-xl px-4 py-2.5 border border-blue-100 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Horizon</p>
                    <p className="text-sm font-bold text-blue-600">7-10 ans</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="absolute bottom-20 -right-2 md:right-4 z-10 animate-float-slow hidden md:block"
              style={{ animationDelay: "-7s" }}
            >
              <div className="bg-white rounded-xl px-4 py-2.5 border border-emerald-100 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Cohérence</p>
                    <p className="text-sm font-bold text-emerald-600">Validée</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-slate-400 text-sm mb-6">
              Ce n'est qu'un exemple. Le tien sera différent.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              Découvrir mon profil
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================
          5. SECTION CTA FINAL
          ================================================ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-8">
            Prêt à voir ton plan d&apos;investissement ?
          </h2>
          
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-semibold text-lg rounded-xl hover:bg-slate-800 transition-all"
          >
            Faire le quiz
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="mt-4 text-sm text-slate-400">
            Gratuit · Résultat immédiat · Sans inscription
          </p>
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
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
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
        
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .animate-card-float {
          animation: card-float 10s ease-in-out infinite;
        }
        
        @keyframes satellite-float {
          0%, 100% { transform: translateY(0px) translateZ(35px); }
          50% { transform: translateY(-4px) translateZ(35px); }
        }
        .animate-satellite-float {
          animation: satellite-float 8s ease-in-out infinite;
        }
        
        @keyframes satellite-float-delayed {
          0%, 100% { transform: translateY(0px) translateZ(30px); }
          50% { transform: translateY(-4px) translateZ(30px); }
        }
        .animate-satellite-float-delayed {
          animation: satellite-float-delayed 9s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        @keyframes satellite-float-slow {
          0%, 100% { transform: translateY(0px) translateZ(20px); }
          50% { transform: translateY(-3px) translateZ(20px); }
        }
        .animate-satellite-float-slow {
          animation: satellite-float-slow 12s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

