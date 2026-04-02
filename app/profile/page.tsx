"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDetails from "@/components/ProfileDetails";

export default function ProfilePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : { user: null })
      .then((d) => {
        if (!d.user) router.replace("/auth");
        else setChecking(false);
      })
      .catch(() => router.replace("/auth"));
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <ProfileDetails />
      </div>
    </main>
  );
}
