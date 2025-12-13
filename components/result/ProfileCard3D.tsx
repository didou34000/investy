"use client";

import React from "react";
import { motion } from "framer-motion";
import type { InvestyProfileResult } from "@/lib/profileMapper";
import { getProfileCopy } from "@/lib/profileCopy";
import { 
  Shield, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  PieChart,
  Landmark 
} from "lucide-react";

type Props = { 
  profile: InvestyProfileResult;
  supportHint?: "PEA" | "CTO" | "PEA+CTO" | null;
};

// Horizon label based on risk
const getHorizonLabel = (riskIndex: number) => {
  if (riskIndex <= 25) return "3-5 ans";
  if (riskIndex <= 45) return "5-7 ans";
  if (riskIndex <= 65) return "7-10 ans";
  return "10+ ans";
};

// Risk label
const getRiskLabel = (riskIndex: number) => {
  if (riskIndex <= 25) return "Faible";
  if (riskIndex <= 45) return "Modéré";
  if (riskIndex <= 65) return "Modéré";
  if (riskIndex <= 80) return "Élevé";
  return "Très élevé";
};

// Slow float animation variants
const floatVariants = {
  animate: {
    y: [0, -3, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Satellite cards float with different timing
const satelliteVariants = (delay: number) => ({
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    },
  },
});

export function ProfileCard3D({ profile, supportHint }: Props) {
  const copy = getProfileCopy(profile.code);
  const horizonLabel = getHorizonLabel(profile.riskIndex);
  const riskLabel = getRiskLabel(profile.riskIndex);

  // Calculate allocation percentages for display
  const alloc = profile.allocation;
  const actionsPercent = (alloc.equities_core || 0) + (alloc.equities_tilts || 0);
  const obligationsPercent = alloc.bonds || 0;
  const cashPercent = alloc.cash || 0;

  return (
    <div 
      className="relative w-full"
      style={{ perspective: "1200px" }}
    >
      {/* Main Card Container with 3D Transform */}
      <motion.div
        className="relative"
        style={{ 
          transformStyle: "preserve-3d",
          transform: "rotateX(4deg) rotateY(-6deg)",
        }}
        variants={floatVariants}
        animate="animate"
      >
        {/* Multi-layer shadow for depth */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            transform: "translateZ(-20px)",
            background: "linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.08) 100%)",
            filter: "blur(30px)",
          }}
        />
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            transform: "translateZ(-10px)",
            background: "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)",
            filter: "blur(20px)",
          }}
        />

        {/* Main Card */}
        <div 
          className="relative bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/60 overflow-hidden"
          style={{
            boxShadow: `
              0 4px 6px rgba(0,0,0,0.02),
              0 12px 24px rgba(0,0,0,0.04),
              0 24px 48px rgba(0,0,0,0.06),
              0 48px 96px rgba(0,0,0,0.08)
            `,
          }}
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-slate-50/30 pointer-events-none" />
          
          {/* Content */}
          <div className="relative p-8">
            {/* Micro-label */}
            <div className="absolute top-4 right-4">
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Basé sur ton profil
              </span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">Profil</p>
                <h2 className="text-2xl font-bold text-slate-900">{profile.label}</h2>
              </div>
              <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-lg font-bold text-indigo-600">{profile.riskIndex}/100</span>
              </div>
            </div>

            {/* Allocation Bars */}
            <div className="space-y-4 mb-8">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Actions / ETF</span>
                  <span className="font-bold text-slate-900">{actionsPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${actionsPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Obligations</span>
                  <span className="font-bold text-slate-900">{obligationsPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${obligationsPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Liquidités</span>
                  <span className="font-bold text-slate-900">{cashPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-slate-300 to-slate-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${cashPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-500">
                <Landmark className="w-4 h-4" />
                <span className="text-sm">{supportHint || "PEA"} recommandé</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-900">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+{profile.expectedReturn.toFixed(1)}%/an</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Satellite Card - Risque (top-right) */}
      <motion.div
        className="absolute -top-2 -right-4 z-10"
        style={{ 
          transformStyle: "preserve-3d",
          transform: "translateZ(30px)",
        }}
        variants={satelliteVariants(0)}
        animate="animate"
      >
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-xl px-4 py-3 border border-amber-100"
          style={{
            boxShadow: `
              0 4px 12px rgba(251,191,36,0.08),
              0 12px 24px rgba(0,0,0,0.06)
            `,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Risque</p>
              <p className="text-sm font-bold text-amber-600">{riskLabel}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Satellite Card - Horizon (bottom-left) */}
      <motion.div
        className="absolute -bottom-2 -left-4 z-10"
        style={{ 
          transformStyle: "preserve-3d",
          transform: "translateZ(25px)",
        }}
        variants={satelliteVariants(2)}
        animate="animate"
      >
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-xl px-4 py-3 border border-blue-100"
          style={{
            boxShadow: `
              0 4px 12px rgba(59,130,246,0.08),
              0 12px 24px rgba(0,0,0,0.06)
            `,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Horizon</p>
              <p className="text-sm font-bold text-blue-600">{horizonLabel}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Satellite Card - Rendement (bottom-right, slightly behind) */}
      <motion.div
        className="absolute bottom-8 -right-6 z-0"
        style={{ 
          transformStyle: "preserve-3d",
          transform: "translateZ(15px)",
          opacity: 0.9,
        }}
        variants={satelliteVariants(4)}
        animate="animate"
      >
        <div 
          className="bg-white/90 backdrop-blur-lg rounded-xl px-4 py-3 border border-emerald-100"
          style={{
            boxShadow: `
              0 4px 12px rgba(16,185,129,0.08),
              0 8px 16px rgba(0,0,0,0.04)
            `,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Rendement</p>
              <p className="text-sm font-bold text-emerald-600">+{profile.expectedReturn.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
