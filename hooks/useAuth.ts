"use client";

import { useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  full_name?: string;
  plan?: string;
} | null;

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(undefined as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : { user: null })
      .then(d => { setUser(d.user); setLoading(false); })
      .catch(() => { setUser(null); setLoading(false); });
  }, []);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth";
  };

  return { user, loading, signOut };
}
