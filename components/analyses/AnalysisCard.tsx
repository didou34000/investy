"use client";

import { Analysis } from '@/lib/analyses/schema';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ExternalLink,
  Clock,
  Target,
  Zap
} from "lucide-react";

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-3.5 h-3.5" />;
      case 'down': return <TrendingDown className="w-3.5 h-3.5" />;
      case 'unclear': return <Minus className="w-3.5 h-3.5" />;
      default: return <Minus className="w-3.5 h-3.5" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-[#34C759] bg-[#34C759]/10';
      case 'down': return 'text-[#FF3B30] bg-[#FF3B30]/10';
      case 'unclear': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getImportanceBadge = (importance: number) => {
    const configs: Record<number, { bg: string; text: string; label: string }> = {
      5: { bg: 'bg-[#FF3B30]/10', text: 'text-[#FF3B30]', label: 'Critique' },
      4: { bg: 'bg-[#FF9500]/10', text: 'text-[#FF9500]', label: 'Très important' },
      3: { bg: 'bg-[#FFCC00]/10', text: 'text-[#997A00]', label: 'Important' },
      2: { bg: 'bg-[#007AFF]/10', text: 'text-[#007AFF]', label: 'Modéré' },
      1: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Faible' },
    };
    return configs[importance] || configs[1];
  };

  const getHorizonText = (horizon: string) => {
    switch (horizon) {
      case 'intraday': return 'Intraday';
      case 'swing': return 'Court terme';
      case 'long': return 'Long terme';
      default: return horizon;
    }
  };

  const importanceBadge = getImportanceBadge(analysis.importance);

  return (
    <div className={cn(
      "p-6 rounded-2xl",
      "bg-white/70 backdrop-blur-xl",
      "border border-white/50",
      "shadow-[0_2px_20px_rgba(0,0,0,0.04)]",
      "hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-white/80",
      "transition-all duration-300"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
            {analysis.primaryTopic}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {analysis.summary}
          </p>
        </div>
        <div className={cn(
          "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold",
          importanceBadge.bg,
          importanceBadge.text
        )}>
          {importanceBadge.label}
        </div>
      </div>

      {/* Affected Assets */}
      {analysis.affectedAssets.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Target className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Actifs concernés</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.affectedAssets.map((asset, index) => (
              <div
                key={index}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl",
                  "bg-white/60 border border-black/[0.04]",
                  "text-sm"
                )}
              >
                <span className="font-semibold text-gray-900">{asset.symbol}</span>
                <span className={cn(
                  "inline-flex items-center justify-center w-5 h-5 rounded-md",
                  getDirectionColor(asset.direction)
                )}>
                  {getDirectionIcon(asset.direction)}
                </span>
                <span className="text-gray-500 text-xs">
                  {getHorizonText(asset.horizon)}
                </span>
                <span className="text-gray-400 text-xs">
                  ({Math.round(asset.confidence * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories and Tags */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {analysis.categories.map((category, index) => (
            <span
              key={`cat-${index}`}
              className="px-2.5 py-1 bg-[#007AFF]/10 text-[#007AFF] rounded-lg text-xs font-medium"
            >
              {category}
            </span>
          ))}
          {analysis.macroTags.map((tag, index) => (
            <span
              key={`tag-${index}`}
              className="px-2.5 py-1 bg-[#AF52DE]/10 text-[#AF52DE] rounded-lg text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-black/[0.04]">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
            <span>{analysis.sourceName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {new Date(analysis.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Confiance {Math.round(analysis.confidence * 100)}%</span>
          </div>
        </div>
        
        <div className="flex items-center">
          {analysis.sources.length > 0 && (
            <Link
              href={analysis.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                "text-xs font-medium text-[#007AFF]",
                "hover:bg-[#007AFF]/10",
                "transition-colors duration-200"
              )}
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
