"use client";

import { useState, useEffect } from 'react';
import { Analysis } from '@/lib/analyses/schema';
import { AnalysisCard } from '@/components/analyses/AnalysisCard';
import SectionHeader from "@/components/ui/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

interface AnalysisData {
  items: Analysis[];
  total: number;
  nextCursor?: string;
}

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
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <SectionHeader title="📊 Analyses de Marché" subtitle="Intelligence appliquée aux actualités financières" />
        {/* Filters Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm sticky top-4 z-10">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            🔍 Filtres d'analyse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Période
              </label>
              <select 
                value={filters.period}
                onChange={(e) => handleFilterChange('period', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="all">Toutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Importance minimum
              </label>
              <select 
                value={filters.minImportance}
                onChange={(e) => handleFilterChange('minImportance', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1+ (Toutes)</option>
                <option value="2">2+ (Modéré)</option>
                <option value="3">3+ (Important)</option>
                <option value="4">4+ (Très important)</option>
                <option value="5">5 (Critique)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                placeholder="Rechercher dans les analyses..."
                value={filters.q}
                onChange={(e) => handleFilterChange('q', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={handleSearch}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                🔍 Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{total}</span>
                <span>analyses trouvées</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Période:</span>
                <span className="font-medium">
                  {filters.period === 'today' ? 'Aujourd\'hui' : 
                   filters.period === 'week' ? 'Cette semaine' : 
                   filters.period === 'month' ? 'Ce mois' : 'Toutes'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Importance:</span>
                <span className="font-medium">{filters.minImportance}+</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Système actif</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && analyses.length === 0 ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-14 rounded-md" />
                </div>
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchAnalyses(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : analyses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <div className="text-slate-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Aucune analyse trouvée
            </h3>
            <p className="text-slate-600 mb-6">
              Aucune analyse ne correspond à vos critères de recherche.
            </p>
            <div className="text-sm text-slate-500">
              💡 Essayez de réduire les filtres ou de changer la période
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {analyses.map((analysis) => (
                <AnalysisCard key={analysis.id} analysis={analysis} />
              ))}
            </div>

            {/* Load More */}
            {analyses.length < total && (
              <div className="mt-8 text-center">
                <button 
                  onClick={() => fetchAnalyses(false)}
                  disabled={loading}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Chargement...' : '📈 Charger plus d\'analyses'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">
              🤖 Comment ça marche ?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <div className="font-medium mb-1">1. Collecte</div>
                <div>RSS feeds analysés toutes les 10min</div>
              </div>
              <div>
                <div className="font-medium mb-1">2. Analyse IA</div>
                <div>Classification pertinence + impact marché</div>
              </div>
              <div>
                <div className="font-medium mb-1">3. Scoring</div>
                <div>Importance calculée automatiquement</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-600">
              ⚠️ Aucun conseil d'investissement • Données éducatives uniquement
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
