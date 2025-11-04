"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface NumberTickerProps {
  value: number;
  durationMs?: number;
  formatter?: (n: number) => string;
  className?: string;
}

export default function NumberTicker({ value, durationMs = 800, formatter = (n) => n.toFixed(0), className }: NumberTickerProps) {
  const reduced = useReducedMotionSafe();
  const [display, setDisplay] = useState<number>(value);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const from = display;
    fromRef.current = from;
    startRef.current = null;

    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (value - from) * eased;
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  return <span className={className}>{formatter(reduced ? value : display)}</span>;
}








