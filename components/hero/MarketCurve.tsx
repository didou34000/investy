"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "@react-three/drei";
import { createCurveSource } from "@/lib/realtime/curveSource";
import { useFrame } from "@react-three/fiber";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { AdditiveBlending } from "three";

interface MarketCurveProps {
  colorPrimary?: string;
  colorHalo?: string;
  lineWidth?: number;
  websocketUrl?: string;
}

export default function MarketCurve({
  colorPrimary = "#3B82F6",
  colorHalo = "rgba(59,130,246,0.18)",
  lineWidth = 2,
  websocketUrl,
}: MarketCurveProps) {
  const reduced = useReducedMotionSafe();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const points = Math.min(1000, Math.max(200, isMobile ? 500 : 1000));

  const source = useMemo(() => createCurveSource({ points, fps: 30, websocketUrl }), [points, websocketUrl]);
  useEffect(() => () => source.dispose(), [source]);

  const lineRef = useRef<any>(null);
  const haloRef = useRef<any>(null);
  const trail1Ref = useRef<any>(null);
  const trail2Ref = useRef<any>(null);

  const trail1 = useRef<Float32Array | null>(null);
  const trail2 = useRef<Float32Array | null>(null);

  // Initialize with current positions to avoid first-frame pop
  const initialPoints = useMemo(() => {
    const p = source.getPositions();
    const arr: [number, number, number][] = [];
    for (let i = 0; i < points; i++) {
      const j = i * 3;
      arr.push([p[j], p[j + 1], p[j + 2]]);
    }
    return arr;
  }, [source, points]);

  useFrame(() => {
    const p = source.getPositions();
    // Update main and halo
    lineRef.current?.geometry?.setPositions?.(p);
    haloRef.current?.geometry?.setPositions?.(p);

    // Trails (simple low-pass for a ribbon effect)
    if (!trail1.current) trail1.current = p.slice(0);
    if (!trail2.current) trail2.current = p.slice(0);
    const t1 = trail1.current;
    const t2 = trail2.current;
    for (let i = 0; i < p.length; i++) {
      t1[i] = t1[i] * 0.92 + p[i] * 0.08;
      t2[i] = t2[i] * 0.85 + p[i] * 0.15;
    }
    trail1Ref.current?.geometry?.setPositions?.(t1);
    trail2Ref.current?.geometry?.setPositions?.(t2);
  });

  const width = isMobile ? Math.max(1.5, lineWidth - 0.5) : lineWidth;

  return (
    <group>
      {/* Trails with decreasing opacity */}
      <Line
        ref={trail2Ref}
        points={initialPoints}
        color={colorHalo}
        lineWidth={width * 3.2}
        transparent
        opacity={0.25}
        toneMapped={false as any}
        blending={AdditiveBlending as any}
      />
      <Line
        ref={trail1Ref}
        points={initialPoints}
        color={colorHalo}
        lineWidth={width * 2.4}
        transparent
        opacity={0.35}
        toneMapped={false as any}
        blending={AdditiveBlending as any}
      />
      {/* Halo (wider, more transparent) */}
      <Line
        ref={haloRef}
        points={initialPoints}
        color={colorHalo}
        lineWidth={width * 1.8}
        transparent
        opacity={0.5}
        toneMapped={false as any}
        blending={AdditiveBlending as any}
      />
      {/* Primary line */}
      <Line
        ref={lineRef}
        points={initialPoints}
        color={colorPrimary}
        lineWidth={width}
        transparent
        opacity={1}
        toneMapped={false as any}
        blending={AdditiveBlending as any}
      />
    </group>
  );
}


