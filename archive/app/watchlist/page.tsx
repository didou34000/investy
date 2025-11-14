"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  logo?: string;
}

export default function WatchlistPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - à remplacer par des données réelles
  useEffect(() => {
    const mockAssets: Asset[] = [
      {
        id: "1",
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 175.43,
        change: 2.15,
        changePercent: 1.24,
      },
      {
        id: "2", 
        symbol: "TSLA",
        name: "Tesla Inc.",
        price: 248.50,
        change: -5.20,
        changePercent: -2.05,
      },
      {
        id: "3",
        symbol: "BTC",
        name: "Bitcoin",
        price: 43250.00,
        change: 1250.00,
        changePercent: 2.98,
      },
    ];
    
    setTimeout(() => {
      setAssets(mockAssets);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAssets = assets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Actifs</h1>
          <p className="text-gray-600">Suivez vos investissements en temps réel</p>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un actif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un actif
          </Button>
        </div>

        {/* Assets List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="space-y-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {asset.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{asset.symbol}</h3>
                      <p className="text-sm text-gray-600">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${asset.price.toLocaleString()}
                    </p>
                    <div className={`flex items-center gap-1 text-sm ${
                      asset.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)} 
                        ({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun actif suivi
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter des actifs à votre watchlist pour les suivre en temps réel.
            </p>
            <Button className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Ajouter mon premier actif
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
