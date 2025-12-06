"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  logo: string;
  color: string;
}

const QUOTES: Quote[] = [
  { symbol: "AAPL", name: "Apple", price: 189.43, change: 1.23, logo: "", color: "#000000" },
  { symbol: "GOOGL", name: "Google", price: 175.98, change: 0.87, logo: "G", color: "#4285F4" },
  { symbol: "MSFT", name: "Microsoft", price: 425.22, change: -0.45, logo: "M", color: "#00A4EF" },
  { symbol: "TSLA", name: "Tesla", price: 248.50, change: 2.34, logo: "T", color: "#E31937" },
  { symbol: "AMZN", name: "Amazon", price: 185.67, change: 0.65, logo: "a", color: "#FF9900" },
  { symbol: "META", name: "Meta", price: 567.89, change: -1.12, logo: "M", color: "#0668E1" },
  { symbol: "NVDA", name: "Nvidia", price: 878.34, change: 3.45, logo: "N", color: "#76B900" },
  { symbol: "BTC", name: "Bitcoin", price: 97580, change: 2.34, logo: "₿", color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", price: 3420, change: 1.89, logo: "Ξ", color: "#627EEA" },
  { symbol: "CAC", name: "CAC 40", price: 7432, change: 0.45, logo: "🇫🇷", color: "#002395" },
];

const QUOTES_LOOP = [...QUOTES, ...QUOTES, ...QUOTES];

export default function MarketStrip() {
  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
    return price.toFixed(2);
  };

  return (
    <div className="w-full py-4 bg-white border-y border-neutral-100 overflow-hidden">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
        
        <div 
          className="flex items-center gap-6 animate-marquee"
          style={{ width: 'max-content' }}
        >
          {QUOTES_LOOP.map((q, i) => (
            <div 
              key={`${q.symbol}-${i}`} 
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-50 hover:bg-neutral-100 transition-colors shrink-0"
            >
              {/* Logo */}
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: q.color }}
              >
                {q.logo || q.symbol.charAt(0)}
              </div>
              
              {/* Symbol */}
              <span className="text-sm font-semibold text-neutral-900">{q.symbol}</span>
              
              {/* Price */}
              <span className="text-sm text-neutral-500 tabular-nums">
                {formatPrice(q.price)}
              </span>
              
              {/* Change */}
              <span className={cn(
                "flex items-center gap-0.5 text-xs font-medium tabular-nums",
                q.change >= 0 ? "text-emerald-600" : "text-red-500"
              )}>
                {q.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {q.change >= 0 ? "+" : ""}{q.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
