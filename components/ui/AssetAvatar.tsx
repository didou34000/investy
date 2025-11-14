"use client";
import { useState } from "react";

type Props = { 
  image?: string|null; 
  symbol: string; 
  label?: string; 
  size?: number;
  className?: string;
};

export default function AssetAvatar({ 
  image, 
  symbol, 
  label, 
  size = 28, 
  className = "" 
}: Props) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const letter = (label || symbol || "?").trim().charAt(0).toUpperCase();
  
  // Si pas d'image ou erreur de chargement, afficher la lettre
  const showFallback = !image || imageError;
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {image && !imageError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={image} 
          alt={label || symbol} 
          width={size} 
          height={size} 
          className={`rounded-md object-contain bg-white border border-slate-200 w-full h-full transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
        />
      )}
      
      {/* Fallback lettre */}
      <div 
        className={`rounded-md bg-slate-100 text-slate-600 border border-slate-200 grid place-items-center w-full h-full ${showFallback ? 'opacity-100' : 'opacity-0 absolute'}`}
        style={{ width: size, height: size }}
      >
        <span className="text-[12px] font-semibold">{letter}</span>
      </div>
    </div>
  );
}
