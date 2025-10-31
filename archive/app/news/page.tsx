"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  symbols: string[];
}

const categories = ['Tous', 'Macro', 'Crypto', 'Tech', 'Energie', 'Finance'];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [loading, setLoading] = useState(true);

  // Mock data - à remplacer par des données réelles
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Bitcoin atteint un nouveau record historique",
        summary: "Le prix du Bitcoin a franchi la barre des 50 000$ pour la première fois cette année, porté par l'adoption institutionnelle croissante.",
        source: "CoinDesk",
        publishedAt: "2024-01-15T10:30:00Z",
        url: "https://example.com/bitcoin-record",
        category: "Crypto",
        sentiment: "positive",
        symbols: ["BTC", "ETH"]
      },
      {
        id: "2",
        title: "La Fed maintient ses taux d'intérêt",
        summary: "La Réserve fédérale américaine a décidé de maintenir ses taux d'intérêt inchangés, signalant une approche prudente face à l'inflation.",
        source: "Reuters",
        publishedAt: "2024-01-15T09:15:00Z",
        url: "https://example.com/fed-rates",
        category: "Macro",
        sentiment: "neutral",
        symbols: ["USD", "EUR"]
      },
      {
        id: "3",
        title: "Tesla annonce de nouveaux investissements en IA",
        summary: "Elon Musk révèle des plans d'investissement massifs dans l'intelligence artificielle pour accélérer le développement des véhicules autonomes.",
        source: "TechCrunch",
        publishedAt: "2024-01-15T08:45:00Z",
        url: "https://example.com/tesla-ai",
        category: "Tech",
        sentiment: "positive",
        symbols: ["TSLA", "NVDA"]
      }
    ];
    
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Actualités</h1>
          <p className="text-gray-600">Restez informé des dernières actualités financières</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les actualités..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* News List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-4 h-4 bg-gray-200 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="flex items-center gap-4">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="space-y-6">
            {filteredNews.map((item) => (
              <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getSentimentIcon(item.sentiment)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {item.title}
                      </h3>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label="Lire l'article complet"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {item.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium">{item.source}</span>
                        <span>•</span>
                        <span>{formatDate(item.publishedAt)}</span>
                        <span>•</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {item.category}
                        </span>
                      </div>
                      
                      {item.symbols.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Symboles:</span>
                          <div className="flex gap-1">
                            {item.symbols.map((symbol) => (
                              <span
                                key={symbol}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                              >
                                {symbol}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune actualité trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Tous");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}