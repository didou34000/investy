"use client";

import { X, ExternalLink, Clock, Tag } from "lucide-react";
import type { NewsItem } from "@/types/news";
import { formatRelativeFR } from "@/lib/date";

interface ArticleModalProps {
  article: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  if (!isOpen || !article) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-64 bg-slate-100">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {article.title}
          </h2>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-slate-600">
            <span className="bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full font-medium">
              {article.sourceName}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <time>{formatRelativeFR(article.publishedAt)}</time>
            </div>
            {article.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <Tag className="w-4 h-4" />
                {article.tags.map(tag => (
                  <span key={tag} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content snippet */}
          {article.contentSnippet && (
            <div className="mb-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {article.contentSnippet}
              </p>
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Résumé</h3>
              <p className="text-slate-600">{article.summary}</p>
            </div>
          )}

          {/* Bullets */}
          {article.bullets && article.bullets.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Points clés</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                {article.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 p-6 flex gap-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Lire l'article complet
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-300 rounded-xl font-medium hover:bg-white transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

