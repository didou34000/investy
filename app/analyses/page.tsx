"use client";

import { useState, useEffect } from 'react';
import { Analysis } from '@/lib/analyses/schema';
import { AnalysisCard } from '@/components/analyses/AnalysisCard';
import { cn } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  ChevronDown,
  Zap,
  BarChart3,
  Bot
} from "lucide-react";

interface AnalysisData {
  items: Analysis[];
  total: number;
  nextCursor?: string;
}

const periodOptions = [
  { value: 'today', label: "Aujourd'hui", icon: Clock },
  { value: 'week', label: 'Cette semaine', icon: Clock },
  { value: 'month', label: 'Ce mois', icon: Clock },
  { value: 'all', label: 'Toutes', icon: Clock },
];

const importanceOptions = [
  { value: 1, label: '1+ (Toutes)', color: 'gray' },
  { value: 2, label: '2+ (Modéré)', color: 'blue' },
  { value: 3, label: '3+ (Important)', color: 'yellow' },
  { value: 4, label: '4+ (Très important)', color: 'orange' },
  { value: 5, label: '5 (Critique)', color: 'red' },
];

export default function AnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    period: 'today',
    minImportance: 3,
    q: '',
  });

  const fetchAnalyses = async (reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      params.set('period', filters.period);
      params.set('minImportance', filters.minImportance.toString());
      if (filters.q) params.set('q', filters.q);
      params.set('limit', '20');
      
      const response = await fetch(`/api/analyses?${params.toString()}`);
      if (!response.ok) throw new Error('Erreur de chargement');
      
      const data: AnalysisData = await response.json();
      
      if (reset) {
        setAnalyses(data.items);
      } else {
        setAnalyses(prev => [...prev, ...data.items]);
      }
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses(true);
  }, [filters]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchAnalyses(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-sm mb-6">
            <BarChart3 className="w-4 h-4 text-[#007AFF]" />
            <span className="text-sm font-medium text-gray-700">Intelligence IA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Analyses de Marché
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Actualités financières analysées automatiquement par notre IA pour identifier les opportunités et les risques.
          </p>
        </div>

        {/* Filters Card */}
        <div className={cn(
          "p-6 rounded-3xl mb-8",
          "bg-white/70 backdrop-blur-xl",
          "border border-white/50",
          "shadow-[0_4px_30px_rgba(0,0,0,0.06)]",
          "sticky top-20 z-10"
        )}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
              <Filter className="w-4 h-4 text-[#007AFF]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Period Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Période
              </label>
              <div className="relative">
                <select 
                  value={filters.period}
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                  className={cn(
                    "w-full appearance-none",
                    "px-4 py-3 pr-10",
                    "bg-white/60 backdrop-blur-md",
                    "border border-black/[0.06] rounded-xl",
                    "text-gray-900 text-sm",
                    "transition-all duration-200",
                    "hover:border-black/[0.1]",
                    "focus:outline-none focus:border-[#007AFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
                  )}
                >
                  {periodOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Importance Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Importance min.
              </label>
              <div className="relative">
                <select 
                  value={filters.minImportance}
                  onChange={(e) => handleFilterChange('minImportance', parseInt(e.target.value))}
                  className={cn(
                    "w-full appearance-none",
                    "px-4 py-3 pr-10",
                    "bg-white/60 backdrop-blur-md",
                    "border border-black/[0.06] rounded-xl",
                    "text-gray-900 text-sm",
                    "transition-all duration-200",
                    "hover:border-black/[0.1]",
                    "focus:outline-none focus:border-[#007AFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
                  )}
                >
                  {importanceOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={filters.q}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className={cn(
                    "w-full",
                    "pl-10 pr-4 py-3",
                    "bg-white/60 backdrop-blur-md",
                    "border border-black/[0.06] rounded-xl",
                    "text-gray-900 text-sm",
                    "placeholder:text-gray-400",
                    "transition-all duration-200",
                    "hover:border-black/[0.1]",
                    "focus:outline-none focus:border-[#007AFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,122,255,0.12)]"
                  )}
                />
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex items-end">
              <button 
                onClick={handleSearch}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "px-4 py-3 rounded-xl",
                  "bg-[#007AFF] text-white text-sm font-semibold",
                  "shadow-[0_2px_8px_rgba(0,122,255,0.25)]",
                  "hover:bg-[#0066D6] hover:shadow-[0_4px_12px_rgba(0,122,255,0.3)]",
                  "active:scale-[0.98]",
                  "transition-all duration-200"
                )}
              >
                <Search className="w-4 h-4" />
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={cn(
          "flex flex-wrap items-center justify-between gap-4 mb-8",
          "p-4 rounded-2xl",
          "bg-white/50 backdrop-blur-md",
          "border border-white/40"
        )}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-4 h-4 text-[#007AFF]" />
              <span className="font-semibold text-gray-900">{total}</span>
              <span>analyses</span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                {filters.period === 'today' ? "Aujourd'hui" : 
                 filters.period === 'week' ? 'Cette semaine' : 
                 filters.period === 'month' ? 'Ce mois' : 'Toutes périodes'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]"></span>
            </span>
            <span className="text-gray-500">Analyse en temps réel</span>
          </div>
        </div>

        {/* Content */}
        {loading && analyses.length === 0 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn(
                "p-6 rounded-2xl",
                "bg-white/60 backdrop-blur-md",
                "border border-white/40",
                "animate-pulse"
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-5 w-3/4 bg-gray-200/60 rounded-lg mb-3" />
                    <div className="h-4 w-full bg-gray-200/60 rounded-lg mb-2" />
                    <div className="h-4 w-2/3 bg-gray-200/60 rounded-lg" />
                  </div>
                  <div className="h-6 w-24 bg-gray-200/60 rounded-lg ml-4" />
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="h-7 w-16 bg-gray-200/60 rounded-lg" />
                  <div className="h-7 w-20 bg-gray-200/60 rounded-lg" />
                  <div className="h-7 w-14 bg-gray-200/60 rounded-lg" />
                </div>
                <div className="h-4 w-1/3 bg-gray-200/60 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={cn(
            "p-10 rounded-3xl text-center",
            "bg-[#FF3B30]/5 backdrop-blur-md",
            "border border-[#FF3B30]/20"
          )}>
            <div className="w-16 h-16 rounded-2xl bg-[#FF3B30]/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-[#FF3B30]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => fetchAnalyses(true)}
              className={cn(
                "inline-flex items-center gap-2",
                "px-5 py-2.5 rounded-xl",
                "bg-[#FF3B30] text-white text-sm font-semibold",
                "hover:bg-[#E6352B]",
                "active:scale-[0.98]",
                "transition-all duration-200"
              )}
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        ) : analyses.length === 0 ? (
          <div className={cn(
            "p-12 rounded-3xl text-center",
            "bg-white/60 backdrop-blur-xl",
            "border border-white/50"
          )}>
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune analyse trouvée
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Aucune analyse ne correspond à vos critères de recherche.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#007AFF]/5 text-[#007AFF] text-sm">
              <Sparkles className="w-4 h-4" />
              Essayez de réduire les filtres ou de changer la période
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <AnalysisCard key={analysis.id} analysis={analysis} />
              ))}
            </div>

            {/* Load More */}
            {analyses.length < total && (
              <div className="mt-10 text-center">
                <button 
                  onClick={() => fetchAnalyses(false)}
                  disabled={loading}
                  className={cn(
                    "inline-flex items-center gap-2",
                    "px-6 py-3 rounded-xl",
                    "bg-white/70 backdrop-blur-md",
                    "border border-black/[0.06]",
                    "text-gray-700 text-sm font-medium",
                    "hover:bg-white/90 hover:border-black/[0.1]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "active:scale-[0.98]",
                    "transition-all duration-200"
                  )}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Charger plus d'analyses
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* How it works */}
        <div className={cn(
          "mt-16 p-8 rounded-3xl",
          "bg-gradient-to-br from-[#007AFF]/5 via-white/60 to-[#5856D6]/5",
          "backdrop-blur-xl",
          "border border-white/50"
        )}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#007AFF]/10 mb-4">
              <Bot className="w-6 h-6 text-[#007AFF]" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Comment ça marche ?
            </h4>
            <p className="text-gray-500 text-sm">Notre système analyse automatiquement les actualités financières</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-[#34C759]/10 flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-5 h-5 text-[#34C759]" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">1. Collecte</h5>
              <p className="text-sm text-gray-500">Sources RSS analysées toutes les 10 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-[#007AFF]" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">2. Analyse IA</h5>
              <p className="text-sm text-gray-500">Classification pertinence + impact marché</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-[#AF52DE]/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-[#AF52DE]" />
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">3. Scoring</h5>
              <p className="text-sm text-gray-500">Importance calculée automatiquement</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-black/[0.04] text-center">
            <p className="text-xs text-gray-400">
              ⚠️ Aucun conseil d'investissement • Données éducatives uniquement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
