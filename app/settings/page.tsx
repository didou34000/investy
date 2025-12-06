"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ProfileDetails from "@/components/ProfileDetails";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.replace("/auth");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Paramètres</h1>
        <ProfileDetails />
      </div>
    </main>
  );
}

