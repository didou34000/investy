"use client";

import { useState, useEffect } from "react";

interface CryptoProgressBarProps {
  progress: number;
}

export default function CryptoProgressBar({ progress }: CryptoProgressBarProps) {
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const generateCryptoPath = () => {
    const time = animationTime / 1000;
    return `M 0,15 Q 10,${8 + Math.sin(time) * 3} 20,${10 + Math.sin(time * 1.25) * 2} T 40,${12 + Math.sin(time * 1.67) * 4} T 60,${8 + Math.sin(time * 2.5) * 3} T 80,${6 + Math.sin(time * 5) * 2} T 100,${4 + Math.sin(time * 10) * 1}`;
  };

  return (
    <div className="relative">
      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
        <div className="relative h-full">
          {/* Courbe crypto animée */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 100 20" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cryptoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <path
              d={generateCryptoPath()}
              stroke="url(#cryptoGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            {/* Zone de remplissage */}
            <rect
              x="0"
              y="0"
              width={`${progress}%`}
              height="20"
              fill="url(#cryptoGradient)"
              opacity="0.2"
              className="transition-all duration-700 ease-out"
            />
          </svg>
        </div>
      </div>
      <div className="flex justify-between mt-3 text-xs">
        <span className="text-slate-500">Début</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
          <span className="text-green-600 font-medium">↗ +{Math.round(progress * 0.1)}%</span>
        </div>
        <span className="text-slate-500">Fin</span>
      </div>
    </div>
  );
}
