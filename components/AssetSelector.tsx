"use client";

import { useState, useEffect, useRef } from "react";
import AssetLogo from "@/components/ui/AssetLogo";
import { Search, X } from "lucide-react";

type Asset = {
  key: string;
  label: string;
  symbol: string;
  category: string;
  logo: string | null;
};

type AssetSelectorProps = {
  value: string;
  onChange: (symbol: string) => void;
  disabled?: boolean;
};

export default function AssetSelector({ value, onChange, disabled }: AssetSelectorProps) {
  const [mode, setMode] = useState<"category" | "specific">("specific");
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger les actifs depuis /api/market
  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/market");
        const json = await res.json();
        if (res.ok && json.data) {
          setAssets(json.data);
        }
      } catch (e) {
        console.error("Error loading assets:", e);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, []);

  // Grouper par catégorie
  const assetsByCategory = {
    equity: assets.filter((a) => a.category === "equity"),
    etf: assets.filter((a) => a.category === "etf"),
    crypto: assets.filter((a) => a.category === "crypto"),
    index: assets.filter((a) => a.category === "index"),
    fx: assets.filter((a) => a.category === "fx"),
  };

  const categories = [
    { key: "equity", label: "Actions", icon: "📈", count: assetsByCategory.equity.length },
    { key: "etf", label: "ETF", icon: "📊", count: assetsByCategory.etf.length },
    { key: "crypto", label: "Crypto", icon: "₿", count: assetsByCategory.crypto.length },
    { key: "index", label: "Indices", icon: "📉", count: assetsByCategory.index.length },
    { key: "fx", label: "Devises", icon: "💱", count: assetsByCategory.fx.length },
  ];

  // Filtrer les actifs selon la recherche
  const filteredAssets = assets.filter((asset) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    // Si la recherche correspond à une catégorie, filtrer par catégorie
    const categoryMatch = categories.find(cat => cat.key === query || cat.label.toLowerCase() === query);
    if (categoryMatch) {
      return asset.category === categoryMatch.key;
    }
    // Sinon, recherche normale
    return (
      asset.label.toLowerCase().includes(query) ||
      asset.symbol.toLowerCase().includes(query) ||
      asset.key.toLowerCase().includes(query) ||
      asset.category.toLowerCase().includes(query)
    );
  });

  const handleSelectAsset = (symbol: string) => {
    onChange(symbol);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    // Afficher une liste des actifs de cette catégorie pour que l'utilisateur choisisse
    // Pour l'instant, on prend le premier actif comme exemple
    const categoryAssets = assetsByCategory[category as keyof typeof assetsByCategory];
    if (categoryAssets && categoryAssets.length > 0) {
      // Si un seul actif, le sélectionner directement
      if (categoryAssets.length === 1) {
        onChange(categoryAssets[0].symbol);
      } else {
        // Sinon, ouvrir la recherche avec les actifs de cette catégorie pré-filtrés
        setMode("specific");
        setSearchQuery(category);
        setShowDropdown(true);
      }
    }
  };

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      {/* Toggle Mode */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("category");
            setSearchQuery("");
            setShowDropdown(false);
          }}
          disabled={disabled}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === "category"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          } disabled:opacity-60`}
        >
          Catégorie
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("specific");
            setSelectedCategory("");
            setShowDropdown(false);
          }}
          disabled={disabled}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === "specific"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          } disabled:opacity-60`}
        >
          Actif précis
        </button>
      </div>

      {/* Sélection par catégorie */}
      {mode === "category" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleSelectCategory(cat.key)}
              disabled={disabled || cat.count === 0}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedCategory === cat.key
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className="text-lg mb-1">{cat.icon}</div>
              <div className="text-sm font-medium text-slate-900">{cat.label}</div>
              <div className="text-xs text-slate-500">{cat.count} actifs</div>
            </button>
          ))}
        </div>
      )}

      {/* Recherche d'actif précis */}
      {mode === "specific" && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Rechercher un actif (ex: Apple, BTC, CAC40...)"
              className="w-full border border-slate-300 rounded-md pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              disabled={disabled}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown avec résultats */}
          {showDropdown && searchQuery.trim() && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
            >
              {loading ? (
                <div className="p-4 text-center text-sm text-slate-500">Chargement...</div>
              ) : filteredAssets.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  Aucun actif trouvé pour "{searchQuery}"
                </div>
              ) : (
                <div className="py-1">
                  {filteredAssets.map((asset) => (
                    <button
                      key={asset.key}
                      type="button"
                      onClick={() => handleSelectAsset(asset.symbol)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <AssetLogo src={asset.logo || null} label={asset.label} size={24} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {asset.label}
                        </div>
                        <div className="text-xs text-slate-500">{asset.symbol}</div>
                      </div>
                      <div className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {asset.category}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Aperçu de la sélection */}
      {value && (
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md border border-slate-200">
          <span className="text-xs text-slate-600">Sélectionné :</span>
          <span className="text-sm font-medium text-slate-900">{value}</span>
        </div>
      )}
    </div>
  );
}

