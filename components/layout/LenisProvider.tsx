"use client";

import { useEffect } from "react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export default function LenisProvider() {
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    let rafId: number | null = null;
    let lenis: any;
    if (reduced) return;

    const start = async () => {
      try {
        const { default: Lenis } = await import("lenis");
        lenis = new Lenis({
          smoothWheel: true,
          smoothTouch: false,
          lerp: 0.1,
        });
        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {}
    };

    start();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      try { lenis?.destroy?.(); } catch {}
    };
  }, [reduced]);

  return null;
}








