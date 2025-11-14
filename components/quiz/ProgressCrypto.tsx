"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  progress: number; // 0..1
  height?: number;  // px
};

/**
 * Courbe style "crypto" : bruit sinusoïdal + gradient.
 * La progression est rendue via strokeDasharray (portion allumée).
 */
export default function ProgressCrypto({ progress, height=90 }: Props){
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Resize observer
  useEffect(()=>{
    const el = ref.current;
    if(!el) return;
    const ro = new ResizeObserver(()=> setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return ()=> ro.disconnect();
  },[]);

  // Génère une courbe de progression simple avec montées/descentes
  const { d, length } = useMemo(()=>{
    const width = Math.max(320, w || 800);
    const H = height;
    const points = 50; // points pour la courbe
    const amp = H*0.3; // amplitude modérée
    const baseline = H*0.6; // position centrale

    const arr: [number, number][] = [];
    let y = baseline; // position de départ
    
    // Génère une courbe avec montées/descentes aléatoires
    for(let i=0;i<=points;i++){
      const x = (i/points) * width;
      const progress = i/points;
      
      // Mouvement aléatoire avec tendance générale vers le haut
      const randomMove = (Math.random() - 0.5) * 20; // variation aléatoire
      const trend = progress * 10; // tendance légèrement haussière
      const wave = Math.sin(progress * Math.PI * 3) * 15; // ondulation
      
      y = baseline + randomMove + trend + wave;
      
      // Limite les extrêmes
      y = Math.max(baseline - amp, Math.min(baseline + amp, y));
      
      arr.push([x, y]);
    }
    
    // Crée le path SVG avec des courbes lisses
    let path = `M ${arr[0][0]} ${arr[0][1]}`;
    for(let i=1;i<arr.length;i++){
      const [x, y] = arr[i];
      const [prevX, prevY] = arr[i-1];
      
      // Courbes de Bézier pour un rendu fluide
      const cp1x = prevX + (x - prevX) * 0.3;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) * 0.7;
      const cp2y = y;
      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    
    // Calcule la longueur du path
    let len = 0;
    for(let i=1;i<arr.length;i++){
      const dx = arr[i][0]-arr[i-1][0], dy = arr[i][1]-arr[i-1][1];
      len += Math.hypot(dx, dy);
    }
    
    return { d: path, length: len };
  },[w, height]);

  const pct = Math.max(0, Math.min(1, progress || 0));
  const dash = `${length * pct} ${length}`;

  return (
    <div ref={ref} className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${Math.max(320, w||800)} ${height}`} preserveAspectRatio="none" className="block">
        <defs>
          {/* Gradient simple */}
          <linearGradient id="gradLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          
          {/* Gradient de remplissage */}
          <linearGradient id="gradFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.1)" />
          </linearGradient>
        </defs>

        {/* Fond avec grille subtile */}
        <rect width="100%" height="100%" fill="#F8FAFC" />
        <rect width="100%" height="100%" fill="url(#gradFill)" opacity="0.3" />

        {/* Courbe de fond (discrete) */}
        <path 
          d={d} 
          stroke="rgba(59,130,246,0.2)" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="3,3"
        />

        {/* Courbe principale avec progression */}
        <path
          d={d}
          stroke="url(#gradLine)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={dash}
        />

        {/* Zone de remplissage sous la courbe */}
        <defs>
          <clipPath id="clipProg">
            <path d={`${d} L ${Math.max(320, w||800)} ${height} L 0 ${height} Z`} />
          </clipPath>
        </defs>
        <rect
          x="0"
          y="0"
          width={`${pct*100}%`}
          height={height}
          fill="url(#gradFill)"
          clipPath="url(#clipProg)"
        />
      </svg>

      <div className="text-center text-[12px] text-slate-600 -mt-2 flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span>{Math.round(pct*100)}% complété</span>
      </div>
    </div>
  );
}

