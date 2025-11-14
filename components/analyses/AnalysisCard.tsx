import { Analysis } from '@/lib/analyses/schema';
import Link from 'next/link';

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'unclear': return '↔';
      default: return '?';
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'unclear': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const getImportanceColor = (importance: number) => {
    switch (importance) {
      case 5: return 'bg-red-100 text-red-800 border-red-200';
      case 4: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 1: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHorizonText = (horizon: string) => {
    switch (horizon) {
      case 'intraday': return 'Intraday';
      case 'swing': return 'Court terme';
      case 'long': return 'Long terme';
      default: return horizon;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {analysis.primaryTopic}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">
            {analysis.summary}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getImportanceColor(analysis.importance)}`}>
            Importance {analysis.importance}/5
          </span>
        </div>
      </div>

      {/* Affected Assets */}
      {analysis.affectedAssets.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Actifs concernés</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.affectedAssets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg text-xs"
              >
                <span className="font-medium">{asset.symbol}</span>
                <span className={`font-medium ${getDirectionColor(asset.direction)}`}>
                  {getDirectionIcon(asset.direction)}
                </span>
                <span className="text-slate-500">
                  {getHorizonText(asset.horizon)}
                </span>
                <span className="text-slate-400">
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
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
            >
              {category}
            </span>
          ))}
          {analysis.macroTags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
            {analysis.sourceName}
          </span>
          <span>
            {new Date(analysis.publishedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span>
            Confiance: {Math.round(analysis.confidence * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          {analysis.sources.map((source, index) => (
            <Link
              key={index}
              href={analysis.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Sources ↗
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
