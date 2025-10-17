"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Courbe douce, aléatoire à chaque chargement (discrète)
export default function DecorativeCurve() {
  const [data, setData] = useState<{ x:number; y:number }[]>([]);
  useEffect(() => {
    const base = Math.random()*40 + 60; // variation de hauteur
    const pts = Array.from({ length: 36 }, (_, i) => {
      const noise = Math.sin(i/2 + Math.random()*0.7)*12 + (Math.random()-0.5)*6;
      return { x: i, y: base + noise };
    });
    setData(pts);
  }, []);
  return (
    <div className="h-40 opacity-30">
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line type="monotone" dataKey="y" stroke="#3B82F6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
