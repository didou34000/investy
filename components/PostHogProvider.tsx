"use client";
import { useEffect } from "react";
import { initPH } from "@/lib/analytics";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPH();
  }, []);

  return <>{children}</>;
}
